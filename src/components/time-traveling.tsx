'use client';

import { motion } from 'framer-motion';
import { Clock, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/utils';

// Simulated price history data
function generateTimelineData(basePrice: number) {
    const variance = basePrice * 0.15; // 15% price variance
    return {
        yesterday: {
            price: basePrice - (Math.random() * variance * 0.5),
            shipping: 0,
            stockRisk: 'low',
            available: true,
        },
        today: {
            price: basePrice,
            shipping: 4.99,
            stockRisk: 'low',
            available: true,
        },
        tomorrow: {
            price: basePrice + (Math.random() * variance),
            shipping: 9.99,
            stockRisk: 'medium',
            available: Math.random() > 0.2,
        },
    };
}

export default function TimeTraveling() {
    const { cart, systemState } = useStore();

    if (systemState !== 'complete' || !cart) return null;

    const basePrice = cart.totalCost;
    const timeline = generateTimelineData(basePrice);

    const timeframes = [
        {
            label: 'Yesterday',
            icon: '⏪',
            data: timeline.yesterday,
            comparison: ((timeline.yesterday.price - basePrice) / basePrice * 100).toFixed(1),
            status: 'missed',
        },
        {
            label: 'Today',
            icon: '📍',
            data: timeline.today,
            comparison: '0',
            status: 'optimal',
        },
        {
            label: 'Tomorrow',
            icon: '⏩',
            data: timeline.tomorrow,
            comparison: ((timeline.tomorrow.price - basePrice) / basePrice * 100).toFixed(1),
            status: 'risky',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass p-4"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">Time-Traveling Optimization</h3>
                    <p className="text-xs text-muted-foreground">Price analysis across time windows</p>
                </div>
            </div>

            {/* Timeline Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {timeframes.map((tf, idx) => (
                    <motion.div
                        key={tf.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-3 rounded-xl border ${tf.status === 'optimal'
                                ? 'bg-accent/10 border-accent/30'
                                : tf.status === 'missed'
                                    ? 'bg-muted/30 border-border/50'
                                    : 'bg-red-500/10 border-red-500/30'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{tf.icon}</span>
                            <span className="text-xs font-medium">{tf.label}</span>
                        </div>

                        <div className="text-lg font-bold mb-1">
                            {formatCurrency(tf.data.price)}
                        </div>

                        <div className="flex items-center gap-1 text-xs">
                            {parseFloat(tf.comparison) < 0 ? (
                                <>
                                    <TrendingDown className="w-3 h-3 text-green-400" />
                                    <span className="text-green-400">{tf.comparison}%</span>
                                </>
                            ) : parseFloat(tf.comparison) > 0 ? (
                                <>
                                    <TrendingUp className="w-3 h-3 text-red-400" />
                                    <span className="text-red-400">+{tf.comparison}%</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-3 h-3 text-accent" />
                                    <span className="text-accent">Best window</span>
                                </>
                            )}
                        </div>

                        {/* Stock Risk */}
                        <div className="mt-2 pt-2 border-t border-border/30">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {tf.data.stockRisk === 'low' ? (
                                    <span className="text-green-400">● In stock</span>
                                ) : tf.data.stockRisk === 'medium' ? (
                                    <span className="text-yellow-400">● Low stock risk</span>
                                ) : (
                                    <span className="text-red-400">● Stock-out risk</span>
                                )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Shipping: {tf.data.shipping === 0 ? 'Free' : formatCurrency(tf.data.shipping)}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* AI Recommendation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-3 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20"
            >
                <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-accent mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-accent">AI Recommendation</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            <strong>Buy TODAY.</strong> Tomorrow's prices are projected {((timeline.tomorrow.price - basePrice) / basePrice * 100).toFixed(0)}% higher
                            due to demand surge. Stock levels may decrease. You're in the optimal buying window.
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
