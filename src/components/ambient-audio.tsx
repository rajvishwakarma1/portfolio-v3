"use client"

import { usePathname } from "next/navigation"
import { Volume2, VolumeX } from "lucide-react"
import { useAudio } from "./audio-context"

export function AmbientAudio() {
    const { isPlaying, toggleAudio } = useAudio()
    const pathname = usePathname()

    // Hide on admin pages
    if (pathname?.startsWith("/admin")) {
        return null
    }

    return (
        <button
            onClick={toggleAudio}
            className={`
                fixed bottom-6 right-6 z-50 hidden lg:flex
                items-center gap-2 px-3 py-2
                bg-neutral-900/80 backdrop-blur-sm
                border border-neutral-800 rounded-full
                text-sm transition-all duration-300
                hover:border-accent hover:text-accent
                ${isPlaying ? "text-accent border-accent" : "text-gray-400"}
            `}
            aria-label={isPlaying ? "Mute ambient music" : "Play ambient music"}
        >
            {isPlaying ? (
                <Volume2 className="w-4 h-4" />
            ) : (
                <VolumeX className="w-4 h-4" />
            )}
        </button>
    )
}
