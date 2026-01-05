import { ScrambleText } from "@/components/scramble-text"
import { ProjectCard } from "@/components/project-card"
import { Metadata } from "next"
import { getProjects } from "@/lib/projects"

// Parse role string to extract period if it exists
function parseRolePeriod(role: string): { role: string; period?: string } {
  const match = role.match(/^(.+?)\s*\((.+)\)$/)
  if (match) {
    return { role: match[1].trim(), period: match[2].trim() }
  }
  return { role }
}

export default function ProjectsPage() {
  const projects = getProjects()

  return (
    <main className="animate-fade-in-up">
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-white">
        <ScrambleText text="projects" />
      </h1>

      <p className="text-gray-400 mb-12 leading-relaxed">
        here are some of the projects i&apos;ve worked on. i love building tools
        that make developers&apos; lives easier and exploring new technologies
        along the way.
      </p>

      <div className="space-y-12">
        {projects.map((project) => {
          const { role, period } = parseRolePeriod(project.role)
          return (
            <div key={project.slug} id={project.slug}>
              <ProjectCard
                slug={project.slug}
                title={project.title}
                description={project.description}
                role={role}
                period={period}
                technologies={project.tags || []}
                href={project.href}
              />
            </div>
          )
        })}
      </div>
    </main>
  )
}

export const metadata: Metadata = {
  title: "Projects",
  description: "Some of the projects I've worked on.",
  openGraph: {
    images: [
      {
        url: "https://www.rajvishwakarma.dev/og/home?title=projects",
      },
    ],
  },
}
