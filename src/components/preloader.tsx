"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

export function Preloader() {
    const loaderRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (!loaderRef.current) return

        let currentProgress = 0

        // Animate progress counter
        const animateProgress = () => {
            if (currentProgress < 100) {
                currentProgress += Math.floor(Math.random() * 5) + 2
                if (currentProgress > 100) currentProgress = 100
                setProgress(currentProgress)
                setTimeout(animateProgress, 100)
            } else {
                // Slide up after reaching 100%
                setTimeout(() => {
                    gsap.to("#preloader", {
                        yPercent: -100,
                        duration: 0.8,
                        ease: "power3.inOut",
                        onComplete: () => {
                            setIsLoading(false)
                        },
                    })
                }, 400)
            }
        }

        // Start after a brief delay
        setTimeout(animateProgress, 300)

        return () => { }
    }, [])

    if (!isLoading) return null

    // Calculate fill position (inverted: 100% progress = 0% from top)
    const fillFromTop = 100 - progress

    return (
        <div
            id="preloader"
            ref={loaderRef}
            style={{
                height: "100vh",
                width: "100%",
                position: "fixed",
                top: 0,
                left: 0,
                backgroundColor: "#111",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Brand name container */}
            <div style={{ position: "relative", display: "inline-block" }}>
                {/* Empty/unfilled text (dark gray) */}
                <h1
                    style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: "clamp(4rem, 18vw, 14rem)",
                        fontWeight: 700,
                        color: "#333333",
                        letterSpacing: "-0.02em",
                        margin: 0,
                        userSelect: "none",
                        lineHeight: 1,
                    }}
                >
                    raj
                </h1>

                {/* Filled text with wavy clip-path */}
                <h1
                    aria-hidden="true"
                    style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: "clamp(4rem, 18vw, 14rem)",
                        fontWeight: 700,
                        color: "#ffffff",
                        letterSpacing: "-0.02em",
                        margin: 0,
                        userSelect: "none",
                        lineHeight: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        clipPath: `polygon(
              0% ${fillFromTop}%,
              5% ${Math.max(0, fillFromTop - 3)}%,
              15% ${Math.min(100, fillFromTop + 2)}%,
              25% ${Math.max(0, fillFromTop - 4)}%,
              35% ${Math.min(100, fillFromTop + 1)}%,
              45% ${Math.max(0, fillFromTop - 2)}%,
              55% ${Math.min(100, fillFromTop + 3)}%,
              65% ${Math.max(0, fillFromTop - 3)}%,
              75% ${Math.min(100, fillFromTop + 2)}%,
              85% ${Math.max(0, fillFromTop - 2)}%,
              95% ${Math.min(100, fillFromTop + 1)}%,
              100% ${Math.max(0, fillFromTop - 1)}%,
              100% 100%,
              0% 100%
            )`,
                        transition: "clip-path 0.12s ease-out",
                    }}
                >
                    raj
                </h1>

                {/* Loading indicator - directly below, right-aligned */}
                <div
                    style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginTop: 0,
                        paddingTop: "0.5rem",
                    }}
                >
                    <span style={{ color: "#666666" }}>loading...</span>
                    <span style={{ color: "#ffffff" }}>{progress}%</span>
                </div>
            </div>
        </div>
    )
}
