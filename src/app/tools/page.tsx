import { Monitor, Code, Terminal, Palette, Globe, Headphones, Coffee } from "lucide-react"
import fs from "fs"
import path from "path"
import { ScrambleText } from "@/components/scramble-text"

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "tools | raj vishwakarma",
    description: "the tools, apps, and gear i use daily to build and create.",
}

interface Tool {
    name: string
    description: string
}

interface ToolsData {
    categories: {
        development: Tool[]
        design: Tool[]
        productivity: Tool[]
        hardware: Tool[]
    }
}

function getTools(): ToolsData {
    try {
        const dataPath = path.join(process.cwd(), "data", "tools.json")
        const data = fs.readFileSync(dataPath, "utf-8")
        return JSON.parse(data)
    } catch {
        return {
            categories: {
                development: [],
                design: [],
                productivity: [],
                hardware: [],
            },
        }
    }
}

const categoryIcons: { [key: string]: any } = {
    development: Code,
    design: Palette,
    productivity: Coffee,
    hardware: Monitor,
}

export default function ToolsPage() {
    const { categories } = getTools()

    return (
        <div className="animate-fade-in-up">
            <header id="tools-intro" className="mb-8 sm:mb-12">
                <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-white">
                    <ScrambleText text="tools" />
                </h1>
                <p className="text-gray-400 leading-relaxed">
                    the apps, services, and gear i use daily to build products and stay productive.
                    nothing fancy, just stuff that works for me.
                </p>
            </header>

            <div className="space-y-12">
                {Object.entries(categories).map(([category, tools]) => {
                    const Icon = categoryIcons[category] || Code
                    return (
                        <section key={category} id={category}>
                            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white">{category}</h2>
                            <div className="grid gap-3 sm:gap-4">
                                {tools.map((tool) => (
                                    <div key={tool.name} className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-neutral-800 hover:border-accent/50 transition-colors duration-200">
                                        <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <h3 className="text-white font-medium group-hover:text-accent transition-colors duration-200">{tool.name}</h3>
                                            <p className="text-gray-400 text-sm">{tool.description}</p>
                                        </div>
                                    </div>
                                ))}
                                {tools.length === 0 && (
                                    <p className="text-gray-500 text-sm">no tools added yet</p>
                                )}
                            </div>
                        </section>
                    )
                })}
            </div>
        </div>
    )
}
