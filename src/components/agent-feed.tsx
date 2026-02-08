'use client';

import { useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { AGENT_ICONS, AGENT_NAMES } from '@/lib/utils';
import type { AgentThought } from '@/types';

interface ThoughtItemProps {
    thought: AgentThought;
    index: number;
}

const ThoughtItem = forwardRef<HTMLDivElement, ThoughtItemProps>(
    ({ thought, index }, ref) => {
        const typeColors = {
            thinking: 'text-yellow-400',
            decision: 'text-primary',
            action: 'text-secondary',
            result: 'text-accent',
        };

        const bgColors = {
            thinking: 'bg-yellow-400/10 border-yellow-400/20',
            decision: 'bg-primary/10 border-primary/20',
            action: 'bg-secondary/10 border-secondary/20',
            result: 'bg-accent/10 border-accent/20',
        };

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex gap-3 p-3 rounded-lg border ${bgColors[thought.type]}`}
            >
                <div className="flex-shrink-0 text-lg">
                    {thought.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${typeColors[thought.type]}`}>
                            {thought.agentName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            {new Date(thought.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                    <p className="text-sm text-foreground/90 break-words">
                        {thought.thought}
                    </p>
                </div>
            </motion.div>
        );
    }
);

ThoughtItem.displayName = 'ThoughtItem';

export default function AgentFeed() {
    const { agentThoughts, systemState } = useStore();
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [agentThoughts]);

    const isActive = systemState !== 'idle';

    return (
        <div className="card-glass h-[500px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent animate-pulse' : 'bg-muted-foreground'}`} />
                    <h3 className="font-semibold text-sm">Agent Reasoning Feed</h3>
                </div>
                <span className="text-xs text-muted-foreground">
                    {agentThoughts.length} thoughts
                </span>
            </div>

            {/* Feed Content */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-4 space-y-2"
            >
                <AnimatePresence mode="popLayout">
                    {agentThoughts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex items-center justify-center text-center"
                        >
                            <div>
                                <div className="text-4xl mb-3">🤖</div>
                                <p className="text-sm text-muted-foreground">
                                    Agents are standing by...
                                </p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                    Enter a goal to see their reasoning
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        agentThoughts.map((thought, index) => (
                            <ThoughtItem
                                key={thought.id}
                                thought={thought}
                                index={index}
                            />
                        ))
                    )}
                </AnimatePresence>

                {/* Thinking indicator */}
                {isActive && systemState !== 'complete' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                    >
                        <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {systemState === 'planning' && 'Planner is analyzing...'}
                            {systemState === 'sourcing' && 'Searching retailers...'}
                            {systemState === 'ranking' && 'Ranking products...'}
                            {systemState === 'optimizing' && 'Optimizing selection...'}
                            {systemState === 'cart_building' && 'Building cart...'}
                        </span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
