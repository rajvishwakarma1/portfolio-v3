"use client"

import Link from "next/link"
import { useState } from "react"
import { BlurMorphText } from "@/components/blur-morph-text"
import { MapPin, Building2, FileText, CornerDownLeft } from "lucide-react"

function LinkWithPreview({ href, children }: { href: string; children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <span className="relative inline-block">
      <Link
        href={href}
        target="_blank"
        className="hover:text-accent transition-colors duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </Link>
      {/* Preview popup - hidden on mobile/tablet */}
      <div
        className={`
          absolute left-0 top-full mt-2 z-50
          w-72 rounded-lg overflow-hidden
          border border-neutral-700 bg-neutral-900
          shadow-2xl shadow-black/50
          transition-all duration-300 ease-out
          hidden lg:block
          ${isHovered ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
        `}
      >
        {isHovered && (
          <video
            src="/digitaldomi.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto"
          />
        )}
        <div className="px-3 py-2 text-xs text-gray-400 border-t border-neutral-800">
          digitaldomi.com
        </div>
      </div>
    </span>
  )
}

export function Header() {
  return (
    <header id="header" className="mb-12 sm:mb-16 space-y-4">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 animate-fade-in text-white">
        <span className="inline-block">
          <BlurMorphText text="raj vishwakarma" hoverText="aka zion" />
        </span>
      </h1>
      <div className="flex flex-col gap-2 text-gray-400">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          gorakhpur, india
        </div>
        <div
          className="flex items-center gap-2 whitespace-nowrap"
          style={{ fontSize: 'clamp(0.75rem, 2.5vw, 1rem)' }}
        >
          <Building2 className="w-4 h-4 shrink-0" />
          <span>founding qa engineer</span>
          <LinkWithPreview href="https://digitaldomi.com/">@digital domi</LinkWithPreview>
        </div>
      </div>
      <p className="leading-relaxed animate-fade-in-up">
        i turn fuzzy ideas into live products. full-stack builder and
        designer. studied cs where i got curious about
        how products work behind the scenes. i enjoy building small tools,
        breaking things the right way, and understanding products inside out.
      </p>

      {/* CTA Buttons and Social Links - combined for mobile alignment */}
      <div className="flex flex-wrap items-center gap-3 animate-fade-in-up">
        <Link
          href="https://docs.google.com/document/d/1eJBZPdjgS4AcN9Q6YUj3U53NzndLew2p/edit?usp=sharing&ouid=114346907034295607424&rtpof=true&sd=true"
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-700 text-gray-300 hover:text-accent hover:border-accent transition-all duration-200"
        >
          <FileText className="w-3.5 h-3.5" />
          resume
        </Link>
        <Link
          href="https://cal.com/rajvishwakarma/30min"
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-700 text-gray-300 hover:text-accent hover:border-accent transition-all duration-200"
        >
          book a call
          <CornerDownLeft className="w-3.5 h-3.5" />
        </Link>

        {/* Social icons - inline with buttons on mobile, separated on desktop */}
        <div className="flex items-center gap-4 lg:hidden ml-1">
          <Link
            href="mailto:rajvishwakarma303@gmail.com"
            className="text-gray-500 hover:text-accent transition-colors duration-200"
            aria-label="Email"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
            </svg>
          </Link>
          <Link
            href="https://x.com/303zion"
            target="_blank"
            className="text-gray-500 hover:text-accent transition-colors duration-200"
            aria-label="X (Twitter)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Link>
          <Link
            href="https://github.com/rajvishwakarma1"
            target="_blank"
            className="text-gray-500 hover:text-accent transition-colors duration-200"
            aria-label="GitHub"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </Link>
          <Link
            href="https://www.linkedin.com/in/rajvishwakarma1"
            target="_blank"
            className="text-gray-500 hover:text-accent transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
