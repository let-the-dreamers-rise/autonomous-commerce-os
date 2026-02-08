'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    ShoppingBag,
    Truck,
    Star,
    Settings,
    Save,
    Check,
    X
} from 'lucide-react';

interface Preferences {
    preferredRetailer: 'amazon' | 'walmart' | 'bestbuy' | 'any';
    prioritizePrime: boolean;
    maxDeliveryDays: number;
    minRating: number;
    ecoFriendly: boolean;
    bundleOrders: boolean;
}

const STORAGE_KEY = 'agentic-commerce-preferences';

export function usePreferences() {
    const [preferences, setPreferences] = useState<Preferences>({
        preferredRetailer: 'any',
        prioritizePrime: true,
        maxDeliveryDays: 5,
        minRating: 4.0,
        ecoFriendly: false,
        bundleOrders: true,
    });

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setPreferences(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse preferences:', e);
            }
        }
    }, []);

    const savePreferences = (newPrefs: Preferences) => {
        setPreferences(newPrefs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    };

    return { preferences, savePreferences };
}

interface PreferencesPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PreferencesPanel({ isOpen, onClose }: PreferencesPanelProps) {
    const { preferences, savePreferences } = usePreferences();
    const [localPrefs, setLocalPrefs] = useState(preferences);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setLocalPrefs(preferences);
    }, [preferences]);

    const handleSave = () => {
        savePreferences(localPrefs);
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            onClose();
        }, 1000);
    };

    const retailers = [
        { value: 'any', label: 'No Preference' },
        { value: 'amazon', label: 'Amazon', color: '#FF9900' },
        { value: 'walmart', label: 'Walmart', color: '#0071DC' },
        { value: 'bestbuy', label: 'Best Buy', color: '#0046BE' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 px-6 py-4 bg-card border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Settings className="w-5 h-5 text-primary" />
                                <h2 className="font-semibold">Shopping Preferences</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Preferred Retailer */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                                    <ShoppingBag className="w-4 h-4 text-primary" />
                                    Preferred Retailer
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {retailers.map((r) => (
                                        <button
                                            key={r.value}
                                            onClick={() => setLocalPrefs({ ...localPrefs, preferredRetailer: r.value as any })}
                                            className={`p-3 rounded-lg border text-sm transition-all ${localPrefs.preferredRetailer === r.value
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                            style={r.color && localPrefs.preferredRetailer === r.value ? { borderColor: r.color } : {}}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Prime Priority */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <Truck className="w-4 h-4 text-secondary" />
                                    Prioritize Prime/Fast Shipping
                                </label>
                                <button
                                    onClick={() => setLocalPrefs({ ...localPrefs, prioritizePrime: !localPrefs.prioritizePrime })}
                                    className={`w-12 h-6 rounded-full transition-all ${localPrefs.prioritizePrime ? 'bg-primary' : 'bg-muted'
                                        }`}
                                >
                                    <motion.div
                                        className="w-5 h-5 bg-white rounded-full shadow"
                                        animate={{ x: localPrefs.prioritizePrime ? 26 : 2 }}
                                    />
                                </button>
                            </div>

                            {/* Max Delivery Days */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                                    <Truck className="w-4 h-4 text-accent" />
                                    Maximum Delivery Time
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min={1}
                                        max={14}
                                        value={localPrefs.maxDeliveryDays}
                                        onChange={(e) => setLocalPrefs({ ...localPrefs, maxDeliveryDays: parseInt(e.target.value) })}
                                        className="flex-1 accent-primary"
                                    />
                                    <span className="text-sm font-mono w-16 text-right">
                                        {localPrefs.maxDeliveryDays} days
                                    </span>
                                </div>
                            </div>

                            {/* Min Rating */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    Minimum Rating
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min={3}
                                        max={5}
                                        step={0.5}
                                        value={localPrefs.minRating}
                                        onChange={(e) => setLocalPrefs({ ...localPrefs, minRating: parseFloat(e.target.value) })}
                                        className="flex-1 accent-yellow-400"
                                    />
                                    <span className="text-sm font-mono w-12 text-right">
                                        {localPrefs.minRating}★
                                    </span>
                                </div>
                            </div>

                            {/* Eco Friendly */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <Heart className="w-4 h-4 text-green-400" />
                                    Prefer Eco-Friendly Options
                                </label>
                                <button
                                    onClick={() => setLocalPrefs({ ...localPrefs, ecoFriendly: !localPrefs.ecoFriendly })}
                                    className={`w-12 h-6 rounded-full transition-all ${localPrefs.ecoFriendly ? 'bg-green-500' : 'bg-muted'
                                        }`}
                                >
                                    <motion.div
                                        className="w-5 h-5 bg-white rounded-full shadow"
                                        animate={{ x: localPrefs.ecoFriendly ? 26 : 2 }}
                                    />
                                </button>
                            </div>

                            {/* Bundle Orders */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                                    Bundle Orders When Possible
                                </label>
                                <button
                                    onClick={() => setLocalPrefs({ ...localPrefs, bundleOrders: !localPrefs.bundleOrders })}
                                    className={`w-12 h-6 rounded-full transition-all ${localPrefs.bundleOrders ? 'bg-purple-500' : 'bg-muted'
                                        }`}
                                >
                                    <motion.div
                                        className="w-5 h-5 bg-white rounded-full shadow"
                                        animate={{ x: localPrefs.bundleOrders ? 26 : 2 }}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 px-6 py-4 bg-card border-t border-border">
                            <button
                                onClick={handleSave}
                                disabled={saved}
                                className={`w-full btn-primary flex items-center justify-center gap-2 ${saved ? 'bg-accent' : ''
                                    }`}
                            >
                                {saved ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Saved!
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Preferences
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-muted-foreground text-center mt-2">
                                AI will remember your preferences for future sessions
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
