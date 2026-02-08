/**
 * BestBuy Products API Adapter
 * 
 * This adapter provides production-ready integration with BestBuy API.
 * It falls back to simulation data when API credentials are not configured.
 * 
 * Setup:
 * 1. Sign up at developer.bestbuy.com
 * 2. Create an application and get API key
 * 3. Set environment variable:
 *    - BESTBUY_API_KEY
 */

import { Product, Retailer } from '@/types';

interface BestBuySearchRequest {
    query: string;
    category?: string;
    pageSize?: number;
}

/**
 * Check if BestBuy API is configured
 */
function isBestBuyConfigured(): boolean {
    return !!process.env.BESTBUY_API_KEY;
}

/**
 * Search BestBuy Products API
 * Returns empty array if not configured (caller should handle fallback)
 */
export async function searchBestBuy(request: BestBuySearchRequest): Promise<Product[]> {
    if (!isBestBuyConfigured()) {
        console.log('[BestBuy Adapter] API not configured, returning empty for fallback');
        return [];
    }

    try {
        const apiKey = process.env.BESTBUY_API_KEY!;

        const searchQuery = `search=${encodeURIComponent(request.query)}&onlineAvailability=true`;

        const params = new URLSearchParams({
            apiKey: apiKey,
            format: 'json',
            pageSize: (request.pageSize || 10).toString(),
            show: 'sku,name,salePrice,regularPrice,shortDescription,manufacturer,customerReviewAverage,customerReviewCount,inStoreAvailability,onlineAvailability,thumbnailImage,shippingCost',
        });

        const response = await fetch(
            `https://api.bestbuy.com/v1/products(${searchQuery})?${params}`
        );

        if (!response.ok) {
            console.error(`[BestBuy Adapter] API error: ${response.status}`);
            return [];
        }

        const data = await response.json();
        return transformBestBuyResults(data.products || []);

    } catch (error) {
        console.error('[BestBuy Adapter] Error:', error);
        return [];
    }
}

/**
 * Transform BestBuy API response to Product type
 */
function transformBestBuyResults(products: any[]): Product[] {
    return products.map((product) => ({
        id: `bb-${product.sku}`,
        name: product.name || 'Unknown Product',
        category: 'outerwear',
        price: product.salePrice || 0,
        rating: product.customerReviewAverage || 4.0,
        reviewCount: product.customerReviewCount || 0,
        deliveryDays: estimateDelivery(product),
        inStock: product.onlineAvailability,
        retailer: 'bestbuy' as Retailer,
        image: product.thumbnailImage || '/products/placeholder.jpg',
        description: product.shortDescription || `From ${product.manufacturer || 'Best Buy'}`,
    }));
}

/**
 * Estimate delivery days based on availability
 */
function estimateDelivery(product: any): number {
    if (product.inStoreAvailability) return 1;
    if (product.onlineAvailability && product.shippingCost === 0) return 2;
    return 5;
}
