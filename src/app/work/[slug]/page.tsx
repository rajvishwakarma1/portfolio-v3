import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { notFound } from "next/navigation"
import { getWorkBySlug, getAllWorkSlugs } from "@/lib/work"

export function generateStaticParams() {
    return getAllWorkSlugs().map((slug) => ({ slug }))
}

export default async function WorkPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const work = getWorkBySlug(slug)

    if (!work) {
        notFound()
    }

    return (
        <div className="animate-fade-in">
            {/* Back link */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors duration-200 mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                back to work
            </Link>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    {work.logo ? (
                        <img src={work.logo} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                        <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-lg font-bold text-white">
                            {work.title.charAt(0).toUpperCase()}
                        </div>
                    )}
                    {work.href ? (
                        <Link href={work.href} target="_blank" className="group">
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2 group-hover:text-accent transition-colors">
                                {work.title}
                                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
                            </h1>
                        </Link>
                    ) : (
                        <h1 className="text-3xl font-bold text-white">{work.title}</h1>
                    )}
                </div>

                <p className="text-gray-400 mb-4">
                    {work.role} • {work.period}
                </p>

                <p className="text-gray-300 mb-6">{work.longDescription}</p>

                {/* Tags */}
                {work.tags && work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {work.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-sm bg-neutral-800 text-gray-400 rounded-md"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Projects */}
            {work.projects && work.projects.length > 0 && (
                <div className="space-y-8">
                    {work.projects.map((project, index) => (
                        <div key={index} className="border-t border-neutral-800 pt-8">
                            {/* Project links */}
                            {project.links && project.links.length > 0 && (
                                <div className="flex flex-wrap gap-3 mb-6">
                                    {project.links.map((link, linkIndex) => (
                                        <Link
                                            key={linkIndex}
                                            href={link.href}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-800 text-gray-400 hover:text-accent hover:border-accent transition-all duration-200"
                                        >
                                            {link.label}
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Bullets */}
                            {project.bullets && project.bullets.length > 0 && (
                                <ul className="space-y-3">
                                    {project.bullets.map((bullet, bulletIndex) => (
                                        <li
                                            key={bulletIndex}
                                            className="flex items-start gap-3 text-gray-300"
                                        >
                                            <span className="text-accent mt-1.5">•</span>
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
