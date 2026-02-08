/**
 * OpenAI Integration for Agentic Commerce
 * 
 * This file provides the AI backbone for natural language understanding.
 * NOT a ChatGPT wrapper - we use AI for structured intent parsing only.
 * All decision logic (ranking, optimization, cart building) is deterministic.
 * 
 * USAGE:
 * 1. Install: npm install openai
 * 2. Create .env.local with: OPENAI_API_KEY=your_key_here
 * 3. The planner will automatically use AI parsing when available
 */

// Types for AI parsing
interface ParsedCategory {
    name: string;
    quantity: number;
    priority: 'high' | 'medium' | 'low';
}

interface ParsedGoal {
    eventType: string;
    attendees: number;
    budget: number;
    deadline: Date;
    categories: ParsedCategory[];
    preferences: string[];
    constraints: string[];
    confidence: number;
}

interface OpenAIConfig {
    apiKey: string | undefined;
    model: string;
    temperature: number;
}

// Configuration
const config: OpenAIConfig = {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    model: 'gpt-4o-mini', // Cost-effective for parsing
    temperature: 0.2, // Low temperature for consistent structured output
};

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
    return !!config.apiKey && config.apiKey.length > 10;
}

/**
 * Parse a procurement goal using OpenAI
 * Returns structured data for the agent pipeline
 * 
 * This is NOT a ChatGPT wrapper because:
 * 1. We only use AI for intent parsing (the "understanding" step)
 * 2. All decision logic (scoring, ranking, optimization) is deterministic
 * 3. AI is one step in a 6-agent pipeline, not the whole system
 */
export async function parseGoalWithAI(goal: string): Promise<ParsedGoal | null> {
    if (!isOpenAIConfigured()) {
        console.log('[OpenAI] Not configured - using fallback parser');
        return null; // Fall back to regex parsing
    }

    try {
        const response = await fetch('/api/parse-goal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goal }),
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data as ParsedGoal;
    } catch (error) {
        console.error('[OpenAI] Parsing failed:', error);
        return null; // Fall back to regex parsing
    }
}

/**
 * System prompt for goal parsing
 * This defines HOW the AI should extract structured data
 */
export const GOAL_PARSING_PROMPT = `You are a procurement intent parser for an autonomous shopping system.

Given a natural language procurement goal, extract structured data:

1. Event Type: hackathon, party, wedding, office, conference, personal, etc.
2. Attendees: Number of people (default: 10)
3. Budget: Dollar amount (extract numbers, default: $500)
4. Deadline: Date by when items are needed (parse relative dates)
5. Categories: What types of products are needed
6. Preferences: Any stated preferences (brands, quality, eco-friendly, etc.)
7. Constraints: Hard requirements (dietary restrictions, color themes, etc.)
8. Confidence: How confident you are in the parsing (0-1)

For categories, map to these standard types:
- snacks (food, beverages, catering)
- badges (name tags, lanyards)
- tech_accessories (cables, chargers, USB)
- prizes (gift cards, electronics, swag)
- decorations (banners, balloons, streamers)
- apparel (clothing, merchandise)
- office_supplies (pens, notebooks, stationery)
- outdoor_gear (camping, sports, weather gear)

Return JSON only, no explanation.`;

/**
 * Example API route handler (create at /api/parse-goal/route.ts)
 * 
 * import OpenAI from 'openai';
 * import { NextResponse } from 'next/server';
 * import { GOAL_PARSING_PROMPT } from '@/lib/openai';
 * 
 * const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
 * 
 * export async function POST(req: Request) {
 *   const { goal } = await req.json();
 *   
 *   const response = await openai.chat.completions.create({
 *     model: 'gpt-4o-mini',
 *     messages: [
 *       { role: 'system', content: GOAL_PARSING_PROMPT },
 *       { role: 'user', content: goal },
 *     ],
 *     response_format: { type: 'json_object' },
 *     temperature: 0.2,
 *   });
 *   
 *   return NextResponse.json(JSON.parse(response.choices[0].message.content));
 * }
 */

export default {
    isConfigured: isOpenAIConfigured,
    parseGoal: parseGoalWithAI,
};
