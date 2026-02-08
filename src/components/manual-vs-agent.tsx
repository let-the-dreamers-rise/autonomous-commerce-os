'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { User, Cpu, Clock, DollarSign, ShoppingCart, Zap, TrendingDown } from 'lucide-react';

export default function ManualVsAgent({ inline = false }: { inline?: boolean }) {
    const { metrics, savings, cart, systemState } = useStore();

    if (systemState !== 'complete' || !metrics || !cart) return null;

    if (inline) {
        return (
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    {/* Manual Human */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span className="text-xs font-medium">Human</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Time</span>
                                <span className="text-red-400 font-medium">~45m</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Checkouts</span>
                                <span className="text-red-400 font-medium">3</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Comparison</span>
                                <span className="text-red-400 font-medium">Low</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Agent */}
                    <div className="space-y-3 pl-4 border-l border-border/50">
                        <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-accent" />
                            <span className="text-xs font-medium text-accent">AI Agent</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Time</span>
                                <span className="text-accent font-medium">{(metrics.totalDecisionTime / 1000).toFixed(1)}s</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Checkouts</span>
                                <span className="text-accent font-medium">1</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Comparing</span>
                                <span className="text-accent font-medium">{metrics.productsScanned}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom comparison */}
                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Paradigm shift:</span>
                    <span className="text-xs font-medium text-accent">
                        {Math.round(45 * 60 / (metrics.totalDecisionTime / 1000))}x faster
                    </span>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-glass overflow-hidden"
        >
            <div className="px-4 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-border/50">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-orange-400" />
                    If This Was Manual
                </h3>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    {/* Manual Human */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span className="text-xs font-medium">Human Shopping</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Time</span>
                                <span className="text-red-400 font-medium">~45 min</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Checkouts</span>
                                <span className="text-red-400 font-medium">3 separate</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Comparison</span>
                                <span className="text-red-400 font-medium">Limited</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Optimization</span>
                                <span className="text-red-400 font-medium">None</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Agent */}
                    <div className="space-y-3 pl-4 border-l border-border/50">
                        <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-accent" />
                            <span className="text-xs font-medium text-accent">AI Agent</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Time</span>
                                <span className="text-accent font-medium">{(metrics.totalDecisionTime / 1000).toFixed(1)}s</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Checkouts</span>
                                <span className="text-accent font-medium">1 unified</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Comparison</span>
                                <span className="text-accent font-medium">{metrics.productsScanned} products</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Optimization</span>
                                <span className="text-accent font-medium">Multi-objective</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom comparison */}
                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Paradigm shift:</span>
                    <span className="text-xs font-medium text-accent">
                        {Math.round(45 * 60 / (metrics.totalDecisionTime / 1000))}x faster, optimized, autonomous
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
