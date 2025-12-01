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

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [filteredMotorcycles]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
            {/* Sidebar Filters - Desktop Sticky / Mobile Collapsible */}
            <aside className="w-full lg:w-[280px] lg:sticky lg:top-24 flex-shrink-0">

                {/* Filters Container */}
                <div className="block space-y-4">

                    {/* Search Bar - Clean Design */}
                    <div className="relative group">
                        <div className="relative flex items-center bg-[#0f0f0f] border border-white/10 rounded-2xl p-1 transition-all duration-300 group-focus-within:border-neutral-700">
                            <div className="p-3 bg-neutral-900 rounded-xl text-neutral-400 group-focus-within:text-white transition-colors">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cerca moto..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent text-white px-3 py-2 focus:outline-none placeholder:text-neutral-600 font-medium"
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

                    {/* Filter Sections */}
                    <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 space-y-8 shadow-2xl">

                        {/* Header with Reset */}
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <SlidersHorizontal className={`w-4 h-4 ${getThemeColorClass('text')}`} />
                                Filtri
                            </h3>
                            {(
                                filters.yearRange[0] !== bounds.year.min || filters.yearRange[1] !== bounds.year.max ||
                                filters.priceRange[0] !== bounds.price.min || filters.priceRange[1] !== bounds.price.max ||
                                filters.displacementRange[0] !== bounds.displacement.min || filters.displacementRange[1] !== bounds.displacement.max ||
                                filters.selectedBrands.length > 0
                            ) && (
                                    <button
                                        onClick={clearFilters}
                                        className={`text-[10px] font-bold text-neutral-500 ${getThemeColorClass('hover-text')} uppercase tracking-wider transition-colors flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md hover:bg-white/10`}
                                    >
                                        <X className="w-3 h-3" /> Reset
                                    </button>
                                )}
                        </div>

                        {/* Brand Filter (Only if not on brand page) */}
                        {!brand && (
                            <div className="space-y-4">
                                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Marchio</label>
                                <div className="space-y-2">
                                    {availableBrands.map(b => (
                                        <label key={b} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-4 h-4 rounded border border-neutral-700 flex items-center justify-center transition-colors ${filters.selectedBrands.includes(b) ? getThemeColorClass('bg') + ' border-transparent' : 'group-hover:border-neutral-500'}`}>
                                                {filters.selectedBrands.includes(b) && <div className="w-2 h-2 bg-black rounded-sm" />}
                                            </div>
                                            <span className={`text-sm font-medium ${filters.selectedBrands.includes(b) ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-300'}`}>{b}</span>
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
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Anno</label>
                                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white bg-white/5 px-2 py-1 rounded border border-white/5">
                                    <span>{filters.yearRange[0]}</span>
                                    <span className="text-neutral-600">-</span>
                                    <span>{filters.yearRange[1]}</span>
                                </div>
                            </div>
                            <div className="px-1">
                                <RangeSlider
                                    min={bounds.year.min}
                                    max={bounds.year.max}
                                    value={filters.yearRange}
                                    onChange={(val) => handleFilterChange('yearRange', val)}
                                    color={themeColor}
                                />
                            </div>
                        </div>

                        {/* Price Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Prezzo</label>
                                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white bg-white/5 px-2 py-1 rounded border border-white/5">
                                    <span>{formatPrice(filters.priceRange[0])}</span>
                                    <span className="text-neutral-600">-</span>
                                    <span>{formatPrice(filters.priceRange[1])}</span>
                                </div>
                            </div>
                            <div className="px-1">
                                <RangeSlider
                                    min={bounds.price.min}
                                    max={bounds.price.max}
                                    step={100}
                                    value={filters.priceRange}
                                    onChange={(val) => handleFilterChange('priceRange', val)}
                                    color={themeColor}
                                />
                            </div>
                        </div>

                        {/* Displacement Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Cilindrata</label>
                                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white bg-white/5 px-2 py-1 rounded border border-white/5">
                                    <span>{filters.displacementRange[0]}cc</span>
                                    <span className="text-neutral-600">-</span>
                                    <span>{filters.displacementRange[1]}cc</span>
                                </div>
                            </div>
                            <div className="px-1">
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

                        {/* Results Count (Sidebar Footer) */}
                        <div className="pt-6 border-t border-white/5 text-center">
                            <strong className="text-xl text-white font-black tracking-tight">{filteredMotorcycles.length}</strong>
                            <span className="text-sm text-neutral-500 font-medium ml-2">Risultati</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content - Grid */}
            <main className="flex-1 w-full">
                {filteredMotorcycles.length > 0 ? (
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
                )}
            </main>
        </div>
    );
}
