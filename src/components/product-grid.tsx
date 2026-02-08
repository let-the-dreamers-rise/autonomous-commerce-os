'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { RETAILER_COLORS, RETAILER_NAMES, formatCurrency } from '@/lib/utils';
import { Star, ChevronDown, ChevronUp, Check, Info, Plus } from 'lucide-react';
import type { ScoredProduct, CartItem } from '@/types';

function ScoreBadge({ score, onClick }: { score: number; onClick?: (e: React.MouseEvent) => void }) {
    const color = score >= 0.7 ? 'bg-accent/20 text-accent border-accent/30' :
        score >= 0.5 ? 'bg-primary/20 text-primary border-primary/30' :
            'bg-muted text-muted-foreground border-border';

    return (
        <button
            onClick={onClick}
            className={`score-badge ${color} flex items-center gap-1 hover:scale-105 transition-transform text-[10px] px-1.5 py-0.5`}
            title="Click to see score breakdown"
        >
            <span className="font-bold">{(score * 100).toFixed(0)}%</span>
        </button>
    );
}

function ProductCard({ product, onAddToCart, isInCart }: {
    product: ScoredProduct;
    onAddToCart: () => void;
    isInCart: boolean;
}) {
    const [expanded, setExpanded] = useState(false);

    const categoryEmojis: Record<string, string> = {
        snacks: '🍿', badges: '🏷️', tech_accessories: '🔌', prizes: '🎁', decorations: '🎈',
        outerwear: '🧥', accessories: '🥽', base_layer: '👕', pants: '👖', gloves: '🧤', helmet: '⛑️', socks: '🧦'
    };

    const emoji = categoryEmojis[product.category] || '📦';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-card/80 backdrop-blur border border-border/50 rounded-lg p-3 hover:border-primary/40 transition-all ${expanded ? 'ring-1 ring-primary/30' : ''}`}
        >
            {/* Header: Retailer + Score + Add */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{emoji}</span>
                    <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{
                            backgroundColor: `${RETAILER_COLORS[product.retailer]}20`,
                            color: RETAILER_COLORS[product.retailer]
                        }}
                    >
                        {RETAILER_NAMES[product.retailer]}
                    </span>
                    <span className="text-[10px] text-muted-foreground">#{product.rank}</span>
                </div>
                <div className="flex items-center gap-1">
                    <ScoreBadge score={product.score} onClick={() => setExpanded(!expanded)} />
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
                        disabled={isInCart}
                        className={`p-1.5 rounded transition-all ${isInCart ? 'bg-accent/20 text-accent' : 'bg-primary/20 hover:bg-primary/40 text-primary'}`}
                        title={isInCart ? "In cart" : "Add to cart"}
                    >
                        {isInCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {/* Product Name - FULL VISIBLE */}
            <h4 className="font-medium text-sm leading-tight mb-2 text-foreground">
                {product.name}
            </h4>

            {/* Price + Rating + Delivery */}
            <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-primary">{formatCurrency(product.price)}</span>
                <span className="flex items-center gap-0.5 text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />{product.rating}
                </span>
                <span className="text-muted-foreground">{product.deliveryDays}d</span>
            </div>

            {/* Expanded Score Breakdown */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-3 pt-2 border-t border-border/50 grid grid-cols-2 gap-1 text-[10px]">
                            <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span>{(product.scoreBreakdown.priceScore * 100).toFixed(0)}%</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{(product.scoreBreakdown.deliveryScore * 100).toFixed(0)}%</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span>{(product.scoreBreakdown.ratingScore * 100).toFixed(0)}%</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Budget Fit</span><span>{(product.scoreBreakdown.budgetFitScore * 100).toFixed(0)}%</span></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function ProductGrid() {
    const { rankedProducts, plan, cart, setCart } = useStore();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

    if (!rankedProducts || !plan) return null;

    const categories = Object.keys(rankedProducts);
    const displayCategory = selectedCategory || categories[0];
    const products = rankedProducts[displayCategory] || [];
    const displayProducts = showAll ? products : products.slice(0, 12);

    const handleAddToCart = (product: ScoredProduct) => {
        if (!cart || cart.items.some(item => item.product.id === product.id)) return;

        const newItem: CartItem = {
            product,
            quantity: 1,
            alternates: [],
            decision: { whySelected: ['Added by user'], whyNotAlternatives: [] }
        };

        const newItems = [...cart.items, newItem];
        const newTotalCost = newItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

        setCart({
            ...cart,
            items: newItems,
            totalCost: newTotalCost,
            budgetRemaining: plan.constraints.maxBudget - newTotalCost,
        });
    };

    const isInCart = (productId: string) => cart?.items.some(item => item.product.id === productId) || false;

    return (
        <div className="card-glass">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    🛍️ All Products
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                        Click + to add
                    </span>
                </h3>
                <span className="text-xs text-muted-foreground">
                    {Object.values(rankedProducts).reduce((sum, arr) => sum + arr.length, 0)} total
                </span>
            </div>

            {/* Category Tabs */}
            <div className="px-4 py-2 border-b border-border/50 overflow-x-auto">
                <div className="flex gap-2">
                    {plan.categories.map((cat) => {
                        const catProducts = rankedProducts[cat.name] || [];
                        const isActive = displayCategory === cat.name;
                        return (
                            <button
                                key={cat.name}
                                onClick={() => { setSelectedCategory(cat.name); setShowAll(false); }}
                                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-all ${isActive ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                    }`}
                            >
                                {cat.displayName} ({catProducts.length})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Products Grid - 2 columns on md, 3 on lg */}
            <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[450px] overflow-y-auto">
                {displayProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => handleAddToCart(product)}
                        isInCart={isInCart(product.id)}
                    />
                ))}
            </div>

            {/* Show More */}
            {products.length > 12 && !showAll && (
                <div className="px-4 pb-3 text-center">
                    <button onClick={() => setShowAll(true)} className="text-xs text-primary hover:underline">
                        Show all {products.length} products →
                    </button>
                </div>
            )}
        </div>
    );
}
