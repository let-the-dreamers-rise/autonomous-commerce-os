import type { Product, ProductResults, ProcurementPlan, AgentThought, Retailer } from '@/types';
import { generateId, delay } from '@/lib/utils';

// Import product catalogs
import amazonCatalog from '@/data/catalogs/amazon.json';
import walmartCatalog from '@/data/catalogs/walmart.json';
import bestbuyCatalog from '@/data/catalogs/bestbuy.json';

// Type the catalogs
interface Catalog {
    retailer: Retailer;
    displayName: string;
    products: Product[];
}

const catalogs: Record<Retailer, Catalog> = {
    amazon: amazonCatalog as Catalog,
    walmart: walmartCatalog as Catalog,
    bestbuy: bestbuyCatalog as Catalog,
};

// Search a single retailer
function searchRetailer(
    retailer: Retailer,
    categories: string[]
): Product[] {
    const catalog = catalogs[retailer];
    return catalog.products
        .filter((p) => categories.includes(p.category))
        .map((p) => ({ ...p, retailer }));
}

// Main sourcing function - searches all retailers in parallel
export async function sourceProducts(
    plan: ProcurementPlan,
    onThought: (thought: AgentThought) => void
): Promise<ProductResults> {
    const startTime = Date.now();
    const categoryNames = plan.categories.map((c) => c.name);

    // Starting thought
    onThought({
        id: generateId(),
        agentId: 'sourcing',
        agentName: 'Sourcing Agents',
        icon: '🔍',
        thought: `Initiating parallel search across 3 retailers for ${categoryNames.length} categories`,
        timestamp: Date.now(),
        type: 'thinking',
    });

    await delay(500);

    // Search Amazon
    onThought({
        id: generateId(),
        agentId: 'sourcing',
        agentName: 'Sourcing Agents',
        icon: '🔍',
        thought: '🛒 Searching Amazon catalog...',
        timestamp: Date.now(),
        type: 'action',
    });

    await delay(600);
    const amazonProducts = searchRetailer('amazon', categoryNames);

    onThought({
        id: generateId(),
        agentId: 'sourcing',
        agentName: 'Sourcing Agents',
        icon: '🔍',
        thought: `✓ Amazon: Found ${amazonProducts.length} matching products`,
        timestamp: Date.now(),
        type: 'result',
    });

    await delay(400);

    // Search Walmart
    onThought({
        id: generateId(),
        agentId: 'sourcing',
        agentName: 'Sourcing Agents',
        icon: '🔍',
        thought: '🏪 Searching Walmart catalog...',
        timestamp: Date.now(),
        type: 'action',
    });

    await delay(600);
    const walmartProducts = searchRetailer('walmart', categoryNames);

    onThought({
        id: generateId(),
        agentId: 'sourcing',
        agentName: 'Sourcing Agents',
        icon: '🔍',
        thought: `✓ Walmart: Found ${walmartProducts.length} matching products`,
        timestamp: Date.now(),
        type: 'result',
    });

    await delay(400);

    // Search Best Buy
    onThought({
        id: generateId(),
        agentId: 'sourcing',
        agentName: 'Sourcing Agents',
        icon: '🔍',
        thought: '💻 Searching Best Buy catalog...',
        timestamp: Date.now(),
        type: 'action',
    });

    await delay(600);
    const bestbuyProducts = searchRetailer('bestbuy', categoryNames);

    onThought({
        id: generateId(),
        agentId: 'sourcing',
        agentName: 'Sourcing Agents',
        icon: '🔍',
        thought: `✓ Best Buy: Found ${bestbuyProducts.length} matching products`,
        timestamp: Date.now(),
        type: 'result',
    });

    await delay(300);

    const totalCount = amazonProducts.length + walmartProducts.length + bestbuyProducts.length;

    // Summary thought
    onThought({
        id: generateId(),
        agentId: 'sourcing',
        agentName: 'Sourcing Agents',
        icon: '🔍',
        thought: `✓ Sourcing complete in ${Date.now() - startTime}ms. Total: ${totalCount} products from 3 retailers`,
        timestamp: Date.now(),
        type: 'result',
    });

    return {
        amazon: amazonProducts,
        walmart: walmartProducts,
        bestbuy: bestbuyProducts,
        totalCount,
    };
}

// Get all products as flat array
export function getAllProducts(results: ProductResults): Product[] {
    return [...results.amazon, ...results.walmart, ...results.bestbuy];
}
