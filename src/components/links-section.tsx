import Link from "next/link"
import { Link2 } from "lucide-react"
import { getLinks } from "@/lib/links"

export function LinksSection() {
  const links = getLinks()

  return (
    <section id="links" className="animate-fade-in-up hidden lg:block">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
        <Link2 className="w-5 h-5 mr-2" /> links
      </h2>
      <div className="flex flex-wrap gap-4 text-sm">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="text-gray-400 hover:text-accent transition-colors duration-200"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </section>
  )
}
