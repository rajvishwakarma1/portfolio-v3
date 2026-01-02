"use client"

import { useEffect } from "react"

interface UseDocumentTitleOptions {
    defaultTitle: string
    onBlurTitle: string
}

export function useDocumentTitle({
    defaultTitle,
    onBlurTitle,
}: UseDocumentTitleOptions) {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                document.title = onBlurTitle
            } else {
                document.title = defaultTitle
            }
        }

        document.title = defaultTitle
        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [defaultTitle, onBlurTitle])
}
