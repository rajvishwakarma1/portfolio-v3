"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"

interface Project {
    slug: string
    title: string
}

export function ProjectsNav() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isHovered, setIsHovered] = useState(false)
    const [activeProject, setActiveProject] = useState<string | null>(null)
    const pathname = usePathname()
    const isClickScrolling = useRef(false)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = useCallback(() => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
        }
        setIsHovered(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(false)
        }, 150)
    }, [])

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/projects")
                const data = await res.json()
                setProjects(data)
                // Set first project as active initially
                if (data.length > 0) {
                    setActiveProject(data[0].slug)
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error)
            }
        }

        fetchProjects()
    }, [])

    // Reset to first project when pathname changes
    useEffect(() => {
        if (projects.length > 0) {
            setActiveProject(projects[0].slug)
        }
    }, [pathname, projects])

    // Detect which project is currently visible on scroll
    useEffect(() => {
        if (pathname !== "/projects" || projects.length === 0) return

        const handleScroll = () => {
            // Skip detection while click-scrolling
            if (isClickScrolling.current) return

            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight

            // If at very bottom of page, select last project
            if (window.scrollY + windowHeight >= documentHeight - 10) {
                if (projects.length > 0) {
                    setActiveProject(projects[projects.length - 1].slug)
                }
                return
            }

            // Find the project in the top half of viewport
            for (let i = projects.length - 1; i >= 0; i--) {
                const project = projects[i]
                const element = document.getElementById(project.slug)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    if (rect.top <= windowHeight / 2) {
                        setActiveProject(project.slug)
                        return
                    }
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        handleScroll()

        return () => window.removeEventListener("scroll", handleScroll)
    }, [projects, pathname])

    const scrollToProject = (slug: string) => {
        const element = document.getElementById(slug)
        if (element) {
            // Set active project immediately when clicking
            setActiveProject(slug)

            // Pause scroll detection during animation
            isClickScrolling.current = true

            // Calculate position to center the element in viewport
            const elementRect = element.getBoundingClientRect()
            const absoluteElementTop = elementRect.top + window.scrollY
            const middleOffset = window.innerHeight / 2 - elementRect.height / 2
            const scrollPosition = absoluteElementTop - middleOffset

            // Scroll to center (but don't scroll past top)
            window.scrollTo({
                top: Math.max(0, scrollPosition),
                behavior: "smooth"
            })

            // Add highlight class temporarily
            const card = element.querySelector(".project-card")
            if (card) {
                card.classList.add("project-highlight")
                setTimeout(() => {
                    card.classList.remove("project-highlight")
                }, 2000)
            }

            // Resume scroll detection after animation completes
            setTimeout(() => {
                isClickScrolling.current = false
            }, 1000)
        }
    }

    // Only show on /projects page (not detail pages)
    if (pathname !== "/projects") {
        return null
    }

    return (
        <div
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:flex items-center pr-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Expanded menu - absolutely positioned */}
            <div
                className={`
          absolute right-full mr-4 top-1/2 -translate-y-1/2
          bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 rounded-lg
          py-3 px-4 min-w-[120px]
          transition-all duration-300 ease-out
          ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}
        `}
            >
                {projects.map((project) => (
                    <button
                        key={project.slug}
                        onClick={() => scrollToProject(project.slug)}
                        className={`
              block w-full text-left text-sm py-1.5 transition-colors duration-200
              ${activeProject === project.slug ? "text-accent" : "text-gray-400 hover:text-white"}
            `}
                    >
                        {project.title}
                    </button>
                ))}
            </div>

            {/* Indicator bars */}
            <div className="flex flex-col gap-2 items-end">
                {projects.map((project) => (
                    <button
                        key={project.slug}
                        onClick={() => scrollToProject(project.slug)}
                        className={`
              h-0.5 rounded-full transition-all duration-300
              ${activeProject === project.slug
                                ? "w-6 bg-accent"
                                : "w-3 bg-neutral-600 hover:bg-neutral-400"
                            }
            `}
                        aria-label={`Scroll to ${project.title}`}
                    />
                ))}
            </div>
        </div>
    )
}
