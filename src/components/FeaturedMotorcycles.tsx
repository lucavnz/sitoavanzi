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

export default async function FeaturedMotorcycles() {
    const motorcycles: Motorcycle[] = await getFeaturedMotorcycles();

    if (!motorcycles || motorcycles.length === 0) {
        return null;
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

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-10 border-b border-neutral-800 pb-8 text-center md:text-left">
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
                        <div key={moto._id}>
                            <MotorcycleCard
                                moto={moto}
                                index={index}
                                themeColor={getBrandColor(moto.brand)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
