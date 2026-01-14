"use client"

import { useState, useEffect, useRef } from "react"

export function SelectionHint() {
    const [showHint, setShowHint] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [shiftHeld, setShiftHeld] = useState(false)
    const isDraggingRef = useRef(false)
    const startPosRef = useRef({ x: 0, y: 0 })
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastHintTimeRef = useRef(0)

    // Control user-select based on shift key
    useEffect(() => {
        const updateBodySelect = (enable: boolean) => {
            document.body.style.userSelect = enable ? "auto" : "none"
            document.body.style.webkitUserSelect = enable ? "auto" : "none"
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Shift") {
                setShiftHeld(true)
                updateBodySelect(true)
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Shift") {
                setShiftHeld(false)
                updateBodySelect(false)
            }
        }

        // Initialize with selection disabled
        updateBodySelect(false)

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
            updateBodySelect(true) // Reset on unmount
        }
    }, [])

    // Detect drag attempts when shift is not held
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0 && !e.shiftKey) {
                isDraggingRef.current = true
                startPosRef.current = { x: e.clientX, y: e.clientY }
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current || e.shiftKey) return

            const dx = Math.abs(e.clientX - startPosRef.current.x)
            const dy = Math.abs(e.clientY - startPosRef.current.y)
            const distance = Math.sqrt(dx * dx + dy * dy)

            const now = Date.now()
            if (distance > 20 && now - lastHintTimeRef.current > 3000) {
                lastHintTimeRef.current = now
                setPosition({ x: e.clientX, y: e.clientY })
                setShowHint(true)

                if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current)
                }

                hideTimeoutRef.current = setTimeout(() => {
                    setShowHint(false)
                }, 2000)
            }
        }

        const handleMouseUp = () => {
            isDraggingRef.current = false
        }

        document.addEventListener("mousedown", handleMouseDown)
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)

        return () => {
            document.removeEventListener("mousedown", handleMouseDown)
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current)
            }
        }
    }, [])

    if (!showHint) return null

    return (
        <div
            className="fixed z-[9999] pointer-events-none animate-fade-in"
            style={{
                left: position.x + 12,
                top: position.y + 4,
            }}
        >
            <span className="text-[11px] text-gray-500 font-mono bg-[#111]/90 px-1.5 py-0.5">
                [shift+drag]
            </span>
        </div>
    )
}
