"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

// Fallback facts in case API fails
const fallbackFacts = [
    "🎮 I've reported more bugs than solved leetcode problems",
    "☕ My code runs on chai, not coffee",
    "🌙 80% of my best ideas come after midnight debugging sessions",
]

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
    const [clickCount, setClickCount] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [currentFact, setCurrentFact] = useState("")
    const [funFacts, setFunFacts] = useState<string[]>(fallbackFacts)
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null)
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const containerRef = useRef<HTMLSpanElement>(null)
    const pathname = usePathname()

    // Fetch fun facts from API
    useEffect(() => {
        fetch("/api/fun-facts")
            .then((res) => res.json())
            .then((data) => {
                if (data.funFacts && data.funFacts.length > 0) {
                    setFunFacts(data.funFacts)
                }
            })
            .catch(() => {
                // Keep fallback facts
            })
    }, [])

    // Re-trigger reveal animation on navigation
    useEffect(() => {
        setIsRevealed(false)
        const timer = setTimeout(() => {
            setIsRevealed(true)
        }, 50)
        return () => clearTimeout(timer)
    }, [pathname])

    // Reset click count after 2 seconds of no clicks
    useEffect(() => {
        if (clickCount > 0 && clickCount < 3) {
            clickTimeoutRef.current = setTimeout(() => {
                setClickCount(0)
            }, 2000)
        }
        return () => {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current)
            }
        }
    }, [clickCount])

    const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        // Get click position relative to the container
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            setClickPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            })
        }

        const newCount = clickCount + 1
        setClickCount(newCount)

        if (newCount >= 3) {
            // Easter egg triggered!
            const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)]
            setCurrentFact(randomFact)
            setShowModal(true)
            setClickCount(0)
            setClickPosition(null)
        }
    }

    return (
        <>
            <span
                ref={containerRef}
                className={`relative inline-block cursor-pointer ${className}`}
                onMouseEnter={() => isRevealed && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
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

                {/* Click indicator - appears at cursor position */}
                {clickCount > 0 && clickCount < 3 && clickPosition && (
                    <span
                        className="absolute flex h-4 w-4 items-center justify-center pointer-events-none"
                        style={{
                            left: clickPosition.x - 8,
                            top: clickPosition.y - 8,
                        }}
                    >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                    </span>
                )}
            </span>

            {/* Fun Facts Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="relative mx-4 w-full max-w-sm border border-neutral-700 bg-[#111] p-6 transition-all duration-500 ease-out"
                        style={{
                            animation: 'modalReveal 0.5s ease-out forwards',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <style>{`
                            @keyframes modalReveal {
                                0% {
                                    opacity: 0;
                                    filter: blur(12px);
                                }
                                100% {
                                    opacity: 1;
                                    filter: blur(0px);
                                }
                            }
                            @keyframes textReveal {
                                0% {
                                    opacity: 0;
                                    filter: blur(8px);
                                }
                                100% {
                                    opacity: 1;
                                    filter: blur(0px);
                                }
                            }
                        `}</style>

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-accent transition-colors text-sm"
                            style={{
                                animation: 'textReveal 0.4s ease-out 0.1s forwards',
                                opacity: 0,
                            }}
                        >
                            [esc]
                        </button>

                        <div className="space-y-4">
                            <p
                                className="text-gray-500 text-sm"
                                style={{
                                    animation: 'textReveal 0.4s ease-out 0.15s forwards',
                                    opacity: 0,
                                }}
                            >
                                you found a secret
                            </p>

                            <p
                                className="text-gray-300 leading-relaxed"
                                style={{
                                    animation: 'textReveal 0.4s ease-out 0.25s forwards',
                                    opacity: 0,
                                }}
                            >
                                "{currentFact}"
                            </p>

                            <button
                                onClick={() => {
                                    const newFact = funFacts[Math.floor(Math.random() * funFacts.length)]
                                    setCurrentFact(newFact)
                                }}
                                className="text-sm text-accent hover:underline"
                                style={{
                                    animation: 'textReveal 0.4s ease-out 0.35s forwards',
                                    opacity: 0,
                                }}
                            >
                                another →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
