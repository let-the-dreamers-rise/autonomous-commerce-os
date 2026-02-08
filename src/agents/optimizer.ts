import type {
    ScoredProduct,
    CartItem,
    UnifiedCart,
    ProcurementPlan,
    AgentThought,
    ProductDecision,
    Retailer,
    DeliveryEstimate
} from '@/types';
import { generateId, delay, daysFromNow, formatDate } from '@/lib/utils';

// Generate decision explanation for a product
function generateDecision(
    selected: ScoredProduct,
    alternatives: ScoredProduct[],
    budgetRemaining: number
): ProductDecision {
    const whySelected: string[] = [];

    // Price reasoning
    if (selected.scoreBreakdown.priceScore > 0.7) {
        whySelected.push(`Excellent value at $${selected.price.toFixed(2)}`);
    } else if (selected.scoreBreakdown.priceScore > 0.4) {
        whySelected.push(`Good balance of price ($${selected.price.toFixed(2)}) and quality`);
    }

    // Delivery reasoning
    if (selected.deliveryDays <= 2) {
        whySelected.push(`Fast delivery in ${selected.deliveryDays} day${selected.deliveryDays !== 1 ? 's' : ''}`);
    }

    // Rating reasoning
    if (selected.rating >= 4.5) {
        whySelected.push(`Highly rated at ${selected.rating}★ (${selected.reviewCount.toLocaleString()} reviews)`);
    }

    // Budget reasoning
    whySelected.push(`Keeps total under budget ($${budgetRemaining.toFixed(2)} remaining)`);

    // Why not alternatives
    const whyNotAlternatives = alternatives.slice(0, 2).map((alt) => {
        let reason = '';
        if (alt.price < selected.price) {
            reason = `$${(selected.price - alt.price).toFixed(2)} cheaper but ${alt.rating < selected.rating ? 'lower quality' : 'slower delivery'}`;
        } else if (alt.rating > selected.rating) {
            reason = `Higher rated (${alt.rating}★) but $${(alt.price - selected.price).toFixed(2)} more expensive`;
        } else if (alt.deliveryDays < selected.deliveryDays) {
            reason = `Faster delivery but ${alt.price > selected.price ? 'more expensive' : 'lower rated'}`;
        } else {
            reason = `Lower overall score (${alt.score.toFixed(3)} vs ${selected.score.toFixed(3)})`;
        }

        return {
            productId: alt.id,
            productName: alt.name,
            reason,
        };
    });

    return { whySelected, whyNotAlternatives };
}

// Main optimizer function
export async function optimizeSelection(
    rankedProducts: Record<string, ScoredProduct[]>,
    plan: ProcurementPlan,
    onThought: (thought: AgentThought) => void
): Promise<UnifiedCart> {
    const startTime = Date.now();
    let remainingBudget = plan.constraints.maxBudget;
    const selectedItems: CartItem[] = [];
    let optimizationIterations = 0;

    // Starting thought
    onThought({
        id: generateId(),
        agentId: 'optimizer',
        agentName: 'Optimizer Agent',
        icon: '💡',
        thought: `Starting budget optimization with $${remainingBudget.toFixed(2)} available`,
        timestamp: Date.now(),
        type: 'thinking',
    });

    await delay(400);

    // Phase 1: Must-have categories (high priority)
    const mustHaveCategories = plan.categories.filter((c) => c.priority === 'high');
    const optionalCategories = plan.categories.filter((c) => c.priority !== 'high');

    onThought({
        id: generateId(),
        agentId: 'optimizer',
        agentName: 'Optimizer Agent',
        icon: '💡',
        thought: `Phase 1: Fulfilling ${mustHaveCategories.length} must-have categories first`,
        timestamp: Date.now(),
        type: 'action',
    });

    await delay(300);

    for (const category of mustHaveCategories) {
        const products = rankedProducts[category.name];
        if (!products || products.length === 0) continue;

        // Find best product that fits budget
        const bestFit = products.find((p) => p.price <= remainingBudget);
        if (bestFit) {
            const quantity = Math.min(category.estimatedQty, Math.floor(remainingBudget / bestFit.price));
            const totalPrice = bestFit.price * quantity;

            if (totalPrice <= remainingBudget) {
                const decision = generateDecision(bestFit, products.slice(1, 4), remainingBudget - totalPrice);

                selectedItems.push({
                    product: bestFit,
                    quantity,
                    alternates: products.slice(1, 4),
                    decision,
                });

                remainingBudget -= totalPrice;
                optimizationIterations++;

                onThought({
                    id: generateId(),
                    agentId: 'optimizer',
                    agentName: 'Optimizer Agent',
                    icon: '💡',
                    thought: `✓ ${category.displayName}: Selected "${bestFit.name.substring(0, 25)}..." × ${quantity} = $${totalPrice.toFixed(2)}`,
                    timestamp: Date.now(),
                    type: 'decision',
                });

                await delay(250);
            }
        }
    }

    // Phase 2: Optional categories (medium/low priority)
    onThought({
        id: generateId(),
        agentId: 'optimizer',
        agentName: 'Optimizer Agent',
        icon: '💡',
        thought: `Phase 2: Adding optional items with $${remainingBudget.toFixed(2)} remaining`,
        timestamp: Date.now(),
        type: 'action',
    });

    await delay(300);

    for (const category of optionalCategories) {
        if (remainingBudget < 10) break; // Stop if budget too low

        const products = rankedProducts[category.name];
        if (!products || products.length === 0) continue;

        const bestFit = products.find((p) => p.price <= remainingBudget);
        if (bestFit) {
            const quantity = Math.min(category.estimatedQty, Math.floor(remainingBudget / bestFit.price));
            const totalPrice = bestFit.price * quantity;

            if (totalPrice <= remainingBudget && quantity > 0) {
                const decision = generateDecision(bestFit, products.slice(1, 4), remainingBudget - totalPrice);

                selectedItems.push({
                    product: bestFit,
                    quantity,
                    alternates: products.slice(1, 4),
                    decision,
                });

                remainingBudget -= totalPrice;
                optimizationIterations++;

                onThought({
                    id: generateId(),
                    agentId: 'optimizer',
                    agentName: 'Optimizer Agent',
                    icon: '💡',
                    thought: `+ ${category.displayName}: Added "${bestFit.name.substring(0, 25)}..." = $${totalPrice.toFixed(2)}`,
                    timestamp: Date.now(),
                    type: 'decision',
                });

                await delay(200);
            }
        }
    }

    // Calculate totals
    const totalCost = plan.constraints.maxBudget - remainingBudget;
    const budgetUtilization = (totalCost / plan.constraints.maxBudget) * 100;

    // Group by retailer
    const byRetailer: Record<Retailer, CartItem[]> = {
        amazon: [],
        walmart: [],
        bestbuy: [],
    };

    for (const item of selectedItems) {
        byRetailer[item.product.retailer].push(item);
    }

    // Calculate delivery estimates
    const deliverySchedule: DeliveryEstimate[] = [];
    for (const [retailer, items] of Object.entries(byRetailer)) {
        if (items.length > 0) {
            const maxDays = Math.max(...items.map((i) => i.product.deliveryDays));
            deliverySchedule.push({
                retailer: retailer as Retailer,
                items: items.length,
                estimatedDate: formatDate(daysFromNow(maxDays)),
                cost: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
            });
        }
    }

    // Final summary thought
    onThought({
        id: generateId(),
        agentId: 'optimizer',
        agentName: 'Optimizer Agent',
        icon: '💡',
        thought: `✓ Optimization complete: $${totalCost.toFixed(2)} spent (${budgetUtilization.toFixed(1)}% of budget), ${selectedItems.length} items across ${deliverySchedule.length} retailers`,
        timestamp: Date.now(),
        type: 'result',
    });

    return {
        items: selectedItems,
        totalCost,
        byRetailer,
        deliverySchedule,
        budgetRemaining: remainingBudget,
        budgetUtilization,
    };
}
