"use client"

import { GitHubCalendar } from "react-github-calendar"
import { useEffect, useState } from "react"

interface GitHubContributionsProps {
    username: string
}

export function GitHubContributions({ username }: GitHubContributionsProps) {
    const currentYear = new Date().getFullYear()
    const [blockSize, setBlockSize] = useState(12)

    useEffect(() => {
        const updateBlockSize = () => {
            setBlockSize(window.innerWidth < 640 ? 10 : 12)
        }
        updateBlockSize()
        window.addEventListener("resize", updateBlockSize)
        return () => window.removeEventListener("resize", updateBlockSize)
    }, [])

    return (
        <section className="my-6 sm:my-8">
            <div className="github-calendar-container overflow-x-auto pb-2">
                <GitHubCalendar
                    username={username}
                    colorScheme="dark"
                    blockSize={blockSize}
                    blockMargin={4}
                    fontSize={12}
                    year={currentYear}
                    showColorLegend={false}
                    style={{
                        color: "#9ca3af",
                    }}
                    theme={{
                        dark: [
                            "#161b22",
                            "#0e4429",
                            "#006d32",
                            "#26a641",
                            "#39d353",
                        ],
                    }}
                    labels={{
                        totalCount: "{{count}} contributions in {{year}}",
                    }}
                />
            </div>
        </section>
    )
}
