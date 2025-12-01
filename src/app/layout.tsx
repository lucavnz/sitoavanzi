import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getMotorcycles } from "@/lib/sanity.fetch";
import React from "react";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Avanzi Moto",
    description: "Vendita e assistenza moto nuove e usate",
};

interface Motorcycle {
    brand: string;
    isUsed?: boolean;
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Fetch motorcycles to determine available brands for the Navbar
    let availableBrands: string[] = [];
    
    try {
        const motorcycles: Motorcycle[] = await getMotorcycles();
        
        // Filter brands that have at least one NEW bike
        availableBrands = Array.from(new Set(
            motorcycles
                .filter((m) => !m.isUsed) // Only consider NEW bikes
                .map((m) => m.brand)
        ));
    } catch (error) {
        console.error('Failed to fetch motorcycles for navbar:', error);
        // Continue with empty array, navbar will just not show "Altro" brands
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${outfit.variable} antialiased font-sans bg-neutral-950 text-white`}
            >
                <Navbar availableBrands={availableBrands} />
                {children}
            </body>
        </html>
    );
}
