'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { useStore } from '@/store';
import { runAgentPipeline } from '@/orchestrator';

export default function GoalInput() {
    const [input, setInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { systemState, userGoal, isDemoMode } = useStore();

    const isProcessing = systemState !== 'idle' && systemState !== 'complete';

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [input]);

    // Handle demo mode typing
    useEffect(() => {
        if (isDemoMode && userGoal && userGoal !== input) {
            setInput(userGoal);
        }
    }, [userGoal, isDemoMode]);

    const handleSubmit = async () => {
        if (!input.trim() || isProcessing) return;
        await runAgentPipeline(input.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Static placeholder to avoid SSR hydration mismatch
    const placeholder = "Host a hackathon for 80 people under $600, need snacks, badges, and prizes...";

    return (
        <motion.div
            layout
            className={`relative max-w-3xl mx-auto transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''
                }`}
        >
            <div
                className={`card-glass overflow-hidden transition-all duration-300 ${isFocused ? 'glow-primary' : ''
                    }`}
            >
                {/* Input Header */}
                <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                        Describe your procurement goal
                    </span>
                </div>

                {/* Textarea */}
                <div className="px-4 pb-4">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={handleKeyDown}
                        disabled={isProcessing}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-none outline-none resize-none text-lg text-foreground placeholder:text-muted-foreground/50 min-h-[60px]"
                        rows={2}
                    />
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-t border-border/50">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Press Enter to submit</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">Shift+Enter for new line</span>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim() || isProcessing}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${input.trim() && !isProcessing
                            ? 'btn-primary'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                            }`}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>Start Agents</span>
                                <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-xl opacity-50 -z-10" />
        </motion.div>
    );
}
