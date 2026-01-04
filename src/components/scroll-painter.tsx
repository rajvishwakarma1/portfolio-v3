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

    return (
        <div className="fixed left-0 top-0 h-screen z-40 hidden lg:block">
            {/* Progress line */}
            <div className="absolute left-0 top-0 w-0.5 h-full bg-neutral-800">
                <div
                    className="w-full bg-accent transition-all duration-150"
                    style={{ height: `${scrollProgress * 100}%` }}
                />
            </div>
        </div>
    )
}
