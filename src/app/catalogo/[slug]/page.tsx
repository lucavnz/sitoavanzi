import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/lib/image";
import ImageSlider from "@/components/ImageSlider";
import ConfiguratorForm from "@/components/ConfiguratorForm";
import Services from "@/components/Services";
import { Calendar, Gauge, Info, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

async function getMotorcycle(slug: string) {
    return client.fetch(`*[_type == "motorcycle" && slug.current == $slug][0]{
        _id,
        title,
        "slug": slug.current,
        "images": images[].asset->url,
        price,
        brand,
        year,
        displacement,
        description,
        isUsed,
        kilometers,
        catchphrase,
        summary
    }`, { slug });
}

export default async function MotorcyclePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const motorcycle = await getMotorcycle(slug);

    if (!motorcycle) {
        notFound();
    }

    const getBrandColor = (brand: string) => {
        const b = brand.toLowerCase();
        if (b === 'ktm') return 'orange';
        if (b === 'husqvarna') return 'blue';
        if (b === 'voge') return 'yellow';
        if (b === 'kymco') return 'green';
        if (b === 'beta') return 'red';
        if (b === 'fantic') return 'fuchsia';
        return 'orange';
    };

    const brandColor = getBrandColor(motorcycle.brand);
    const shade = brandColor === 'red' ? '600' : '500';

    const textClass = `text-${brandColor}-${shade}`;
    const borderClass = `border-${brandColor}-${shade}`;
    const bgClass = `bg-${brandColor}-${shade}`;

    return (
        <main className="bg-neutral-950 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40">

                {/* Header Section */}
                <div className="mb-8">
                    <div className={`text-sm font-black uppercase tracking-[0.2em] mb-2 ${textClass}`}>
                        {motorcycle.brand}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">
                        {motorcycle.title}
                    </h1>
                    <p className="text-neutral-400 text-lg leading-relaxed">
                        Avanzi Moto - Concessionario di moto nuove e usate a Bagnolo Mella, BRESCIA.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Images & Info */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Image Slider */}
                        <ImageSlider images={motorcycle.images} title={motorcycle.title} />

                        {/* Price Section - Minimal & Elegant */}
                        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-10 text-center group hover:border-${brandColor}-${shade}/30 transition-all duration-500`}>
                            {/* Subtle accent line */}
                            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${brandColor}-${shade}/50 to-transparent`} />

                            <div className="space-y-6">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-800" />
                                    <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-[0.3em]">Prezzo</span>
                                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-800" />
                                </div>

                                <div className="relative">
                                    <div className={`text-6xl md:text-7xl font-black text-white tracking-tighter group-hover:${textClass} transition-colors duration-500`}>
                                        {formatPrice(motorcycle.price)}
                                    </div>
                                </div>

                                {motorcycle.isUsed && (
                                    <div className="pt-4 border-t border-neutral-800">
                                        <div className={`inline-flex items-center gap-2 bg-neutral-800/50 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-300 group-hover:bg-${brandColor}-${shade}/10 group-hover:${textClass} transition-all duration-300`}>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Usato Garantito
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Other Info - Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className={`bg-[#0f0f0f] border border-neutral-800 rounded-xl p-5 text-center group hover:border-${brandColor}-${shade}/50 transition-all`}>
                                <Calendar className={`w-5 h-5 ${textClass} mx-auto mb-2`} />
                                <div className="text-[9px] text-neutral-600 uppercase font-bold tracking-wider mb-2">Anno</div>
                                <div className="text-2xl font-black text-white font-mono">{motorcycle.year}</div>
                            </div>
                            <div className={`bg-[#0f0f0f] border border-neutral-800 rounded-xl p-5 text-center group hover:border-${brandColor}-${shade}/50 transition-all`}>
                                <Gauge className={`w-5 h-5 ${textClass} mx-auto mb-2`} />
                                <div className="text-[9px] text-neutral-600 uppercase font-bold tracking-wider mb-2">Chilometri</div>
                                <div className="text-2xl font-black text-white font-mono">
                                    {motorcycle.isUsed ? (motorcycle.kilometers ? motorcycle.kilometers.toLocaleString('it-IT') : '0') : 'Nuova'}
                                </div>
                            </div>
                            <div className={`bg-[#0f0f0f] border border-neutral-800 rounded-xl p-5 text-center group hover:border-${brandColor}-${shade}/50 transition-all`}>
                                <span className={`${textClass} font-bold text-sm mx-auto block mb-2`}>CC</span>
                                <div className="text-[9px] text-neutral-600 uppercase font-bold tracking-wider mb-2">Cilindrata</div>
                                <div className="text-2xl font-black text-white font-mono">{motorcycle.displacement}</div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Descrizione</h2>
                            {motorcycle.catchphrase && (
                                <p className={`text-xl text-neutral-200 font-medium italic border-l-4 ${borderClass} pl-4 py-1`}>
                                    "{motorcycle.catchphrase}"
                                </p>
                            )}
                            <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                                <p className="whitespace-pre-line">{motorcycle.description}</p>
                            </div>
                        </div>


                    </div>

                    {/* Right Column: Configurator (Sticky) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-6">
                            <ConfiguratorForm motorcycleTitle={motorcycle.title} brandColor={brandColor} />

                            <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-xl p-4 flex gap-4 items-start">
                                <Info className="w-5 h-5 text-neutral-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                    Il prezzo indicato è da intendersi escluso passaggio di proprietà. Le foto potrebbero essere indicative.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Services Section */}
            <Services brandColor={brandColor} />
        </main>
    );
}
