'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { RETAILER_COLORS, RETAILER_NAMES, formatCurrency } from '@/lib/utils';
import { Check, Package, CreditCard, Shield, Sparkles, PartyPopper } from 'lucide-react';
import { useConfetti } from './confetti-celebration';

export default function CheckoutSimulation() {
    const { checkoutProgress, cart, setSystemState } = useStore();
    const { fireConfetti } = useConfetti();

    const isComplete = checkoutProgress?.state === 'complete';

    // Fire confetti when checkout completes
    useEffect(() => {
        if (isComplete) {
            fireConfetti();
        }
    }, [isComplete, fireConfetti]);

    if (!checkoutProgress || !cart) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-lg mx-4"
            >
                <div className="card-glass overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                {isComplete ? (
                                    <Sparkles className="w-6 h-6 text-accent" />
                                ) : (
                                    <Package className="w-6 h-6 text-primary animate-pulse" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">
                                    {isComplete ? 'Orders Placed Successfully!' : 'Autonomous Checkout'}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {isComplete
                                        ? `${cart.deliverySchedule.length} orders across multiple retailers`
                                        : 'AI agent executing checkout sequence...'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <span>{checkoutProgress.message}</span>
                            <span>{checkoutProgress.progress}%</span>
                        </div>
                        <div className="progress-bar">
                            <motion.div
                                className="progress-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${checkoutProgress.progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Consolidated Payment & Address (Entered Once) */}
                    <div className="px-6 pb-4">
                        <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-4 h-4 text-accent" />
                                <span className="text-xs font-medium text-accent">Payment & Shipping (Entered Once)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <p className="text-muted-foreground">Card</p>
                                    <p className="font-mono">•••• •••• •••• 4242</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Address</p>
                                    <p>123 Demo St, SF, CA</p>
                                </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Agent fans out to {cart.deliverySchedule.length} retailers below
                            </p>
                        </div>
                    </div>

                    {/* Retailer Status */}
                    <div className="px-6 pb-4 space-y-3">
                        {cart.deliverySchedule.map((delivery) => {
                            const isRetailerComplete = checkoutProgress.completedRetailers.includes(delivery.retailer);
                            const isRetailerActive = checkoutProgress.currentRetailer === delivery.retailer;

                            return (
                                <div
                                    key={delivery.retailer}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isRetailerComplete
                                        ? 'bg-accent/10 border border-accent/30'
                                        : isRetailerActive
                                            ? 'bg-primary/10 border border-primary/30 animate-pulse'
                                            : 'bg-muted/50 border border-transparent'
                                        }`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${isRetailerComplete ? 'bg-accent' : 'bg-muted'
                                            }`}
                                        style={!isRetailerComplete ? {
                                            backgroundColor: `${RETAILER_COLORS[delivery.retailer]}20`
                                        } : {}}
                                    >
                                        {isRetailerComplete ? (
                                            <Check className="w-5 h-5 text-white" />
                                        ) : (
                                            <span
                                                className="text-lg font-bold"
                                                style={{ color: RETAILER_COLORS[delivery.retailer] }}
                                            >
                                                {RETAILER_NAMES[delivery.retailer].charAt(0)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-medium text-sm">
                                            {RETAILER_NAMES[delivery.retailer]}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {delivery.items} item{delivery.items !== 1 ? 's' : ''} • {formatCurrency(delivery.cost)}
                                        </p>
                                    </div>

                                    <div className="text-xs">
                                        {isRetailerComplete && (
                                            <span className="text-accent">✓ Confirmed</span>
                                        )}
                                        {isRetailerActive && (
                                            <span className="text-primary">Processing...</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Completion State */}
                    {isComplete && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-6 py-4 border-t border-border/50 bg-accent/5"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Charged</p>
                                    <p className="text-2xl font-bold gradient-text">
                                        {formatCurrency(cart.totalCost)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Shield className="w-4 h-4 text-accent" />
                                    <span>Secure Checkout</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSystemState('complete')}
                                className="w-full btn-primary"
                            >
                                Done
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
