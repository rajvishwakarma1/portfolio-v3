import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataPath = path.join(process.cwd(), "data", "work.json")

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

// GET all work items
export async function GET() {
    const data = readData()
    return NextResponse.json(data.items)
}

// POST new work item
export async function POST(request: NextRequest) {
    const body = await request.json()
    const data = readData()

    // Generate slug from title
    const slug = body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const newItem = {
        slug,
        title: body.title,
        href: body.href || "",
        logo: body.logo || "",
        role: body.role,
        period: body.period,
        description: body.description,
        longDescription: body.longDescription || body.description,
        tags: body.tags || [],
        projects: body.projects || [],
    }

    data.items.push(newItem)
    writeData(data)

    return NextResponse.json(newItem, { status: 201 })
}

// DELETE work item
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

// PUT update work item
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
