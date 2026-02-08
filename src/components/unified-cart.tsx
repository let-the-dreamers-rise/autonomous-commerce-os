'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { RETAILER_COLORS, RETAILER_NAMES, formatCurrency } from '@/lib/utils';
import { runCheckout } from '@/agents/checkout';
import { reOptimize } from '@/orchestrator';
import ProductPickerModal from './product-picker-modal';
import {
    ShoppingCart,
    Truck,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Check,
    Info,
    Zap,
    Plus,
    Trash2,
    ArrowRightLeft
} from 'lucide-react';
import type { CartItem, OptimizationMode, ScoredProduct } from '@/types';

function CartItemRow({
    item,
    onReplace,
    onRemove
}: {
    item: CartItem;
    onReplace?: () => void;
    onRemove?: () => void;
}) {
    const [showDecision, setShowDecision] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="py-3 border-b border-border/30 last:border-0"
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg flex-shrink-0">
                    {item.product.category === 'snacks' && '🍿'}
                    {item.product.category === 'badges' && '🏷️'}
                    {item.product.category === 'tech_accessories' && '🔌'}
                    {item.product.category === 'prizes' && '🎁'}
                    {item.product.category === 'decorations' && '🎈'}
                    {item.product.category === 'outerwear' && '🧥'}
                    {item.product.category === 'accessories' && '🥽'}
                    {item.product.category === 'base_layer' && '👕'}
                    {item.product.category === 'pants' && '👖'}
                    {item.product.category === 'gloves' && '🧤'}
                    {item.product.category === 'helmet' && '⛑️'}
                    {item.product.category === 'socks' && '🧦'}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{
                                backgroundColor: `${RETAILER_COLORS[item.product.retailer]}20`,
                                color: RETAILER_COLORS[item.product.retailer]
                            }}
                        >
                            {RETAILER_NAMES[item.product.retailer]}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            × {item.quantity}
                        </span>
                    </div>
                </div>

                <div className="text-right flex items-center gap-1">
                    <p className="text-sm font-semibold text-primary mr-2">
                        {formatCurrency(item.product.price * item.quantity)}
                    </p>
                    <button
                        onClick={(e) => { e.stopPropagation(); onReplace?.(); }}
                        className="p-1.5 rounded-md hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                        title="Replace with another product"
                    >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
                        className="p-1.5 rounded-md hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Remove from cart"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2">
                <button
                    onClick={() => setShowDecision(!showDecision)}
                    className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 ml-13"
                >
                    Why this?
                    {showDecision ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
            </div>

            <AnimatePresence>
                {showDecision && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-3 ml-13 p-3 rounded-lg bg-muted/50 text-xs space-y-2">
                            <div>
                                <p className="font-medium text-accent mb-1 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Why #{item.product.rank}?
                                </p>
                                <p className="text-muted-foreground">{item.decision.whySelected?.[0] || 'Best match for your criteria'}</p>
                            </div>
                            {item.decision.whyNotAlternatives && item.decision.whyNotAlternatives.length > 0 && (
                                <div>
                                    <p className="font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                        <Info className="w-3 h-3" /> Alternatives:
                                    </p>
                                    <ul className="space-y-0.5 text-muted-foreground">
                                        {item.decision.whyNotAlternatives.slice(0, 2).map((alt, i) => (
                                            <li key={i}>• {alt.productName.substring(0, 20)}... — {alt.reason}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function UnifiedCart() {
    const { cart, plan, setSystemState, setCheckoutProgress, replaceCartItem, setCart } = useStore();
    const [isReOptimizing, setIsReOptimizing] = useState(false);
    const [optimizeMode, setOptimizeMode] = useState<OptimizationMode>('balanced');
    const [showPickerModal, setShowPickerModal] = useState(false);
    const [replaceItemId, setReplaceItemId] = useState<string | undefined>(undefined);

    if (!cart || !plan) return null;

    const handleReOptimize = async (mode: OptimizationMode) => {
        setIsReOptimizing(true);
        setOptimizeMode(mode);
        await reOptimize(mode);
        setIsReOptimizing(false);
    };

    const handleCheckout = async () => {
        setSystemState('checkout');
        await runCheckout(
            cart,
            (thought) => useStore.getState().addAgentThought(thought),
            (progress) => setCheckoutProgress(progress)
        );
    };

    const handleAddProduct = () => {
        setReplaceItemId(undefined);
        setShowPickerModal(true);
    };

    const handleReplace = (itemId: string) => {
        setReplaceItemId(itemId);
        setShowPickerModal(true);
    };

    const handleRemove = (itemId: string) => {
        const newItems = cart.items.filter(i => i.product.id !== itemId);
        const newTotalCost = newItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
        setCart({
            ...cart,
            items: newItems,
            totalCost: newTotalCost,
            budgetRemaining: plan.constraints.maxBudget - newTotalCost,
        });
    };

    const handleProductSelect = (product: ScoredProduct) => {
        if (replaceItemId) {
            replaceCartItem(replaceItemId, product);
        } else {
            const newItem: CartItem = {
                product,
                quantity: 1,
                alternates: [],
                decision: {
                    whySelected: ['Added manually by user'],
                    whyNotAlternatives: []
                }
            };
            const newItems = [...cart.items, newItem];
            const newTotalCost = newItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
            setCart({
                ...cart,
                items: newItems,
                totalCost: newTotalCost,
                budgetRemaining: plan.constraints.maxBudget - newTotalCost,
            });
        }
        setShowPickerModal(false);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-glass h-full flex flex-col"
            >
                {/* Header */}
                <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-primary" />
                        Unified Cart
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {cart.items.length} items
                        </span>
                        <button
                            onClick={handleAddProduct}
                            className="p-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                            title="Add product to cart"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Re-Optimize Controls */}
                <div className="px-4 py-2 border-b border-border/50 bg-muted/30">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">Mode:</span>
                        {(['balanced', 'cheapest', 'fastest', 'highest-quality'] as OptimizationMode[]).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => handleReOptimize(mode)}
                                disabled={isReOptimizing}
                                className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${optimizeMode === mode
                                    ? 'bg-primary text-white'
                                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                    }`}
                            >
                                {mode === 'balanced' && '⚖️'}
                                {mode === 'cheapest' && '💰'}
                                {mode === 'fastest' && '⚡'}
                                {mode === 'highest-quality' && '⭐'}
                            </button>
                        ))}
                        {isReOptimizing && <RefreshCw className="w-3 h-3 animate-spin text-primary" />}
                    </div>
                </div>

                {/* Cart Items */}
                <div className="px-4 max-h-[250px] overflow-y-auto flex-1">
                    <AnimatePresence>
                        {cart.items.map((item) => (
                            <CartItemRow
                                key={item.product.id}
                                item={item}
                                onReplace={() => handleReplace(item.product.id)}
                                onRemove={() => handleRemove(item.product.id)}
                            />
                        ))}
                    </AnimatePresence>
                    {cart.items.length === 0 && (
                        <p className="text-center text-muted-foreground py-8 text-sm">
                            Cart is empty. Click + to add products.
                        </p>
                    )}
                </div>

                {/* Delivery Schedule */}
                <div className="px-4 py-2 border-t border-border/50 bg-muted/20">
                    <div className="flex items-center gap-2 mb-1">
                        <Truck className="w-3 h-3 text-secondary" />
                        <span className="text-[10px] font-medium">Delivery Schedule</span>
                    </div>
                    <div className="space-y-0.5">
                        {cart.deliverySchedule.map((delivery) => (
                            <div key={delivery.retailer} className="flex items-center justify-between text-[10px]">
                                <span style={{ color: RETAILER_COLORS[delivery.retailer] }}>
                                    {RETAILER_NAMES[delivery.retailer]}
                                </span>
                                <span className="text-muted-foreground">
                                    {delivery.items} items • {delivery.estimatedDate}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total & Checkout */}
                <div className="px-4 py-3 border-t border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-muted-foreground">Total</p>
                            <p className="text-xl font-bold gradient-text">
                                {formatCurrency(cart.totalCost)}
                            </p>
                            <p className="text-[10px] text-accent">
                                {formatCurrency(cart.budgetRemaining)} under budget
                            </p>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={cart.items.length === 0}
                            className="btn-primary flex items-center gap-2 text-sm"
                        >
                            <Zap className="w-4 h-4" />
                            Checkout
                        </button>
                    </div>
                </div>
            </motion.div>

            <ProductPickerModal
                isOpen={showPickerModal}
                onClose={() => setShowPickerModal(false)}
                replaceItemId={replaceItemId}
                onSelect={handleProductSelect}
            />
        </>
    );
}
