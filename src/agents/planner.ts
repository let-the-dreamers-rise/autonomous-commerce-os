import type { ProcurementPlan, Category, AgentThought } from '@/types';
import { generateId, delay } from '@/lib/utils';

// Category templates based on event type
const CATEGORY_TEMPLATES: Record<string, Category[]> = {
    hackathon: [
        { name: 'snacks', displayName: 'Snacks & Refreshments', estimatedQty: 0, priority: 'high', budgetAllocation: 0.25 },
        { name: 'badges', displayName: 'Name Badges', estimatedQty: 0, priority: 'high', budgetAllocation: 0.10 },
        { name: 'tech_accessories', displayName: 'Tech Accessories', estimatedQty: 0, priority: 'medium', budgetAllocation: 0.20 },
        { name: 'prizes', displayName: 'Prizes & Awards', estimatedQty: 0, priority: 'medium', budgetAllocation: 0.35 },
        { name: 'decorations', displayName: 'Decorations', estimatedQty: 0, priority: 'low', budgetAllocation: 0.10 },
    ],
    party: [
        { name: 'snacks', displayName: 'Snacks & Food', estimatedQty: 0, priority: 'high', budgetAllocation: 0.40 },
        { name: 'decorations', displayName: 'Decorations', estimatedQty: 0, priority: 'high', budgetAllocation: 0.30 },
        { name: 'prizes', displayName: 'Party Favors', estimatedQty: 0, priority: 'medium', budgetAllocation: 0.30 },
    ],
    skiing: [
        { name: 'outerwear', displayName: 'Jacket & Pants', estimatedQty: 1, priority: 'high', budgetAllocation: 0.50 },
        { name: 'accessories', displayName: 'Gloves & Goggles', estimatedQty: 1, priority: 'high', budgetAllocation: 0.25 },
        { name: 'base_layer', displayName: 'Base Layers', estimatedQty: 1, priority: 'medium', budgetAllocation: 0.25 },
    ],
};

// Parse user goal to extract key information
function parseGoal(goal: string): {
    eventType: string;
    attendees: number;
    budget: number;
    deadline: string | null;
    preferences: string[];
} {
    const lowerGoal = goal.toLowerCase();

    // Detect event type
    let eventType = 'hackathon';
    if (lowerGoal.includes('party') || lowerGoal.includes('super bowl')) {
        eventType = 'party';
    } else if (lowerGoal.includes('ski') || lowerGoal.includes('outfit')) {
        eventType = 'skiing';
    }

    // Extract attendees
    const attendeesMatch = goal.match(/(\d+)\s*(people|person|attendees|guests)/i);
    const attendees = attendeesMatch ? parseInt(attendeesMatch[1]) : 50;

    // Extract budget
    const budgetMatch = goal.match(/\$?\s*(\d+)/);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : 500;

    // Extract deadline
    let deadline: string | null = null;
    if (lowerGoal.includes('friday')) {
        const friday = new Date();
        friday.setDate(friday.getDate() + ((5 - friday.getDay() + 7) % 7));
        deadline = friday.toISOString().split('T')[0];
    } else if (lowerGoal.includes('5 days') || lowerGoal.includes('within 5')) {
        const d = new Date();
        d.setDate(d.getDate() + 5);
        deadline = d.toISOString().split('T')[0];
    }

    // Extract preferences
    const preferences: string[] = [];
    if (lowerGoal.includes('snacks')) preferences.push('snacks');
    if (lowerGoal.includes('badges')) preferences.push('badges');
    if (lowerGoal.includes('cables') || lowerGoal.includes('tech')) preferences.push('tech_accessories');
    if (lowerGoal.includes('prizes')) preferences.push('prizes');
    if (lowerGoal.includes('decorations') || lowerGoal.includes('decor')) preferences.push('decorations');

    return { eventType, attendees, budget, deadline, preferences };
}

// Calculate quantities based on attendees
function calculateQuantities(categories: Category[], attendees: number): Category[] {
    return categories.map((cat) => {
        let qty = 1;
        switch (cat.name) {
            case 'snacks':
                qty = Math.ceil(attendees * 1.5); // 1.5 snacks per person
                break;
            case 'badges':
                qty = Math.ceil(attendees * 1.1); // 10% buffer
                break;
            case 'tech_accessories':
                qty = Math.ceil(attendees * 0.25); // 1 per 4 people
                break;
            case 'prizes':
                qty = Math.min(5, Math.ceil(attendees / 15)); // 1 prize per 15 people, max 5
                break;
            case 'decorations':
                qty = Math.ceil(attendees / 20); // 1 set per 20 people
                break;
            default:
                qty = 1;
        }
        return { ...cat, estimatedQty: qty };
    });
}

// Main planner function
export async function planProcurement(
    goal: string,
    onThought: (thought: AgentThought) => void
): Promise<ProcurementPlan> {
    const startTime = Date.now();

    // Thought 1: Analyzing goal
    onThought({
        id: generateId(),
        agentId: 'planner',
        agentName: 'Planner Agent',
        icon: '🎯',
        thought: `Analyzing goal: "${goal.substring(0, 50)}${goal.length > 50 ? '...' : ''}"`,
        timestamp: Date.now(),
        type: 'thinking',
    });

    await delay(800);

    // Parse the goal
    const parsed = parseGoal(goal);

    // Thought 2: Extracted information
    onThought({
        id: generateId(),
        agentId: 'planner',
        agentName: 'Planner Agent',
        icon: '🎯',
        thought: `Detected: ${parsed.eventType} event, ${parsed.attendees} attendees, $${parsed.budget} budget`,
        timestamp: Date.now(),
        type: 'decision',
    });

    await delay(600);

    // Get category template
    const categoryTemplate = CATEGORY_TEMPLATES[parsed.eventType] || CATEGORY_TEMPLATES.hackathon;
    const categories = calculateQuantities(categoryTemplate, parsed.attendees);

    // Thought 3: Categories identified
    const categoryNames = categories.map(c => c.displayName).join(', ');
    onThought({
        id: generateId(),
        agentId: 'planner',
        agentName: 'Planner Agent',
        icon: '🎯',
        thought: `Identified ${categories.length} required categories: ${categoryNames}`,
        timestamp: Date.now(),
        type: 'result',
    });

    await delay(500);

    // Build the plan
    const plan: ProcurementPlan = {
        categories,
        constraints: {
            maxBudget: parsed.budget,
            deadlineDate: parsed.deadline,
            mustHaveCategories: categories.filter(c => c.priority === 'high').map(c => c.name),
        },
        reasoning: `Created procurement plan for ${parsed.eventType} with ${parsed.attendees} attendees. Budget allocated across ${categories.length} categories with priority-based weighting. High-priority items (${categories.filter(c => c.priority === 'high').map(c => c.displayName).join(', ')}) will be fulfilled first.`,
    };

    // Final thought
    onThought({
        id: generateId(),
        agentId: 'planner',
        agentName: 'Planner Agent',
        icon: '🎯',
        thought: `✓ Plan complete in ${Date.now() - startTime}ms. Ready to source products.`,
        timestamp: Date.now(),
        type: 'result',
    });

    return plan;
}
