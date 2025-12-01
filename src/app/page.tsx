import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/lib/image";
import Hero from "../components/Hero";
import Services from "@/components/Services";
import FeaturedMotorcycles from "@/components/FeaturedMotorcycles";
import FeatureSections from "@/components/FeatureSections";

async function getHomepageData() {
    return client.fetch(`*[_type == "homepage"][0]{
        heroImage,
        featureSections[]{
            title,
            description,
            "imageUrl": asset->url
        }
    }`);
}

export default async function Home() {
    const data = await getHomepageData();
    // @ts-ignore
    const heroImageUrl = data?.heroImage ? urlFor(data.heroImage).url() : undefined;
    const defaultSections = [
        {
            title: "Vendita di Moto Nuove e Usate",
            description: "Ampia gamma di moto nuove KTM, Husqvarna, Kymco e Voge a Brescia con finanziamenti personalizzati. Selezione accurata di moto usate controllate e garantite nel nostro concessionario.",
            imageUrl: "/hero-motorcycle.png"
        },
        {
            title: "Officina, ricambi e riparazioni",
            description: "Officina specializzata con tecnici qualificati. Vasto magazzino ricambi originali e reparto dedicato ad accessori e abbigliamento per la tua sicurezza e comfort.",
            imageUrl: "/hero-motorcycle.png"
        }
    ];

    // Merge Sanity data with defaults
    const featureSections = defaultSections.map((defaultSection, index) => {
        const sanitySection = data?.featureSections?.[index];
        return {
            title: sanitySection?.title || defaultSection.title,
            description: sanitySection?.description || defaultSection.description,
            imageUrl: sanitySection?.imageUrl || defaultSection.imageUrl
        };
    });

    return (
        <main className="bg-neutral-950 min-h-screen">
            <Hero heroImageUrl={heroImageUrl} />
            <FeatureSections sections={featureSections} />
            <FeaturedMotorcycles />
            <Services />
        </main>
    );
}
