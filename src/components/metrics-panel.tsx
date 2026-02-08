'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store';
import {
    Search,
    Store,
    RotateCcw,
    Zap,
    Percent,
    Star
} from 'lucide-react';

interface MetricCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    color: string;
    delay?: number;
}

function MetricCard({ icon, value, label, color, delay = 0 }: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, type: 'spring' }}
            className={`p-3 rounded-lg border ${color}`}
        >
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="text-lg font-bold">{value}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{label}</p>
        </motion.div>
    );
}

export default function MetricsPanel({ inline = false }: { inline?: boolean }) {
    const { metrics } = useStore();

    if (!metrics) return null;

    if (inline) {
        return (
            <div className="p-4 grid grid-cols-2 gap-3">
                <MetricCard
                    icon={<Search className="w-4 h-4 text-primary" />}
                    value={metrics.productsScanned}
                    label="Products Scanned"
                    color="bg-primary/10 border-primary/20"
                    delay={0.1}
                />

                <MetricCard
                    icon={<Store className="w-4 h-4 text-secondary" />}
                    value={metrics.retailersAnalyzed}
                    label="Retailers"
                    color="bg-secondary/10 border-secondary/20"
                    delay={0.2}
                />

                <MetricCard
                    icon={<RotateCcw className="w-4 h-4 text-accent" />}
                    value={metrics.optimizationIterations}
                    label="Optimizations"
                    color="bg-accent/10 border-accent/20"
                    delay={0.3}
                />

                <MetricCard
                    icon={<Zap className="w-4 h-4 text-yellow-400" />}
                    value={`${(metrics.totalDecisionTime / 1000).toFixed(1)}s`}
                    label="Decision Time"
                    color="bg-yellow-400/10 border-yellow-400/20"
                    delay={0.4}
                />

                <MetricCard
                    icon={<Percent className="w-4 h-4 text-green-400" />}
                    value={`${metrics.budgetEfficiency.toFixed(1)}%`}
                    label="Efficiency"
                    color="bg-green-400/10 border-green-400/20"
                    delay={0.5}
                />

                <MetricCard
                    icon={<Star className="w-4 h-4 text-orange-400" />}
                    value={metrics.averageQualityScore.toFixed(1)}
                    label="Quality Score"
                    color="bg-orange-400/10 border-orange-400/20"
                    delay={0.6}
                />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass"
        >
            <div className="px-4 py-3 border-b border-border/50">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    Multi-Agent System Metrics
                </h3>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3">
                <MetricCard
                    icon={<Search className="w-4 h-4 text-primary" />}
                    value={metrics.productsScanned}
                    label="Products Scanned"
                    color="bg-primary/10 border-primary/20"
                    delay={0.1}
                />

                <MetricCard
                    icon={<Store className="w-4 h-4 text-secondary" />}
                    value={metrics.retailersAnalyzed}
                    label="Retailers Analyzed"
                    color="bg-secondary/10 border-secondary/20"
                    delay={0.2}
                />

                <MetricCard
                    icon={<RotateCcw className="w-4 h-4 text-accent" />}
                    value={metrics.optimizationIterations}
                    label="Optimization Runs"
                    color="bg-accent/10 border-accent/20"
                    delay={0.3}
                />

                <MetricCard
                    icon={<Zap className="w-4 h-4 text-yellow-400" />}
                    value={`${(metrics.totalDecisionTime / 1000).toFixed(1)}s`}
                    label="Decision Time"
                    color="bg-yellow-400/10 border-yellow-400/20"
                    delay={0.4}
                />

                <MetricCard
                    icon={<Percent className="w-4 h-4 text-green-400" />}
                    value={`${metrics.budgetEfficiency.toFixed(1)}%`}
                    label="Budget Efficiency"
                    color="bg-green-400/10 border-green-400/20"
                    delay={0.5}
                />

                <MetricCard
                    icon={<Star className="w-4 h-4 text-orange-400" />}
                    value={metrics.averageQualityScore.toFixed(1)}
                    label="Avg Quality Score"
                    color="bg-orange-400/10 border-orange-400/20"
                    delay={0.6}
                />
            </div>
        </motion.div>
    );
}
