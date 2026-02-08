'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, DEMO_SCENARIOS } from '@/store';
import { runAgentPipeline } from '@/orchestrator';
import { typeText, delay } from '@/lib/utils';
import { Play, X, Sparkles, ChevronRight } from 'lucide-react';

export default function DemoMode() {
    const [isOpen, setIsOpen] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const { setDemoMode, setUserGoal, systemState } = useStore();

    const isIdle = systemState === 'idle';

    const runDemo = async (scenarioId: string) => {
        const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
        if (!scenario) return;

        setIsRunning(true);
        setDemoMode(true);
        setIsOpen(false);

        // Type out the goal with animation
        let currentText = '';
        for (const char of scenario.input) {
            currentText += char;
            setUserGoal(currentText);
            await delay(30); // Fast typing for demo
        }

        await delay(500);

        // Run the pipeline
        await runAgentPipeline(scenario.input);

        setIsRunning(false);
        setDemoMode(false);
    };

    return (
        <>
            {/* Demo Button */}
            <button
                onClick={() => setIsOpen(true)}
                disabled={!isIdle || isRunning}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${isIdle && !isRunning
                    ? 'btn-primary'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
            >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Demo</span>
            </button>

            {/* Demo Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] overflow-y-auto bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="flex min-h-full items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                className="w-full max-w-md relative z-[101]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="card-glass overflow-hidden shadow-2xl">
                                    {/* Header */}
                                    <div className="px-6 py-4 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border/50 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="w-5 h-5 text-primary" />
                                            <h2 className="font-bold">Demo Scenarios</h2>
                                        </div>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-1 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Scenarios */}
                                    <div className="p-4 space-y-3">
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Select a scenario to see the AI agents in action:
                                        </p>

                                        {DEMO_SCENARIOS.map((scenario) => (
                                            <button
                                                key={scenario.id}
                                                onClick={() => runDemo(scenario.id)}
                                                className="w-full p-4 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-primary/30 transition-all text-left group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl">{scenario.icon}</span>
                                                    <div className="flex-1">
                                                        <h3 className="font-medium group-hover:text-primary transition-colors">
                                                            {scenario.title}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {scenario.description}
                                                        </p>
                                                        <p className="text-xs text-primary/70 mt-2 line-clamp-1">
                                                            "{scenario.input}"
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="px-6 py-3 border-t border-border/50 bg-muted/20">
                                        <p className="text-xs text-muted-foreground text-center">
                                            Demo will auto-type the goal and run the full agent pipeline
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
