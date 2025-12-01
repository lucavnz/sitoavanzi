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
    }, [motorcycles]);

    if (!motorcycles || motorcycles.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-10 md:border-b border-neutral-800 md:pb-8 text-center md:text-left">
                    <div>
                        <h2 className="text-orange-500 font-bold tracking-[0.2em] uppercase text-sm mb-2">La nostra selezione</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
                            Moto in Evidenza
                        </h3>
                    </div>
                    <p className="text-neutral-400 max-w-md text-center md:text-right">
                        Scopri le migliori occasioni e le ultime novità disponibili subito in concessionaria.
                    </p>
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
