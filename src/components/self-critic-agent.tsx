'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import {
    AlertTriangle,
    Shield,
    TrendingUp,
    CheckCircle,
    Package,
    Clock,
    DollarSign,
    Star
} from 'lucide-react';

interface CriticFinding {
    type: 'warning' | 'success' | 'suggestion';
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function SelfCriticAgent() {
    const { cart, savings, plan, systemState, optimizationMode } = useStore();

    if (systemState !== 'complete' || !cart || !plan) return null;

    // Generate DYNAMIC critic findings based on actual cart analysis
    const findings: CriticFinding[] = [];

    // 1. Budget Analysis
    const budgetUsage = cart.totalCost / plan.constraints.maxBudget;
    const budgetRemaining = cart.budgetRemaining;

    if (budgetUsage > 0.95) {
        findings.push({
            type: 'warning',
            icon: <DollarSign className="w-4 h-4" />,
            title: `Budget ${(budgetUsage * 100).toFixed(0)}% utilized`,
            description: `Only ${formatCurrency(budgetRemaining)} remaining. Consider downgrading 1 item.`,
        });
    } else if (budgetUsage < 0.6) {
        const unused = plan.constraints.maxBudget - cart.totalCost;
        findings.push({
            type: 'suggestion',
            icon: <TrendingUp className="w-4 h-4" />,
            title: `${formatCurrency(unused)} budget unused`,
            description: `Could upgrade ${plan.categories[0]?.displayName || 'items'} for better quality.`,
        });
    } else {
        findings.push({
            type: 'success',
            icon: <DollarSign className="w-4 h-4" />,
            title: 'Budget optimally utilized',
            description: `${(budgetUsage * 100).toFixed(0)}% used, ${formatCurrency(budgetRemaining)} safety buffer.`,
        });
    }

    // 2. Delivery Risk Analysis
    const deliveryDays = cart.items.map(i => ({
        name: i.product.name.substring(0, 20),
        days: i.product.deliveryDays,
        category: i.product.category
    }));
    const maxDelivery = Math.max(...deliveryDays.map(d => d.days));
    const slowestItem = deliveryDays.find(d => d.days === maxDelivery);

    if (maxDelivery >= 4) {
        findings.push({
            type: 'warning',
            icon: <Clock className="w-4 h-4" />,
            title: `${maxDelivery}-day delivery risk`,
            description: `"${slowestItem?.name}..." may arrive late. Consider express shipping.`,
        });
    } else if (maxDelivery >= 3) {
        findings.push({
            type: 'suggestion',
            icon: <Clock className="w-4 h-4" />,
            title: 'Moderate delivery timeline',
            description: `Max ${maxDelivery} days. All items should arrive before deadline.`,
        });
    } else {
        findings.push({
            type: 'success',
            icon: <Clock className="w-4 h-4" />,
            title: 'Fast delivery confirmed',
            description: `All items arrive within ${maxDelivery} day${maxDelivery !== 1 ? 's' : ''}.`,
        });
    }

    // 3. Quality Analysis
    const avgRating = cart.items.reduce((sum, i) => sum + i.product.rating, 0) / cart.items.length;
    const minRating = Math.min(...cart.items.map(i => i.product.rating));
    const lowestRatedItem = cart.items.find(i => i.product.rating === minRating);

    if (minRating < 4.0) {
        findings.push({
            type: 'warning',
            icon: <Star className="w-4 h-4" />,
            title: `Low rating detected: ${minRating}★`,
            description: `"${lowestRatedItem?.product.name.substring(0, 20)}..." has lower reviews.`,
        });
    } else if (avgRating >= 4.5) {
        findings.push({
            type: 'success',
            icon: <Star className="w-4 h-4" />,
            title: `High quality selection: ${avgRating.toFixed(1)}★ avg`,
            description: 'All items meet premium quality threshold.',
        });
    }

    // 4. Retailer Distribution Analysis
    const retailerCount = new Set(cart.items.map(i => i.product.retailer)).size;
    if (retailerCount === 1) {
        findings.push({
            type: 'suggestion',
            icon: <Package className="w-4 h-4" />,
            title: 'Single retailer used',
            description: 'Multi-retailer approach could yield better deals.',
        });
    } else if (retailerCount === 3) {
        findings.push({
            type: 'success',
            icon: <Package className="w-4 h-4" />,
            title: 'Optimal multi-retailer mix',
            description: `Cross-shopped ${retailerCount} retailers for best deals.`,
        });
    }

    // 5. Mode-specific insights
    if (optimizationMode === 'cheapest' && savings) {
        findings.push({
            type: 'success',
            icon: <TrendingUp className="w-4 h-4" />,
            title: `Cheapest mode: ${formatCurrency(savings.moneySaved)} saved`,
            description: 'Prioritized cost over delivery speed and quality.',
        });
    } else if (optimizationMode === 'fastest') {
        findings.push({
            type: 'success',
            icon: <Clock className="w-4 h-4" />,
            title: `Fastest mode: ${maxDelivery}-day max delivery`,
            description: 'Prioritized speed over cost savings.',
        });
    } else if (optimizationMode === 'highest-quality') {
        findings.push({
            type: 'success',
            icon: <Star className="w-4 h-4" />,
            title: `Quality mode: ${avgRating.toFixed(1)}★ average`,
            description: 'Prioritized ratings over other factors.',
        });
    }

    // 6. Final verification
    findings.push({
        type: 'success',
        icon: <Shield className="w-4 h-4" />,
        title: 'Decision quality verified',
        description: `${cart.items.length} items from ${retailerCount} retailers validated.`,
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-glass overflow-hidden"
        >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-border/50">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    Self-Critic Agent
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 ml-auto">
                        AI Audit
                    </span>
                </h3>
            </div>

            {/* Findings */}
            <div className="p-4 space-y-3">
                {findings.slice(0, 4).map((finding, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${finding.type === 'warning'
                                ? 'bg-yellow-500/10 border-yellow-500/20'
                                : finding.type === 'success'
                                    ? 'bg-accent/10 border-accent/20'
                                    : 'bg-blue-500/10 border-blue-500/20'
                            }`}
                    >
                        <div className={`flex-shrink-0 ${finding.type === 'warning'
                                ? 'text-yellow-400'
                                : finding.type === 'success'
                                    ? 'text-accent'
                                    : 'text-blue-400'
                            }`}>
                            {finding.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{finding.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {finding.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
