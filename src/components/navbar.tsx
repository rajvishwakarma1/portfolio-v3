"use client"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navItems = [
    { href: "/", label: "home", key: "h" },
    { href: "/blog", label: "blog", key: "b" },
    { href: "/projects", label: "projects", key: "p" },
    { href: "/tools", label: "tools", key: "t" },
]

export function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const [isHovered, setIsHovered] = useState(false)

    // Determine active page
    const isActive = (href: string) => {
        if (href === "/") return pathname === "/"
        return pathname?.startsWith(href)
    }

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Don't trigger if any input elements are focused or if event target is an input
            if (
                document.activeElement?.tagName === "INPUT" ||
                document.activeElement?.tagName === "TEXTAREA" ||
                event.target instanceof HTMLInputElement
            ) {
                return
            }

            const item = navItems.find(i => i.key === event.key.toLowerCase())
            if (item) router.push(item.href)
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [router])

    // Hide on admin and dashboard pages
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
        return null
    }

    return (
        <>
            <style jsx>{`
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
                .cursor-blink {
                    animation: blink 1s infinite;
                }
                .nav-label {
                    display: inline-block;
                    max-width: 0;
                    overflow: hidden;
                    white-space: nowrap;
                    transition: max-width 0.3s ease-out;
                }
                .nav-label.expanded {
                    max-width: 100px;
                }
            `}</style>
            <nav
                className="flex items-center justify-between mb-12 text-sm"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center space-x-4">
                    {navItems.map((item) => {
                        const active = isActive(item.href)
                        const showExpanded = active || isHovered

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch={item.href === "/blog"}
                                className="hover:text-accent transition-colors duration-200 flex items-center"
                            >
                                <span className="text-gray-500">[</span>
                                <span>{item.key}</span>
                                <span className="text-gray-500">]</span>
                                <span className={`nav-label ${showExpanded ? 'expanded' : ''}`}>
                                    &nbsp;{item.label}
                                </span>
                                {active && (
                                    <span className="cursor-blink text-white">|</span>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}