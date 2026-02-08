/**
 * Amazon Product Advertising API 5.0 Adapter
 * 
 * This adapter provides production-ready integration with Amazon PA-API.
 * It falls back to simulation data when API credentials are not configured.
 * 
 * Setup:
 * 1. Sign up at affiliate-program.amazon.com
 * 2. Get API credentials from Product Advertising API
 * 3. Set environment variables:
 *    - AMAZON_ACCESS_KEY
 *    - AMAZON_SECRET_KEY
 *    - AMAZON_PARTNER_TAG
 */

import { Product, Retailer } from '@/types';

interface AmazonSearchRequest {
    keywords: string;
    category?: string;
    maxResults?: number;
}

/**
 * Check if Amazon API is configured
 */
function isAmazonConfigured(): boolean {
    return !!(
        process.env.AMAZON_ACCESS_KEY &&
        process.env.AMAZON_SECRET_KEY &&
        process.env.AMAZON_PARTNER_TAG
    );
}

/**
 * Search Amazon Product Advertising API
 * Returns empty array if not configured (caller should handle fallback)
 */
export async function searchAmazon(request: AmazonSearchRequest): Promise<Product[]> {
    // Check if API is configured
    if (!isAmazonConfigured()) {
        console.log('[Amazon Adapter] API not configured, returning empty for fallback');
        return [];
    }

    // Server-side only - dynamic import to avoid bundling crypto on client
    try {
        const crypto = await import('crypto');

        const accessKey = process.env.AMAZON_ACCESS_KEY!;
        const secretKey = process.env.AMAZON_SECRET_KEY!;
        const partnerTag = process.env.AMAZON_PARTNER_TAG!;
        const region = process.env.AMAZON_REGION || 'us-east-1';

        const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');

        const payload = JSON.stringify({
            Keywords: request.keywords,
            SearchIndex: mapCategoryToSearchIndex(request.category),
            ItemCount: request.maxResults || 10,
            PartnerTag: partnerTag,
            PartnerType: 'Associates',
            Resources: [
                'ItemInfo.Title',
                'ItemInfo.ByLineInfo',
                'Offers.Listings.Price',
                'Offers.Listings.DeliveryInfo',
                'CustomerReviews.StarRating',
                'CustomerReviews.Count',
                'Images.Primary.Large'
            ]
        });

        // Generate AWS Signature V4
        const authorization = generateAwsSignature(
            crypto,
            'POST',
            '/paapi5/searchitems',
            payload,
            timestamp,
            accessKey,
            secretKey,
            region
        );

        const response = await fetch('https://webservices.amazon.com/paapi5/searchitems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Amz-Date': timestamp,
                'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
                'Authorization': authorization,
            },
            body: payload,
        });

        if (!response.ok) {
            console.error(`[Amazon Adapter] API error: ${response.status}`);
            return [];
        }

        const data = await response.json();
        return transformAmazonResults(data.SearchResult?.Items || []);

    } catch (error) {
        console.error('[Amazon Adapter] Error:', error);
        return [];
    }
}

/**
 * Generate AWS Signature V4 for Amazon PA-API
 */
function generateAwsSignature(
    crypto: any,
    method: string,
    path: string,
    payload: string,
    timestamp: string,
    accessKey: string,
    secretKey: string,
    region: string
): string {
    const service = 'ProductAdvertisingAPI';
    const dateStamp = timestamp.split('T')[0].replace(/-/g, '');

    const canonicalHeaders = `host:webservices.amazon.com\nx-amz-date:${timestamp}\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems\n`;
    const signedHeaders = 'host;x-amz-date;x-amz-target';
    const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');

    const canonicalRequest = `${method}\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;

    const kDate = crypto.createHmac('sha256', `AWS4${secretKey}`).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

    return `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

/**
 * Map category names to Amazon SearchIndex
 */
function mapCategoryToSearchIndex(category?: string): string {
    const mapping: Record<string, string> = {
        outerwear: 'Apparel',
        accessories: 'SportingGoods',
        base_layer: 'Apparel',
        pants: 'Apparel',
        gloves: 'Apparel',
        helmet: 'SportingGoods',
        socks: 'Apparel',
        snacks: 'GroceryAndGourmetFood',
        tech_accessories: 'Electronics',
    };
    return mapping[category || ''] || 'All';
}

/**
 * Transform Amazon API response to Product type
 */
function transformAmazonResults(items: any[]): Product[] {
    return items.map((item) => ({
        id: `amz-${item.ASIN}`,
        name: item.ItemInfo?.Title?.DisplayValue || 'Unknown Product',
        category: 'outerwear',
        price: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
        rating: item.CustomerReviews?.StarRating?.Value || 4.0,
        reviewCount: item.CustomerReviews?.Count || 0,
        deliveryDays: item.Offers?.Listings?.[0]?.DeliveryInfo?.IsPrimeEligible ? 2 : 5,
        inStock: !!item.Offers?.Listings?.length,
        retailer: 'amazon' as Retailer,
        image: item.Images?.Primary?.Large?.URL || '/products/placeholder.jpg',
        description: `From ${item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || 'Amazon'}`,
    }));
}
