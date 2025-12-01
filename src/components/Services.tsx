"use client";

import { ArrowRight, Wrench, ShieldCheck, Bike, Trophy } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const services = [
    {
        id: "01",
        title: "Vendita Nuovo",
        description: "Concessionaria ufficiale KTM, Husqvarna, GasGas. Scopri la gamma completa.",
        icon: Bike,
    },
    {
        id: "02",
        title: "Usato Garantito",
        description: "Moto usate selezionate, controllate e garantite dalla nostra officina.",
        icon: ShieldCheck,
    },
    {
        id: "03",
        title: "Officina Racing",
        description: "Assistenza tecnica specializzata, preparazioni e manutenzione ordinaria.",
        icon: Wrench,
    },
    {
        id: "04",
        title: "Custom Lab",
        description: "Personalizzazioni estetiche e funzionali per rendere unica la tua moto.",
        icon: Trophy,
    },
];

export default function Services() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
    }, []);

    return (
        <section className="py-24 bg-neutral-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="relative mb-12">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8 pt-10">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                <span className="text-orange-500 font-mono text-sm tracking-[0.3em] uppercase">
                                    What we do
                                </span>
                                <div className="h-px w-12 bg-orange-500/50" />
                            </div>

                            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
                                Ecosistema <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 stroke-text">
                                    Avanzi
                                </span>
                            </h2>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-6">
                            <p className="text-neutral-400 max-w-md md:text-right text-lg leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-orange-500 pl-4 md:pl-0 md:pr-4">
                                Un hub completo per il motociclista. <br />
                                <span className="text-white font-bold">Vendita, assistenza e customizzazione</span> <br />
                                sotto lo stesso tetto.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Unified Grid Container */}
                <div className="bg-neutral-800 border border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-[1px]">
                    {services.map((service, index) => {
                        const isActive = activeIndex === index;

                        return (
                            <div
                                key={index}
                                ref={(el) => { cardRefs.current[index] = el }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className={`relative group bg-neutral-950 h-[300px] md:h-[450px] p-8 md:p-12 flex flex-col justify-between overflow-hidden border-b border-neutral-800 md:border-0 last:border-b-0`}
                            >
                                {/* Hover Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

                                {/* Large Background Icon (Watermark) */}
                                <service.icon className={`absolute -bottom-12 -right-12 w-64 h-64 transition-colors duration-500 rotate-12 ${isActive ? 'text-neutral-800/50' : 'text-neutral-900 group-hover:text-neutral-800/50'}`} />

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <span className={`font-mono text-xl transition-colors duration-300 ${isActive ? 'text-orange-500' : 'text-neutral-700 group-hover:text-orange-500'}`}>
                                            {service.id}
                                        </span>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-orange-500/10' : 'bg-neutral-900 group-hover:bg-orange-500/10'}`}>
                                            <service.icon className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-orange-500' : 'text-neutral-400 group-hover:text-orange-500'}`} />
                                        </div>
                                    </div>

                                    <h4 className={`text-3xl md:text-5xl font-black text-white uppercase mb-6 tracking-tight transition-transform duration-300 ${isActive ? 'translate-x-2' : 'group-hover:translate-x-2'}`}>
                                        {service.title}
                                    </h4>
                                    <p className={`text-lg leading-relaxed transition-colors duration-300 max-w-md ${isActive ? 'text-neutral-300' : 'text-neutral-400 group-hover:text-neutral-300'}`}>
                                        {service.description}
                                    </p>
                                </div>

                                {/* Bottom Action */}
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className={`h-[1px] w-12 transition-colors duration-300 ${isActive ? 'bg-orange-500' : 'bg-neutral-800 group-hover:bg-orange-500'}`} />
                                    <span className={`text-sm font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-white'}`}>Scopri</span>
                                </div>

                                {/* Active Border Overlay */}
                                <div className={`absolute inset-0 border-2 border-orange-500 transition-opacity duration-300 pointer-events-none z-20 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
