import { Link2 } from "lucide-react"
import { getLinks } from "@/lib/links"
import { LinksSectionClient } from "./links-section-client"

export function LinksSection() {
  const links = getLinks()

  return (
    <section id="links" className="animate-fade-in-up hidden lg:block">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
        <Link2 className="w-5 h-5 mr-2" /> links
      </h2>
      <LinksSectionClient links={links} />
    </section>
  )
}
