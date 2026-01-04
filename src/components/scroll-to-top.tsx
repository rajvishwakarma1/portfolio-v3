"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
    const pathname = usePathname()

    // Disable browser's automatic scroll restoration
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.history.scrollRestoration = "manual"
        }
    }, [])

    // Scroll to top on route change
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Force scroll to very top
            window.scrollTo({ top: 0, left: 0, behavior: "instant" })
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
        }
    }, [pathname])

    return null
}
