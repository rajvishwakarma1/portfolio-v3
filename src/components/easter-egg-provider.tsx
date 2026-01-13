"use client"

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react"

interface EasterEggContextType {
    showModal: boolean
    setShowModal: (show: boolean) => void
}

const EasterEggContext = createContext<EasterEggContextType | null>(null)

// Fallback facts in case API fails
const fallbackFacts = [
    "🎮 I've reported more bugs than solved leetcode problems",
    "☕ My code runs on chai, not coffee",
    "🌙 80% of my best ideas come after midnight debugging sessions",
]

// Dot sizes for each click level
const DOT_SIZES = [0, 12, 20, 32] // click 0, 1, 2, 3

export function EasterEggProvider({ children }: { children: ReactNode }) {
    const [showModal, setShowModal] = useState(false)
    const [currentFact, setCurrentFact] = useState("")
    const [funFacts, setFunFacts] = useState<string[]>(fallbackFacts)
    const [clickCount, setClickCount] = useState(0)
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null)
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

    // Reset click count after 2 seconds of no clicks
    useEffect(() => {
        if (clickCount > 0 && clickCount < 3) {
            clickTimeoutRef.current = setTimeout(() => {
                setClickCount(0)
                setClickPosition(null)
            }, 2000)
        }
        return () => {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current)
            }
        }
    }, [clickCount])

    // Handle clicks on empty areas
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement

            // Check if clicked on an "empty" area (background/container elements only)
            const isEmptyArea =
                target.tagName === "MAIN" ||
                target.tagName === "BODY" ||
                target.id === "content-wrapper" ||
                target.classList.contains("empty-click-target") ||
                (target.tagName === "DIV" &&
                    !target.closest("a") &&
                    !target.closest("button") &&
                    !target.closest("input") &&
                    !target.closest("textarea") &&
                    !target.closest("[role='button']") &&
                    !target.closest("nav") &&
                    !target.closest("header") &&
                    target.textContent?.trim() === "")

            if (isEmptyArea) {
                // Update click position
                setClickPosition({ x: e.clientX, y: e.clientY })

                const newCount = clickCount + 1
                setClickCount(newCount)

                if (newCount >= 3) {
                    // Delay slightly to show the final dot size
                    setTimeout(() => {
                        const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)]
                        setCurrentFact(randomFact)
                        setShowModal(true)
                        setClickCount(0)
                        setClickPosition(null)
                    }, 150)
                }
            }
        }

        document.addEventListener("click", handleClick)
        return () => document.removeEventListener("click", handleClick)
    }, [clickCount, funFacts])

    const getNewFact = () => {
        const newFact = funFacts[Math.floor(Math.random() * funFacts.length)]
        setCurrentFact(newFact)
    }

    const currentDotSize = DOT_SIZES[clickCount] || 0

    return (
        <EasterEggContext.Provider value={{ showModal, setShowModal }}>
            {children}

            {/* Minimal click counter at click position */}
            {clickCount > 0 && clickPosition && (
                <div
                    className="fixed pointer-events-none z-40 font-mono text-xs text-gray-500"
                    style={{
                        left: clickPosition.x + 12,
                        top: clickPosition.y - 8,
                    }}
                >
                    {clickCount}/3
                </div>
            )}

            {/* Fun Facts Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="relative mx-4 w-full max-w-sm border border-neutral-700 bg-[#111] p-6 transition-all duration-500 ease-out"
                        style={{ animation: 'modalReveal 0.5s ease-out forwards' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <style>{`
                            @keyframes modalReveal {
                                0% { opacity: 0; filter: blur(12px); }
                                100% { opacity: 1; filter: blur(0px); }
                            }
                            @keyframes textReveal {
                                0% { opacity: 0; filter: blur(8px); }
                                100% { opacity: 1; filter: blur(0px); }
                            }
                        `}</style>

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-accent transition-colors text-sm"
                            style={{ animation: 'textReveal 0.4s ease-out 0.1s forwards', opacity: 0 }}
                        >
                            [esc]
                        </button>

                        <div className="space-y-4">
                            <p
                                className="text-gray-500 text-sm"
                                style={{ animation: 'textReveal 0.4s ease-out 0.15s forwards', opacity: 0 }}
                            >
                                you found a secret
                            </p>

                            <p
                                className="text-gray-300 leading-relaxed"
                                style={{ animation: 'textReveal 0.4s ease-out 0.25s forwards', opacity: 0 }}
                            >
                                "{currentFact}"
                            </p>

                            <button
                                onClick={getNewFact}
                                className="text-sm text-accent hover:underline"
                                style={{ animation: 'textReveal 0.4s ease-out 0.35s forwards', opacity: 0 }}
                            >
                                another →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </EasterEggContext.Provider>
    )
}

export function useEasterEgg() {
    return useContext(EasterEggContext)
}
