'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Shield, Zap, ChevronRight } from 'lucide-react';

// Import WOW components
import TimeTraveling from './time-traveling';
import CrossUserIntel from './cross-user-intel';
import RegretMinimizer from './regret-minimizer';
import AutonomousExecution from './autonomous-execution';

const tabs = [
    { id: 'time', label: 'Time Analysis', icon: Clock, color: 'from-purple-500 to-pink-500' },
    { id: 'social', label: 'Social Proof', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { id: 'risk', label: 'Risk Check', icon: Shield, color: 'from-orange-500 to-red-500' },
    { id: 'execute', label: 'Execute', icon: Zap, color: 'from-primary to-accent' },
];

export default function InsightsHub() {
    const [activeTab, setActiveTab] = useState('time');

    return (
        <div className="card-glass overflow-hidden">
            {/* Tab Header */}
            <div className="flex border-b border-border/50">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-xs font-medium transition-all relative ${isActive
                                    ? 'text-white'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className={`absolute inset-0 bg-gradient-to-r ${tab.color}`}
                                    transition={{ type: 'spring', duration: 0.3 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-1.5">
                                <Icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </span>
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
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'time' && <TimeTravelingContent />}
                    {activeTab === 'social' && <CrossUserContent />}
                    {activeTab === 'risk' && <RegretContent />}
                    {activeTab === 'execute' && <ExecuteContent />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// Wrapper components that render the actual components without their outer cards
function TimeTravelingContent() {
    return <div className="p-0"><TimeTraveling /></div>;
}

function CrossUserContent() {
    return <div className="p-0"><CrossUserIntel /></div>;
}

function RegretContent() {
    return <div className="p-0"><RegretMinimizer /></div>;
}

function ExecuteContent() {
    return <div className="p-0"><AutonomousExecution /></div>;
}
