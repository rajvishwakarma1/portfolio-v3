"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const [isClicking, setIsClicking] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const pathname = usePathname()
    const animationRef = useRef<number | undefined>(undefined)
    const positionRef = useRef({ x: 0, y: 0 })

    // Function to check if cursor is over a clickable element
    const checkIfHovering = () => {
        const element = document.elementFromPoint(positionRef.current.x, positionRef.current.y) as HTMLElement | null
        if (element) {
            const isClickable =
                element.tagName === "A" ||
                element.tagName === "BUTTON" ||
                element.closest("a") ||
                element.closest("button") ||
                element.getAttribute("role") === "button" ||
                element.classList.contains("cursor-pointer")
            setIsHovering(!!isClickable)
        } else {
            setIsHovering(false)
        }
    }

    // Smooth cursor following animation
    useEffect(() => {
        const animate = () => {
            setSmoothPosition(prev => ({
                x: prev.x + (position.x - prev.x) * 0.15,
                y: prev.y + (position.y - prev.y) * 0.15
            }))
            animationRef.current = requestAnimationFrame(animate)
        }
        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [position])

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY })
            positionRef.current = { x: e.clientX, y: e.clientY }
            setIsVisible(true)
        }

        const handleMouseEnter = () => setIsVisible(true)
        const handleMouseLeave = () => setIsVisible(false)

        const handleMouseDown = () => setIsClicking(true)
        const handleMouseUp = () => setIsClicking(false)

        const handleHoverStart = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.getAttribute("role") === "button" ||
                target.classList.contains("cursor-pointer")
            ) {
                setIsHovering(true)
            }
        }

        const handleHoverEnd = () => {
            setIsHovering(false)
        }

        // Check hover state on scroll (elements move under cursor)
        const handleScroll = () => {
            checkIfHovering()
        }

        window.addEventListener("mousemove", updatePosition)
        window.addEventListener("mouseenter", handleMouseEnter)
        window.addEventListener("mouseleave", handleMouseLeave)
        window.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mouseup", handleMouseUp)
        window.addEventListener("scroll", handleScroll, { passive: true })
        document.addEventListener("mouseover", handleHoverStart)
        document.addEventListener("mouseout", handleHoverEnd)

        return () => {
            window.removeEventListener("mousemove", updatePosition)
            window.removeEventListener("mouseenter", handleMouseEnter)
            window.removeEventListener("mouseleave", handleMouseLeave)
            window.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("mouseup", handleMouseUp)
            window.removeEventListener("scroll", handleScroll)
            document.removeEventListener("mouseover", handleHoverStart)
            document.removeEventListener("mouseout", handleHoverEnd)
        }
    }, [])

    // Hide on admin pages
    if (pathname?.startsWith("/admin")) {
        return null
    }

    return (
        <>
            {/* Hide default cursor */}
            <style jsx global>{`
                * {
                    cursor: none !important;
                }
            `}</style>

            {/* Outer ring - follows with smooth delay */}
            <div
                className={`fixed pointer-events-none z-[9999] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    left: smoothPosition.x,
                    top: smoothPosition.y,
                    transform: "translate(-50%, -50%)",
                }}
            >
                <div
                    className={`rounded-full border-2 transition-all duration-300 ease-out ${isClicking
                        ? "w-6 h-6 border-white bg-white/20 rotate-45"
                        : isHovering
                            ? "w-14 h-14 border-white/80 bg-white/5 rotate-0"
                            : "w-10 h-10 border-gray-500/40 rotate-0"
                        }`}
                    style={{
                        animation: isHovering ? "pulse-ring 2s infinite" : "none"
                    }}
                />
            </div>

            {/* Inner dot - follows cursor exactly */}
            <div
                className={`fixed pointer-events-none z-[10000] transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    left: position.x,
                    top: position.y,
                    transform: "translate(-50%, -50%)",
                }}
            >
                <div
                    className={`rounded-full transition-all duration-150 ${isClicking
                        ? "w-3 h-3 bg-white scale-150"
                        : isHovering
                            ? "w-2 h-2 bg-white"
                            : "w-1.5 h-1.5 bg-gray-400"
                        }`}
                />
            </div>

            {/* Click ripple effect */}
            {isClicking && (
                <div
                    className="fixed pointer-events-none z-[9998]"
                    style={{
                        left: position.x,
                        top: position.y,
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <div className="w-20 h-20 rounded-full border border-white/30 animate-ping" />
                </div>
            )}

            {/* Decorative orbiting dots on hover */}
            {isHovering && (
                <div
                    className="fixed pointer-events-none z-[9997]"
                    style={{
                        left: smoothPosition.x,
                        top: smoothPosition.y,
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <div
                        className="w-16 h-16 relative"
                        style={{ animation: "spin 4s linear infinite" }}
                    >
                        <div className="absolute top-0 left-1/2 w-1 h-1 bg-white/60 rounded-full -translate-x-1/2" />
                        <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-white/60 rounded-full -translate-x-1/2" />
                    </div>
                </div>
            )}

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes pulse-ring {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(1.05);
                    }
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </>
    )
}
