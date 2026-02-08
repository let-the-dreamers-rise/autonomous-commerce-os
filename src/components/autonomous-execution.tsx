'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Lock, CheckCircle2, ShoppingCart, ExternalLink, Loader2 } from 'lucide-react';
import { useStore } from '@/store';
import { RETAILER_NAMES, RETAILER_COLORS } from '@/lib/utils';
import type { Retailer } from '@/types';

interface RetailerAuth {
    retailer: Retailer;
    authenticated: boolean;
    cartReady: boolean;
}

export default function AutonomousExecution() {
    const { systemState, cart } = useStore();
    const [authStatus, setAuthStatus] = useState<RetailerAuth[]>([]);
    const [executing, setExecuting] = useState(false);
    const [executed, setExecuted] = useState(false);

    useEffect(() => {
        if (systemState === 'complete' && cart) {
            // Simulate pre-authentication with retailers
            const retailers: Retailer[] = ['amazon', 'walmart', 'bestbuy'];
            const statuses: RetailerAuth[] = retailers.map(r => ({
                retailer: r,
                authenticated: false,
                cartReady: false,
            }));
            setAuthStatus(statuses);

            // Animate authentication status
            retailers.forEach((retailer, idx) => {
                setTimeout(() => {
                    setAuthStatus(prev => prev.map(s =>
                        s.retailer === retailer ? { ...s, authenticated: true } : s
                    ));
                }, 500 + idx * 400);

                setTimeout(() => {
                    setAuthStatus(prev => prev.map(s =>
                        s.retailer === retailer ? { ...s, cartReady: true } : s
                    ));
                }, 800 + idx * 400);
            });
        }
    }, [systemState, cart]);

    if (systemState !== 'complete' || !cart) return null;

    const allReady = authStatus.every(s => s.authenticated && s.cartReady);

    const handleExecute = async () => {
        setExecuting(true);
        // Simulate execution delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setExecuting(false);
        setExecuted(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-glass overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Autonomous Execution</h3>
                        <p className="text-xs text-muted-foreground">Pre-authenticated & ready to purchase</p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Retailer Auth Status */}
                <div className="space-y-2 mb-4">
                    {authStatus.map((status, idx) => (
                        <motion.div
                            key={status.retailer}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                        >
                            {/* Retailer Badge */}
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                                style={{
                                    backgroundColor: `${RETAILER_COLORS[status.retailer]}20`,
                                    color: RETAILER_COLORS[status.retailer]
                                }}
                            >
                                {RETAILER_NAMES[status.retailer].charAt(0)}
                            </div>

                            {/* Status */}
                            <div className="flex-1">
                                <span className="text-sm font-medium">{RETAILER_NAMES[status.retailer]}</span>
                            </div>

                            {/* Auth Status */}
                            <div className="flex items-center gap-2">
                                <AnimatePresence mode="wait">
                                    {!status.authenticated ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-1 text-xs text-muted-foreground"
                                        >
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            <span>Authenticating...</span>
                                        </motion.div>
                                    ) : !status.cartReady ? (
                                        <motion.div
                                            key="preparing"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-1 text-xs text-yellow-400"
                                        >
                                            <ShoppingCart className="w-3 h-3" />
                                            <span>Preparing cart...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="ready"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-1 text-xs text-accent"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Ready</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Security Note */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
                    <Lock className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-green-300">
                        All credentials secured with end-to-end encryption.
                        No payment data stored on our servers.
                    </p>
                </div>

                {/* Execute Button */}
                <AnimatePresence mode="wait">
                    {!executed ? (
                        <motion.button
                            key="execute"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={handleExecute}
                            disabled={!allReady || executing}
                            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${allReady && !executing
                                    ? 'bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 cursor-pointer'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                                }`}
                        >
                            {executing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Executing across 3 retailers...
                                </>
                            ) : allReady ? (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Execute Procurement
                                </>
                            ) : (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Preparing checkout...
                                </>
                            )}
                        </motion.button>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 rounded-xl bg-gradient-to-r from-accent/20 to-green-500/20 border border-accent/30"
                        >
                            <div className="flex items-center justify-center gap-2 text-accent mb-2">
                                <CheckCircle2 className="w-6 h-6" />
                                <span className="font-bold">Procurement Executed!</span>
                            </div>
                            <p className="text-xs text-center text-muted-foreground">
                                3 orders placed simultaneously across Amazon, Walmart, and Best Buy
                            </p>
                            <div className="flex justify-center mt-3">
                                <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                                    View Order Confirmations <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
