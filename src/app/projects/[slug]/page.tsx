import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, Maximize2 } from "lucide-react"
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects"
import { Metadata } from "next"

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const slugs = getAllProjectSlugs()
    return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const project = getProjectBySlug(slug)
    if (!project) return { title: "Project Not Found" }

    return {
        title: project.title,
        description: project.description,
    }
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params
    const project = getProjectBySlug(slug)

    if (!project) {
        notFound()
    }

    // Parse role to extract clean role and period
    const roleMatch = project.role.match(/^(.+?)\s*\((.+)\)$/)
    const cleanRole = roleMatch ? roleMatch[1].trim() : project.role
    const period = roleMatch ? roleMatch[2].trim() : ""

    // Extract YouTube video ID
    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?/]+)/)
        return match ? match[1] : null
    }

    const youtubeId = project.youtubeUrl ? getYouTubeId(project.youtubeUrl) : null

    return (
        <div className="animate-fade-in">
            {/* Back link */}
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors duration-200 mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                back to projects
            </Link>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-lg font-bold text-white">
                        {project.title.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        {project.title}
                        {project.href && (
                            <Link href={project.href} target="_blank">
                                <ExternalLink className="w-5 h-5 text-gray-400 hover:text-accent transition-colors" />
                            </Link>
                        )}
                    </h1>
                </div>

                <p className="text-gray-400 mb-4">
                    {cleanRole} {period && `• ${period}`}
                </p>

                <p className="text-gray-300 mb-6">{project.longDescription || project.description}</p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-sm bg-neutral-800 text-gray-400 rounded-md"
                            >
                                {tag.toLowerCase()}
                            </span>
                        ))}
                    </div>
                )}

                {/* Links */}
                {project.links && project.links.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                        {project.links.map((link) => (
                            <Link
                                key={link.label}
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
            </div>

            {/* Live Preview */}
            {project.livePreviewUrl && (
                <div className="border-t border-neutral-800 pt-8 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">live preview</h2>
                        <div className="flex items-center gap-2">
                            <Link
                                href={project.livePreviewUrl}
                                target="_blank"
                                className="p-2 text-gray-400 hover:text-accent transition-colors"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </Link>
                            <Link
                                href={project.livePreviewUrl}
                                target="_blank"
                                className="p-2 text-gray-400 hover:text-accent transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="relative w-full aspect-video border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
                        <iframe
                            src={project.livePreviewUrl}
                            className="w-full h-full"
                            title="Live Preview"
                            sandbox="allow-scripts allow-same-origin"
                        />
                    </div>
                </div>
            )}

            {/* YouTube Video */}
            {youtubeId && (
                <div className="border-t border-neutral-800 pt-8 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">video</h2>
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        <iframe
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            className="w-full h-full"
                            title="YouTube video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            {/* Diagrams */}
            {project.diagrams && project.diagrams.length > 0 && (
                <div className="border-t border-neutral-800 pt-8">
                    <h2 className="text-xl font-bold text-white mb-4">diagrams</h2>
                    <div className="space-y-6">
                        {project.diagrams.map((diagram, index) => (
                            <div key={index} className="border border-neutral-800 rounded-lg overflow-hidden">
                                <img
                                    src={diagram}
                                    alt={`Diagram ${index + 1}`}
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
