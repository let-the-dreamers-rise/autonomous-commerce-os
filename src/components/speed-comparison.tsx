'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { User, Clock, Zap, MousePointer, Brain, Sparkles } from 'lucide-react';

export default function SpeedComparison() {
    const { metrics, cart } = useStore();

    if (!cart || !metrics) return null;

    // Calculate estimates
    const manualTime = 45 * 60; // 45 minutes in seconds
    const aiTime = (metrics.totalDecisionTime || 8000) / 1000; // in seconds
    const speedMultiplier = Math.round(manualTime / aiTime);

    const manualClicks = 150;
    const aiClicks = 0;

    const manualTabs = 12;
    const aiTabs = 1;

    const comparisons = [
        {
            label: 'Time',
            manual: `${Math.round(manualTime / 60)} min`,
            ai: `${aiTime.toFixed(1)} sec`,
            icon: Clock,
            color: 'text-blue-400',
            improvement: `${speedMultiplier}x faster`
        },
        {
            label: 'Clicks',
            manual: manualClicks.toString(),
            ai: aiClicks.toString(),
            icon: MousePointer,
            color: 'text-green-400',
            improvement: '100% automated'
        },
        {
            label: 'Tabs Open',
            manual: manualTabs.toString(),
            ai: aiTabs.toString(),
            icon: Brain,
            color: 'text-purple-400',
            improvement: 'Single interface'
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass overflow-hidden"
        >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    <span className="font-semibold text-sm">Speed Comparison</span>
                </div>
            </div>

            {/* Comparison Grid */}
            <div className="p-4">
                {/* Column Headers */}
                <div className="grid grid-cols-4 gap-2 mb-3 text-xs">
                    <div></div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <User className="w-3 h-3" />
                            Manual
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-primary">
                            <Sparkles className="w-3 h-3" />
                            AI Agent
                        </div>
                    </div>
                    <div></div>
                </div>

                {/* Comparison Rows */}
                <div className="space-y-3">
                    {comparisons.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="grid grid-cols-4 gap-2 items-center"
                        >
                            {/* Label */}
                            <div className="flex items-center gap-2 text-sm">
                                <item.icon className={`w-4 h-4 ${item.color}`} />
                                <span className="text-muted-foreground">{item.label}</span>
                            </div>

                            {/* Manual Value */}
                            <div className="text-center">
                                <span className="text-sm text-red-400 font-mono">{item.manual}</span>
                            </div>

                            {/* AI Value */}
                            <div className="text-center">
                                <motion.span
                                    className="text-sm text-accent font-mono font-bold"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.5, delay: i * 0.1 + 0.5 }}
                                >
                                    {item.ai}
                                </motion.span>
                            </div>

                            {/* Improvement */}
                            <div className="text-right">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                                    {item.improvement}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Big Number */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.5 }}
                    className="mt-4 pt-4 border-t border-border/50 text-center"
                >
                    <div className="text-4xl font-bold gradient-text">
                        {speedMultiplier}x
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Faster than manual shopping
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
