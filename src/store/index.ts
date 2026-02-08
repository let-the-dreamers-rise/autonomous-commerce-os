import { create } from 'zustand';
import type {
    SystemState,
    ProcurementPlan,
    ProductResults,
    ScoredProduct,
    UnifiedCart,
    AgentStep,
    AgentThought,
    SystemMetrics,
    SavingsAnalysis,
    OptimizationMode,
    CheckoutProgress,
    DemoScenario,
} from '@/types';

// Demo scenarios
export const DEMO_SCENARIOS: DemoScenario[] = [
    {
        id: 'hackathon',
        title: 'Hackathon Host Kit',
        input: 'Host a hackathon for 80 people under $600, need snacks, badges, cables, prizes, and decorations',
        description: 'Full procurement for a tech event',
        icon: '🎓',
    },
    {
        id: 'skiing',
        title: 'Skiing Outfit',
        input: 'Complete skiing outfit, warm and waterproof, size M, budget $400, deliver in 5 days',
        description: 'Multi-item fashion optimization',
        icon: '🎿',
    },
    {
        id: 'party',
        title: 'Super Bowl Party',
        input: 'Full outfit for Super Bowl party, team style, budget $150, by Friday',
        description: 'Time-sensitive event shopping',
        icon: '🏈',
    },
];

interface AgenticCommerceStore {
    // System state
    systemState: SystemState;
    setSystemState: (state: SystemState) => void;

    // User input
    userGoal: string;
    setUserGoal: (goal: string) => void;

    // Agent steps tracking
    agentSteps: AgentStep[];
    addAgentStep: (step: AgentStep) => void;
    updateAgentStep: (agentId: string, updates: Partial<AgentStep>) => void;

    // Agent thoughts (real-time feed)
    agentThoughts: AgentThought[];
    addAgentThought: (thought: AgentThought) => void;
    clearAgentThoughts: () => void;

    // Planning results
    plan: ProcurementPlan | null;
    setPlan: (plan: ProcurementPlan) => void;

    // Product results
    products: ProductResults | null;
    setProducts: (products: ProductResults) => void;

    // Ranked products
    rankedProducts: Record<string, ScoredProduct[]> | null;
    setRankedProducts: (products: Record<string, ScoredProduct[]>) => void;

    // Cart
    cart: UnifiedCart | null;
    setCart: (cart: UnifiedCart) => void;
    replaceCartItem: (itemId: string, newProduct: ScoredProduct) => void;

    // Savings analysis
    savings: SavingsAnalysis | null;
    setSavings: (savings: SavingsAnalysis) => void;

    // Metrics
    metrics: SystemMetrics | null;
    setMetrics: (metrics: SystemMetrics) => void;

    // Checkout
    checkoutProgress: CheckoutProgress | null;
    setCheckoutProgress: (progress: CheckoutProgress) => void;

    // Optimization mode
    optimizationMode: OptimizationMode;
    setOptimizationMode: (mode: OptimizationMode) => void;

    // Demo mode
    isDemoMode: boolean;
    setDemoMode: (isDemo: boolean) => void;

    // Reset
    reset: () => void;
}

const initialState = {
    systemState: 'idle' as SystemState,
    userGoal: '',
    agentSteps: [],
    agentThoughts: [],
    plan: null,
    products: null,
    rankedProducts: null,
    cart: null,
    savings: null,
    metrics: null,
    checkoutProgress: null,
    optimizationMode: 'balanced' as OptimizationMode,
    isDemoMode: false,
};

export const useStore = create<AgenticCommerceStore>((set, get) => ({
    ...initialState,

    setSystemState: (state) => set({ systemState: state }),

    setUserGoal: (goal) => set({ userGoal: goal }),

    addAgentStep: (step) => set((state) => ({
        agentSteps: [...state.agentSteps, step],
    })),

    updateAgentStep: (agentId, updates) => set((state) => ({
        agentSteps: state.agentSteps.map((step) =>
            step.agentId === agentId ? { ...step, ...updates } : step
        ),
    })),

    addAgentThought: (thought) => set((state) => ({
        agentThoughts: [...state.agentThoughts, thought],
    })),

    clearAgentThoughts: () => set({ agentThoughts: [] }),

    setPlan: (plan) => set({ plan }),

    setProducts: (products) => set({ products }),

    setRankedProducts: (products) => set({ rankedProducts: products }),

    setCart: (cart) => set({ cart }),

    replaceCartItem: (itemId, newProduct) => {
        const { cart } = get();
        if (!cart) return;

        const updatedItems = cart.items.map((item) =>
            item.product.id === itemId
                ? { ...item, product: newProduct }
                : item
        );

        const totalCost = updatedItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        set({
            cart: {
                ...cart,
                items: updatedItems,
                totalCost,
                budgetRemaining: (cart.budgetRemaining + cart.totalCost) - totalCost,
            },
        });
    },

    setSavings: (savings) => set({ savings }),

    setMetrics: (metrics) => set({ metrics }),

    setCheckoutProgress: (progress) => set({ checkoutProgress: progress }),

    setOptimizationMode: (mode) => set({ optimizationMode: mode }),

    setDemoMode: (isDemo) => set({ isDemoMode: isDemo }),

    reset: () => set(initialState),
}));
