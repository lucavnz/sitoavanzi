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
        const colorMap: Record<string, { bg: string; text: string; border: string; bgBlur: string }> = {
            orange: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', bgBlur: 'bg-orange-500/5' },
            blue: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', bgBlur: 'bg-blue-500/5' },
            yellow: { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500', bgBlur: 'bg-yellow-500/5' },
            green: { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', bgBlur: 'bg-green-500/5' },
            red: { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-600', bgBlur: 'bg-red-600/5' },
            fuchsia: { bg: 'bg-fuchsia-500', text: 'text-fuchsia-500', border: 'border-fuchsia-500', bgBlur: 'bg-fuchsia-500/5' },
            teal: { bg: 'bg-teal-400', text: 'text-teal-400', border: 'border-teal-400', bgBlur: 'bg-teal-400/5' },
        };
        return colorMap[color] || colorMap.orange;
    };

    const themeClasses = getThemeClasses(theme.color);

    return (
        <div className="min-h-screen bg-neutral-950 pt-40 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Modern Header */}
                <div className="relative mb-12 pt-8">
                    {/* Decorative Background Elements */}
                    <div className={`absolute top-0 right-0 w-64 h-64 ${themeClasses.bgBlur} rounded-full blur-3xl -z-10`} />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-800 pb-8">
                        <div className="relative">
                            {/* Small Overline */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 ${themeClasses.bg} rounded-full`} />
                                <span className={`${themeClasses.text} text-xs font-bold uppercase tracking-[0.2em]`}>
                                    Concessionario Ufficiale
                                </span>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                                {theme.title}
                            </h1>

                            {/* Subtitle */}
                            <p className={`text-neutral-400 text-lg max-w-xl mt-4 font-light border-l-2 ${themeClasses.border}/50 pl-4`}>
                                {theme.subtitle}
                            </p>
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
