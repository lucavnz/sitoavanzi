"use client";

import { ArrowRight, Wrench, ShieldCheck, Bike, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const services = [
    {
        title: "Vendita Nuovo",
        description: "Concessionaria ufficiale dei migliori marchi. Scopri le ultime novità del mercato moto.",
        icon: Bike,
    },
    {
        title: "Usato Garantito",
        description: "Selezione accurata di moto usate, controllate e garantite dalla nostra officina.",
        icon: ShieldCheck,
    },
    {
        title: "Officina",
        description: "Assistenza tecnica specializzata, tagliandi programmati e riparazioni complete.",
        icon: Wrench,
    },
    {
        title: "Custom",
        description: "Personalizzazioni estetiche e meccaniche per rendere unica la tua moto.",
        icon: Trophy,
    },
];

const colorVariants: Record<string, any> = {
    orange: {
        text: "text-orange-500",
        bg: "bg-orange-500",
        border: "border-orange-500",
        hoverBorder: "hover:border-orange-500",
        groupHoverBg: "group-hover:bg-orange-500",
        iconBg: "bg-orange-500/10",
    },
    blue: {
        text: "text-blue-500",
        bg: "bg-blue-500",
        border: "border-blue-500",
        hoverBorder: "hover:border-blue-500",
        groupHoverBg: "group-hover:bg-blue-500",
        iconBg: "bg-blue-500/10",
    },
    yellow: {
        text: "text-yellow-500",
        bg: "bg-yellow-500",
        border: "border-yellow-500",
        hoverBorder: "hover:border-yellow-500",
        groupHoverBg: "group-hover:bg-yellow-500",
        iconBg: "bg-yellow-500/10",
    },
    green: {
        text: "text-green-500",
        bg: "bg-green-500",
        border: "border-green-500",
        hoverBorder: "hover:border-green-500",
        groupHoverBg: "group-hover:bg-green-500",
        iconBg: "bg-green-500/10",
    },
    red: {
        text: "text-red-600",
        bg: "bg-red-600",
        border: "border-red-600",
        hoverBorder: "hover:border-red-600",
        groupHoverBg: "group-hover:bg-red-600",
        iconBg: "bg-red-600/10",
    },
    fuchsia: {
        text: "text-fuchsia-500",
        bg: "bg-fuchsia-500",
        border: "border-fuchsia-500",
        hoverBorder: "hover:border-fuchsia-500",
        groupHoverBg: "group-hover:bg-fuchsia-500",
        iconBg: "bg-fuchsia-500/10",
    },
};

function ServiceCard({ service, index, brandColor = "orange", isActive = false, cardRef }: { service: any; index: number; brandColor?: string; isActive?: boolean; cardRef?: any }) {
    const colors = colorVariants[brandColor] || colorVariants.orange;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative bg-neutral-900/50 border p-8 transition-colors duration-500 overflow-hidden ${isActive
                ? `${colors.border} md:border-neutral-800 md:${colors.hoverBorder}`
                : `border-neutral-800 ${colors.hoverBorder}`
                }`}
        >
            <div className={`absolute top-0 right-0 p-4 transition-opacity duration-500 ${isActive ? 'opacity-20 md:opacity-10 md:group-hover:opacity-20' : 'opacity-10 group-hover:opacity-20'
                }`}>
                <service.icon className={`w-24 h-24 ${colors.text} rotate-12 transform transition-transform duration-500 ${isActive ? 'scale-110 md:scale-100 md:group-hover:scale-110' : 'group-hover:scale-110'
                    }`} />
            </div>

            <div className="relative z-10">
                <div className={`w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mb-6 transition-colors duration-500 ${isActive ? `${colors.bg} md:bg-neutral-800 md:${colors.groupHoverBg}` : colors.groupHoverBg
                    }`}>
                    <service.icon className="w-6 h-6 text-white" />
                </div>

                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                    {service.title}
                </h4>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    {service.description}
                </p>

                <div className={`flex items-center gap-2 ${colors.text} text-xs font-bold uppercase tracking-widest transition-transform duration-300 ${isActive ? 'translate-x-2 md:translate-x-0 md:group-hover:translate-x-2' : 'group-hover:translate-x-2'
                    }`}>
                    Scopri di più <ArrowRight className="w-3 h-3" />
                </div>
            </div>

            <div className={`absolute bottom-0 left-0 w-full h-1 ${colors.bg} transform transition-transform duration-500 origin-left ${isActive ? 'scale-x-100 md:scale-x-0 md:group-hover:scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
        </motion.div>
    );
}

export default function Services({ brandColor = "orange" }: { brandColor?: string }) {
    const colors = colorVariants[brandColor] || colorVariants.orange;
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
    }, []);

    return (
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-10 md:border-b border-neutral-800 md:pb-8 text-center md:text-left">
                    <div>
                        <h2 className={`${colors.text} font-bold tracking-[0.2em] uppercase text-sm mb-2`}>Cosa Offriamo</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
                            Servizi Premium
                        </h3>
                    </div>
                    <p className="text-neutral-400 max-w-md text-center md:text-left">
                        Offriamo un servizio completo a 360° per la tua moto, dalla vendita all'assistenza post-vendita specializzata.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            service={service}
                            index={index}
                            brandColor={brandColor}
                            isActive={activeIndex === index}
                            cardRef={(el: HTMLDivElement | null) => cardRefs.current[index] = el}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
