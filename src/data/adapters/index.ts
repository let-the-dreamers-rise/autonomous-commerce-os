/**
 * Unified Retailer Adapter
 * Combines all retailer APIs with automatic fallback to simulation mode
 * 
 * This is the main entry point for product sourcing.
 * - In simulation mode: uses local JSON catalogs
 * - In live mode: calls real APIs, falls back to simulation on error
 */

import { Product, Retailer } from '@/types';
import { isSimulationMode, getEnabledRetailers } from '@/lib/api-config';

// Import simulation data
import amazonData from '@/data/catalogs/amazon.json';
import walmartData from '@/data/catalogs/walmart.json';
import bestbuyData from '@/data/catalogs/bestbuy.json';

export interface UnifiedSearchRequest {
    keywords: string;
    category?: string;
    maxResults?: number;
    retailers?: Retailer[];
}

export interface UnifiedSearchResult {
    products: Product[];
    sources: {
        retailer: Retailer;
        count: number;
        fromApi: boolean;
        latencyMs?: number;
    }[];
    mode: 'simulation' | 'live' | 'hybrid';
    totalLatencyMs: number;
}

/**
 * Search all retailers with automatic fallback
 * This is the main function used by the sourcing agent
 */
export async function searchAllRetailers(request: UnifiedSearchRequest): Promise<UnifiedSearchResult> {
    const startTime = Date.now();
    const { keywords, category, maxResults = 15 } = request;

    // Always use simulation in client-side or when not configured
    if (isSimulationMode()) {
        console.log('[Unified Adapter] Running in SIMULATION mode');
        const result = getSimulationResults(category, maxResults);
        result.totalLatencyMs = Date.now() - startTime;
        return result;
    }

    // Live mode - try APIs with fallback
    console.log('[Unified Adapter] Running in LIVE mode');
    return await getLiveResults(keywords, category, maxResults, startTime);
}

/**
 * Get results from simulation data (local JSON)
 */
function getSimulationResults(category?: string, maxResults = 15): UnifiedSearchResult {
    const amazonProducts = getProductsFromCatalog(amazonData, 'amazon', category, maxResults);
    const walmartProducts = getProductsFromCatalog(walmartData, 'walmart', category, maxResults);
    const bestbuyProducts = getProductsFromCatalog(bestbuyData, 'bestbuy', category, maxResults);

    const allProducts = [...amazonProducts, ...walmartProducts, ...bestbuyProducts];

    return {
        products: allProducts,
        sources: [
            { retailer: 'amazon', count: amazonProducts.length, fromApi: false },
            { retailer: 'walmart', count: walmartProducts.length, fromApi: false },
            { retailer: 'bestbuy', count: bestbuyProducts.length, fromApi: false },
        ],
        mode: 'simulation',
        totalLatencyMs: 0,
    };
}

/**
 * Get products from a catalog JSON
 */
function getProductsFromCatalog(
    catalog: any,
    retailer: Retailer,
    category?: string,
    maxResults = 15
): Product[] {
    let products = (catalog.products || []) as Product[];

    // Filter by category if specified
    if (category) {
        products = products.filter(p => p.category === category);
    }

    // Ensure retailer is set
    products = products.map(p => ({
        ...p,
        retailer: retailer,
    }));

    return products.slice(0, maxResults);
}

/**
 * Get results from live APIs with fallback to simulation
 * This function handles real API calls on the server-side
 */
async function getLiveResults(
    keywords: string,
    category?: string,
    maxResults = 15,
    startTime = Date.now()
): Promise<UnifiedSearchResult> {
    const sources: UnifiedSearchResult['sources'] = [];
    let allProducts: Product[] = [];
    let hasLiveData = false;

    // For now, call the API routes we'll create
    // These routes handle the actual API calls server-side
    try {
        const response = await fetch('/api/products/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keywords, category, maxResults }),
        });

        if (response.ok) {
            const data = await response.json();
            return {
                products: data.products,
                sources: data.sources,
                mode: data.mode,
                totalLatencyMs: Date.now() - startTime,
            };
        }
    } catch (error) {
        console.error('[Unified Adapter] API route error, falling back to simulation:', error);
    }

    // Fallback to simulation
    const result = getSimulationResults(category, maxResults);
    result.totalLatencyMs = Date.now() - startTime;
    return result;
}

/**
 * Search a single retailer
 */
export async function searchRetailer(
    retailer: Retailer,
    keywords: string,
    category?: string,
    maxResults = 10
): Promise<Product[]> {
    // In simulation mode, use local data
    if (isSimulationMode()) {
        const catalog = retailer === 'amazon' ? amazonData :
            retailer === 'walmart' ? walmartData : bestbuyData;
        return getProductsFromCatalog(catalog, retailer, category, maxResults);
    }

    // Live mode - call API route
    try {
        const response = await fetch(`/api/products/${retailer}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keywords, category, maxResults }),
        });

        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error(`[${retailer} Adapter] Error:`, error);
    }

    // Fallback
    const catalog = retailer === 'amazon' ? amazonData :
        retailer === 'walmart' ? walmartData : bestbuyData;
    return getProductsFromCatalog(catalog, retailer, category, maxResults);
}
