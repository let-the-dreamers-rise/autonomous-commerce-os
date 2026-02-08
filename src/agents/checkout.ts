import type {
    UnifiedCart,
    CheckoutProgress,
    CheckoutState,
    AgentThought,
    Retailer
} from '@/types';
import { generateId, delay } from '@/lib/utils';

// Checkout orchestration generator
export async function* orchestrateCheckout(
    cart: UnifiedCart,
    onThought: (thought: AgentThought) => void
): AsyncGenerator<CheckoutProgress> {
    const retailers = cart.deliverySchedule.map((d) => d.retailer);
    const completedRetailers: Retailer[] = [];

    // Step 1: Collecting info
    yield {
        state: 'collecting_info',
        progress: 5,
        completedRetailers: [],
        message: 'Collecting shipping and payment information...',
    };

    onThought({
        id: generateId(),
        agentId: 'checkout',
        agentName: 'Checkout Orchestrator',
        icon: '🚀',
        thought: 'Starting autonomous checkout sequence...',
        timestamp: Date.now(),
        type: 'thinking',
    });

    await delay(800);

    // Step 2: Validating
    yield {
        state: 'validating',
        progress: 15,
        completedRetailers: [],
        message: 'Validating cart items and availability...',
    };

    onThought({
        id: generateId(),
        agentId: 'checkout',
        agentName: 'Checkout Orchestrator',
        icon: '🚀',
        thought: `📋 Validating ${cart.items.length} items across ${retailers.length} retailers`,
        timestamp: Date.now(),
        type: 'action',
    });

    await delay(600);

    // Step 3-5: Process each retailer
    let progressBase = 20;
    const progressPerRetailer = 70 / retailers.length;

    for (const retailer of retailers) {
        const state = `processing_${retailer}` as CheckoutState;
        const retailerItems = cart.byRetailer[retailer];
        const retailerTotal = retailerItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

        yield {
            state,
            progress: Math.round(progressBase),
            currentRetailer: retailer,
            completedRetailers: [...completedRetailers],
            message: `Processing ${retailer.charAt(0).toUpperCase() + retailer.slice(1)} order...`,
        };

        onThought({
            id: generateId(),
            agentId: 'checkout',
            agentName: 'Checkout Orchestrator',
            icon: '🚀',
            thought: `🛒 Processing ${retailer}: ${retailerItems.length} item${retailerItems.length !== 1 ? 's' : ''}, $${retailerTotal.toFixed(2)}`,
            timestamp: Date.now(),
            type: 'action',
        });

        await delay(1000);

        // Simulate sub-steps for this retailer
        yield {
            state,
            progress: Math.round(progressBase + progressPerRetailer * 0.3),
            currentRetailer: retailer,
            completedRetailers: [...completedRetailers],
            message: `Adding items to ${retailer} cart...`,
        };

        await delay(500);

        yield {
            state,
            progress: Math.round(progressBase + progressPerRetailer * 0.6),
            currentRetailer: retailer,
            completedRetailers: [...completedRetailers],
            message: `Applying shipping to ${retailer} order...`,
        };

        await delay(500);

        yield {
            state,
            progress: Math.round(progressBase + progressPerRetailer * 0.9),
            currentRetailer: retailer,
            completedRetailers: [...completedRetailers],
            message: `Confirming ${retailer} order...`,
        };

        await delay(400);

        completedRetailers.push(retailer);
        progressBase += progressPerRetailer;

        onThought({
            id: generateId(),
            agentId: 'checkout',
            agentName: 'Checkout Orchestrator',
            icon: '🚀',
            thought: `✓ ${retailer.charAt(0).toUpperCase() + retailer.slice(1)} order confirmed! Order #${generateId().toUpperCase()}`,
            timestamp: Date.now(),
            type: 'result',
        });

        await delay(300);
    }

    // Step 6: Complete
    yield {
        state: 'complete',
        progress: 100,
        completedRetailers,
        message: 'All orders placed successfully!',
    };

    onThought({
        id: generateId(),
        agentId: 'checkout',
        agentName: 'Checkout Orchestrator',
        icon: '🚀',
        thought: `🎉 Checkout complete! ${retailers.length} orders placed, total: $${cart.totalCost.toFixed(2)}`,
        timestamp: Date.now(),
        type: 'result',
    });
}

// Simple checkout function for non-generator usage
export async function runCheckout(
    cart: UnifiedCart,
    onThought: (thought: AgentThought) => void,
    onProgress: (progress: CheckoutProgress) => void
): Promise<void> {
    const generator = orchestrateCheckout(cart, onThought);

    for await (const progress of generator) {
        onProgress(progress);
    }
}
