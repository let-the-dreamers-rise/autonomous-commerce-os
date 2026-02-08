import type {
    Product,
    ScoredProduct,
    ScoreBreakdown,
    ScoringWeights,
    ProcurementPlan,
    AgentThought,
    OptimizationMode
} from '@/types';
import { generateId, delay } from '@/lib/utils';

// User preferences interface (matches preferences-panel)
export interface UserPreferences {
    preferredRetailer: 'amazon' | 'walmart' | 'bestbuy' | 'any';
    prioritizePrime: boolean;
    maxDeliveryDays: number;
    minRating: number;
    ecoFriendly: boolean;
    bundleOrders: boolean;
}

// Default preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
    preferredRetailer: 'any',
    prioritizePrime: true,
    maxDeliveryDays: 5,
    minRating: 4.0,
    ecoFriendly: false,
    bundleOrders: true,
};

// Default scoring weights
export const SCORING_WEIGHTS: Record<OptimizationMode, ScoringWeights> = {
    balanced: { price: 0.35, delivery: 0.25, rating: 0.20, budgetFit: 0.20 },
    cheapest: { price: 0.60, delivery: 0.15, rating: 0.15, budgetFit: 0.10 },
    fastest: { price: 0.20, delivery: 0.50, rating: 0.15, budgetFit: 0.15 },
    'highest-quality': { price: 0.15, delivery: 0.15, rating: 0.55, budgetFit: 0.15 },
};

// Calculate individual score components
function calculateScoreBreakdown(
    product: Product,
    maxPrice: number,
    maxDeliveryDays: number,
    targetBudgetPerCategory: number,
    preferences: UserPreferences
): ScoreBreakdown {
    // Price score: lower price = higher score (0-1)
    const priceScore = 1 - (product.price / maxPrice);

    // Delivery score: faster delivery = higher score (0-1)
    // Penalize products exceeding user's max delivery days
    let deliveryScore = 1 - (product.deliveryDays / Math.max(maxDeliveryDays, 1));
    if (product.deliveryDays > preferences.maxDeliveryDays) {
        deliveryScore *= 0.5; // 50% penalty for exceeding preference
    }

    // Rating score: higher rating = higher score (0-1)
    // Boost products meeting min rating preference
    let ratingScore = product.rating / 5;
    if (product.rating >= preferences.minRating) {
        ratingScore = Math.min(1, ratingScore * 1.1); // 10% bonus
    }

    // Budget fit score: how well price fits target budget (0-1)
    const budgetFitScore = Math.max(
        0,
        1 - Math.abs(product.price - targetBudgetPerCategory) / targetBudgetPerCategory
    );

    return {
        priceScore: Math.round(priceScore * 100) / 100,
        deliveryScore: Math.round(deliveryScore * 100) / 100,
        ratingScore: Math.round(ratingScore * 100) / 100,
        budgetFitScore: Math.round(budgetFitScore * 100) / 100,
    };
}

// Calculate total weighted score with preference boost
function calculateTotalScore(
    breakdown: ScoreBreakdown,
    weights: ScoringWeights,
    product: Product,
    preferences: UserPreferences
): number {
    let score =
        (weights.price * breakdown.priceScore) +
        (weights.delivery * breakdown.deliveryScore) +
        (weights.rating * breakdown.ratingScore) +
        (weights.budgetFit * breakdown.budgetFitScore);

    // Apply retailer preference boost (15% boost if preferred retailer)
    if (preferences.preferredRetailer !== 'any' &&
        product.retailer === preferences.preferredRetailer) {
        score = Math.min(1, score * 1.15);
    }

    return Math.round(score * 1000) / 1000;
}

// Main ranking function
export async function rankProducts(
    products: Product[],
    plan: ProcurementPlan,
    mode: OptimizationMode = 'balanced',
    onThought: (thought: AgentThought) => void,
    preferences: UserPreferences = DEFAULT_PREFERENCES
): Promise<Record<string, ScoredProduct[]>> {
    const startTime = Date.now();
    const weights = SCORING_WEIGHTS[mode];

    // Starting thought with preferences info
    const prefInfo = preferences.preferredRetailer !== 'any'
        ? ` | Preferred: ${preferences.preferredRetailer}`
        : '';
    onThought({
        id: generateId(),
        agentId: 'ranking',
        agentName: 'Ranking Engine',
        icon: '📊',
        thought: `Applying ${mode} scoring model: ${Math.round(weights.price * 100)}% price, ${Math.round(weights.delivery * 100)}% delivery, ${Math.round(weights.rating * 100)}% rating, ${Math.round(weights.budgetFit * 100)}% budget fit${prefInfo}`,
        timestamp: Date.now(),
        type: 'thinking',
    });

    await delay(500);

    // Group products by category
    const byCategory: Record<string, Product[]> = {};
    for (const product of products) {
        if (!byCategory[product.category]) {
            byCategory[product.category] = [];
        }
        byCategory[product.category].push(product);
    }

    const rankedByCategory: Record<string, ScoredProduct[]> = {};

    // Score and rank each category
    for (const category of plan.categories) {
        const categoryProducts = byCategory[category.name] || [];
        if (categoryProducts.length === 0) continue;

        // Calculate context values for this category
        const maxPrice = Math.max(...categoryProducts.map((p) => p.price));
        const maxDeliveryDays = Math.max(...categoryProducts.map((p) => p.deliveryDays));
        const targetBudget = plan.constraints.maxBudget * category.budgetAllocation;

        // Score each product
        const scoredProducts: ScoredProduct[] = categoryProducts.map((product) => {
            const scoreBreakdown = calculateScoreBreakdown(
                product,
                maxPrice,
                maxDeliveryDays,
                targetBudget,
                preferences
            );
            const score = calculateTotalScore(scoreBreakdown, weights, product, preferences);

            return {
                ...product,
                score,
                rank: 0, // Will be set after sorting
                scoreBreakdown,
            };
        });

        // Sort by score descending and assign ranks
        scoredProducts.sort((a, b) => b.score - a.score);
        scoredProducts.forEach((p, i) => {
            p.rank = i + 1;
        });

        rankedByCategory[category.name] = scoredProducts;

        // Thought for this category
        const topProduct = scoredProducts[0];
        if (topProduct) {
            onThought({
                id: generateId(),
                agentId: 'ranking',
                agentName: 'Ranking Engine',
                icon: '📊',
                thought: `${category.displayName}: Top pick "${topProduct.name.substring(0, 30)}..." (score: ${topProduct.score.toFixed(3)})`,
                timestamp: Date.now(),
                type: 'result',
            });
            await delay(300);
        }
    }

    // Summary thought
    const totalRanked = Object.values(rankedByCategory).reduce((sum, arr) => sum + arr.length, 0);
    onThought({
        id: generateId(),
        agentId: 'ranking',
        agentName: 'Ranking Engine',
        icon: '📊',
        thought: `✓ Ranked ${totalRanked} products across ${Object.keys(rankedByCategory).length} categories in ${Date.now() - startTime}ms`,
        timestamp: Date.now(),
        type: 'result',
    });

    return rankedByCategory;
}

// Generate explanation for a product's ranking
export function explainRanking(product: ScoredProduct, weights: ScoringWeights): string {
    const breakdown = product.scoreBreakdown;
    return `Ranked #${product.rank} because:
• Price efficiency: ${(breakdown.priceScore * 100).toFixed(0)}% (${(weights.price * 100).toFixed(0)}% weight)
• Delivery speed: ${(breakdown.deliveryScore * 100).toFixed(0)}% (${(weights.delivery * 100).toFixed(0)}% weight)  
• Quality rating: ${(breakdown.ratingScore * 100).toFixed(0)}% (${(weights.rating * 100).toFixed(0)}% weight)
• Budget fit: ${(breakdown.budgetFitScore * 100).toFixed(0)}% (${(weights.budgetFit * 100).toFixed(0)}% weight)
Final score: ${product.score.toFixed(3)}`;
}
