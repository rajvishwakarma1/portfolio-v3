"use client"

import { type MDXFileData } from "@/lib/blog"
import Link from "next/link"
import { useState } from "react"

type PostItemProps = {
  post: MDXFileData
  isSelected?: boolean
}

export function PostItem({ post, isSelected }: PostItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formattedDate = new Date(post.metadata.date)
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

  return (
    <div
      className={`relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 group ${isSelected
          ? "bg-gradient-to-r from-accent/10 to-transparent -mx-2 px-2 border-l-2 border-l-accent/50"
          : ""
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/blog/${post.slug}`}
        prefetch={true}
        className="text-gray-200 hover:text-accent transition-colors duration-200"
      >
        {post.metadata.title.toLowerCase()}
      </Link>
      <div className="flex items-center text-sm text-gray-400 shrink-0">
        <span>
          {new Date(post.metadata.date)
            .toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
            .toLowerCase()}
        </span>
      </div>

      {/* Hover card */}
      {isHovered && post.metadata.description && (
        <div className="absolute left-0 top-full mt-2 z-50 w-full max-w-lg animate-fade-in-up">
          <div className="bg-neutral-900 border border-neutral-800 p-4 shadow-xl">
            <h3 className="text-white font-medium mb-1">
              {post.metadata.title}
            </h3>
            <p className="text-gray-400 text-sm mb-2 leading-relaxed">
              {post.metadata.description}
            </p>
            <span className="text-gray-500 text-xs">
              {formattedDate}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
