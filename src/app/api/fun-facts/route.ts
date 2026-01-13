import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const DATA_PATH = path.join(process.cwd(), "src/lib/fun-facts.json")

export async function GET() {
    try {
        const data = await fs.readFile(DATA_PATH, "utf-8")
        return NextResponse.json(JSON.parse(data))
    } catch {
        return NextResponse.json({ funFacts: [] }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        await fs.writeFile(DATA_PATH, JSON.stringify(body, null, 2))
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: "Failed to save" }, { status: 500 })
    }
}
