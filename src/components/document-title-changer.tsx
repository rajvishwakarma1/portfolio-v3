"use client"

import { useDocumentTitle } from "@/hooks/use-document-title"

export function DocumentTitleChanger() {
    useDocumentTitle({
        defaultTitle: "Raj Vishwakarma",
        onBlurTitle: "Where ya going?",
    })

    return null
}
