# Production Roadmap

> From hackathon demo to production-ready startup

## Current State (Hackathon MVP)

| Feature | Data Source | Status |
|---------|-------------|--------|
| Product Search | Simulation catalogs | ✅ Ready for live APIs |
| AI Ranking | Algorithmic scoring | ✅ Production-ready |
| Unified Cart | Local state | ✅ Production-ready |
| Time-Travel Analysis | Simulated variance | ⚡ Needs real data |
| Cross-User Intelligence | Hardcoded patterns | ⚡ Needs real data |
| Regret Minimizer | Random percentages | ⚡ Needs real data |

---

## Phase 1: Real Retailer APIs (Week 1-2)

### Already Built
Files are ready, just add API keys:

```bash
# .env.local
BESTBUY_API_KEY=your_key
AMAZON_ACCESS_KEY=your_key
AMAZON_SECRET_KEY=your_secret
WALMART_CONSUMER_ID=your_id
```

### Files to Modify: None
The adapters (`src/data/adapters/*.ts`) handle fallback automatically.

---

## Phase 2: Time-Travel Analysis (Week 2-3)

### Current Implementation
```typescript
// src/components/time-traveling.tsx (Line 9-31)
function generateTimelineData(basePrice: number) {
    const variance = basePrice * 0.15; // Random simulation
    return { yesterday, today, tomorrow };
}
```

### Production Implementation

**Option A: Keepa API (Amazon)**
```typescript
// src/lib/price-history.ts
import { KeepaAPI } from 'keepa';

export async function getRealPriceHistory(asin: string): Promise<PriceTimeline> {
    const keepa = new KeepaAPI(process.env.KEEPA_API_KEY);
    const history = await keepa.getProduct(asin);
    
    return {
        yesterday: history.priceAt(Date.now() - 86400000),
        today: history.currentPrice,
        tomorrow: predictPrice(history), // ML model
    };
}
```

**Option B: Build Your Own**
- Cron job scrapes prices every 6 hours
- PostgreSQL stores price history
- Linear regression predicts tomorrow

**Cost:** Keepa starts at $15/month for 100 tokens/day

---

## Phase 3: Cross-User Intelligence (Week 3-4)

### Current Implementation
```typescript
// src/components/cross-user-intel.tsx (Line 8-36)
const eventData = {
    hackathon: { purchases: 327, topChoices: [...] },
    // Hardcoded
};
```

### Production Implementation

**Database Schema:**
```sql
CREATE TABLE purchases (
    id UUID PRIMARY KEY,
    user_id UUID,
    event_type VARCHAR(50),
    products JSONB,
    created_at TIMESTAMP
);

CREATE TABLE product_popularity (
    product_id VARCHAR(100),
    event_type VARCHAR(50),
    purchase_count INT,
    satisfaction_score DECIMAL
);
```

**OpenAI Integration:**
```typescript
// src/lib/cross-user-ai.ts
export async function getCrowdInsights(eventType: string, products: Product[]) {
    const purchaseHistory = await db.query(`
        SELECT products, COUNT(*) as frequency
        FROM purchases
        WHERE event_type = $1
        GROUP BY products
        ORDER BY frequency DESC
        LIMIT 10
    `, [eventType]);

    const analysis = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "system",
            content: "Analyze purchase patterns and generate insights..."
        }, {
            role: "user",
            content: JSON.stringify({ eventType, purchaseHistory, currentCart: products })
        }]
    });

    return {
        purchases: purchaseHistory.length,
        topChoices: analysis.choices[0].message.content,
        warnings: extractWarnings(analysis),
        tips: extractTips(analysis),
    };
}
```

---

## Phase 4: Regret Minimizer (Week 4-5)

### Current Implementation
```typescript
// src/components/regret-minimizer.tsx (Line 25-53)
const risks = [
    { probability: Math.floor(Math.random() * 8) + 3 }, // Random
];
```

### Production Implementation

**1. Delivery Risk (Real Carrier Data)**
```typescript
// src/lib/delivery-risk.ts
export async function getDeliveryRisk(carrier: string, route: { from: string; to: string }) {
    // FedEx API
    const fedexStats = await fedex.getServiceStats(route);
    
    // Or aggregate from ShipStation
    const historicalData = await shipstation.getDeliveryHistory({
        carrier,
        destination: route.to,
        days: 30
    });

    return {
        onTimePercentage: historicalData.onTimeRate,
        averageDelay: historicalData.avgDelayDays,
        riskLevel: historicalData.onTimeRate > 95 ? 'low' : 'medium'
    };
}
```

**2. Stock-out Risk (Inventory APIs)**
```typescript
// src/lib/stock-risk.ts
export async function getStockRisk(productId: string, retailer: string) {
    // Some retailers expose inventory levels
    if (retailer === 'bestbuy') {
        const inventory = await bestbuy.getStoreAvailability(productId);
        return {
            inStock: inventory.count > 0,
            quantity: inventory.count,
            risk: inventory.count < 5 ? 'high' : 'low'
        };
    }
    
    // Fallback: Use review velocity as proxy
    const recentReviews = await getReviewVelocity(productId);
    return estimateStockFromDemand(recentReviews);
}
```

**3. Quality Variance (OpenAI Sentiment Analysis)**
```typescript
// src/lib/quality-risk.ts
export async function getQualityRisk(productId: string, reviews: string[]) {
    const analysis = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "system",
            content: `Analyze these product reviews. Return JSON:
            {
                "overallSentiment": "positive|mixed|negative",
                "qualityVariance": 0-100 (percentage of complaints),
                "commonIssues": ["issue1", "issue2"],
                "riskLevel": "low|medium|high"
            }`
        }, {
            role: "user",
            content: reviews.slice(0, 50).join("\n---\n")
        }]
    });

    return JSON.parse(analysis.choices[0].message.content);
}
```

---

## Phase 5: Full AI Agent Pipeline (Week 5-6)

### Current: Rule-based agents
### Production: OpenAI function calling

```typescript
// src/agents/planner.ts (Production)
export async function plannerAgent(userGoal: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "system",
            content: "You are a procurement planning agent..."
        }, {
            role: "user",
            content: userGoal
        }],
        tools: [{
            type: "function",
            function: {
                name: "create_procurement_plan",
                parameters: {
                    type: "object",
                    properties: {
                        categories: { type: "array", items: { type: "string" } },
                        budget: { type: "number" },
                        deadline: { type: "string" },
                        constraints: { type: "array", items: { type: "string" } }
                    }
                }
            }
        }]
    });

    return response.choices[0].message.tool_calls[0].function.arguments;
}
```

---

## API Cost Estimates (Monthly)

| Service | Usage | Cost |
|---------|-------|------|
| OpenAI GPT-4o | 10K requests | ~$50 |
| Keepa | 100 tokens/day | $15 |
| BestBuy API | 50K/day | Free |
| Amazon PA-API | Unlimited* | Free |
| Walmart API | 5 req/sec | Free |
| Database (Supabase) | 500MB | Free |

**Total MVP:** ~$65/month

---

## Environment Variables (Production)

```bash
# .env.production

# Retailer APIs
BESTBUY_API_KEY=
AMAZON_ACCESS_KEY=
AMAZON_SECRET_KEY=
AMAZON_PARTNER_TAG=
WALMART_CONSUMER_ID=
WALMART_PRIVATE_KEY=

# AI Services
OPENAI_API_KEY=
KEEPA_API_KEY=

# Database
DATABASE_URL=

# Carrier APIs (optional)
FEDEX_API_KEY=
UPS_API_KEY=
SHIPSTATION_API_KEY=

# Mode
NEXT_PUBLIC_API_MODE=live
```

---

## Summary: Files to Modify

| Feature | Current File | New Function |
|---------|--------------|--------------|
| Time-Travel | `time-traveling.tsx` | Replace `generateTimelineData()` with `getRealPriceHistory()` |
| Cross-User Intel | `cross-user-intel.tsx` | Replace `generateCrossUserData()` with `getCrowdInsights()` |
| Regret Minimizer | `regret-minimizer.tsx` | Replace `risks` array generation with real API calls |
| Planner Agent | `agents/planner.ts` | Add OpenAI function calling |

**The UI stays the same.** Only the data sources change.

---

*Built for Global AI Hackathon 2026 • MIT License • Ashwin Goyal*
