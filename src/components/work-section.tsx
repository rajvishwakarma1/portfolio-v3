import Link from "next/link"
import { Briefcase } from "lucide-react"
import { getWorkItems } from "@/lib/work"

export function WorkSection() {
    const workItems = getWorkItems()

    return (
        <section id="work" className="mb-16 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
                <Briefcase className="w-5 h-5 mr-2" /> work
            </h2>
            <div className="space-y-8">
                {workItems.map((item) => (
                    <div key={item.slug} className="group">
                        <Link href={`/work/${item.slug}`}>
                            <h3 className="text-xl font-semibold mb-1 text-white group-hover:text-accent transition-colors duration-200">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-2">
                                {item.role} ({item.period})
                            </p>
                            <p className="text-gray-300">{item.description}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
