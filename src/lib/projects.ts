import fs from "fs"
import path from "path"
import { unstable_noStore as noStore } from "next/cache"

export interface ProjectLink {
    label: string
    href: string
}

export interface ProjectItem {
    slug: string
    title: string
    role: string
    description: string
    longDescription: string
    href: string
    tags: string[]
    links: ProjectLink[]
    livePreviewUrl: string
    demoMedia: string // Uploaded demo media (GIF/SVG/MP4/WebM)
    youtubeUrl: string
    diagrams: string[]
}

const dataPath = path.join(process.cwd(), "data", "projects.json")

// Parse role string to get sortable value (present items first, then by date)
function getSortValue(role: string): number {
    const months: { [key: string]: number } = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    }
    const isPresent = role.toLowerCase().includes("present")
    const match = role.toLowerCase().match(/\((\w+)\s+(\d{4})/)
    if (match) {
        const month = months[match[1]] ?? 0
        const year = parseInt(match[2])
        const dateValue = year * 12 + month
        return isPresent ? dateValue + 100000 : dateValue
    }
    return 0
}

export function getProjects(): ProjectItem[] {
    noStore()
    try {
        const data = fs.readFileSync(dataPath, "utf-8")
        const items = JSON.parse(data).items as ProjectItem[]
        return items.sort((a, b) => getSortValue(b.role) - getSortValue(a.role))
    } catch {
        return []
    }
}

export function getProjectBySlug(slug: string): ProjectItem | undefined {
    noStore()
    const items = getProjects()
    return items.find((item) => item.slug === slug)
}

export function getAllProjectSlugs(): string[] {
    return getProjects().map((item) => item.slug)
}
