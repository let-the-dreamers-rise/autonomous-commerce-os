'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <motion.div
            className={`bg-muted/50 rounded-lg ${className}`}
            animate={{
                opacity: [0.5, 1, 0.5],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="card p-4 space-y-3">
            <div className="flex gap-3">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CartItemSkeleton() {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-border/30">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-5 w-16" />
        </div>
    );
}

export function MetricCardSkeleton() {
    return (
        <div className="p-3 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 mb-1">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-3 w-20 mt-1" />
        </div>
    );
}

export function AgentFlowSkeleton() {
    return (
        <div className="card-glass p-4">
            <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center justify-between px-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <Skeleton className="w-14 h-14 rounded-full" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ThoughtItemSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 p-3 rounded-lg bg-muted/30"
        >
            <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </motion.div>
    );
}

// Animated processing indicator
export function ProcessingIndicator({ message = 'Processing...' }: { message?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12"
        >
            <div className="relative">
                {/* Outer ring */}
                <motion.div
                    className="w-16 h-16 rounded-full border-4 border-primary/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                {/* Inner spinning element */}
                <motion.div
                    className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                        className="text-2xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        🤖
                    </motion.span>
                </div>
            </div>
            <motion.p
                className="mt-4 text-sm text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                {message}
            </motion.p>
        </motion.div>
    );
}

// Animated success indicator
export function SuccessIndicator({ message = 'Complete!' }: { message?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-accent flex items-center justify-center"
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl text-white"
                >
                    ✓
                </motion.span>
            </motion.div>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-sm font-medium text-accent"
            >
                {message}
            </motion.p>
        </motion.div>
    );
}
