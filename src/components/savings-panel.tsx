'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { TrendingDown, Clock, Star, Sparkles } from 'lucide-react';

export default function SavingsPanel() {
    const { savings, plan } = useStore();

    if (!savings || !plan) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass overflow-hidden"
        >
            {/* Header with gradient */}
            <div className="px-4 py-3 bg-gradient-to-r from-accent/20 to-primary/20 border-b border-border/50">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    AI Savings Intelligence
                </h3>
            </div>

            <div className="p-4 space-y-4">
                {/* Comparison Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Random Shopping</span>
                        <span className="line-through text-muted-foreground">
                            {formatCurrency(savings.randomShoppingCost)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Single Retailer</span>
                        <span className="line-through text-muted-foreground">
                            {formatCurrency(savings.singleRetailerCost)}
                        </span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex items-center justify-between">
                        <span className="font-medium flex items-center gap-2">
                            <span className="text-accent">✨</span>
                            AI Optimized
                        </span>
                        <span className="font-bold text-lg text-accent">
                            {formatCurrency(savings.aiOptimizedCost)}
                        </span>
                    </div>
                </div>

                {/* Savings Highlight */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="text-3xl font-bold gradient-text mb-1"
                        >
                            {formatCurrency(savings.moneySaved)}
                        </motion.div>
                        <p className="text-sm text-muted-foreground">
                            saved compared to average shopping
                        </p>
                        <p className="text-xs text-accent mt-1">
                            That's {savings.percentSaved.toFixed(1)}% in savings!
                        </p>
                    </div>
                </div>

                {/* Additional Benefits */}
                <div className="grid grid-cols-2 gap-3">
                    {savings.deliveryDaysSaved > 0 && (
                        <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                            <Clock className="w-4 h-4 text-secondary mb-1" />
                            <p className="text-lg font-bold text-secondary">
                                {savings.deliveryDaysSaved} day{savings.deliveryDaysSaved !== 1 ? 's' : ''}
                            </p>
                            <p className="text-[10px] text-muted-foreground">faster delivery</p>
                        </div>
                    )}

                    {savings.qualityScoreGain > 0 && (
                        <div className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                            <Star className="w-4 h-4 text-yellow-400 mb-1" />
                            <p className="text-lg font-bold text-yellow-400">
                                +{savings.qualityScoreGain.toFixed(1)}★
                            </p>
                            <p className="text-[10px] text-muted-foreground">quality gain</p>
                        </div>
                    )}
                </div>

                {/* How Calculated */}
                <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer hover:text-primary">
                        How is this calculated?
                    </summary>
                    <div className="mt-2 p-3 rounded-lg bg-muted/30 space-y-1">
                        <p>• <strong>Random:</strong> Average price per category × quantity</p>
                        <p>• <strong>Single Retailer:</strong> Cost if buying all from most expensive store</p>
                        <p>• <strong>AI Optimized:</strong> Multi-retailer selection with weighted scoring</p>
                    </div>
                </details>
            </div>
        </motion.div>
    );
}
