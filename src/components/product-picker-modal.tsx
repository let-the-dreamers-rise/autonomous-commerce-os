'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { RETAILER_COLORS, RETAILER_NAMES, formatCurrency } from '@/lib/utils';
import { X, Plus, ArrowRightLeft, Search, Star, Truck, Check } from 'lucide-react';
import type { ScoredProduct, CartItem } from '@/types';

interface ProductPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    category?: string;
    replaceItemId?: string; // If set, we're replacing an item
    onSelect: (product: ScoredProduct) => void;
}

export default function ProductPickerModal({
    isOpen,
    onClose,
    category,
    replaceItemId,
    onSelect
}: ProductPickerModalProps) {
    const { rankedProducts, cart } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRetailer, setSelectedRetailer] = useState<string>('all');

    if (!isOpen || !rankedProducts) return null;

    // Get all products from all categories
    const allProducts: ScoredProduct[] = Object.entries(rankedProducts)
        .filter(([cat]) => !category || cat === category)
        .flatMap(([, products]) => products);

    // Filter by search and retailer
    const filteredProducts = allProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRetailer = selectedRetailer === 'all' || p.retailer === selectedRetailer;
        // Don't show products already in cart
        const notInCart = !cart?.items.some(item => item.product.id === p.id);
        return matchesSearch && matchesRetailer && (replaceItemId ? true : notInCart);
    });

    // Sort by score
    const sortedProducts = [...filteredProducts].sort((a, b) => b.score - a.score);

    const handleSelect = (product: ScoredProduct) => {
        onSelect(product);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="card-glass overflow-hidden flex flex-col h-full">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-primary/20 to-secondary/20">
                        <div className="flex items-center gap-2">
                            {replaceItemId ? (
                                <ArrowRightLeft className="w-5 h-5 text-accent" />
                            ) : (
                                <Plus className="w-5 h-5 text-accent" />
                            )}
                            <h2 className="font-semibold">
                                {replaceItemId ? 'Replace Item' : 'Add Product to Cart'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="px-4 py-3 border-b border-border/50 flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <select
                            value={selectedRetailer}
                            onChange={(e) => setSelectedRetailer(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm"
                        >
                            <option value="all">All Retailers</option>
                            <option value="amazon">Amazon</option>
                            <option value="walmart">Walmart</option>
                            <option value="bestbuy">Best Buy</option>
                        </select>
                    </div>

                    {/* Product List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[50vh]">
                        {sortedProducts.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No products found
                            </p>
                        ) : (
                            sortedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => handleSelect(product)}
                                    className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border/30 hover:border-primary/50 cursor-pointer transition-all flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                                        {product.category === 'outerwear' && '🧥'}
                                        {product.category === 'accessories' && '🥽'}
                                        {product.category === 'base_layer' && '👕'}
                                        {product.category === 'pants' && '👖'}
                                        {product.category === 'gloves' && '🧤'}
                                        {product.category === 'helmet' && '⛑️'}
                                        {product.category === 'socks' && '🧦'}
                                        {product.category === 'snacks' && '🍿'}
                                        {product.category === 'badges' && '🏷️'}
                                        {product.category === 'tech_accessories' && '🔌'}
                                        {product.category === 'prizes' && '🎁'}
                                        {product.category === 'decorations' && '🎈'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span
                                                className="text-[10px] px-1.5 py-0.5 rounded"
                                                style={{
                                                    backgroundColor: `${RETAILER_COLORS[product.retailer]}20`,
                                                    color: RETAILER_COLORS[product.retailer]
                                                }}
                                            >
                                                {RETAILER_NAMES[product.retailer]}
                                            </span>
                                            <span className="text-[10px] text-yellow-500 flex items-center gap-0.5">
                                                <Star className="w-3 h-3" /> {product.rating}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                                <Truck className="w-3 h-3" /> {product.deliveryDays}d
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary">
                                            {formatCurrency(product.price)}
                                        </p>
                                        <p className="text-[10px] text-accent">
                                            Score: {(product.score * 100).toFixed(0)}%
                                        </p>
                                    </div>

                                    <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-border/50 text-xs text-muted-foreground text-center">
                        {sortedProducts.length} products available • Click to {replaceItemId ? 'replace' : 'add'}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
