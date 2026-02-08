// ===================================
// AGENTIC COMMERCE - TYPE DEFINITIONS
// ===================================

// ===== PROCUREMENT TYPES =====

export interface ProcurementGoal {
    rawInput: string;
    parsedIntent: {
        event: string;
        attendees: number;
        budget: number;
        deadline: Date | null;
        preferences: string[];
    };
}

export interface Category {
    name: string;
    displayName: string;
    estimatedQty: number;
    priority: 'high' | 'medium' | 'low';
    budgetAllocation: number;
}

export interface ProcurementPlan {
    categories: Category[];
    constraints: {
        maxBudget: number;
        deadlineDate: string | null;
        mustHaveCategories: string[];
    };
    reasoning: string;
}

// ===== PRODUCT TYPES =====

export type Retailer = 'amazon' | 'walmart' | 'bestbuy';

export interface ProductVariant {
    size?: string;
    color?: string;
    inStock: boolean;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    rating: number;
    reviewCount: number;
    deliveryDays: number;
    retailer: Retailer;
    image: string;
    inStock: boolean;
    description: string;
    variants?: ProductVariant[];
    selectedVariant?: ProductVariant;
}

export interface ScoreBreakdown {
    priceScore: number;
    deliveryScore: number;
    ratingScore: number;
    budgetFitScore: number;
}

export interface ScoredProduct extends Product {
    score: number;
    rank: number;
    scoreBreakdown: ScoreBreakdown;
}

export interface ProductResults {
    amazon: Product[];
    walmart: Product[];
    bestbuy: Product[];
    totalCount: number;
}

// ===== CART TYPES =====

export interface CartItem {
    product: ScoredProduct;
    quantity: number;
    alternates: ScoredProduct[];
    decision: ProductDecision;
}

export interface DeliveryEstimate {
    retailer: Retailer;
    items: number;
    estimatedDate: string;
    cost: number;
}

export interface UnifiedCart {
    items: CartItem[];
    totalCost: number;
    byRetailer: Record<Retailer, CartItem[]>;
    deliverySchedule: DeliveryEstimate[];
    budgetRemaining: number;
    budgetUtilization: number;
}

// ===== DECISION TYPES =====

export interface ProductDecision {
    whySelected: string[];
    whyNotAlternatives: Array<{
        productId: string;
        productName: string;
        reason: string;
    }>;
}

// ===== SAVINGS TYPES =====

export interface SavingsAnalysis {
    randomShoppingCost: number;
    singleRetailerCost: number;
    aiOptimizedCost: number;
    moneySaved: number;
    percentSaved: number;
    deliveryDaysSaved: number;
    qualityScoreGain: number;
}

// ===== AGENT TYPES =====

export type AgentId = 'planner' | 'sourcing' | 'ranking' | 'optimizer' | 'cart' | 'checkout';

export type AgentStatus = 'idle' | 'thinking' | 'complete' | 'error';

export interface AgentStep {
    agentId: AgentId;
    agentName: string;
    status: AgentStatus;
    input: unknown;
    output: unknown;
    reasoning: string;
    timestamp: number;
    duration?: number;
}

export interface AgentThought {
    id: string;
    agentId: AgentId;
    agentName: string;
    icon: string;
    thought: string;
    timestamp: number;
    type: 'thinking' | 'decision' | 'action' | 'result';
}

// ===== METRICS TYPES =====

export interface SystemMetrics {
    productsScanned: number;
    retailersAnalyzed: number;
    optimizationIterations: number;
    totalDecisionTime: number;
    budgetEfficiency: number;
    averageQualityScore: number;
    deliveryScore: number;
}

// ===== SYSTEM STATE =====

export type SystemState =
    | 'idle'
    | 'planning'
    | 'sourcing'
    | 'ranking'
    | 'optimizing'
    | 'cart_building'
    | 'checkout'
    | 'complete';

export type OptimizationMode = 'balanced' | 'cheapest' | 'fastest' | 'highest-quality';

export interface ScoringWeights {
    price: number;
    delivery: number;
    rating: number;
    budgetFit: number;
}

// ===== CHECKOUT TYPES =====

export type CheckoutState =
    | 'idle'
    | 'collecting_info'
    | 'validating'
    | 'processing_amazon'
    | 'processing_walmart'
    | 'processing_bestbuy'
    | 'complete';

export interface CheckoutProgress {
    state: CheckoutState;
    progress: number;
    currentRetailer?: Retailer;
    completedRetailers: Retailer[];
    message: string;
}

// ===== DEMO MODE =====

export interface DemoScenario {
    id: string;
    title: string;
    input: string;
    description: string;
    icon: string;
}
