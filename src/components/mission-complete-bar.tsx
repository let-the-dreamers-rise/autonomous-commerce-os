'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import {
    CheckCircle,
    Search,
    Store,
    Clock,
    DollarSign,
    Package,
    Zap,
    Calendar
} from 'lucide-react';

export default function MissionCompleteBar() {
    const { metrics, savings, cart, plan, systemState } = useStore();

    if (systemState !== 'complete' || !metrics || !cart) return null;

    const stats = [
        {
            icon: Search,
            value: metrics.productsScanned.toString(),
            label: 'Products Analyzed',
            color: 'text-primary',
        },
        {
            icon: Store,
            value: '3',
            label: 'Retailers Negotiated',
            color: 'text-secondary',
        },
        {
            icon: Clock,
            value: `${(metrics.totalDecisionTime / 1000).toFixed(1)}s`,
            label: 'Decision Time',
            color: 'text-yellow-400',
        },
        {
            icon: DollarSign,
            value: savings ? formatCurrency(savings.moneySaved) : '$0',
            label: 'Money Saved',
            color: 'text-accent',
        },
        {
            icon: Calendar,
            value: plan?.constraints.deadlineDate ? '✓ Before Deadline' : '✓ Optimized',
            label: 'Delivery Status',
            color: 'text-green-400',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            {/* Success Header */}
            <div className="text-center mb-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30"
                >
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-accent">Autonomous Run Complete</span>
                    <Zap className="w-4 h-4 text-accent" />
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-5 gap-3">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="card-glass text-center py-4"
                    >
                        <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                        <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
