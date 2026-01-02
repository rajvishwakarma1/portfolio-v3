import fs from "fs"
import path from "path"
import { unstable_noStore as noStore } from "next/cache"

export interface WorkProject {
    title: string
    links?: { label: string; href: string }[]
    bullets: string[]
}

export interface WorkItem {
    slug: string
    title: string
    href: string
    logo?: string
    role: string
    period: string
    description: string
    longDescription: string
    tags: string[]
    projects?: WorkProject[]
}

const dataPath = path.join(process.cwd(), "data", "work.json")

// Parse period string to get sortable value (present items first, then by date)
function getSortValue(period: string): number {
    const months: { [key: string]: number } = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    }
    const isPresent = period.toLowerCase().includes("present")
    const match = period.toLowerCase().match(/(\w+)\s+(\d{4})/)
    if (match) {
        const month = months[match[1]] ?? 0
        const year = parseInt(match[2])
        const dateValue = year * 12 + month
        return isPresent ? dateValue + 100000 : dateValue
    }
    return 0
}

export function getWorkItems(): WorkItem[] {
    noStore() // Disable caching to always read fresh data
    try {
        const data = fs.readFileSync(dataPath, "utf-8")
        const items = JSON.parse(data).items as WorkItem[]
        // Sort: present items first, then by start date (latest first)
        return items.sort((a, b) => getSortValue(b.period) - getSortValue(a.period))
    } catch {
        return []
    }
}

export function getWorkBySlug(slug: string): WorkItem | undefined {
    noStore()
    const items = getWorkItems()
    return items.find((item) => item.slug === slug)
}

export function getAllWorkSlugs(): string[] {
    noStore()
    const items = getWorkItems()
    return items.map((item) => item.slug)
}
