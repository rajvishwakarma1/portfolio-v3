import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

type ProjectCardProps = {
  slug: string
  title: string
  description: string
  role: string
  period?: string
  technologies: string[]
  href: string
}

export function ProjectCard({
  slug,
  title,
  description,
  role,
  period,
  technologies,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="block">
      <div className="project-card group border border-gray-800 p-4 sm:p-6 transition-all duration-300 hover:border-accent/50 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-accent transition-colors project-title">
            {title}
          </h2>
          <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors project-arrow" />
        </div>

        <p className="text-sm text-gray-400 mb-4">
          {role} {period && `(${period})`}
        </p>

        <p className="text-gray-300 mb-6">{description}</p>

        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-sm text-gray-300 bg-gray-800/50 rounded"
            >
              {tech.toLowerCase()}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
