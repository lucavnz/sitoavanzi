"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import MotorcycleCard from "./MotorcycleCard";
import { motion, AnimatePresence } from "framer-motion";
import RangeSlider from "./ui/RangeSlider";
import { formatPrice } from "@/lib/utils";

type Motorcycle = {
    _id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    price: number;
    brand: string;
    year: number;
    displacement?: number;
    description?: string;
    isUsed?: boolean;
    kilometers?: number;
    catchphrase?: string;
    summary?: string;
};

export default function CatalogGrid({
    motorcycles,
    brand,
    isUsed = false,
    themeColor = "orange"
}: {
    motorcycles: Motorcycle[],
    brand?: string,
    isUsed?: boolean,
    themeColor?: string
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Calculate Bounds from Data
    const bounds = useMemo(() => {
        if (motorcycles.length === 0) return {
            year: { min: 2000, max: new Date().getFullYear() },
            price: { min: 0, max: 50000 },
            displacement: { min: 50, max: 2000 }
        };

        const years = motorcycles.map(m => m.year);
        const prices = motorcycles.map(m => m.price);
        const displacements = motorcycles.map(m => m.displacement || 0).filter(d => d > 0);

        return {
            year: {
                min: Math.min(...years),
                max: Math.max(...years) === Math.min(...years) ? Math.min(...years) + 1 : Math.max(...years)
            },
            price: {
                min: Math.min(...prices),
                max: Math.max(...prices) === Math.min(...prices) ? Math.min(...prices) + 1000 : Math.max(...prices)
            },
            displacement: {
                min: displacements.length ? Math.min(...displacements) : 50,
                max: (displacements.length ? Math.max(...displacements) : 1200) === (displacements.length ? Math.min(...displacements) : 50) ? (displacements.length ? Math.min(...displacements) : 50) + 100 : (displacements.length ? Math.max(...displacements) : 1200)
            }
        };
    }, [motorcycles]);

    // Filters State
    const [filters, setFilters] = useState({
        yearRange: [bounds.year.min, bounds.year.max] as [number, number],
        priceRange: [bounds.price.min, bounds.price.max] as [number, number],
        displacementRange: [bounds.displacement.min, bounds.displacement.max] as [number, number],
        selectedBrands: [] as string[],
    });

    // Update filters when bounds change (e.g. initial load)
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            yearRange: [bounds.year.min, bounds.year.max],
            priceRange: [bounds.price.min, bounds.price.max],
            displacementRange: [bounds.displacement.min, bounds.displacement.max],
        }));
    }, [bounds]);

    // Filter Logic
    const filteredMotorcycles = useMemo(() => {
        return motorcycles.filter(moto => {
            // 1. Page-Level Filters (Brand Page or Used Page)
            if (brand && moto.brand.toLowerCase() !== brand.toLowerCase()) return false;

            // If we are on a specific brand page (and not the used page), show only NEW bikes
            if (brand && !isUsed && moto.isUsed) return false;

            // If we are on the used page, show ONLY used bikes
            if (isUsed && !moto.isUsed) return false;

            // 2. User Filters
            // Search
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                moto.title.toLowerCase().includes(searchLower) ||
                moto.brand.toLowerCase().includes(searchLower) ||
                moto.description?.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;

            // Brand Filter (Sidebar) - Only if not on a brand page
            if (!brand && filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(moto.brand)) return false;

            // Year
            if (moto.year < filters.yearRange[0] || moto.year > filters.yearRange[1]) return false;

            // Price
            if (moto.price < filters.priceRange[0] || moto.price > filters.priceRange[1]) return false;

            // Displacement
            const disp = moto.displacement || 0;
            if (disp > 0 && (disp < filters.displacementRange[0] || disp > filters.displacementRange[1])) return false;

            return true;
        });
    }, [motorcycles, searchQuery, filters, brand, isUsed]);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleBrand = (brandName: string) => {
        setFilters(prev => {
            const current = prev.selectedBrands;
            if (current.includes(brandName)) {
                return { ...prev, selectedBrands: current.filter(b => b !== brandName) };
            } else {
                return { ...prev, selectedBrands: [...current, brandName] };
            }
        });
    };

    const clearFilters = () => {
        setFilters({
            yearRange: [bounds.year.min, bounds.year.max],
            priceRange: [bounds.price.min, bounds.price.max],
            displacementRange: [bounds.displacement.min, bounds.displacement.max],
            selectedBrands: [],
        });
        setSearchQuery("");
    };

    // Dynamic Styles based on Theme Color
    const getThemeColorClass = (type: 'text' | 'bg' | 'border' | 'hover-bg' | 'hover-text') => {
        const colorMap: Record<string, string> = {
            orange: 'orange-500',
            blue: 'blue-500',
            yellow: 'yellow-500',
            green: 'green-500',
            red: 'red-600',
            fuchsia: 'fuchsia-500',
            teal: 'teal-400',
        };
        const color = colorMap[themeColor] || 'orange-500';

        switch (type) {
            case 'text': return `text-${color}`;
            case 'bg': return `bg-${color}`;
            case 'border': return `border-${color}`;
            case 'hover-bg': return `hover:bg-${color}`;
            case 'hover-text': return `hover:text-${color}`;
            default: return '';
        }
    };

    const availableBrands = useMemo(() => {
        const brands = new Set(motorcycles.map(m => m.brand));
        return Array.from(brands).sort();
    }, [motorcycles]);

    // Scroll spotlight tracking for mobile
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            if (typeof window === 'undefined') return;

            // Only on mobile
            if (window.innerWidth >= 768) {
                setActiveIndex(null);
                return;
            }

            const viewportCenter = window.innerHeight / 2;
            let closestIndex = null;
            let closestDistance = Infinity;

            cardRefs.current.forEach((card, index) => {
                if (!card) return;

                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                const distance = Math.abs(cardCenter - viewportCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            setActiveIndex(closestIndex);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleScroll);
            handleScroll(); // Initial check
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', handleScroll);
            }
        };
    }, [filteredMotorcycles]);

    // Prevent body scroll when filters are open (mobile)
    useEffect(() => {
        if (showFilters) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showFilters]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
            {/* Mobile Filter Toggle */}
            <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden w-full py-3 bg-neutral-900 border border-white/10 text-white font-mono text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 mb-6 transition-colors hover:bg-neutral-800"
            >
                <SlidersHorizontal className="w-4 h-4" />
                Filtri e Cerca
            </button>

            {/* Mobile Drawer Overlay */}
            <AnimatePresence>
                {
                    showFilters && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowFilters(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
                            />

                            {/* Drawer */}
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-white/10 rounded-t-3xl z-50 lg:hidden max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl"
                            >
                                <div className="p-4 space-y-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wider">Filtri</h3>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="p-2 text-neutral-400 hover:text-white transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Mobile Filter Content - Reusing the same structure as desktop but in drawer */}
                                    <div className="space-y-8">
                                        {/* Search */}
                                        <div className="relative">
                                            <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1.5 transition-all focus-within:border-neutral-700 focus-within:shadow-lg focus-within:shadow-black/50">
                                                <div className="p-2 text-neutral-500">
                                                    <Search className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Cerca moto..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full bg-transparent text-white text-sm font-medium px-1 py-2 focus:outline-none placeholder:text-neutral-600 placeholder:font-mono placeholder:uppercase placeholder:tracking-wider placeholder:font-bold"
                                                />
                                                {searchQuery && (
                                                    <button
                                                        onClick={() => setSearchQuery("")}
                                                        className="p-2 text-neutral-600 hover:text-white transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Filters */}
                                        <div className="space-y-8">
                                            {/* Brand Filter (Mobile) */}
                                            {!brand && (
                                                <div className="space-y-4">
                                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Marchio</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {availableBrands.map(b => (
                                                            <button
                                                                key={b}
                                                                onClick={() => toggleBrand(b)}
                                                                className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide border transition-all ${filters.selectedBrands.includes(b)
                                                                    ? `${getThemeColorClass('bg')} border-transparent text-white`
                                                                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                                                                    }`}
                                                            >
                                                                {b}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Year Slider */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Anno</label>
                                                    <div className="text-xs font-mono font-medium text-white bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                                                        {filters.yearRange[0]} - {filters.yearRange[1]}
                                                    </div>
                                                </div>
                                                <RangeSlider
                                                    min={bounds.year.min}
                                                    max={bounds.year.max}
                                                    value={filters.yearRange}
                                                    onChange={(val) => handleFilterChange('yearRange', val)}
                                                    color={themeColor}
                                                />
                                            </div>

                                            {/* Price Slider */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Prezzo</label>
                                                    <div className="text-xs font-mono font-medium text-white bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                                                        {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                                                    </div>
                                                </div>
                                                <RangeSlider
                                                    min={bounds.price.min}
                                                    max={bounds.price.max}
                                                    step={100}
                                                    value={filters.priceRange}
                                                    onChange={(val) => handleFilterChange('priceRange', val)}
                                                    color={themeColor}
                                                />
                                            </div>

                                            {/* Displacement Slider */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Cilindrata</label>
                                                    <div className="text-xs font-mono font-medium text-white bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                                                        {filters.displacementRange[0]}cc - {filters.displacementRange[1]}cc
                                                    </div>
                                                </div>
                                                <RangeSlider
                                                    min={bounds.displacement.min}
                                                    max={bounds.displacement.max}
                                                    step={50}
                                                    value={filters.displacementRange}
                                                    onChange={(val) => handleFilterChange('displacementRange', val)}
                                                    color={themeColor}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Drawer Footer */}
                                <div className="p-6 border-t border-white/10 bg-neutral-900/50 mt-auto sticky bottom-0">
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="w-full py-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-200 transition-colors"
                                    >
                                        Vedi {filteredMotorcycles.length} Risultati
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )
                }
            </AnimatePresence >

            {/* Desktop Sidebar - Sticky */}
            < aside className="hidden lg:block w-[300px] sticky top-32 flex-shrink-0" >
                {/* Search - Moved Outside */}
                < div className="mb-4 relative" >
                    <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1.5 transition-all focus-within:border-neutral-700 focus-within:shadow-lg focus-within:shadow-black/50">
                        <div className="p-2 text-neutral-500">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cerca moto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent text-white text-sm font-medium px-1 py-2 focus:outline-none placeholder:text-neutral-600 placeholder:font-mono placeholder:uppercase placeholder:tracking-wider placeholder:font-bold"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="p-2 text-neutral-600 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div >

                <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-6 space-y-4 shadow-2xl backdrop-blur-xl">

                    {/* Filters Content */}
                    <div className="space-y-8">
                        {/* Brand Filter (Desktop) */}
                        {!brand && (
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Marchio</label>
                                <div className="space-y-2">
                                    {availableBrands.map(b => (
                                        <label key={b} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-4 h-4 rounded border border-neutral-800 flex items-center justify-center transition-all ${filters.selectedBrands.includes(b) ? getThemeColorClass('bg') + ' border-transparent' : 'group-hover:border-neutral-600'}`}>
                                                {filters.selectedBrands.includes(b) && <div className="w-1.5 h-1.5 bg-black rounded-[1px]" />}
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${filters.selectedBrands.includes(b) ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-300'}`}>{b}</span>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={filters.selectedBrands.includes(b)}
                                                onChange={() => toggleBrand(b)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Year Slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Anno</label>
                                <div className="text-xs font-mono font-medium text-white bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                                    {filters.yearRange[0]} - {filters.yearRange[1]}
                                </div>
                            </div>
                            <RangeSlider
                                min={bounds.year.min}
                                max={bounds.year.max}
                                value={filters.yearRange}
                                onChange={(val) => handleFilterChange('yearRange', val)}
                                color={themeColor}
                            />
                        </div>

                        {/* Price Slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Prezzo</label>
                                <div className="text-xs font-mono font-medium text-white bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                                    {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                                </div>
                            </div>
                            <RangeSlider
                                min={bounds.price.min}
                                max={bounds.price.max}
                                step={100}
                                value={filters.priceRange}
                                onChange={(val) => handleFilterChange('priceRange', val)}
                                color={themeColor}
                            />
                        </div>

                        {/* Displacement Slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Cilindrata</label>
                                <div className="text-xs font-mono font-medium text-white bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                                    {filters.displacementRange[0]}cc - {filters.displacementRange[1]}cc
                                </div>
                            </div>
                            <RangeSlider
                                min={bounds.displacement.min}
                                max={bounds.displacement.max}
                                step={50}
                                value={filters.displacementRange}
                                onChange={(val) => handleFilterChange('displacementRange', val)}
                                color={themeColor}
                            />
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="pt-4 border-t border-white/10 text-center">
                        <span className="text-neutral-400 font-mono text-xs uppercase tracking-wider">
                            {filteredMotorcycles.length} Risultati trovati
                        </span>
                    </div>
                </div>
            </aside >

            {/* Main Content - Grid */}
            < main className="flex-1 w-full" >
                {
                    filteredMotorcycles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {filteredMotorcycles.map((moto, index) => (
                                <MotorcycleCard
                                    key={moto._id}
                                    moto={moto}
                                    index={index}
                                    themeColor={themeColor}
                                    isActive={activeIndex === index}
                                    cardRef={(el: HTMLDivElement | null) => cardRefs.current[index] = el}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 bg-neutral-900/30 border border-neutral-800 border-dashed rounded-3xl">
                            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/5">
                                <Search className="w-8 h-8 text-neutral-600" />
                            </div>
                            <p className="text-xl text-white font-bold mb-2">Nessun risultato trovato</p>
                            <p className="text-sm text-neutral-500 mb-8">Prova a modificare i filtri di ricerca</p>
                            <button
                                onClick={clearFilters}
                                className={`px-8 py-3 ${getThemeColorClass('bg')} text-black font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-lg`}
                            >
                                Resetta Filtri
                            </button>
                        </div>
                    )
                }
            </main >
        </div >
    );
}
