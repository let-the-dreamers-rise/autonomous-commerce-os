/**
 * Product Search API Route
 * Handles server-side API calls to retailers
 * Falls back to simulation data when APIs are not configured
 */

import { NextRequest, NextResponse } from 'next/server';
import { isSimulationMode } from '@/lib/api-config';

// Import catalogs for simulation fallback
import amazonData from '@/data/catalogs/amazon.json';
import walmartData from '@/data/catalogs/walmart.json';
import bestbuyData from '@/data/catalogs/bestbuy.json';

// Import API adapters (server-side only)
// These will only be called if API keys are configured
import { searchAmazon } from '@/data/adapters/amazon';
import { searchWalmart } from '@/data/adapters/walmart';
import { searchBestBuy } from '@/data/adapters/bestbuy';

interface SearchRequest {
    keywords: string;
    category?: string;
    maxResults?: number;
}

export async function POST(request: NextRequest) {
    try {
        const body: SearchRequest = await request.json();
        const { keywords, category, maxResults = 15 } = body;

        // Check if we should use real APIs
        if (!isSimulationMode()) {
            // Live mode - call real APIs
            return await handleLiveSearch(keywords, category, maxResults);
        }

        // Simulation mode - use local catalogs
        return handleSimulationSearch(category, maxResults);

    } catch (error) {
        console.error('[Product Search API] Error:', error);
        return NextResponse.json(
            { error: 'Search failed', mode: 'simulation' },
            { status: 500 }
        );
    }
}

/**
 * Handle live API search with fallback
 */
async function handleLiveSearch(
    keywords: string,
    category?: string,
    maxResults = 15
) {
    const sources: any[] = [];
    let allProducts: any[] = [];
    let hasLiveData = false;

    // Parallel API calls with individual fallbacks
    const [amazonResult, walmartResult, bestbuyResult] = await Promise.allSettled([
        searchAmazonWithFallback(keywords, category, maxResults),
        searchWalmartWithFallback(keywords, category, maxResults),
        searchBestBuyWithFallback(keywords, category, maxResults),
    ]);

    // Process Amazon results
    if (amazonResult.status === 'fulfilled') {
        allProducts.push(...amazonResult.value.products);
        sources.push({
            retailer: 'amazon',
            count: amazonResult.value.products.length,
            fromApi: amazonResult.value.fromApi,
        });
        if (amazonResult.value.fromApi) hasLiveData = true;
    }

    // Process Walmart results
    if (walmartResult.status === 'fulfilled') {
        allProducts.push(...walmartResult.value.products);
        sources.push({
            retailer: 'walmart',
            count: walmartResult.value.products.length,
            fromApi: walmartResult.value.fromApi,
        });
        if (walmartResult.value.fromApi) hasLiveData = true;
    }

    // Process BestBuy results
    if (bestbuyResult.status === 'fulfilled') {
        allProducts.push(...bestbuyResult.value.products);
        sources.push({
            retailer: 'bestbuy',
            count: bestbuyResult.value.products.length,
            fromApi: bestbuyResult.value.fromApi,
        });
        if (bestbuyResult.value.fromApi) hasLiveData = true;
    }

    const mode = hasLiveData
        ? (sources.every(s => s.fromApi) ? 'live' : 'hybrid')
        : 'simulation';

    return NextResponse.json({ products: allProducts, sources, mode });
}

/**
 * Handle simulation search using local catalogs
 */
function handleSimulationSearch(category?: string, maxResults = 15) {
    const amazonProducts = getFromCatalog(amazonData, 'amazon', category, maxResults);
    const walmartProducts = getFromCatalog(walmartData, 'walmart', category, maxResults);
    const bestbuyProducts = getFromCatalog(bestbuyData, 'bestbuy', category, maxResults);

    const allProducts = [...amazonProducts, ...walmartProducts, ...bestbuyProducts];

    return NextResponse.json({
        products: allProducts,
        sources: [
            { retailer: 'amazon', count: amazonProducts.length, fromApi: false },
            { retailer: 'walmart', count: walmartProducts.length, fromApi: false },
            { retailer: 'bestbuy', count: bestbuyProducts.length, fromApi: false },
        ],
        mode: 'simulation',
    });
}

/**
 * Get products from simulation catalog
 */
function getFromCatalog(catalog: any, retailer: string, category?: string, maxResults = 15) {
    let products = (catalog.products || []).map((p: any) => ({
        ...p,
        retailer,
    }));

    if (category) {
        products = products.filter((p: any) => p.category === category);
    }

    return products.slice(0, maxResults);
}

/**
 * Search Amazon API with fallback to simulation
 */
async function searchAmazonWithFallback(keywords: string, category?: string, maxResults = 15) {
    try {
        const products = await searchAmazon({ keywords, category, maxResults });
        if (products.length > 0) {
            return { products, fromApi: true };
        }
    } catch (error) {
        console.error('[Amazon API] Error, using fallback:', error);
    }

    // Fallback to simulation
    return {
        products: getFromCatalog(amazonData, 'amazon', category, maxResults),
        fromApi: false,
    };
}

/**
 * Search Walmart API with fallback to simulation
 */
async function searchWalmartWithFallback(keywords: string, category?: string, maxResults = 15) {
    try {
        const products = await searchWalmart({ query: keywords, category, numItems: maxResults });
        if (products.length > 0) {
            return { products, fromApi: true };
        }
    } catch (error) {
        console.error('[Walmart API] Error, using fallback:', error);
    }

    return {
        products: getFromCatalog(walmartData, 'walmart', category, maxResults),
        fromApi: false,
    };
}

/**
 * Search BestBuy API with fallback to simulation
 */
async function searchBestBuyWithFallback(keywords: string, category?: string, maxResults = 15) {
    try {
        const products = await searchBestBuy({ query: keywords, category, pageSize: maxResults });
        if (products.length > 0) {
            return { products, fromApi: true };
        }
    } catch (error) {
        console.error('[BestBuy API] Error, using fallback:', error);
    }

    return {
        products: getFromCatalog(bestbuyData, 'bestbuy', category, maxResults),
        fromApi: false,
    };
}
