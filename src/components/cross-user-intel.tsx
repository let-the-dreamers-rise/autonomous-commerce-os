'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertCircle, CheckCircle2, ThumbsUp } from 'lucide-react';
import { useStore } from '@/store';

// Simulated cross-user data
const generateCrossUserData = (eventType: string) => {
    const eventData: Record<string, { purchases: number; topChoices: string[]; warnings: string[]; tips: string[] }> = {
        hackathon: {
            purchases: 327,
            topChoices: ['Mixed snack variety packs', 'Energy drinks', 'Name badges', 'USB cables'],
            warnings: ['12% reported running out of snacks - we added 20% buffer'],
            tips: ['Most successful events ordered 2 days early for best prices'],
        },
        party: {
            purchases: 891,
            topChoices: ['Party decorations', 'Disposable tableware', 'Balloons', 'Snack platters'],
            warnings: ['8% had delivery delays - choose Prime items'],
            tips: ['Bundle orders for free shipping on large events'],
        },
        skiing: {
            purchases: 156,
            topChoices: ['Thermal layers', 'Waterproof jackets', 'Ski goggles', 'Hand warmers'],
            warnings: ['Sizes run small - check reviews for fit info'],
            tips: ['Order 1 week before trip for best selection'],
        },
        default: {
            purchases: 245,
            topChoices: ['Top-rated products', 'Best value items', 'Fast delivery options'],
            warnings: [],
            tips: ['Check our AI recommendations for optimal choices'],
        },
    };

    return eventData[eventType] || eventData.default;
};

export default function CrossUserIntel() {
    const { plan, systemState, cart } = useStore();

    if (systemState !== 'complete' || !cart) return null;

    // Determine event type from plan
    let eventType = 'default';
    if (plan) {
        const categories = plan.categories.map(c => c.name.toLowerCase());
        if (categories.some(c => c.includes('snack') || c.includes('badge') || c.includes('tech'))) {
            eventType = 'hackathon';
        } else if (categories.some(c => c.includes('decoration') || c.includes('balloon') || c.includes('party'))) {
            eventType = 'party';
        } else if (categories.some(c => c.includes('ski') || c.includes('winter') || c.includes('thermal'))) {
            eventType = 'skiing';
        }
    }

    const data = generateCrossUserData(eventType);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-glass p-4"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">Cross-User Intelligence</h3>
                    <p className="text-xs text-muted-foreground">Insights from similar purchases</p>
                </div>
            </div>

            {/* Stats Banner */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 mb-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{data.purchases}</div>
                    <div className="text-xs text-muted-foreground">Similar purchases</div>
                </div>
                <div className="h-10 w-px bg-border/50" />
                <div className="flex-1">
                    <p className="text-sm">
                        <span className="text-blue-400 font-semibold">{Math.floor(data.purchases * 0.89)}</span>
                        <span className="text-muted-foreground"> users chose similar items for {eventType} events</span>
                    </p>
                </div>
            </div>

            {/* Top Choices */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">Popular choices for {eventType} events:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.topChoices.map((choice, idx) => (
                        <motion.span
                            key={choice}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs"
                        >
                            {choice}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* Warnings */}
            {data.warnings.length > 0 && (
                <div className="mb-4">
                    {data.warnings.map((warning, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-start gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                        >
                            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-yellow-200">{warning}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Tips */}
            {data.tips.length > 0 && (
                <div>
                    {data.tips.map((tip, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-start gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20"
                        >
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-green-200">{tip}</p>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
