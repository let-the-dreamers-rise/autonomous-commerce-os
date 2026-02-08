'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import {
    Gauge,
    Zap,
    TrendingUp,
    Clock,
    Package,
    DollarSign
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AnimatedNumberProps {
    value: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

function AnimatedNumber({
    value,
    duration = 1000,
    prefix = '',
    suffix = '',
    decimals = 0
}: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const startValue = displayValue;
        const diff = value - startValue;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = startValue + diff * easeOut;

            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return (
        <span>
            {prefix}
            {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue)}
            {suffix}
        </span>
    );
}

export default function LiveDashboard() {
    const { systemState, metrics, cart } = useStore();
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTime] = useState(Date.now());
    const [productCount, setProductCount] = useState(0);
    const [simulatedBudget, setSimulatedBudget] = useState(0);
    const [simulatedUtilization, setSimulatedUtilization] = useState(0);

    // Live timer
    useEffect(() => {
        // Use processing states instead of 'running'
        const isProcessing = ['planning', 'sourcing', 'ranking', 'optimizing', 'cart_building'].includes(systemState);
        if (isProcessing) {
            const interval = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [systemState, startTime]);

    // Simulated product scanning counter
    useEffect(() => {
        const isProcessing = ['sourcing', 'ranking', 'optimizing'].includes(systemState);
        if (isProcessing && productCount < 150) {
            const interval = setInterval(() => {
                setProductCount(prev => Math.min(prev + Math.floor(Math.random() * 15) + 5, 150));
            }, 200);
            return () => clearInterval(interval);
        }
    }, [systemState, productCount]);

    // Simulated budget tracking during processing
    useEffect(() => {
        const isOptimizing = ['optimizing', 'cart_building'].includes(systemState);
        if (isOptimizing && simulatedUtilization < 95) {
            const interval = setInterval(() => {
                setSimulatedBudget(prev => Math.min(prev + Math.floor(Math.random() * 30) + 20, 80));
                setSimulatedUtilization(prev => Math.min(prev + Math.floor(Math.random() * 8) + 5, 95));
            }, 300);
            return () => clearInterval(interval);
        }
    }, [systemState, simulatedUtilization]);

    const isActive = ['planning', 'sourcing', 'ranking', 'optimizing', 'cart_building', 'checkout'].includes(systemState);

    if (!isActive && !cart) return null;

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const tenths = Math.floor((ms % 1000) / 100);
        return `${seconds}.${tenths}s`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass p-4 mb-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                    <Gauge className="w-5 h-5 text-primary" />
                    {isActive && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-primary/30"
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    )}
                </div>
                <span className="font-semibold text-sm">Live Performance</span>
                {isActive && (
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs animate-pulse">
                        LIVE
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Elapsed Time */}
                <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-secondary" />
                    <div className="text-lg font-bold font-mono">
                        {isActive ? formatTime(elapsedTime) : formatTime(metrics?.totalDecisionTime || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Decision Time</div>
                </div>

                {/* Products Scanned */}
                <div className="text-center p-3 rounded-lg bg-muted/50">
                    <Package className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-lg font-bold">
                        <AnimatedNumber value={isActive ? productCount : (metrics?.productsScanned || productCount)} />
                    </div>
                    <div className="text-xs text-muted-foreground">Products Analyzed</div>
                </div>

                {/* Current Savings */}
                <div className="text-center p-3 rounded-lg bg-muted/50">
                    <DollarSign className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <div className="text-lg font-bold text-accent">
                        <AnimatedNumber
                            value={cart?.budgetRemaining ?? simulatedBudget}
                            prefix="$"
                            decimals={0}
                        />
                    </div>
                    <div className="text-xs text-muted-foreground">Under Budget</div>
                </div>

                {/* Optimization Score */}
                <div className="text-center p-3 rounded-lg bg-muted/50">
                    <TrendingUp className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                    <div className="text-lg font-bold">
                        <AnimatedNumber
                            value={cart?.budgetUtilization ?? simulatedUtilization}
                            suffix="%"
                            decimals={0}
                        />
                    </div>
                    <div className="text-xs text-muted-foreground">Budget Utilized</div>
                </div>
            </div>

            {/* Speed indicator bar */}
            {isActive && (
                <motion.div
                    className="mt-4 h-1 rounded-full bg-muted overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        style={{ width: '50%' }}
                    />
                </motion.div>
            )}
        </motion.div>
    );
}
