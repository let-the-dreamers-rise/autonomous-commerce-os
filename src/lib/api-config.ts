/**
 * API Configuration
 * 
 * Determines whether to use simulation mode or live API calls.
 * Simulation mode uses local JSON catalog data.
 * Live mode calls real retailer APIs (requires API keys in .env.local)
 */

export type ApiMode = 'simulation' | 'live';

/**
 * Check if running in simulation mode
 * Returns true if:
 * - Explicitly set to simulation
 * - No API keys configured
 * - Running on client-side (always simulation on client)
 */
export function isSimulationMode(): boolean {
    // Client-side always uses simulation (no secrets exposed)
    if (typeof window !== 'undefined') {
        return true;
    }

    // Server-side: check for API keys
    const hasApiKeys = !!(
        process.env.AMAZON_ACCESS_KEY ||
        process.env.WALMART_CONSUMER_ID ||
        process.env.BESTBUY_API_KEY
    );

    // If no API keys, use simulation
    if (!hasApiKeys) {
        return true;
    }

    // Check explicit mode setting
    return process.env.NEXT_PUBLIC_API_MODE !== 'live';
}

/**
 * Check if running in live API mode
 */
export function isLiveMode(): boolean {
    return !isSimulationMode();
}

/**
 * Get list of retailers with configured API keys
 */
export function getEnabledRetailers(): ('amazon' | 'walmart' | 'bestbuy')[] {
    if (typeof window !== 'undefined') {
        // All available in simulation mode
        return ['amazon', 'walmart', 'bestbuy'];
    }

    const retailers: ('amazon' | 'walmart' | 'bestbuy')[] = [];

    if (process.env.AMAZON_ACCESS_KEY) retailers.push('amazon');
    if (process.env.WALMART_CONSUMER_ID) retailers.push('walmart');
    if (process.env.BESTBUY_API_KEY) retailers.push('bestbuy');

    // If no APIs, all available via simulation
    return retailers.length > 0 ? retailers : ['amazon', 'walmart', 'bestbuy'];
}

/**
 * Rate limits per retailer (requests per second)
 */
export const RATE_LIMITS = {
    amazon: 1,
    walmart: 5,
    bestbuy: 5,
};

/**
 * Get API mode for display in UI
 */
export function getApiModeDisplay(): string {
    return isSimulationMode() ? 'Simulation' : 'Live API';
}
