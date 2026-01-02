"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Volume2, VolumeX } from "lucide-react"

export function AmbientAudio() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)
    const pathname = usePathname()

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.15 // Very subtle volume
            audioRef.current.loop = true
            setIsLoaded(true)
        }
    }, [])

    const toggleAudio = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play().catch(() => {
                // Autoplay was prevented
                console.log("Audio autoplay prevented")
            })
        }
        setIsPlaying(!isPlaying)
    }

    // Hide on admin pages
    if (pathname?.startsWith("/admin")) {
        return null
    }

    return (
        <>
            {/* Hidden audio element - using a free ambient zen music */}
            <audio
                ref={audioRef}
                src="/ambient.mp3"
                preload="none"
            />

            {/* Floating audio control button */}
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
                    <>
                        <Volume2 className="w-4 h-4" />
                        {/* <span className="text-xs"></span> */}
                    </>
                ) : (
                    <>
                        <VolumeX className="w-4 h-4" />
                        {/* <span className="text-xs"></span> */}
                    </>
                )}
            </button>
        </>
    )
}
