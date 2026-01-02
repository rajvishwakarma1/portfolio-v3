import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const postsDir = path.join(process.cwd(), "posts")

// GET all blog posts (from MDX files)
export async function GET() {
    try {
        const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".mdx"))
        const posts = files.map(file => {
            const content = fs.readFileSync(path.join(postsDir, file), "utf-8")
            const slug = file.replace(".mdx", "")

            // Parse frontmatter
            const frontmatterMatch = content.match(/---\s*([\s\S]*?)\s*---/)
            let title = slug
            let date = ""

            if (frontmatterMatch) {
                const lines = frontmatterMatch[1].split("\n")
                for (const line of lines) {
                    const [key, ...values] = line.split(": ")
                    const value = values.join(": ").replace(/^['"]|['"]$/g, "").trim()
                    if (key?.trim() === "title") title = value
                    if (key?.trim() === "date") date = value
                }
            }

            return { slug, title, date, filename: file }
        })

        // Sort by date (newest first)
        posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        return NextResponse.json(posts)
    } catch {
        return NextResponse.json([])
    }
}

// DELETE a blog post (removes MDX file)
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
        return NextResponse.json({ error: "Slug required" }, { status: 400 })
    }

    const filepath = path.join(postsDir, `${slug}.mdx`)

    if (!fs.existsSync(filepath)) {
        return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    fs.unlinkSync(filepath)

    return NextResponse.json({ success: true })
}
