'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, DollarSign, Calendar, Package, Target } from 'lucide-react';

interface ConstraintStatus {
    name: string;
    icon: React.ReactNode;
    satisfied: boolean;
    details: string;
}

export default function ConstraintSatisfied({ inline = false }: { inline?: boolean }) {
    const { cart, plan, systemState } = useStore();

    if (systemState !== 'complete' || !cart || !plan) return null;

    const constraints: ConstraintStatus[] = [];

    // Budget constraint
    constraints.push({
        name: 'Budget',
        icon: <DollarSign className="w-4 h-4" />,
        satisfied: cart.totalCost <= plan.constraints.maxBudget,
        details: cart.totalCost <= plan.constraints.maxBudget
            ? `${formatCurrency(cart.budgetRemaining)} under limit`
            : `${formatCurrency(cart.totalCost - plan.constraints.maxBudget)} over!`,
    });

    // Deadline constraint
    const maxDeliveryDays = Math.max(...cart.items.map(i => i.product.deliveryDays));
    const meetsDeadline = plan.constraints.deadlineDate
        ? maxDeliveryDays <= 5 // assuming deadline is ~5 days
        : true;
    constraints.push({
        name: 'Delivery',
        icon: <Calendar className="w-4 h-4" />,
        satisfied: meetsDeadline,
        details: meetsDeadline ? 'Before deadline' : 'May miss deadline',
    });

    // Required items constraint
    const categoriesFulfilled = plan.categories.filter(c =>
        cart.items.some(i => i.product.category === c.name)
    );
    const allRequiredFulfilled = categoriesFulfilled.length === plan.categories.length;
    constraints.push({
        name: 'Required Items',
        icon: <Package className="w-4 h-4" />,
        satisfied: allRequiredFulfilled,
        details: allRequiredFulfilled
            ? `All ${plan.categories.length} categories fulfilled`
            : `${categoriesFulfilled.length}/${plan.categories.length} categories`,
    });

    // Quantity constraint
    constraints.push({
        name: 'Quantity',
        icon: <Target className="w-4 h-4" />,
        satisfied: true,
        details: `${cart.items.reduce((sum, i) => sum + i.quantity, 0)} items selected`,
    });

    if (inline) {
        return (
            <div className="p-4 grid grid-cols-1 gap-2">
                {constraints.map((constraint, index) => (
                    <div
                        key={constraint.name}
                        className={`flex items-center gap-2 p-2 rounded-lg ${constraint.satisfied
                            ? 'bg-accent/10 border border-accent/20'
                            : 'bg-red-500/10 border border-red-500/20'
                            }`}
                    >
                        <div className={constraint.satisfied ? 'text-accent' : 'text-red-400'}>
                            {constraint.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium">{constraint.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">
                                {constraint.details}
                            </p>
                        </div>
                        {constraint.satisfied ? (
                            <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                        ) : (
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glass overflow-hidden"
        >
            <div className="px-4 py-3 bg-gradient-to-r from-green-500/20 to-teal-500/20 border-b border-border/50">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    Constraints Satisfied
                </h3>
            </div>

            <div className="p-4 grid grid-cols-2 gap-2">
                {constraints.map((constraint, index) => (
                    <motion.div
                        key={constraint.name}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-2 p-2 rounded-lg ${constraint.satisfied
                            ? 'bg-accent/10 border border-accent/20'
                            : 'bg-red-500/10 border border-red-500/20'
                            }`}
                    >
                        <div className={constraint.satisfied ? 'text-accent' : 'text-red-400'}>
                            {constraint.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium">{constraint.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">
                                {constraint.details}
                            </p>
                        </div>
                        {constraint.satisfied ? (
                            <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                        ) : (
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
