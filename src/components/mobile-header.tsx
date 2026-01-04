"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"

// Map paths to their initials
const pageInitials: { [key: string]: string } = {
    "/": "h",
    "/work": "w",
    "/blog": "b",
    "/projects": "p",
    "/tools": "t",
}

const navItems = [
    { href: "/", label: "home" },
    { href: "/work", label: "work" },
    { href: "/blog", label: "blog" },
    { href: "/projects", label: "projects" },
    { href: "/tools", label: "tools" },
]

export function MobileHeader() {
    const [isVisible, setIsVisible] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            // Show header after scrolling 100px
            setIsVisible(window.scrollY > 100)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close menu when navigating
    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isMenuOpen])

    // Get page initial - check for exact match first, then startsWith for detail pages
    const getPageInitial = () => {
        if (pageInitials[pathname || ""]) {
            return pageInitials[pathname || ""]
        }
        // Check for detail pages like /work/slug, /blog/slug, /projects/slug
        for (const [path, initial] of Object.entries(pageInitials)) {
            if (path !== "/" && pathname?.startsWith(path)) {
                return initial
            }
        }
        return "h"
    }

    // Hide on admin pages
    if (pathname?.startsWith("/admin")) {
        return null
    }

    return (
        <>
            {/* Sticky Header Bar */}
            <div
                className={`
                    fixed top-0 left-0 right-0 z-50 
                    lg:hidden
                    bg-neutral-900/95 backdrop-blur-sm
                    border-b border-neutral-800
                    px-4 py-3
                    flex items-center justify-between
                    transition-all duration-300
                    ${isVisible || isMenuOpen
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-full opacity-0 pointer-events-none"}
                `}
            >
                <span className="text-white font-medium text-sm">raj vishwakarma</span>
                <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm font-mono">[{getPageInitial()}]</span>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Fullscreen Menu Overlay */}
            <div
                className={`
                    fixed inset-0 z-40
                    lg:hidden
                    bg-neutral-900/98 backdrop-blur-md
                    transition-all duration-300 ease-out
                    ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
                `}
            >
                <nav className="flex flex-col justify-center h-full px-8 pt-16">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/" && pathname?.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    py-4 text-2xl font-medium
                                    transition-all duration-200
                                    ${isActive ? "text-accent" : "text-gray-400 hover:text-white"}
                                `}
                                style={{
                                    transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                                    transform: isMenuOpen ? "translateX(0)" : "translateX(-20px)",
                                    opacity: isMenuOpen ? 1 : 0,
                                }}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </>
    )
}
