import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataPath = path.join(process.cwd(), "data", "tools.json")

interface Tool {
    name: string
    description: string
}

interface ToolsData {
    categories: {
        [key: string]: Tool[]
    }
}

function readData(): ToolsData {
    try {
        const data = fs.readFileSync(dataPath, "utf-8")
        return JSON.parse(data)
    } catch {
        return { categories: { development: [], design: [], productivity: [], hardware: [] } }
    }
}

function writeData(data: ToolsData) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
}

export async function GET() {
    const data = readData()
    return NextResponse.json(data.categories)
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { category, name, description } = body

    if (!category || !name) {
        return NextResponse.json({ error: "Category and name required" }, { status: 400 })
    }

    const data = readData()

    if (!data.categories[category]) {
        data.categories[category] = []
    }

    const newTool: Tool = { name, description: description || "" }
    data.categories[category].push(newTool)
    writeData(data)

    return NextResponse.json(newTool, { status: 201 })
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const name = searchParams.get("name")

    if (!category || !name) {
        return NextResponse.json({ error: "Category and name required" }, { status: 400 })
    }

    const data = readData()

    if (data.categories[category]) {
        data.categories[category] = data.categories[category].filter((tool: Tool) => tool.name !== name)
        writeData(data)
    }

    return NextResponse.json({ success: true })
}

export async function PUT(request: NextRequest) {
    const body = await request.json()
    const { category, originalName, name, description } = body

    if (!category || !originalName || !name) {
        return NextResponse.json({ error: "Category, originalName, and name required" }, { status: 400 })
    }

    const data = readData()

    if (!data.categories[category]) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const index = data.categories[category].findIndex((tool: Tool) => tool.name === originalName)
    if (index === -1) {
        return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    data.categories[category][index] = { name, description: description || "" }
    writeData(data)

    return NextResponse.json(data.categories[category][index])
}
