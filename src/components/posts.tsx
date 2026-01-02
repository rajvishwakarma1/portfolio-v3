"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import type { MDXFileData } from "@/lib/blog"
import { PostItem } from "./post-item"

type PostsProps = {
  posts: MDXFileData[]
}

export function Posts({ posts }: PostsProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const selectedItemRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredPosts = posts.filter((item) =>
    item.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  const scrollSelectedIntoView = () => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isSearching) {
        e.preventDefault()
        setIsSearching(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      } else if (e.key === "Escape" && isSearching) {
        setIsSearching(false)
        setSearchQuery("")
        inputRef.current?.blur()
      } else if (
        isSearching &&
        (e.key === "ArrowDown" || e.key === "ArrowUp")
      ) {
        e.preventDefault()
        setSelectedIndex((prev) => {
          const isDownward = e.key === "ArrowDown"

          const newIndex = isDownward
            ? prev < filteredPosts.length - 1
              ? prev + 1
              : prev
            : prev > 0
              ? prev - 1
              : prev

          scrollSelectedIntoView()
          return newIndex
        })
      } else if (isSearching && e.key === "Enter" && filteredPosts.length > 0) {
        router.push(`/blog/${filteredPosts[selectedIndex].slug}`)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isSearching, filteredPosts, selectedIndex, router])

  return (
    <>
      {/* Minimal inline search */}
      <div className={`mb-6 transition-all duration-200 ${isSearching ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden mb-0'}`}>
        <div className="inline-flex items-center">
          <span className="text-accent mr-1">/</span>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-gray-200 placeholder-gray-500 w-40"
            placeholder="search posts..."
            aria-label="Search posts"
          />
        </div>
      </div>

      <div className="space-y-8 sm:space-y-4">
        {filteredPosts.map((item, index) => (
          <div
            key={item.slug}
            ref={
              isSearching && index === selectedIndex ? selectedItemRef : null
            }
          >
            <PostItem
              post={item}
              isSelected={isSearching && index === selectedIndex}
            />
          </div>
        ))}

        {isSearching && filteredPosts.length === 0 && (
          <p className="text-gray-500 text-sm">no posts found</p>
        )}
      </div>
    </>
  )
}

