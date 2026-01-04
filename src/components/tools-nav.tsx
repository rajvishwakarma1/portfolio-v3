"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"

interface Section {
    id: string
    label: string
}

const sections: Section[] = [
    { id: "development", label: "development" },
    { id: "design", label: "design" },
    { id: "productivity", label: "productivity" },
    { id: "hardware", label: "hardware" },
]

export function ToolsNav() {
    const [activeSection, setActiveSection] = useState("development")
    const [isHovered, setIsHovered] = useState(false)
    const pathname = usePathname()
    const isClickScrolling = useRef(false)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = useCallback(() => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
        }
        setIsHovered(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(false)
        }, 150)
    }, [])

    useEffect(() => {
        // Reset to first section when pathname changes
        setActiveSection("development")
    }, [pathname])

    useEffect(() => {
        const handleScroll = () => {
            // Skip detection while click-scrolling
            if (isClickScrolling.current) return

            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight

            // If at very bottom of page, select hardware
            if (window.scrollY + windowHeight >= documentHeight - 10) {
                setActiveSection("hardware")
                return
            }

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i]
                const element = document.getElementById(section.id)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    // If element is in the top half of the viewport, it's active
                    if (rect.top <= windowHeight / 2) {
                        setActiveSection(section.id)
                        break
                    }
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        handleScroll()

        return () => window.removeEventListener("scroll", handleScroll)
    }, [pathname])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            // Set the active section immediately when clicking
            setActiveSection(id)

            // Pause scroll detection during animation
            isClickScrolling.current = true

            // Calculate position to center the element in viewport
            const elementRect = element.getBoundingClientRect()
            const absoluteElementTop = elementRect.top + window.scrollY
            const middleOffset = window.innerHeight / 2 - elementRect.height / 2
            const scrollPosition = absoluteElementTop - middleOffset

            // Scroll to center (but don't scroll past top)
            window.scrollTo({
                top: Math.max(0, scrollPosition),
                behavior: "smooth"
            })

            // Resume scroll detection after animation completes
            setTimeout(() => {
                isClickScrolling.current = false
            }, 1000)
        }
    }

    // Only show on tools page
    if (pathname !== "/tools") {
        return null
    }

    return (
        <div
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:flex items-center pr-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Expanded menu - absolutely positioned */}
            <div
                className={`
          absolute right-full mr-4 top-1/2 -translate-y-1/2
          bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 rounded-lg
          py-3 px-4 min-w-[120px]
          transition-all duration-300 ease-out
          ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}
        `}
            >
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`
              block w-full text-left text-sm py-1.5 transition-colors duration-200
              ${activeSection === section.id ? "text-accent" : "text-gray-400 hover:text-white"}
            `}
                    >
                        {section.label}
                    </button>
                ))}
            </div>

            {/* Indicator bars */}
            <div className="flex flex-col gap-2 items-end">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`
              h-0.5 rounded-full transition-all duration-300
              ${activeSection === section.id
                                ? "w-6 bg-accent"
                                : "w-3 bg-neutral-600 hover:bg-neutral-400"
                            }
            `}
                        aria-label={`Scroll to ${section.label}`}
                    />
                ))}
            </div>
        </div>
    )
}
