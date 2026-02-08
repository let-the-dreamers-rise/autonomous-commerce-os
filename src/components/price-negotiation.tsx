'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { TrendingDown, Zap, DollarSign } from 'lucide-react';

interface PriceNegotiationProps {
    initialPrice: number;
    finalPrice: number;
    onComplete?: () => void;
    duration?: number;
}

export default function PriceNegotiation({
    initialPrice,
    finalPrice,
    onComplete,
    duration = 2000,
}: PriceNegotiationProps) {
    const [currentPrice, setCurrentPrice] = useState(initialPrice);
    const [phase, setPhase] = useState<'negotiating' | 'settling' | 'complete'>('negotiating');
    const [negotiations, setNegotiations] = useState<string[]>([]);
    const animationRef = useRef<NodeJS.Timeout | null>(null);

    const negotiationMessages = [
        '🔍 Scanning Amazon prices...',
        '🏪 Checking Walmart deals...',
        '💻 Finding Best Buy offers...',
        '🤝 Negotiating bulk discounts...',
        '⚡ Applying AI optimization...',
        '✨ Finalizing best price...',
    ];

    useEffect(() => {
        // Phase 1: Negotiating - show fluctuating prices
        let step = 0;
        const totalSteps = 20;
        const stepDuration = duration / totalSteps;

        const animate = () => {
            step++;

            if (step <= totalSteps * 0.3) {
                // First 30%: Price goes UP (retailer initial quote)
                const progress = step / (totalSteps * 0.3);
                const peakPrice = initialPrice * 1.15;
                setCurrentPrice(initialPrice + (peakPrice - initialPrice) * progress);

                if (step === 1) addNegotiation(negotiationMessages[0]);
                if (step === 3) addNegotiation(negotiationMessages[1]);
            } else if (step <= totalSteps * 0.6) {
                // 30-60%: Price fluctuates (negotiation)
                const variance = (Math.random() - 0.5) * (initialPrice * 0.1);
                setCurrentPrice(initialPrice * 1.05 + variance);
                setPhase('settling');

                if (step === Math.floor(totalSteps * 0.35)) addNegotiation(negotiationMessages[2]);
                if (step === Math.floor(totalSteps * 0.45)) addNegotiation(negotiationMessages[3]);
                if (step === Math.floor(totalSteps * 0.55)) addNegotiation(negotiationMessages[4]);
            } else {
                // 60-100%: Price settles down to final
                const progress = (step - totalSteps * 0.6) / (totalSteps * 0.4);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                setCurrentPrice(initialPrice * 1.05 - (initialPrice * 1.05 - finalPrice) * easeOut);

                if (step === Math.floor(totalSteps * 0.65)) addNegotiation(negotiationMessages[5]);
            }

            if (step >= totalSteps) {
                setCurrentPrice(finalPrice);
                setPhase('complete');
                onComplete?.();
            } else {
                animationRef.current = setTimeout(animate, stepDuration);
            }
        };

        animationRef.current = setTimeout(animate, 100);

        return () => {
            if (animationRef.current) clearTimeout(animationRef.current);
        };
    }, [initialPrice, finalPrice, duration, onComplete]);

    const addNegotiation = (msg: string) => {
        setNegotiations(prev => [...prev.slice(-2), msg]);
    };

    const savings = initialPrice - finalPrice;
    const savingsPercent = ((savings / initialPrice) * 100).toFixed(0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glass p-6 text-center"
        >
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <motion.div
                    animate={{ rotate: phase === 'negotiating' || phase === 'settling' ? 360 : 0 }}
                    transition={{ repeat: phase === 'complete' ? 0 : Infinity, duration: 1 }}
                >
                    <DollarSign className="w-6 h-6 text-primary" />
                </motion.div>
                <span className="font-semibold">
                    {phase === 'complete' ? 'Price Optimized!' : 'AI Negotiating...'}
                </span>
            </div>

            {/* Price Display */}
            <div className="relative mb-4">
                <motion.div
                    key={currentPrice}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className={`text-4xl font-bold ${phase === 'complete' ? 'text-accent' : 'text-foreground'
                        }`}
                >
                    {formatCurrency(currentPrice)}
                </motion.div>

                {phase !== 'negotiating' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-2 right-1/4 text-xs text-muted-foreground line-through"
                    >
                        {formatCurrency(initialPrice)}
                    </motion.div>
                )}
            </div>

            {/* Negotiation Feed */}
            <div className="h-16 mb-4">
                <AnimatePresence mode="popLayout">
                    {negotiations.map((msg, i) => (
                        <motion.div
                            key={msg + i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="text-xs text-muted-foreground mb-1"
                        >
                            {msg}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Savings Badge */}
            {phase === 'complete' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30"
                >
                    <TrendingDown className="w-4 h-4 text-accent" />
                    <span className="font-semibold text-accent">
                        Saved {formatCurrency(savings)} ({savingsPercent}%)
                    </span>
                    <Zap className="w-4 h-4 text-accent" />
                </motion.div>
            )}

            {/* Progress Bar */}
            <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: '0%' }}
                    animate={{
                        width: phase === 'complete' ? '100%' : phase === 'settling' ? '70%' : '30%',
                    }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </motion.div>
    );
}
