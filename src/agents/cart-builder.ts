import type {
    UnifiedCart,
    Product,
    SavingsAnalysis,
    AgentThought,
    Retailer
} from '@/types';
import { generateId, delay } from '@/lib/utils';

// Calculate savings analysis
export function calculateSavings(
    cart: UnifiedCart,
    allProducts: Product[],
    budget: number
): SavingsAnalysis {
    // Group products by category
    const byCategory: Record<string, Product[]> = {};
    for (const product of allProducts) {
        if (!byCategory[product.category]) {
            byCategory[product.category] = [];
        }
        byCategory[product.category].push(product);
    }

    // Calculate "random shopping" cost - average price per category
    let randomShoppingCost = 0;
    for (const item of cart.items) {
        const categoryProducts = byCategory[item.product.category] || [];
        if (categoryProducts.length > 0) {
            const avgPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length;
            randomShoppingCost += avgPrice * item.quantity;
        }
    }

    // Calculate single-retailer cost - pick highest total from one retailer
    const retailerCosts: Record<Retailer, number> = {
        amazon: 0,
        walmart: 0,
        bestbuy: 0,
    };

    for (const item of cart.items) {
        // Find equivalent product from each retailer
        const category = item.product.category;
        for (const retailer of ['amazon', 'walmart', 'bestbuy'] as Retailer[]) {
            const retailerProduct = allProducts.find(
                (p) => p.category === category && p.retailer === retailer
            );
            if (retailerProduct) {
                retailerCosts[retailer] += retailerProduct.price * item.quantity;
            } else {
                // If no equivalent, use 1.2x the selected price as estimate
                retailerCosts[retailer] += item.product.price * 1.2 * item.quantity;
            }
        }
    }

    const singleRetailerCost = Math.max(...Object.values(retailerCosts));

    // Calculate delivery days saved
    const aiMaxDays = Math.max(...cart.items.map((i) => i.product.deliveryDays));
    const avgDeliveryDays = 4; // Assume average without optimization
    const deliveryDaysSaved = Math.max(0, avgDeliveryDays - aiMaxDays);

    // Calculate quality score gain
    const aiAvgRating = cart.items.reduce((sum, i) => sum + i.product.rating, 0) / cart.items.length;
    const avgRating = 4.0; // Assume average without optimization
    const qualityScoreGain = aiAvgRating - avgRating;

    const moneySaved = randomShoppingCost - cart.totalCost;
    const percentSaved = (moneySaved / randomShoppingCost) * 100;

    return {
        randomShoppingCost: Math.round(randomShoppingCost * 100) / 100,
        singleRetailerCost: Math.round(singleRetailerCost * 100) / 100,
        aiOptimizedCost: cart.totalCost,
        moneySaved: Math.round(moneySaved * 100) / 100,
        percentSaved: Math.round(percentSaved * 10) / 10,
        deliveryDaysSaved,
        qualityScoreGain: Math.round(qualityScoreGain * 100) / 100,
    };
}

// Build cart with savings analysis
export async function buildCart(
    cart: UnifiedCart,
    allProducts: Product[],
    budget: number,
    onThought: (thought: AgentThought) => void
): Promise<{ cart: UnifiedCart; savings: SavingsAnalysis }> {
    const startTime = Date.now();

    onThought({
        id: generateId(),
        agentId: 'cart',
        agentName: 'Cart Builder',
        icon: '🛒',
        thought: 'Building unified multi-retailer cart...',
        timestamp: Date.now(),
        type: 'thinking',
    });

    await delay(400);

    // Calculate savings
    const savings = calculateSavings(cart, allProducts, budget);

    onThought({
        id: generateId(),
        agentId: 'cart',
        agentName: 'Cart Builder',
        icon: '🛒',
        thought: `💰 AI saved $${savings.moneySaved.toFixed(2)} vs random shopping (${savings.percentSaved.toFixed(1)}% savings)`,
        timestamp: Date.now(),
        type: 'result',
    });

    await delay(300);

    if (savings.deliveryDaysSaved > 0) {
        onThought({
            id: generateId(),
            agentId: 'cart',
            agentName: 'Cart Builder',
            icon: '🛒',
            thought: `⚡ Optimized delivery: ${savings.deliveryDaysSaved} day${savings.deliveryDaysSaved !== 1 ? 's' : ''} faster than average`,
            timestamp: Date.now(),
            type: 'result',
        });

        await delay(200);
    }

    // Retailer breakdown
    const retailers = cart.deliverySchedule.map((d) =>
        `${d.retailer} (${d.items} item${d.items !== 1 ? 's' : ''}, $${d.cost.toFixed(2)})`
    ).join(', ');

    onThought({
        id: generateId(),
        agentId: 'cart',
        agentName: 'Cart Builder',
        icon: '🛒',
        thought: `✓ Cart ready: ${retailers}`,
        timestamp: Date.now(),
        type: 'result',
    });

    return { cart, savings };
}
