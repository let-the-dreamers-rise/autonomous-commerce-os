import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Delay utility for animations
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Format currency
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

// Format date
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

// Calculate days from now
export function daysFromNow(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

// Generate unique ID
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

// Typing animation helper
export async function typeText(
    text: string,
    onUpdate: (text: string) => void,
    speed: number = 50
): Promise<void> {
    let current = '';
    for (const char of text) {
        current += char;
        onUpdate(current);
        await delay(speed);
    }
}

// Retailer colors
export const RETAILER_COLORS = {
    amazon: '#FF9900',
    walmart: '#0071DC',
    bestbuy: '#0046BE',
} as const;

// Retailer display names
export const RETAILER_NAMES = {
    amazon: 'Amazon',
    walmart: 'Walmart',
    bestbuy: 'Best Buy',
} as const;

// Agent icons
export const AGENT_ICONS = {
    planner: '🎯',
    sourcing: '🔍',
    ranking: '📊',
    optimizer: '💡',
    cart: '🛒',
    checkout: '🚀',
} as const;

// Agent display names
export const AGENT_NAMES = {
    planner: 'Planner Agent',
    sourcing: 'Sourcing Agents',
    ranking: 'Ranking Engine',
    optimizer: 'Optimizer Agent',
    cart: 'Cart Builder',
    checkout: 'Checkout Orchestrator',
} as const;
