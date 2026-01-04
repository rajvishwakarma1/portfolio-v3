"use client"

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react"

interface AudioContextType {
    isPlaying: boolean
    toggleAudio: () => void
}

const AudioContext = createContext<AudioContextType | null>(null)

export function useAudio() {
    const context = useContext(AudioContext)
    if (!context) {
        throw new Error("useAudio must be used within AudioProvider")
    }
    return context
}

export function AudioProvider({ children }: { children: ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(true)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        // Create audio element
        const audio = new Audio("/ambient.mp3")
        audio.volume = 0.15
        audio.loop = true
        audioRef.current = audio

        // Attempt autoplay
        audio.play().catch(() => {
            setIsPlaying(false)
        })

        return () => {
            audio.pause()
            audio.src = ""
        }
    }, [])

    const toggleAudio = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play().catch(() => {
                console.log("Audio autoplay prevented")
            })
        }
        setIsPlaying(!isPlaying)
    }

    return (
        <AudioContext.Provider value={{ isPlaying, toggleAudio }}>
            {children}
        </AudioContext.Provider>
    )
}
