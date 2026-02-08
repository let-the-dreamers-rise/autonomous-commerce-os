'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CheckCircle2, Users } from 'lucide-react';
import { useStore } from '@/store';

// Import components to combine
import MetricsPanel from './metrics-panel';
import ConstraintSatisfied from './constraint-satisfied';
import ManualVsAgent from './manual-vs-agent';

const tabs = [
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'constraints', label: 'Constraints', icon: CheckCircle2 },
    { id: 'comparison', label: 'vs Manual', icon: Users },
];

export default function AnalyticsHub() {
    const [activeTab, setActiveTab] = useState('metrics');
    const { metrics, systemState } = useStore();

    const isComplete = systemState === 'complete';

    // Don't show if no metrics yet
    if (!metrics) return null;

    return (
        <div className="card-glass overflow-hidden">
            {/* Tab Header */}
            <div className="flex border-b border-border/50">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    // Hide constraints and comparison tabs until complete
                    if ((tab.id === 'constraints' || tab.id === 'comparison') && !isComplete) {
                        return null;
                    }

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-medium transition-all relative ${isActive
                                    ? 'text-accent'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="analyticsActiveTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                    transition={{ type: 'spring', duration: 0.3 }}
                                />
                            )}
                            <Icon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="p-0"
                >
                    {activeTab === 'metrics' && <MetricsPanelInline />}
                    {activeTab === 'constraints' && isComplete && <ConstraintSatisfiedInline />}
                    {activeTab === 'comparison' && isComplete && <ManualVsAgentInline />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// Inline wrappers that render the components without their outer card styling
function MetricsPanelInline() {
    return <MetricsPanel inline />;
}

function ConstraintSatisfiedInline() {
    return <ConstraintSatisfied inline />;
}

function ManualVsAgentInline() {
    return <ManualVsAgent inline />;
}
