"use client"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navItems = [
    { href: "/", label: "home", key: "h" },
    { href: "/work", label: "work", key: "w" },
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
            // Don't trigger if any input elements are focused
            if (
                document.activeElement?.tagName === "INPUT" ||
                document.activeElement?.tagName === "TEXTAREA" ||
                (document.activeElement as HTMLElement)?.isContentEditable
            ) {
                return
            }

            // Ignore if modifier keys are pressed
            if (event.ctrlKey || event.metaKey || event.altKey) return

            const pressedKey = event.key.toLowerCase()
            const item = navItems.find(i => i.key === pressedKey)

            if (item) {
                event.preventDefault()
                router.push(item.href)
            }
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
                /* Desktop styles (default) */
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
                
                /* Mobile & Tablet styles */
                @media (max-width: 1023px) {
                    .nav-key-bracket {
                        display: none !important;
                    }
                    .cursor-blink {
                        display: none !important;
                    }
                    .nav-label {
                        max-width: none !important;
                        overflow: visible !important;
                    }
                    .nav-link {
                        padding-bottom: 2px;
                    }
                    .nav-link-active {
                        border-bottom: 1px solid currentColor;
                    }
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
                                prefetch={true}
                                className={`hover:text-accent transition-colors duration-200 flex items-center nav-link ${active ? 'nav-link-active' : ''}`}
                            >
                                <span className="text-gray-500 nav-key-bracket">[</span>
                                <span className="nav-key-bracket">{item.key}</span>
                                <span className="text-gray-500 nav-key-bracket">]</span>
                                <span className={`nav-label ${showExpanded ? 'expanded' : ''}`}>
                                    <span className="hidden lg:inline">&nbsp;</span>{item.label}
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