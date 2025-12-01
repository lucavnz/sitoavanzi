"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Gauge } from "lucide-react";
import { motion } from "framer-motion";
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

export default function MotorcycleCard({ moto, index, themeColor = "orange" }: { moto: Motorcycle; index: number; themeColor?: string }) {
    const getColorClass = (type: 'text' | 'bg' | 'border' | 'group-hover-border' | 'group-hover-text') => {
        const colorMap: Record<string, string> = {
            orange: 'orange-500',
            blue: 'blue-500',
            yellow: 'yellow-500',
            green: 'green-500',
            red: 'red-600',
            fuchsia: 'fuchsia-500',
            teal: 'teal-400',
        };
        const c = colorMap[themeColor] || 'orange-500';

        switch (type) {
            case 'text': return `text-${c}`;
            case 'bg': return `bg-${c}`;
            case 'border': return `border-${c}`;
            case 'group-hover-border': return `group-hover:border-${c}`;
            case 'group-hover-text': return `group-hover:text-${c}`;
            default: return '';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group h-full"
        >
            <Link href={`/catalogo/${moto.slug}`} className="block h-full">
                <div className={`relative h-full bg-[#0f0f0f] border border-neutral-800 border-l-2 border-l-${getColorClass('border').split('-')[1]}-${getColorClass('border').split('-')[2]}/50 overflow-hidden ${getColorClass('group-hover-border')} transition-all duration-500`}>

                    {/* Main Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-black">
                        {moto.imageUrl ? (
                            <Image
                                src={moto.imageUrl}
                                alt={moto.title}
                                fill
                                className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-neutral-700 font-mono text-xs">NO_IMAGE</span>
                            </div>
                        )}

                        {/* Top Overlay - Status Badge */}
                        <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4">
                            {moto.isUsed && (
                                <div className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-widest ${getColorClass('bg')} text-black`}>
                                    USATO
                                </div>
                            )}
                        </div>

                        {/* Bottom Gradient Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent" />

                        {/* Brand & Title on Image */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <div className={`${getColorClass('text')} text-[11px] font-black uppercase tracking-[0.2em] mb-1.5`}>
                                {moto.brand}
                            </div>
                            <h3 className={`text-xl font-black text-white uppercase tracking-tight leading-none mb-3 ${getColorClass('group-hover-text')} transition-colors`}>
                                {moto.title}
                            </h3>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 space-y-4">

                        {/* Price - Large & Bold */}
                        <div>
                            <div className="text-[9px] text-neutral-600 uppercase font-bold tracking-wider mb-1">Prezzo</div>
                            <div className="text-3xl font-black text-white tracking-tighter" suppressHydrationWarning>
                                {formatPrice(moto.price)}
                            </div>
                        </div>

                        {/* Year, KM, CC - Simple Grid */}
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-800/50">
                            <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Calendar className={`w-3.5 h-3.5 ${getColorClass('text')}`} />
                                    <span className="text-[10px] text-neutral-600 uppercase font-bold">Anno</span>
                                </div>
                                <div className="text-sm font-black text-white font-mono">{moto.year}</div>
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Gauge className={`w-3.5 h-3.5 ${getColorClass('text')}`} />
                                    <span className="text-[10px] text-neutral-600 uppercase font-bold">Km</span>
                                </div>
                                <div className="text-sm font-black text-white font-mono">
                                    {moto.isUsed ? (moto.kilometers ? moto.kilometers.toLocaleString('it-IT') : '0') : 'Nuova'}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className={`${getColorClass('text')} font-bold text-[10px]`}>CC</span>
                                    <span className="text-[10px] text-neutral-600 uppercase font-bold">Cilindrata</span>
                                </div>
                                <div className="text-sm font-black text-white font-mono">
                                    {moto.displacement ? moto.displacement : 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {(moto.catchphrase || moto.summary || moto.description) && (
                            <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 pt-3 border-t border-neutral-800/50">
                                {moto.catchphrase || moto.summary || moto.description}
                            </p>
                        )}
                    </div>

                    {/* Hover Effect Bar */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${getColorClass('bg')} transform scale-x-50 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>
            </Link>
        </motion.div>
    );
}
