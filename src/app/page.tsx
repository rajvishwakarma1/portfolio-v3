import { Header } from "@/components/header"
import { Item, SectionList } from "@/components/section-list"
import { BlogSection } from "@/components/blog-section"
import { LinksSection } from "@/components/links-section"
import { WorkSection } from "@/components/work-section"
import { GitHubContributions } from "@/components/github-contributions"
import { getProjects } from "@/lib/projects"

export default function HomePage() {
  const allProjects = getProjects()

  // Take first 2 projects for homepage, map to Item format
  const projectItems: Item[] = allProjects.slice(0, 2).map((p) => ({
    title: p.title,
    role: p.role.replace(/\s*\(.+\)$/, ""), // Remove date portion from role
    description: p.description,
    href: p.href,
  }))

  return (
    <>
      <Header />
      <GitHubContributions username="rajvishwakarma1" />
      <WorkSection />
      <BlogSection />
      <SectionList
        title="projects"
        items={projectItems}
        viewAllHref="/projects"
        viewAllText="all projects"
        id="projects"
      />
      <LinksSection />
    </>
  )
}
