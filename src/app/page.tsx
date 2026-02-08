'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, DEMO_SCENARIOS } from '@/store';
import { runAgentPipeline } from '@/orchestrator';
import {
    Sparkles,
    Zap,
    ShoppingCart,
    ArrowRight,
    Play,
    RotateCcw,
    Settings,
    Mic
} from 'lucide-react';

// Components
import GoalInput from '@/components/goal-input';
import AgentFeed from '@/components/agent-feed';
import AgentFlow from '@/components/agent-flow';
import ProductGrid from '@/components/product-grid';
import UnifiedCart from '@/components/unified-cart';
import SavingsPanel from '@/components/savings-panel';
import CheckoutSimulation from '@/components/checkout-simulation';
import DemoMode from '@/components/demo-mode';
import StartupVision from '@/components/startup-vision';
import MissionCompleteBar from '@/components/mission-complete-bar';
import SelfCriticAgent from '@/components/self-critic-agent';

// NEW 10/10 FEATURES
import VoiceInput from '@/components/voice-input';
import LiveDashboard from '@/components/live-dashboard';
import PreferencesPanel from '@/components/preferences-panel';
// WOW FEATURES - Combined in Hubs
import InsightsHub from '@/components/insights-hub';
import AnalyticsHub from '@/components/analytics-hub';
import ModeIndicator from '@/components/mode-indicator';
import ShoppingSpec from '@/components/shopping-spec';


export default function Home() {
    const {
        systemState,
        cart,
        savings,
        metrics,
        checkoutProgress,
        reset
    } = useStore();

    const [showPreferences, setShowPreferences] = useState(false);

    const isIdle = systemState === 'idle';
    const isProcessing = ['planning', 'sourcing', 'ranking', 'optimizing', 'cart_building'].includes(systemState);
    const isComplete = systemState === 'complete';
    const isCheckout = systemState === 'checkout';

    return (
        <main className="min-h-screen relative">
            <div className="fixed top-5 right-6 z-[60]">
                <DemoMode />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold gradient-text">Agentic Commerce</h1>
                            <p className="text-xs text-muted-foreground">Autonomous Multi-Agent Purchasing</p>
                        </div>
                        <ModeIndicator />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Preferences Button */}
                        <button
                            onClick={() => setShowPreferences(true)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="Shopping Preferences"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        {!isIdle && (
                            <button
                                onClick={() => reset()}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="pt-24 pb-12 px-6">
                <div className="container mx-auto max-w-7xl">

                    {/* Hero Section - Only shown when idle */}
                    <AnimatePresence>
                        {isIdle && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center mb-12"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span className="text-sm text-primary">Multi-Agent AI System</span>
                                </div>

                                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                                    <span className="gradient-text">The Operating System</span>
                                    <br />
                                    <span className="text-foreground">for Autonomous Commerce</span>
                                </h2>

                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                                    AI agents will soon buy everything.
                                    We're building the infrastructure they use.
                                </p>

                                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-accent" />
                                        <span>6 Autonomous Agents</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4 text-secondary" />
                                        <span>3 Retailers</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <span>Transparent Scoring</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Input with Voice - Always visible when idle or processing */}
                    {(isIdle || isProcessing) && (
                        <motion.div
                            layout
                            className="mb-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <GoalInput />
                                </div>
                                {isIdle && (
                                    <VoiceInput
                                        onTranscript={(text) => runAgentPipeline(text)}
                                        disabled={isProcessing}
                                    />
                                )}
                            </div>
                            {isIdle && (
                                <p className="text-center text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                                    <Mic className="w-3 h-3" /> Or click the mic to speak your request
                                </p>
                            )}
                        </motion.div>
                    )}

                    {/* Live Dashboard - Show during processing */}
                    {isProcessing && <LiveDashboard />}

                    {/* Processing / Results Layout */}
                    <AnimatePresence mode="wait">
                        {(isProcessing || isComplete) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Mission Complete Bar - Top Dashboard */}
                                {isComplete && <MissionCompleteBar />}

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Agent Feed + Elite Panels */}
                                    {/* Left Column - Agent Feed + Elite Panels */}
                                    <div className="lg:col-span-1 space-y-6">
                                        <AgentFeed />
                                        <AnalyticsHub />
                                    </div>

                                    {/* Center Column - Agent Flow & Products */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <AgentFlow />

                                        {isComplete && cart && (
                                            <>
                                                <ProductGrid />
                                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                                    <UnifiedCart />
                                                    <div className="space-y-4">
                                                        {savings && <SavingsPanel />}
                                                        <ShoppingSpec />
                                                        <SelfCriticAgent />
                                                    </div>
                                                </div>
                                                {/* AI Insights Hub - Tabbed WOW Features */}
                                                <InsightsHub />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Checkout Modal */}
                    <AnimatePresence>
                        {isCheckout && checkoutProgress && (
                            <CheckoutSimulation />
                        )}
                    </AnimatePresence>

                    {/* Quick Scenarios - Only when idle */}
                    {isIdle && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12"
                        >
                            <h3 className="text-center text-sm font-medium text-muted-foreground mb-4">
                                Try a demo scenario
                            </h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {DEMO_SCENARIOS.map((scenario) => (
                                    <button
                                        key={scenario.id}
                                        onClick={() => runAgentPipeline(scenario.input)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-primary/10 transition-all group"
                                    >
                                        <span className="text-lg">{scenario.icon}</span>
                                        <span className="text-sm">{scenario.title}</span>
                                        <Play className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Startup Vision - Show on idle or complete */}
                    {(isIdle || isComplete) && <StartupVision />}

                </div>
            </div>
            {/* Preferences Panel */}
            <PreferencesPanel isOpen={showPreferences} onClose={() => setShowPreferences(false)} />
        </main>
    );
}
