'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Clock, Package, CheckCircle2, XCircle } from 'lucide-react';
import { useStore } from '@/store';

interface Risk {
    id: string;
    category: string;
    icon: React.ReactNode;
    title: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
}

export default function RegretMinimizer() {
    const { systemState, cart } = useStore();
    const [acknowledged, setAcknowledged] = useState(false);

    if (systemState !== 'complete' || !cart) return null;

    // Generate realistic risk assessment
    const risks: Risk[] = [
        {
            id: 'delivery',
            category: 'Delivery',
            icon: <Clock className="w-4 h-4" />,
            title: 'Late Delivery Risk',
            probability: Math.floor(Math.random() * 8) + 3, // 3-10%
            severity: 'medium',
            description: 'Based on carrier history and current logistics loads',
        },
        {
            id: 'stock',
            category: 'Inventory',
            icon: <Package className="w-4 h-4" />,
            title: 'Stock-out Risk',
            probability: Math.floor(Math.random() * 5) + 1, // 1-5%
            severity: 'low',
            description: 'Some items have limited inventory remaining',
        },
        {
            id: 'quality',
            category: 'Quality',
            icon: <AlertTriangle className="w-4 h-4" />,
            title: 'Quality Variance',
            probability: Math.floor(Math.random() * 6) + 2, // 2-7%
            severity: 'low',
            description: 'Based on review sentiment analysis',
        },
    ];

    const totalRiskScore = risks.reduce((sum, r) => sum + r.probability, 0) / risks.length;
    const overallRisk = totalRiskScore < 5 ? 'low' : totalRiskScore < 10 ? 'medium' : 'high';

    const riskColors = {
        low: 'text-green-400 bg-green-500/10 border-green-500/20',
        medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        high: 'text-red-400 bg-red-500/10 border-red-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-glass p-4"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">Regret Minimizer</h3>
                    <p className="text-xs text-muted-foreground">Risk assessment before commitment</p>
                </div>
            </div>

            {/* Overall Risk Score */}
            <div className={`p-3 rounded-xl border mb-4 ${riskColors[overallRisk]}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        <span className="font-medium">Overall Risk Level</span>
                    </div>
                    <span className="text-lg font-bold uppercase">{overallRisk}</span>
                </div>
                <p className="text-xs opacity-80 mt-1">
                    Combined probability of regret: {totalRiskScore.toFixed(1)}%
                </p>
            </div>

            {/* Individual Risks */}
            <div className="space-y-2 mb-4">
                {risks.map((risk, idx) => (
                    <motion.div
                        key={risk.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                    >
                        <div className={`p-1.5 rounded-lg ${riskColors[risk.severity]}`}>
                            {risk.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{risk.title}</span>
                                <span className={`text-sm font-bold ${risk.probability < 5 ? 'text-green-400' :
                                        risk.probability < 8 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                    {risk.probability}%
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{risk.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Acknowledgment */}
            <AnimatePresence mode="wait">
                {!acknowledged ? (
                    <motion.button
                        key="accept"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => setAcknowledged(true)}
                        className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:border-orange-500/50 transition-all text-sm font-medium text-orange-300 flex items-center justify-center gap-2"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        I understand the risks - Proceed
                    </motion.button>
                ) : (
                    <motion.div
                        key="acknowledged"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center gap-2 py-2 text-accent"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Risks acknowledged</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
