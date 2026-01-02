import fs from "fs"
import path from "path"
import { unstable_noStore as noStore } from "next/cache"

export interface LinkItem {
    title: string
    href: string
}

const dataPath = path.join(process.cwd(), "data", "links.json")

export function getLinks(): LinkItem[] {
    noStore()
    try {
        const data = fs.readFileSync(dataPath, "utf-8")
        return JSON.parse(data).items
    } catch {
        return []
    }
}
