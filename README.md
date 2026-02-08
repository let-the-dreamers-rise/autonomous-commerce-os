# 🛒🤖 Autonomous Commerce OS

<div align="center">

### The Operating System for Autonomous Purchasing

*Tell us what you need. We'll find, compare, and buy it from the best retailers — automatically.*

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![AI Agents](https://img.shields.io/badge/AI%20Agents-6-purple)

**[🎬 Watch Demo](#demo-scenarios) • [🚀 Quick Start](#-quick-start) • [🔌 Live API Setup](#-production-ready-just-add-api-keys)**

</div>

---

## 💡 The Problem

Shopping across multiple retailers is **broken**:
- 🔍 Search Amazon, Walmart, BestBuy separately
- 📊 Compare prices manually in spreadsheets
- ⏰ Track delivery dates across tabs
- 💸 Miss deals because you can't watch everything

**What if AI did all of this for you?**

---

## ✨ The Solution: 6 AI Agents Working Together

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   "I need a complete skiing outfit, budget $500, arrives in 5 days" │
│                                                                     │
└───────────────────────────────┬─────────────────────────────────────┘
                                ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  🎯 Planner  │→ │ 🔍 Sourcing  │→ │ 📊 Ranker    │→ │ 💰 Optimizer │
│    Agent     │  │    Swarm     │  │   Engine     │  │    Agent     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
        │                │                │                 │
        ↓                ↓                ↓                 ↓
   Break down      Search 3+         Score every      Maximize value
   your goal       retailers         product          within budget
                                                           ↓
                                    ┌──────────────────────────────┐
                                    │  🛒 Unified Cart              │
                                    │  One checkout • All retailers │
                                    └──────────────────────────────┘
```

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **🧠 Intent Understanding** | Natural language → structured procurement plan |
| **🏪 Multi-Retailer Search** | Amazon, Walmart, BestBuy searched in parallel |
| **📊 AI Ranking Engine** | Products scored by price, delivery, quality, budget fit |
| **🎚️ 4 Optimization Modes** | Balanced • Cheapest • Fastest • Highest Quality |
| **🛒 Unified Cart** | One cart across all retailers |
| **✏️ Full Cart Control** | Add, remove, replace any item manually |

### 🌟 WOW Features

| Feature | What It Does |
|---------|--------------|
| **⏰ Time-Travel Analysis** | *"Buy tomorrow, save 15%"* — Historical price predictions |
| **👥 Cross-User Intel** | *"327 others bought this combo"* — Social proof |
| **⚠️ Regret Minimizer** | Risk disclosure before checkout (late delivery %, stock-out risk) |
| **🤖 Self-Critic Agent** | AI explains why it made each decision |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/let-the-dreamers-rise/autonomous-commerce-os.git
cd autonomous-commerce-os

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

**That's it!** The system runs in Simulation Mode by default with realistic product data.

---

## 🎬 Demo Scenarios

Try these built-in scenarios:

| Scenario | Goal |
|----------|------|
| 🎉 **Hackathon Host Kit** | Snacks, badges, tech accessories for 80 people, $600 budget |
| ⛷️ **Skiing Outfit** | Complete gear (jacket, pants, accessories), 5-day delivery |
| 🏈 **Super Bowl Party** | Team merchandise, must arrive by Friday |

---

## 🏗️ Architecture

```
src/
├── agents/           # 🤖 AI Agents (planner, sourcing, ranking, optimizer)
├── components/       # ⚛️ React UI (cart, product grid, agent console)
├── data/
│   ├── adapters/     # 🔌 Retailer API adapters (Amazon, Walmart, BestBuy)
│   └── catalogs/     # 📦 Simulation data
├── lib/              # 🛠️ Utilities and API config
├── orchestrator/     # 🎭 Pipeline coordination
├── store/            # 📊 Zustand state management
└── types/            # 📝 TypeScript interfaces
```

---

## 🔌 Production-Ready: Just Add API Keys!

> **Zero code changes required.** Add API keys → restart → real data flows automatically.

### Environment Setup

```bash
# Create .env.local with any or all of these:

# BestBuy (FREE - Instant approval)
BESTBUY_API_KEY=your_key

# Amazon (Requires Associates account)
AMAZON_ACCESS_KEY=your_key
AMAZON_SECRET_KEY=your_secret
AMAZON_PARTNER_TAG=your_tag

# Walmart (Requires developer approval)
WALMART_CONSUMER_ID=your_id
WALMART_PRIVATE_KEY=your_key

# Enable live mode
NEXT_PUBLIC_API_MODE=live
```

### API Information

| Retailer | API | Get Started |
|----------|-----|-------------|
| **BestBuy** | Products API | [developer.bestbuy.com](https://developer.bestbuy.com) (Free, instant) |
| **Amazon** | PA-API 5.0 | [affiliate-program.amazon.com](https://affiliate-program.amazon.com) |
| **Walmart** | Affiliate API | [developers.walmart.com](https://developers.walmart.com) |

### Smart Fallback System

```
No API Keys   → Simulation Mode (realistic mock data)
Some Keys     → Hybrid Mode (real + simulation per-retailer)
All Keys      → Full Live Mode (100% real data)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | TailwindCSS + Framer Motion |
| **State** | Zustand |
| **AI** | OpenAI GPT-4 (optional) |
| **APIs** | Amazon PA-API, Walmart, BestBuy |

---

## 📊 Feature Compatibility

| Feature | Simulation | Live APIs |
|---------|:----------:|:---------:|
| Product Search | ✅ | ✅ |
| Real-Time Pricing | ✅ | ✅ |
| Ratings & Reviews | ✅ | ✅ |
| Delivery Estimates | ✅ | ✅ |
| Multi-Retailer Cart | ✅ | ✅ |
| AI Ranking Engine | ✅ | ✅ |
| Cart Modifications | ✅ | ✅ |
| Time-Travel Analysis | ✅ | ✅ |

---

## 🏆 Built for Global AI Hackathon

**Track:** Agentic Commerce (VC)

This project demonstrates:
- ✅ Multi-agent AI architecture
- ✅ Real-world API integration patterns
- ✅ Production-ready code with smart fallbacks
- ✅ Beautiful, responsive UI
- ✅ End-to-end autonomous purchasing flow

---

## 📄 License

MIT License © 2026 Ashwin Goyal

---

<div align="center">

**Made with ❤️ for autonomous commerce**

[⬆ Back to top](#-autonomous-commerce-os)

</div>
