"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollPainter() {
    const [scrollProgress, setScrollProgress] = useState(0)
    const pathname = usePathname()

    useEffect(() => {
        // Reset scroll progress when page changes
        setScrollProgress(0)

        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
            const currentScroll = window.scrollY
            const progress = Math.min(currentScroll / scrollHeight, 1)
            setScrollProgress(progress)
        }

        window.addEventListener("scroll", handleScroll)
        handleScroll()

        return () => window.removeEventListener("scroll", handleScroll)
    }, [pathname])

    // Hide on admin, project detail pages, and blog detail pages
    // Show only on main pages, not on /projects/[slug] or /blog/[slug]
    const isProjectDetailPage = pathname?.startsWith("/projects/") && pathname !== "/projects"
    const isBlogDetailPage = pathname?.startsWith("/blog/") && pathname !== "/blog"
    if (pathname?.startsWith("/admin") || isProjectDetailPage || isBlogDetailPage) {
        return null
    }

    // Determine which image to show based on page
    const getImagePath = () => {
        if (pathname?.startsWith("/projects")) {
            return "/japanese-projects.png"
        }
        if (pathname?.startsWith("/blog")) {
            return "/japanese-blog.png"
        }
        return "/japanese-river.png"
    }

    return (
        <div className="fixed left-0 top-0 h-screen w-32 z-40 hidden lg:block overflow-hidden">
            {/* Progress line - LEFT side */}
            <div className="absolute left-0 top-0 w-0.5 h-full bg-neutral-800 z-10">
                <div
                    className="w-full bg-accent transition-all duration-150"
                    style={{ height: `${scrollProgress * 100}%` }}
                />
            </div>

            {/* Japanese painting - reveals as you scroll */}
            <div
                className="absolute inset-0 pl-1 transition-all duration-300"
                style={{
                    clipPath: `inset(0 0 ${100 - (scrollProgress * 100)}% 0)`,
                }}
            >
                <img
                    src={getImagePath()}
                    alt="Japanese painting"
                    className="w-full h-full object-cover opacity-80"
                />
            </div>

            {/* Subtle gradient overlay for blend into background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#111]" />
        </div>
    )
}
