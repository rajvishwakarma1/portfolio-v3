"use client"

import { useState } from "react"
import { useScramble } from "use-scramble"

export function ScrambleTextHover({
    text,
    hoverText,
    className = "",
    speed = 0.5,
    tick = 1,
    step = 1,
    scramble = 5,
    seed = 3,
}: {
    text: string
    hoverText: string
    className?: string
    speed?: number
    tick?: number
    step?: number
    scramble?: number
    seed?: number
}) {
    const [isHovered, setIsHovered] = useState(false)

    const { ref } = useScramble({
        text: isHovered ? hoverText : text,
        speed,
        tick,
        step,
        scramble,
        seed,
        overdrive: true,
    })

    return (
        <span
            className={className}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ cursor: "pointer", display: "inline-block", minWidth: `${text.length}ch` }}
        >
            <span ref={ref} />
        </span>
    )
}
