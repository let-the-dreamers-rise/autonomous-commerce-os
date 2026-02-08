'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { FileJson, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function ShoppingSpec() {
    const { plan, userGoal } = useStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!plan) return null;

    const specJson = {
        goal: userGoal,
        parsed: {
            categories: plan.categories.map(c => ({
                name: c.displayName,
                priority: c.priority,
                budgetAllocation: `${(c.budgetAllocation * 100).toFixed(0)}%`
            })),
            constraints: {
                maxBudget: `$${plan.constraints.maxBudget}`,
                deadline: plan.constraints.deadlineDate || 'Not specified',
                mustHave: plan.constraints.mustHaveCategories
            }
        },
        reasoning: plan.reasoning
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(specJson, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass overflow-hidden"
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">Shopping Spec (JSON)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                        Brief §2.1
                    </span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4">
                            <div className="relative">
                                <button
                                    onClick={handleCopy}
                                    className="absolute top-2 right-2 p-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                                    title="Copy JSON"
                                >
                                    {copied ? (
                                        <Check className="w-3.5 h-3.5 text-accent" />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                    )}
                                </button>
                                <pre className="p-3 rounded-lg bg-black/50 text-xs text-green-400 overflow-x-auto font-mono">
                                    {JSON.stringify(specJson, null, 2)}
                                </pre>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2">
                                ✓ Budget, deadline, preferences, and must-haves captured
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
