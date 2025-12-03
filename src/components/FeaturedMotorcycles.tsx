"use client";

import { useState, useEffect, useRef } from "react";
import { client } from "@/sanity/client";
import { motion } from "framer-motion";
import MotorcycleCard from "@/components/MotorcycleCard";
import { urlFor } from "@/sanity/lib/image";

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

async function getFeaturedMotorcycles() {
    const query = `*[_type == "motorcycle" && isFeatured == true][0...6] {
        _id,
        title,
        "slug": slug.current,
        "imageUrl": images[0].asset->url,
        price,
        brand,
        year,
        displacement,
        description,
        isUsed,
        kilometers,
        catchphrase,
        summary
    }`;
    return client.fetch(query);
}

const getBrandColor = (brand: string) => {
    const b = brand.toLowerCase();
    if (b === 'ktm') return 'orange';
    if (b === 'husqvarna') return 'blue';
    if (b === 'voge') return 'yellow';
    if (b === 'kymco') return 'green';
    if (b === 'beta') return 'red';
    if (b === 'fantic') return 'fuchsia';
    if (b === 'honda') return 'red';
    if (b === 'ducati') return 'red';
    if (b === 'bmw') return 'blue';
    if (b === 'piaggio') return 'blue';
    return 'orange'; // Default
};

export default function FeaturedMotorcycles() {
    const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        getFeaturedMotorcycles().then(setMotorcycles);
    }, []);

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
    }, [motorcycles]);

    if (!motorcycles || motorcycles.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="relative mb-16">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8 pt-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                                />
                                <span className="text-orange-500 font-mono text-sm tracking-[0.3em] uppercase font-bold">
                                    La nostra selezione
                                </span>
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: 48 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="h-px bg-gradient-to-r from-orange-500 to-transparent"
                                />
                            </div>

                            <h2 className="text-6xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                                Moto in <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-red-600">
                                    Evidenza
                                </span>
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col items-start md:items-end gap-6"
                        >
                            <p className="text-neutral-400 max-w-md md:text-right text-base md:text-lg leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-orange-500/30 pl-4 md:pl-0 md:pr-4">
                                Scopri le migliori occasioni e le ultime novità <br />
                                <span className="text-white font-bold">disponibili subito</span> <br />
                                in concessionaria.
                            </p>

                            {/* Decorative elements */}
                            <div className="hidden md:flex gap-2">
                                <div className="w-2 h-2 bg-neutral-800 rounded-full" />
                                <div className="w-2 h-2 bg-neutral-700 rounded-full" />
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Background decorative gradient */}
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {motorcycles.map((moto, index) => (
                        <MotorcycleCard
                            key={moto._id}
                            moto={moto}
                            index={index}
                            themeColor={getBrandColor(moto.brand)}
                            isActive={activeIndex === index}
                            cardRef={(el: HTMLDivElement | null) => cardRefs.current[index] = el}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
