'use client';

import { useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCelebrationProps {
    trigger: boolean;
    onComplete?: () => void;
}

export function useConfetti() {
    const fireConfetti = useCallback(() => {
        // First burst - center
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00F5A0', '#00D9F5', '#6366F1', '#F59E0B', '#EF4444'],
        });

        // Second burst - left side
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#00F5A0', '#00D9F5'],
            });
        }, 150);

        // Third burst - right side
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366F1', '#F59E0B'],
            });
        }, 300);

        // Stars shower
        setTimeout(() => {
            confetti({
                particleCount: 30,
                spread: 100,
                origin: { y: 0.3 },
                shapes: ['star'],
                colors: ['#FFD700', '#FFA500'],
            });
        }, 450);

        // Final celebration
        setTimeout(() => {
            const end = Date.now() + 1000;
            const colors = ['#00F5A0', '#00D9F5'];

            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors,
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors,
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();
        }, 600);
    }, []);

    const fireSuccess = useCallback(() => {
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#00F5A0', '#10B981', '#34D399'],
        });
    }, []);

    const fireEmoji = useCallback((emoji: string = '🎉') => {
        confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.6 },
            shapes: ['circle'],
            scalar: 2,
            colors: ['#FFD700'],
        });
    }, []);

    return { fireConfetti, fireSuccess, fireEmoji };
}

export default function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
    const { fireConfetti } = useConfetti();

    useEffect(() => {
        if (trigger) {
            fireConfetti();
            const timeout = setTimeout(() => {
                onComplete?.();
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [trigger, fireConfetti, onComplete]);

    return null; // This component only handles effects
}
