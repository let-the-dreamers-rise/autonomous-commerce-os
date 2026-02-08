'use client';

import { motion } from 'framer-motion';
import { Rocket, Building2, TrendingUp, Globe, Zap, Users, DollarSign, Target } from 'lucide-react';

const VISION_STATS = [
    { icon: Globe, value: '$5.5T', label: 'Global E-commerce Market' },
    { icon: Users, value: '2.14B', label: 'Online Shoppers Worldwide' },
    { icon: DollarSign, value: '23%', label: 'Cart Abandonment Reduction' },
    { icon: Zap, value: '10x', label: 'Faster Procurement' },
];

const ROADMAP_ITEMS = [
    { quarter: 'Q1', title: 'Enterprise Pilot', description: 'B2B procurement automation for Fortune 500' },
    { quarter: 'Q2', title: 'API Launch', description: 'Developer API for autonomous purchasing' },
    { quarter: 'Q3', title: 'Shopify Integration', description: 'One-click install for Shopify merchants' },
    { quarter: 'Q4', title: 'Series A', description: 'Scale to 100+ enterprise customers' },
];

export default function StartupVision() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 mb-8"
        >
            {/* Section Header */}
            <div className="text-center mb-12">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-4"
                >
                    <Rocket className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Startup Vision</span>
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className="gradient-text">The Operating System</span>
                    <br />
                    for Autonomous Commerce
                </h2>

                <p className="text-muted-foreground max-w-2xl mx-auto">
                    We're not building another shopping assistant. We're building the infrastructure
                    layer for AI agents to participate in the economy autonomously.
                </p>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {VISION_STATS.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="card-glass text-center py-6"
                    >
                        <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Business Model */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="card-glass"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">B2B Enterprise</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Fortune 500 companies spend $2M+ annually on procurement.
                        We automate 80% of routine purchasing decisions.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-1 rounded-lg bg-muted text-xs">SaaS Platform</span>
                        <span className="px-2 py-1 rounded-lg bg-muted text-xs">$50K/year ACL</span>
                        <span className="px-2 py-1 rounded-lg bg-muted text-xs">Enterprise Support</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    className="card-glass"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                            <Target className="w-5 h-5 text-accent" />
                        </div>
                        <h3 className="font-semibold">API Platform</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Let any AI agent make purchases autonomously.
                        Usage-based pricing for developers building agentic apps.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-1 rounded-lg bg-muted text-xs">REST API</span>
                        <span className="px-2 py-1 rounded-lg bg-muted text-xs">Pay-per-transaction</span>
                        <span className="px-2 py-1 rounded-lg bg-muted text-xs">SDK</span>
                    </div>
                </motion.div>
            </div>

            {/* Roadmap */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="card-glass overflow-hidden"
            >
                <div className="px-6 py-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">2026 Roadmap</h3>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid md:grid-cols-4 gap-4">
                        {ROADMAP_ITEMS.map((item, index) => (
                            <motion.div
                                key={item.quarter}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 + index * 0.1 }}
                                className="relative"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 rounded-lg bg-primary text-white text-xs font-bold">
                                        {item.quarter}
                                    </span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center mt-8"
            >
                <p className="text-sm text-muted-foreground italic">
                    "Commerce is the next frontier for autonomous AI agents.
                    We're building the rails."
                </p>
                <p className="text-xs text-primary/60 mt-2">
                    — Agentic Commerce Founding Team
                </p>
            </motion.div>
        </motion.section>
    );
}
