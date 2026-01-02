import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataPath = path.join(process.cwd(), "data", "links.json")

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

export async function GET() {
    const data = readData()
    return NextResponse.json(data.items)
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const data = readData()

    const newItem = {
        title: body.title,
        href: body.href,
    }

    data.items.push(newItem)
    writeData(data)

    return NextResponse.json(newItem, { status: 201 })
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get("title")

    if (!title) {
        return NextResponse.json({ error: "Title required" }, { status: 400 })
    }

    const data = readData()
    data.items = data.items.filter((item: any) => item.title !== title)
    writeData(data)

    return NextResponse.json({ success: true })
}

export async function PUT(request: NextRequest) {
    const body = await request.json()
    const data = readData()

    const index = data.items.findIndex((item: any) => item.title === body.originalTitle)
    if (index === -1) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    data.items[index] = { title: body.title, href: body.href }
    writeData(data)

    return NextResponse.json(data.items[index])
}
