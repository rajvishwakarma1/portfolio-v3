import Link from "next/link"
import { ScrambleTextHover } from "@/components/scramble-text-hover"
import { MapPin, Building2, FileText, CornerDownLeft } from "lucide-react"

export function Header() {
  return (
    <header id="header" className="mb-16 space-y-4">
      <h1 className="text-4xl font-bold mb-4 animate-fade-in text-white">
        <span className="inline-block">
          <ScrambleTextHover text="raj vishwakarma" hoverText="aka zion" />
        </span>
      </h1>
      <div className="flex flex-col gap-2 text-gray-400">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          gorakhpur, india
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          founding qa engineer <Link href="https://digitaldomi.com/" target="_blank" className="hover:text-accent transition-colors duration-200">@digital domi</Link>
        </div>
      </div>
      <p className="leading-relaxed animate-fade-in-up">
        i turn fuzzy ideas into live products. full-stack builder and
        designer. studied cs where i got curious about
        how products work behind the scenes. i enjoy building small tools,
        breaking things the right way, and understanding products inside out.
      </p>
      <div className="flex gap-4 animate-fade-in-up">
        <Link
          href="https://docs.google.com/document/d/1eJBZPdjgS4AcN9Q6YUj3U53NzndLew2p/edit?usp=sharing&ouid=114346907034295607424&rtpof=true&sd=true"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 border border-neutral-800 text-gray-400 hover:text-accent hover:border-accent transition-all duration-200"
        >
          <FileText className="w-4 h-4" />
          resume
        </Link>
        <Link
          href="https://cal.com/rajvishwakarma/30min"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 border border-neutral-800 text-gray-400 hover:text-accent hover:border-accent transition-all duration-200"
        >
          book a call
          <CornerDownLeft className="w-4 h-4" />
        </Link>
      </div>
    </header>
  )
}
