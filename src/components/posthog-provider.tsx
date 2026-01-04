"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense, useState } from "react"

function PostHogPageView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const posthog = usePostHog()

    useEffect(() => {
        if (pathname && posthog) {
            let url = window.origin + pathname
            if (searchParams.toString()) {
                url = url + "?" + searchParams.toString()
            }
            posthog.capture("$pageview", { $current_url: url })
        }
    }, [pathname, searchParams, posthog])

    return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        if (typeof window !== "undefined" && !posthog.__loaded) {
            const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
            const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

            if (key) {
                posthog.init(key, {
                    api_host: host,
                    person_profiles: "identified_only",
                    capture_pageview: false,
                    capture_pageleave: true,
                    loaded: (posthog) => {
                        if (process.env.NODE_ENV === "development") {
                            console.log("PostHog initialized successfully")
                        }
                    },
                })
                setIsInitialized(true)
            } else {
                console.warn("PostHog key not found in environment variables")
            }
        } else if (posthog.__loaded) {
            setIsInitialized(true)
        }
    }, [])

    return (
        <PHProvider client={posthog}>
            {isInitialized && (
                <Suspense fallback={null}>
                    <PostHogPageView />
                </Suspense>
            )}
            {children}
        </PHProvider>
    )
}
