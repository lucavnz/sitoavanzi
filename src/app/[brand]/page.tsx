import { getMotorcycles } from "@/lib/sanity.fetch";
import CatalogGrid from "@/components/CatalogGrid";
import { notFound } from "next/navigation";

// Brand Configuration
const BRAND_THEMES: Record<string, { color: string; title: string; subtitle: string }> = {
    ktm: {
        color: "orange",
        title: "KTM",
        subtitle: "Ready to Race. Prestazioni senza compromessi."
    },
    husqvarna: {
        color: "blue", // User asked for blue/azure
        title: "Husqvarna",
        subtitle: "Pioneering Since 1903. Stile svedese, tecnologia all'avanguardia."
    },
    voge: {
        color: "yellow",
        title: "Voge",
        subtitle: "Spark Your Dream. Qualità premium, accessibile a tutti."
    },
    kymco: {
        color: "green",
        title: "Kymco",
        subtitle: "Win My Heart. Soluzioni di mobilità urbana affidabili e innovative."
    },
    beta: {
        color: "red",
        title: "Beta",
        subtitle: "The Play Bike. Eccellenza italiana nell'enduro e trial."
    },
    fantic: {
        color: "fuchsia",
        title: "Fantic",
        subtitle: "Caballero e non solo. Lo stile italiano incontra le prestazioni."
    },
    honda: {
        color: "red",
        title: "Honda",
        subtitle: "The Power of Dreams. Tecnologia e affidabilità giapponese."
    },
    ducati: {
        color: "red",
        title: "Ducati",
        subtitle: "Style, Sophistication, Performance. L'eccellenza italiana."
    },
    bmw: {
        color: "blue",
        title: "BMW",
        subtitle: "Make Life a Ride. Tecnologia tedesca e spirito d'avventura."
    },
    piaggio: {
        color: "blue",
        title: "Piaggio",
        subtitle: "Move Beautifully. L'icona della mobilità urbana italiana."
    }
};

interface Motorcycle {
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
}

export async function generateStaticParams() {
    return Object.keys(BRAND_THEMES).map((brand) => ({
        brand: brand,
    }));
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
    const { brand } = await params;
    const normalizedBrand = brand.toLowerCase();
    const theme = BRAND_THEMES[normalizedBrand];

    if (!theme) {
        notFound();
    }

    const motorcycles: Motorcycle[] = await getMotorcycles();

    const getThemeClasses = (color: string) => {
        const colorMap: Record<string, { bg: string; text: string; border: string; shadow: string; gradientFrom: string; gradientVia: string; gradientTo: string }> = {
            orange: {
                bg: 'bg-orange-500',
                text: 'text-orange-500',
                border: 'border-orange-500',
                shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]',
                gradientFrom: 'from-orange-500',
                gradientVia: 'via-orange-400',
                gradientTo: 'to-red-600'
            },
            blue: {
                bg: 'bg-blue-500',
                text: 'text-blue-500',
                border: 'border-blue-500',
                shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
                gradientFrom: 'from-blue-500',
                gradientVia: 'via-blue-400',
                gradientTo: 'to-cyan-500'
            },
            yellow: {
                bg: 'bg-yellow-500',
                text: 'text-yellow-500',
                border: 'border-yellow-500',
                shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.5)]',
                gradientFrom: 'from-yellow-500',
                gradientVia: 'via-yellow-400',
                gradientTo: 'to-orange-500'
            },
            green: {
                bg: 'bg-green-500',
                text: 'text-green-500',
                border: 'border-green-500',
                shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
                gradientFrom: 'from-green-500',
                gradientVia: 'via-green-400',
                gradientTo: 'to-emerald-600'
            },
            red: {
                bg: 'bg-red-600',
                text: 'text-red-600',
                border: 'border-red-600',
                shadow: 'shadow-[0_0_15px_rgba(220,38,38,0.5)]',
                gradientFrom: 'from-red-600',
                gradientVia: 'via-red-500',
                gradientTo: 'to-orange-600'
            },
            fuchsia: {
                bg: 'bg-fuchsia-500',
                text: 'text-fuchsia-500',
                border: 'border-fuchsia-500',
                shadow: 'shadow-[0_0_15px_rgba(217,70,239,0.5)]',
                gradientFrom: 'from-fuchsia-500',
                gradientVia: 'via-fuchsia-400',
                gradientTo: 'to-purple-600'
            },
            teal: {
                bg: 'bg-teal-400',
                text: 'text-teal-400',
                border: 'border-teal-400',
                shadow: 'shadow-[0_0_15px_rgba(45,212,191,0.5)]',
                gradientFrom: 'from-teal-400',
                gradientVia: 'via-teal-300',
                gradientTo: 'to-emerald-500'
            },
        };
        return colorMap[color] || colorMap.orange;
    };

    const themeClasses = getThemeClasses(theme.color);

    return (
        <div className="min-h-screen bg-neutral-950 pt-40 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Modern Header */}
                <div className="relative mb-8.5">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8 pt-10">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-3 h-3 ${themeClasses.bg} rounded-full ${themeClasses.shadow}`} />
                                <span className={`${themeClasses.text} font-mono text-sm tracking-[0.3em] uppercase font-bold`}>
                                    Official Dealer
                                </span>
                                <div className={`h-px w-12 bg-gradient-to-r ${themeClasses.gradientFrom} to-transparent`} />
                            </div>

                            <h2 className="text-6xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                                Gamma <br />
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeClasses.gradientFrom} ${themeClasses.gradientVia} ${themeClasses.gradientTo}`}>
                                    {theme.title}
                                </span>
                            </h2>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-6">
                            <p className={`text-neutral-400 max-w-md md:text-right text-base md:text-lg leading-relaxed border-l-2 md:border-l-0 md:border-r-2 ${themeClasses.border}/30 pl-4 md:pl-0 md:pr-4`}>
                                {theme.subtitle} <br />
                                <span className="text-white font-bold">Prestazioni e stile</span> <br />
                                senza compromessi.
                            </p>

                            {/* Decorative elements */}
                            <div className="hidden md:flex gap-2">
                                <div className="w-2 h-2 bg-neutral-800 rounded-full" />
                                <div className="w-2 h-2 bg-neutral-700 rounded-full" />
                                <div className={`w-2 h-2 ${themeClasses.bg} rounded-full`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Grid with Filters */}
                <CatalogGrid
                    motorcycles={motorcycles}
                    brand={theme.title} // Pass the display title (e.g. "KTM") which matches the Sanity data
                    isUsed={false} // Only NEW bikes for brand pages
                    themeColor={theme.color}
                />
            </div>
        </div>
    );
}
