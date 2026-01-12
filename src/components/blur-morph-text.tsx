"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function BlurMorphText({
    text,
    hoverText,
    className = "",
}: {
    text: string
    hoverText: string
    className?: string
}) {
    const [isHovered, setIsHovered] = useState(false)
    const [isRevealed, setIsRevealed] = useState(false)
    const pathname = usePathname()

    // Re-trigger reveal animation on navigation
    useEffect(() => {
        setIsRevealed(false)
        const timer = setTimeout(() => {
            setIsRevealed(true)
        }, 50)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <span
            className={`relative inline-block cursor-pointer ${className}`}
            onMouseEnter={() => setIsRevealed && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ minWidth: `${Math.max(text.length, hoverText.length)}ch` }}
        >
            {/* Original text */}
            <span
                className="transition-all duration-300 ease-out"
                style={{
                    filter: !isRevealed ? "blur(12px)" : isHovered ? "blur(8px)" : "blur(0px)",
                    opacity: !isRevealed ? 0 : isHovered ? 0 : 1,
                    transform: isRevealed ? "translateY(0)" : "translateY(8px)",
                }}
            >
                {text}
            </span>

            {/* Hover text - positioned absolutely on top */}
            <span
                className="absolute left-0 top-0 transition-all duration-300 ease-out"
                style={{
                    filter: isHovered ? "blur(0px)" : "blur(8px)",
                    opacity: isHovered ? 1 : 0,
                }}
            >
                {hoverText}
            </span>
        </span>
    )
}
