"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function BlurRevealText({
    text,
    className = "",
    delay = 0,
}: {
    text: string
    className?: string
    delay?: number
}) {
    const [isRevealed, setIsRevealed] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        // Reset and re-trigger animation on every navigation
        setIsRevealed(false)
        const timer = setTimeout(() => {
            setIsRevealed(true)
        }, delay + 50) // Small delay to ensure state reset is processed
        return () => clearTimeout(timer)
    }, [delay, pathname])

    return (
        <span
            className={`inline-block transition-all duration-500 ease-out ${className}`}
            style={{
                filter: isRevealed ? "blur(0px)" : "blur(12px)",
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? "translateY(0)" : "translateY(8px)",
            }}
        >
            {text}
        </span>
    )
}
