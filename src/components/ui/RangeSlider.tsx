"use client";

import { useCallback, useEffect, useState, useRef } from "react";

interface RangeSliderProps {
    min: number;
    max: number;
    step?: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    color?: string;
}

export default function RangeSlider({
    min,
    max,
    step = 1,
    value,
    onChange,
    color = "orange"
}: RangeSliderProps) {
    const [minVal, setMinVal] = useState(value[0]);
    const [maxVal, setMaxVal] = useState(value[1]);
    const minValRef = useRef(value[0]);
    const maxValRef = useRef(value[1]);
    const range = useRef<HTMLDivElement>(null);

    // Convert to percentage
    const getPercent = useCallback(
        (value: number) => {
            if (max === min) return 0;
            return Math.round(((value - min) / (max - min)) * 100);
        },
        [min, max]
    );

    // Set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // Update internal state when props change
    useEffect(() => {
        setMinVal(value[0]);
        setMaxVal(value[1]);
    }, [value]);

    const getColorClass = (type: 'bg' | 'border' | 'shadow') => {
        const colorMap: Record<string, string> = {
            orange: 'orange-500',
            blue: 'blue-500',
            yellow: 'yellow-500',
            green: 'green-500',
            red: 'red-600',
            fuchsia: 'fuchsia-500',
            teal: 'teal-400',
        };
        const c = colorMap[color] || 'orange-500';

        switch (type) {
            case 'bg': return `bg-${c}`;
            case 'border': return `border-${c}`;
            case 'shadow': return `shadow-${c}/30`;
            default: return '';
        }
    };

    return (
        <div className="relative w-full h-6 flex items-center select-none touch-none">
            {/* Invisible Inputs for Interaction */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={minVal}
                onChange={(event) => {
                    const value = Math.min(Number(event.target.value), maxVal);
                    setMinVal(value);
                    minValRef.current = value;
                    onChange([value, maxVal]);
                }}
                className="thumb thumb--left absolute h-full w-full outline-none opacity-0 cursor-pointer"
                style={{ zIndex: getPercent(minVal) > 90 ? 50 : 30 }}
            />
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={maxVal}
                onChange={(event) => {
                    const value = Math.max(Number(event.target.value), minVal);
                    setMaxVal(value);
                    maxValRef.current = value;
                    onChange([minVal, value]);
                }}
                className="thumb thumb--right absolute h-full w-full outline-none z-40 opacity-0 cursor-pointer"
            />

            {/* Visual Track Container */}
            <div className="relative w-full h-1 bg-neutral-800 rounded-full overflow-visible group">
                {/* Active Range Track */}
                <div
                    ref={range}
                    className={`absolute h-full ${getColorClass('bg')} rounded-full z-20`}
                />

                {/* Left Thumb Visual */}
                <div
                    className={`absolute h-4 w-4 ${getColorClass('bg')} rounded-full z-30 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-transform duration-100 ease-out`}
                    style={{ left: `${getPercent(minVal)}%` }}
                />

                {/* Right Thumb Visual */}
                <div
                    className={`absolute h-4 w-4 ${getColorClass('bg')} rounded-full z-30 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-transform duration-100 ease-out`}
                    style={{ left: `${getPercent(maxVal)}%` }}
                />
            </div>

            <style jsx>{`
                /* Apply pointer-events: none to the input itself to let clicks pass through */
                .thumb {
                    pointer-events: none;
                }
                
                /* Re-enable pointer-events for the thumb so it can be dragged */
                .thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    pointer-events: auto;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                    opacity: 0;
                }
                .thumb::-moz-range-thumb {
                    pointer-events: auto;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}
