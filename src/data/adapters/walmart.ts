/**
 * Walmart Affiliate API Adapter
 * 
 * This adapter provides production-ready integration with Walmart API.
 * It falls back to simulation data when API credentials are not configured.
 * 
 * Setup:
 * 1. Sign up at developers.walmart.com
 * 2. Create an application and get credentials
 * 3. Set environment variables:
 *    - WALMART_CONSUMER_ID
 *    - WALMART_PRIVATE_KEY
 */

import { Product, Retailer } from '@/types';

interface WalmartSearchRequest {
    query: string;
    category?: string;
    numItems?: number;
}

/**
 * Check if Walmart API is configured
 */
function isWalmartConfigured(): boolean {
    return !!(
        process.env.WALMART_CONSUMER_ID &&
        process.env.WALMART_PRIVATE_KEY
    );
}

/**
 * Search Walmart Products API
 * Returns empty array if not configured (caller should handle fallback)
 */
export async function searchWalmart(request: WalmartSearchRequest): Promise<Product[]> {
    if (!isWalmartConfigured()) {
        console.log('[Walmart Adapter] API not configured, returning empty for fallback');
        return [];
    }

    try {
        const crypto = await import('crypto');

        const consumerId = process.env.WALMART_CONSUMER_ID!;
        const privateKey = process.env.WALMART_PRIVATE_KEY!;
        const timestamp = Date.now().toString();

        // Generate Walmart API signature
        const data = `${consumerId}\n${timestamp}\n1\n`;
        const sign = crypto.createSign('RSA-SHA256');
        sign.update(data);
        const signature = sign.sign(privateKey, 'base64');

        const params = new URLSearchParams({
            query: request.query,
            format: 'json',
            numItems: (request.numItems || 10).toString(),
        });

        const response = await fetch(
            `https://developer.api.walmart.com/v1/search?${params}`,
            {
                headers: {
                    'WM_CONSUMER.ID': consumerId,
                    'WM_CONSUMER.INTIMESTAMP': timestamp,
                    'WM_SEC.KEY_VERSION': '1',
                    'WM_SEC.AUTH_SIGNATURE': signature,
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            console.error(`[Walmart Adapter] API error: ${response.status}`);
            return [];
        }

        const responseData = await response.json();
        return transformWalmartResults(responseData.items || []);

    } catch (error) {
        console.error('[Walmart Adapter] Error:', error);
        return [];
    }
}

/**
 * Transform Walmart API response to Product type
 */
function transformWalmartResults(items: any[]): Product[] {
    return items.map((item) => ({
        id: `wmt-${item.itemId}`,
        name: item.name || 'Unknown Product',
        category: 'outerwear',
        price: item.salePrice || 0,
        rating: parseFloat(item.customerRating || '4.0'),
        reviewCount: item.numReviews || 0,
        deliveryDays: estimateDelivery(item),
        inStock: item.stock !== 'Not available',
        retailer: 'walmart' as Retailer,
        image: item.thumbnailImage || '/products/placeholder.jpg',
        description: item.shortDescription || `From ${item.brandName || 'Walmart'}`,
    }));
}

/**
 * Estimate delivery days based on stock status
 */
function estimateDelivery(item: any): number {
    if (item.stock === 'Available') return 2;
    if (item.stock === 'Limited Stock') return 4;
    return 7;
}
