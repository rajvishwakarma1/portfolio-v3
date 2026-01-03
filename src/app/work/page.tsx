import { ScrambleText } from "@/components/scramble-text"
import Link from "next/link"
import { Metadata } from "next"
import { getWorkItems } from "@/lib/work"

export default function WorkPage() {
    const workItems = getWorkItems()

    return (
        <main className="animate-fade-in-up">
            <h1 className="text-4xl font-bold mb-8 text-white">
                <span className="text-accent mr-2">*</span>
                <ScrambleText text="work" />
            </h1>

            <p className="text-gray-400 mb-12 leading-relaxed">
                here&apos;s my professional experience and the companies i&apos;ve had the
                opportunity to work with.
            </p>

            <div className="space-y-12">
                {workItems.map((item) => (
                    <div key={item.slug} id={item.slug} className="group">
                        <Link href={`/work/${item.slug}`}>
                            <div className="border border-neutral-800 rounded-lg p-6 hover:border-accent/50 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    {item.logo ? (
                                        <img
                                            src={item.logo}
                                            alt=""
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-lg font-bold text-white shrink-0">
                                            {item.title.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-white group-hover:text-accent transition-colors duration-200">
                                            {item.title}
                                        </h2>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {item.role} • {item.period}
                                        </p>
                                        <p className="text-gray-300 mt-3">{item.description}</p>
                                        {item.tags && item.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {item.tags.slice(0, 5).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 text-xs bg-neutral-800 text-gray-400 rounded"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    )
}

export const metadata: Metadata = {
    title: "Work",
    description: "My professional experience and companies I've worked with.",
    openGraph: {
        images: [
            {
                url: "https://www.rajvishwakarma.dev/og/home?title=work",
            },
        ],
    },
}
