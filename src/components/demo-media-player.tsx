"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"

interface DemoMediaPlayerProps {
    src: string
    className?: string
}

export function DemoMediaPlayer({ src, className = "" }: DemoMediaPlayerProps) {
    const [isMuted, setIsMuted] = useState(true)
    const [hasAudio, setHasAudio] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Determine media type from URL
    const isVideo = /\.(mp4|webm)$/i.test(src)
    const isSvg = /\.svg$/i.test(src)

    useEffect(() => {
        // Check if video has audio tracks
        if (isVideo && videoRef.current) {
            const video = videoRef.current as HTMLVideoElement & {
                mozHasAudio?: boolean
                webkitAudioDecodedByteCount?: number
                audioTracks?: { length: number }
            }
            const checkAudio = () => {
                // Check for audio tracks in the video
                if (video.mozHasAudio !== undefined) {
                    setHasAudio(video.mozHasAudio)
                } else if (video.webkitAudioDecodedByteCount !== undefined) {
                    setHasAudio(video.webkitAudioDecodedByteCount > 0)
                } else if (video.audioTracks !== undefined) {
                    setHasAudio(video.audioTracks.length > 0)
                } else {
                    // Fallback: assume MP4 might have audio
                    setHasAudio(/\.mp4$/i.test(src))
                }
            }
            video.addEventListener("loadedmetadata", checkAudio)
            return () => video.removeEventListener("loadedmetadata", checkAudio)
        }
    }, [src, isVideo])

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    if (isVideo) {
        return (
            <div className={`relative ${className}`}>
                <video
                    ref={videoRef}
                    src={src}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-contain"
                />
                {hasAudio && (
                    <button
                        onClick={toggleMute}
                        className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors"
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                        ) : (
                            <Volume2 className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
        )
    }

    // For SVG - use iframe to contain the animation and add cache-busting to restart
    if (isSvg) {
        return (
            <SvgLooper src={src} className={className} />
        )
    }

    return (
        <img
            src={src}
            alt="Demo"
            className={`w-full h-full object-contain ${className}`}
        />
    )
}

// SvgLooper component - reloads SVG after animation to create loop effect
function SvgLooper({ src, className = "" }: { src: string; className?: string }) {
    const [key, setKey] = useState(0)
    const objectRef = useRef<HTMLObjectElement>(null)

    useEffect(() => {
        // Check when SVG animation ends and restart it
        const checkAnimationEnd = () => {
            const obj = objectRef.current
            if (!obj) return

            try {
                const svgDoc = obj.contentDocument
                if (!svgDoc) return

                const svg = svgDoc.querySelector("svg")
                if (!svg) return

                // Listen for animation end on all animated elements
                const animatedElements = svgDoc.querySelectorAll("[style*='animation'], animate, animateTransform, animateMotion")

                if (animatedElements.length === 0) {
                    // No CSS animations found, try to detect SVG animation duration from SMIL
                    const smilElements = svgDoc.querySelectorAll("animate, animateTransform, animateMotion, set")
                    let maxDuration = 0

                    smilElements.forEach((el) => {
                        const dur = el.getAttribute("dur")
                        if (dur) {
                            const match = dur.match(/(\d+\.?\d*)(s|ms)?/)
                            if (match) {
                                let duration = parseFloat(match[1])
                                if (match[2] === "ms") duration /= 1000
                                maxDuration = Math.max(maxDuration, duration)
                            }
                        }
                    })

                    if (maxDuration > 0) {
                        // Restart after the animation duration
                        setTimeout(() => setKey(k => k + 1), maxDuration * 1000 + 100)
                    }
                } else {
                    // Listen for CSS animation end
                    animatedElements.forEach((el) => {
                        el.addEventListener("animationend", () => {
                            setKey(k => k + 1)
                        }, { once: true })
                    })
                }
            } catch {
                // Cross-origin SVG, can't access content - just reload after a delay
                // Default to 5 second animation duration
                setTimeout(() => setKey(k => k + 1), 5000)
            }
        }

        const obj = objectRef.current
        if (obj) {
            obj.addEventListener("load", checkAnimationEnd)
            return () => obj.removeEventListener("load", checkAnimationEnd)
        }
    }, [key])

    return (
        <object
            key={key}
            ref={objectRef}
            data={src}
            type="image/svg+xml"
            className={`w-full h-full ${className}`}
        >
            <img src={src} alt="Demo" className="w-full h-full object-contain" />
        </object>
    )
}
