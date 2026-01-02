import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataPath = path.join(process.cwd(), "data", "projects.json")

function readData() {
    try {
        const data = fs.readFileSync(dataPath, "utf-8")
        return JSON.parse(data)
    } catch {
        return { items: [] }
    }
}

function writeData(data: any) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
}

// Sort by date (newest first)
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

export async function GET() {
    const data = readData()
    const sorted = data.items.sort((a: any, b: any) => getSortValue(b.role) - getSortValue(a.role))
    return NextResponse.json(sorted)
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const data = readData()

    const slug = body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const newItem = {
        slug,
        title: body.title,
        role: body.role,
        description: body.description,
        longDescription: body.longDescription || "",
        href: body.href || "",
        tags: body.tags || [],
        links: body.links || [],
        livePreviewUrl: body.livePreviewUrl || "",
        youtubeUrl: body.youtubeUrl || "",
        diagrams: body.diagrams || [],
    }

    data.items.push(newItem)
    writeData(data)

    return NextResponse.json(newItem, { status: 201 })
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
        return NextResponse.json({ error: "Slug required" }, { status: 400 })
    }

    const data = readData()
    data.items = data.items.filter((item: any) => item.slug !== slug)
    writeData(data)

    return NextResponse.json({ success: true })
}

export async function PUT(request: NextRequest) {
    const body = await request.json()
    const data = readData()

    const index = data.items.findIndex((item: any) => item.slug === body.slug)
    if (index === -1) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    data.items[index] = { ...data.items[index], ...body }
    writeData(data)

    return NextResponse.json(data.items[index])
}
