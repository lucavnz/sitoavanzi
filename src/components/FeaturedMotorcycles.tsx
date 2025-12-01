"use client";

import { useState, useEffect, useRef } from "react";
import { client } from "@/sanity/client";
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="relative mb-12">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8 pt-10">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                <span className="text-orange-500 font-mono text-sm tracking-[0.3em] uppercase">
                                    La nostra selezione
                                </span>
                                <div className="h-px w-12 bg-orange-500/50" />
                            </div>

                            <h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
                                Moto in <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 stroke-text">
                                    Evidenza
                                </span>
                            </h2>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-6">
                            <p className="text-neutral-400 max-w-md md:text-right text-lg leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-orange-500 pl-4 md:pl-0 md:pr-4">
                                Scopri le migliori occasioni e le ultime novità <br />
                                <span className="text-white font-bold">disponibili subito</span> <br />
                                in concessionaria.
                            </p>
                        </div>
                    </div>
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
