'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { AGENT_ICONS, AGENT_NAMES } from '@/lib/utils';
import type { AgentId, SystemState } from '@/types';

interface FlowNode {
    id: AgentId | 'user' | 'complete';
    label: string;
    icon: string;
    x: number;
    y: number;
}

interface FlowEdge {
    from: string;
    to: string;
}

const NODES: FlowNode[] = [
    { id: 'user', label: 'User Goal', icon: '👤', x: 50, y: 150 },
    { id: 'planner', label: 'Planner', icon: '🎯', x: 180, y: 150 },
    { id: 'sourcing', label: 'Sourcing', icon: '🔍', x: 310, y: 80 },
    { id: 'ranking', label: 'Ranking', icon: '📊', x: 440, y: 150 },
    { id: 'optimizer', label: 'Optimizer', icon: '💡', x: 570, y: 150 },
    { id: 'cart', label: 'Cart', icon: '🛒', x: 700, y: 150 },
    { id: 'checkout', label: 'Checkout', icon: '🚀', x: 830, y: 150 },
];

const EDGES: FlowEdge[] = [
    { from: 'user', to: 'planner' },
    { from: 'planner', to: 'sourcing' },
    { from: 'sourcing', to: 'ranking' },
    { from: 'ranking', to: 'optimizer' },
    { from: 'optimizer', to: 'cart' },
    { from: 'cart', to: 'checkout' },
];

// Map system state to active node
const STATE_TO_NODE: Record<SystemState, string> = {
    idle: '',
    planning: 'planner',
    sourcing: 'sourcing',
    ranking: 'ranking',
    optimizing: 'optimizer',
    cart_building: 'cart',
    checkout: 'checkout',
    complete: 'checkout',
};

// Get completed nodes based on state
function getCompletedNodes(state: SystemState): string[] {
    const order = ['planner', 'sourcing', 'ranking', 'optimizer', 'cart', 'checkout'];
    const currentIndex = order.indexOf(STATE_TO_NODE[state]);
    if (currentIndex === -1) return [];
    return order.slice(0, currentIndex);
}

export default function AgentFlow() {
    const { systemState } = useStore();

    const activeNode = STATE_TO_NODE[systemState];
    const completedNodes = getCompletedNodes(systemState);
    const isComplete = systemState === 'complete';

    // Calculate scale for responsiveness
    const scale = 0.85;
    const width = 900 * scale;
    const height = 300 * scale;

    return (
        <div className="card-glass overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    Multi-Agent Execution Pipeline
                </h3>
            </div>

            <div className="p-4 overflow-x-auto">
                <svg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${900} ${300}`}
                    className="mx-auto"
                >
                    {/* Background Grid */}
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(222, 20%, 15%)" strokeWidth="0.5" />
                        </pattern>

                        {/* Glow filter */}
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Active glow */}
                        <filter id="activeGlow">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />

                    {/* Edges */}
                    {EDGES.map((edge, i) => {
                        const fromNode = NODES.find(n => n.id === edge.from)!;
                        const toNode = NODES.find(n => n.id === edge.to)!;
                        const isActive = activeNode === edge.to || completedNodes.includes(edge.to as string);

                        return (
                            <g key={`edge-${i}`}>
                                {/* Edge line */}
                                <motion.line
                                    x1={fromNode.x + 50}
                                    y1={fromNode.y}
                                    x2={toNode.x - 10}
                                    y2={toNode.y}
                                    stroke={isActive ? 'hsl(263, 90%, 65%)' : 'hsl(222, 20%, 25%)'}
                                    strokeWidth={isActive ? 3 : 2}
                                    strokeDasharray={isActive ? '0' : '5,5'}
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                />

                                {/* Animated particle on active edge */}
                                {activeNode === edge.to && (
                                    <motion.circle
                                        r={4}
                                        fill="hsl(263, 90%, 65%)"
                                        filter="url(#glow)"
                                        initial={{ cx: fromNode.x + 50, cy: fromNode.y }}
                                        animate={{ cx: toNode.x - 10, cy: toNode.y }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {NODES.map((node) => {
                        const isActive = activeNode === node.id;
                        const isCompleted = completedNodes.includes(node.id) || (isComplete && node.id !== 'user');
                        const isUserNode = node.id === 'user';

                        return (
                            <motion.g
                                key={node.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                {/* Node circle */}
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={isActive ? 35 : 30}
                                    fill={
                                        isCompleted ? 'hsl(172, 66%, 40%)' :
                                            isActive ? 'hsl(263, 90%, 55%)' :
                                                'hsl(222, 20%, 15%)'
                                    }
                                    stroke={
                                        isCompleted ? 'hsl(172, 66%, 50%)' :
                                            isActive ? 'hsl(263, 90%, 65%)' :
                                                'hsl(222, 20%, 25%)'
                                    }
                                    strokeWidth={2}
                                    filter={isActive ? 'url(#activeGlow)' : undefined}
                                    animate={isActive ? {
                                        scale: [1, 1.1, 1],
                                        transition: { duration: 1.5, repeat: Infinity }
                                    } : {}}
                                />

                                {/* Icon */}
                                <text
                                    x={node.x}
                                    y={node.y + 5}
                                    textAnchor="middle"
                                    fontSize={20}
                                    style={{ userSelect: 'none' }}
                                >
                                    {node.icon}
                                </text>

                                {/* Label */}
                                <text
                                    x={node.x}
                                    y={node.y + 55}
                                    textAnchor="middle"
                                    fill="hsl(210, 40%, 80%)"
                                    fontSize={12}
                                    fontWeight={500}
                                >
                                    {node.label}
                                </text>

                                {/* Status indicator */}
                                {isCompleted && (
                                    <motion.circle
                                        cx={node.x + 22}
                                        cy={node.y - 22}
                                        r={10}
                                        fill="hsl(142, 76%, 50%)"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring' }}
                                    />
                                )}
                                {isCompleted && (
                                    <text
                                        x={node.x + 22}
                                        y={node.y - 18}
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize={12}
                                        fontWeight="bold"
                                    >
                                        ✓
                                    </text>
                                )}
                            </motion.g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
