"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface ImageSliderProps {
    images: string[];
    title: string;
}

export default function ImageSlider({ images, title }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const slideVariants = {
        enter: (direction: number) => ({
            opacity: 0,
        }),
        center: {
            opacity: 1,
        },
        exit: (direction: number) => ({
            opacity: 0,
        }),
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => {
            if (newDirection === 1) {
                return prev === images.length - 1 ? 0 : prev + 1;
            } else {
                return prev === 0 ? images.length - 1 : prev - 1;
            }
        });
    };

    if (!images || images.length === 0) {
        return (
            <div className="relative w-full aspect-[16/10] bg-neutral-900 rounded-2xl flex items-center justify-center">
                <p className="text-neutral-600">Nessuna immagine disponibile</p>
            </div>
        );
    }

    return (
        <>
            {/* Main Image with Modern Frame */}
            <div className="relative w-full aspect-[16/10] bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 group">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            opacity: { duration: 0.4 },
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`${title} - Immagine ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            priority={currentIndex === 0}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons - Modern Style */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => paginate(-1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/70 hover:border-orange-500/50 transition-all opacity-0 group-hover:opacity-100 z-10"
                            aria-label="Immagine precedente"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => paginate(1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/70 hover:border-orange-500/50 transition-all opacity-0 group-hover:opacity-100 z-10"
                            aria-label="Immagine successiva"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Fullscreen Button */}
                <button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center text-white hover:bg-black/70 hover:border-orange-500/50 transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label="Schermo intero"
                >
                    <Maximize2 className="w-5 h-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                        onClick={() => setIsFullscreen(false)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
                            aria-label="Chiudi"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navigation in Fullscreen */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        paginate(-1);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
                                    aria-label="Immagine precedente"
                                >
                                    <ChevronLeft className="w-7 h-7" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        paginate(1);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
                                    aria-label="Immagine successiva"
                                >
                                    <ChevronRight className="w-7 h-7" />
                                </button>
                            </>
                        )}

                        {/* Image Counter in Fullscreen */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-white text-sm font-medium z-20">
                            {currentIndex + 1} / {images.length}
                        </div>

                        {/* Fullscreen Image */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative w-full h-full p-20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ opacity: { duration: 0.3 } }}
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src={images[currentIndex]}
                                        alt={`${title} - Immagine ${currentIndex + 1}`}
                                        fill
                                        className="object-contain"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
