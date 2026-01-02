import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const ext = file.name.split(".").pop()
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
        const filepath = path.join(process.cwd(), "public", "logos", filename)

        fs.writeFileSync(filepath, buffer)

        return NextResponse.json({ url: `/logos/${filename}` })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}
