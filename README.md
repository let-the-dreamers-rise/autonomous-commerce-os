# Agentic Commerce 🛒🤖

> **The Operating System for Autonomous Purchasing**

An AI-powered multi-agent system that transforms high-level goals into optimized procurement decisions across multiple retailers.

![Mode: Simulation](https://img.shields.io/badge/Mode-Simulation-blue)
![Agents: 6](https://img.shields.io/badge/Agents-6-green)
![Retailers: 3](https://img.shields.io/badge/Retailers-3-orange)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## ⚙️ API Configuration (Optional)

The system runs in **Simulation Mode** by default (fast, deterministic, perfect for demos).

To enable **Live Mode** with real AI:

1. Copy `.env.example` to `.env.local`
2. Add your OpenAI API key:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart the server

The header will show "Live API" when connected.

## 🎯 Features

### Core Pipeline
- **Intent Parsing** → Understand complex goals
- **Multi-Retailer Sourcing** → Amazon, Walmart, BestBuy
- **AI Ranking Engine** → Score by price, delivery, quality
- **Budget Optimization** → Constraint-aware selection
- **Unified Cart** → Single checkout across stores

### 4 Optimization Modes
| Mode | Focus |
|------|-------|
| Balanced | Equal weight to all factors |
| Cheapest | Minimize total cost |
| Fastest | Minimize delivery time |
| Highest Quality | Maximize ratings |

### WOW Features
- **Time-Travel Analysis** → "Buy tomorrow, save 15%"
- **Regret Minimizer** → Risk disclosure before checkout
- **Cross-User Intel** → "327 others bought this"
- **Self-Critic Agent** → AI judges its own decisions

## 🏗️ Architecture

```
User Goal → Planner Agent → Sourcing Swarm → Ranking Engine
                                                    ↓
            Checkout ←── Cart Builder ←── Optimizer
```

## 📁 Project Structure

```
src/
├── agents/          # AI agents (planner, sourcing, ranking, optimizer)
├── components/      # React UI components
├── data/catalogs/   # Retailer product data (simulation)
├── lib/             # Utilities and config
├── orchestrator/    # Pipeline coordination
├── store/           # Zustand state management
└── types/           # TypeScript interfaces
```

## 🎬 Demo Scenarios

1. **Hackathon Host Kit** - 80 people, $600 budget
2. **Skiing Outfit** - Complete gear, 5-day delivery
3. **Super Bowl Party** - Team merchandise, Friday deadline

## 🏆 Built for Global AI Hackathon

Track: **Agentic Commerce (VC)**

---

## 🔌 Production-Ready: Just Add API Keys!

> **No code changes needed!** Add your API keys to `.env.local` and restart - real data flows automatically.

### Quick Setup

```bash
# .env.local - Add any or all of these:

# BestBuy (FREE - Instant approval at developer.bestbuy.com)
BESTBUY_API_KEY=your_key

# Amazon (Requires Associates account at affiliate-program.amazon.com)
AMAZON_ACCESS_KEY=your_key
AMAZON_SECRET_KEY=your_secret
AMAZON_PARTNER_TAG=your_tag

# Walmart (Requires approval at developers.walmart.com)
WALMART_CONSUMER_ID=your_id
WALMART_PRIVATE_KEY=your_key

# Enable live mode
NEXT_PUBLIC_API_MODE=live
```

### Get Your API Keys

| Retailer | API | Difficulty | Free Tier | Sign Up |
|----------|-----|:----------:|:---------:|---------|
| BestBuy | Products API | ✅ Easy | 50K/day | [developer.bestbuy.com](https://developer.bestbuy.com) |
| Amazon | PA-API 5.0 | ⚠️ Medium | Unlimited* | [affiliate-program.amazon.com](https://affiliate-program.amazon.com) |
| Walmart | Affiliate API | ⚠️ Medium | 5 req/sec | [developers.walmart.com](https://developers.walmart.com) |

*Amazon requires 3 qualifying sales in 180 days for API access

### How It Works

```
No API Keys → Simulation Mode (realistic mock data)
API Keys    → Live Mode (real retailer data)
Mixed Keys  → Hybrid Mode (real + simulation per-retailer)
```

### API Adapter Files (Already Built)

| File | Purpose |
|------|---------|
| `src/lib/api-config.ts` | Mode detection (simulation vs live) |
| `src/data/adapters/amazon.ts` | Amazon PA-API 5.0 with AWS Signature V4 |
| `src/data/adapters/walmart.ts` | Walmart Affiliate API with RSA auth |
| `src/data/adapters/bestbuy.ts` | BestBuy Products API |
| `src/data/adapters/index.ts` | Unified search with auto-fallback |
| `src/app/api/products/search/route.ts` | Server-side API route |

### All Features Work with Real Data ✅

| Feature | Works in Simulation | Works with Real APIs |
|---------|:------------------:|:-------------------:|
| Product Search | ✅ | ✅ |
| Live Pricing | ✅ | ✅ |
| Ratings & Reviews | ✅ | ✅ |
| Delivery Estimates | ✅ | ✅ |
| Multi-Retailer Cart | ✅ | ✅ |
| AI Ranking Engine | ✅ | ✅ |
| Add/Remove/Replace Items | ✅ | ✅ |
| Time-Travel Analysis | ✅ | ✅ (with Keepa API) |


