import Link from "next/link"
import { ArrowUpRight, Folder } from "lucide-react"

export type Item = {
  title: string
  href: string
  role: string
  period?: string
  description: string
}

type SectionListProps = {
  title: string
  items: Item[]
  viewAllHref?: string
  viewAllText?: string
  id?: string
}

export function SectionList({
  title,
  items,
  viewAllHref,
  viewAllText,
  id,
}: SectionListProps) {
  return (
    <section id={id} className="mb-12 sm:mb-16 animate-fade-in-up">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center text-white">
        <Folder className="w-5 h-5 mr-2" /> {title}
      </h2>
      <div className="space-y-6 sm:space-y-8">
        {items.map((item, index) => (
          <div key={item.title} className="group">
            <Link href={item.href} target="_blank">
              <h3 className="text-lg sm:text-xl font-semibold mb-1 text-white group-hover:text-accent transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                {item.role} {item.period && `(${item.period})`}
              </p>
              <p className="text-gray-300">{item.description}</p>
            </Link>
          </div>
        ))}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 mt-6 text-accent hover:underline group"
        >
          {viewAllText}{" "}
          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      )}
    </section>
  )
}
