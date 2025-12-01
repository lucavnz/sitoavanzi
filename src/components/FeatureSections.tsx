"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface FeatureSection {
    title: string;
    description: string;
    imageUrl: string;
}

interface FeatureSectionsProps {
    sections: FeatureSection[];
}

export default function FeatureSections({ sections }: FeatureSectionsProps) {
    if (!sections || sections.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950">
            <div className="max-w-7xl mx-auto space-y-0">
                {sections.map((section, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <div
                            key={index}
                            className={`grid grid-cols-1 md:grid-cols-2 gap-0 ${index > 0 ? '' : ''}`}
                        >
                            {/* Image Block */}
                            <motion.div
                                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className={`relative aspect-square bg-neutral-900 overflow-hidden group ${isEven ? 'md:order-1' : 'md:order-2'}`}
                            >
                                <Image
                                    src={section.imageUrl}
                                    alt={section.title || "Feature Image"}
                                    fill
                                    className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>

                            {/* Text Block */}
                            <motion.div
                                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className={`relative aspect-square bg-neutral-900 border border-neutral-800 flex items-center justify-center p-8 md:p-12 lg:p-16 group hover:bg-neutral-800 transition-colors duration-500 ${isEven ? 'md:order-2' : 'md:order-1'}`}
                            >
                                {/* Decorative corner elements */}
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-orange-500/30 group-hover:border-orange-500 transition-colors duration-500" />
                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-orange-500/30 group-hover:border-orange-500 transition-colors duration-500" />

                                <div className="relative z-10 text-center md:text-left">
                                    <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                                        <div className="w-8 h-[2px] bg-orange-500" />
                                        <span className="text-orange-500 text-xs font-bold uppercase tracking-[0.2em]">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6 group-hover:text-orange-500 transition-colors duration-500">
                                        {section.title}
                                    </h3>

                                    <p className="text-neutral-400 text-base md:text-lg leading-relaxed group-hover:text-neutral-300 transition-colors duration-500">
                                        {section.description}
                                    </p>

                                    {/* Decorative dot */}
                                    <div className="mt-8 flex gap-2 justify-center md:justify-start">
                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                        <div className="w-2 h-2 rounded-full bg-orange-500/60" />
                                        <div className="w-2 h-2 rounded-full bg-orange-500/30" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
