'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, Package, Calendar, CreditCard, ExternalLink } from 'lucide-react';
import { useStore } from '@/store';
import { formatCurrency, RETAILER_NAMES, RETAILER_COLORS } from '@/lib/utils';

export default function EmailConfirmation() {
    const { cart, plan, systemState } = useStore();
    const [showEmail, setShowEmail] = useState(false);

    useEffect(() => {
        if (systemState === 'complete' && cart) {
            const timer = setTimeout(() => setShowEmail(true), 500);
            return () => clearTimeout(timer);
        }
    }, [systemState, cart]);

    if (!showEmail || !cart || !plan) return null;

    const orderNumber = `AC-${Date.now().toString(36).toUpperCase()}`;
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="card-glass overflow-hidden"
            >
                {/* Email Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-sm">Order Confirmation</h3>
                                <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px]">
                                    Preview
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                noreply@agenticcommerce.ai
                            </p>
                        </div>
                    </div>
                </div>

                {/* Email Body */}
                <div className="p-4 bg-white/5">
                    {/* Success Banner */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20 mb-4">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-accent">Orders Placed Successfully!</p>
                            <p className="text-xs text-muted-foreground">
                                {cart.deliverySchedule.length} orders across multiple retailers
                            </p>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Order Number:</span>
                            <span className="font-mono font-semibold">{orderNumber}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{today}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Categories:</span>
                            <span>{plan.categories.length} items</span>
                        </div>
                    </div>

                    {/* Items Summary */}
                    <div className="border-t border-border/50 pt-4 mb-4">
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Order Summary
                        </h4>
                        <div className="space-y-2">
                            {cart.deliverySchedule.map((delivery) => (
                                <div
                                    key={delivery.retailer}
                                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                                            style={{ backgroundColor: `${RETAILER_COLORS[delivery.retailer]}20`, color: RETAILER_COLORS[delivery.retailer] }}
                                        >
                                            {RETAILER_NAMES[delivery.retailer].charAt(0)}
                                        </div>
                                        <span className="text-sm">{RETAILER_NAMES[delivery.retailer]}</span>
                                        <span className="text-xs text-muted-foreground">
                                            ({delivery.items} items)
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold">
                                        {formatCurrency(delivery.cost)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Schedule */}
                    <div className="border-t border-border/50 pt-4 mb-4">
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Estimated Delivery
                        </h4>
                        <div className="space-y-2">
                            {cart.deliverySchedule.map((delivery) => (
                                <div
                                    key={delivery.retailer}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span style={{ color: RETAILER_COLORS[delivery.retailer] }}>
                                        {RETAILER_NAMES[delivery.retailer]}
                                    </span>
                                    <span className="text-muted-foreground">{delivery.estimatedDate}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-border/50 pt-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Total Charged</span>
                            </div>
                            <span className="text-xl font-bold gradient-text">
                                {formatCurrency(cart.totalCost)}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            You saved {formatCurrency(cart.budgetRemaining)} compared to your budget!
                        </p>
                    </div>
                </div>

                {/* Email Footer */}
                <div className="px-4 py-3 bg-muted/30 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Track your orders at any time</span>
                        <button className="flex items-center gap-1 text-primary hover:underline">
                            View Orders <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
