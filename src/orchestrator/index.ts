import type { AgentThought, SystemMetrics, OptimizationMode } from '@/types';
import { useStore } from '@/store';
import {
    planProcurement,
    sourceProducts,
    getAllProducts,
    rankProducts,
    optimizeSelection,
    buildCart
} from '@/agents';
import { DEFAULT_PREFERENCES, type UserPreferences } from '@/agents/ranking';
import { generateId } from '@/lib/utils';

// Load preferences from localStorage (client-side only)
function loadPreferences(): UserPreferences {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    try {
        const stored = localStorage.getItem('agentic-commerce-preferences');
        if (stored) {
            return JSON.parse(stored) as UserPreferences;
        }
    } catch (e) {
        console.error('Failed to load preferences:', e);
    }
    return DEFAULT_PREFERENCES;
}

// Main orchestrator function
export async function runAgentPipeline(
    goal: string,
    mode: OptimizationMode = 'balanced'
): Promise<void> {
    const store = useStore.getState();
    const startTime = Date.now();
    let productsScanned = 0;
    let optimizationIterations = 0;

    // Load user preferences
    const preferences = loadPreferences();

    // Thought handler
    const onThought = (thought: AgentThought) => {
        store.addAgentThought(thought);
    };

    try {
        // Reset state
        store.reset();
        store.setUserGoal(goal);
        store.setOptimizationMode(mode);

        // Step 1: Planning
        store.setSystemState('planning');
        const plan = await planProcurement(goal, onThought);
        store.setPlan(plan);

        // Step 2: Sourcing
        store.setSystemState('sourcing');
        const products = await sourceProducts(plan, onThought);
        store.setProducts(products);
        productsScanned = products.totalCount;

        // Step 3: Ranking (with preferences!)
        store.setSystemState('ranking');
        const allProducts = getAllProducts(products);
        const rankedProducts = await rankProducts(allProducts, plan, mode, onThought, preferences);
        store.setRankedProducts(rankedProducts);

        // Step 4: Optimization
        store.setSystemState('optimizing');
        const optimizedCart = await optimizeSelection(rankedProducts, plan, onThought);
        optimizationIterations = optimizedCart.items.length;

        // Step 5: Cart Building
        store.setSystemState('cart_building');
        const { cart, savings } = await buildCart(
            optimizedCart,
            allProducts,
            plan.constraints.maxBudget,
            onThought
        );
        store.setCart(cart);
        store.setSavings(savings);

        // Calculate metrics
        const totalTime = Date.now() - startTime;
        const avgQuality = cart.items.reduce((sum, i) => sum + i.product.rating, 0) / cart.items.length;

        const metrics: SystemMetrics = {
            productsScanned,
            retailersAnalyzed: 3,
            optimizationIterations,
            totalDecisionTime: totalTime,
            budgetEfficiency: cart.budgetUtilization,
            averageQualityScore: Math.round(avgQuality * 100) / 100,
            deliveryScore: 100 - (Math.max(...cart.items.map(i => i.product.deliveryDays)) * 10),
        };
        store.setMetrics(metrics);

        // Done!
        store.setSystemState('complete');

    } catch (error) {
        console.error('Pipeline error:', error);
        store.setSystemState('idle');

        onThought({
            id: generateId(),
            agentId: 'planner',
            agentName: 'System',
            icon: '❌',
            thought: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            timestamp: Date.now(),
            type: 'result',
        });
    }
}

// Re-optimize with different weights
export async function reOptimize(mode: OptimizationMode): Promise<void> {
    const store = useStore.getState();
    const { plan, products, userGoal } = store;

    if (!plan || !products || !userGoal) {
        console.error('Cannot re-optimize: missing data');
        return;
    }

    // Clear thoughts and run again with new mode
    store.clearAgentThoughts();
    await runAgentPipeline(userGoal, mode);
}
