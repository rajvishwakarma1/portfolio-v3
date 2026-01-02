import { ScrambleText } from "@/components/scramble-text"
import { PostsList } from "@/components/posts-list"
import { getPosts } from "@/lib/blog"
import { Metadata } from "next"

export default async function BlogPage() {
  const posts = getPosts().sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  )

  return (
    <>
      <main className="animate-fade-in-up relative">
        <h1 className="text-4xl font-bold mb-8 text-white">
          <span className="text-accent mr-2">*</span>
          <ScrambleText text="blog" />
        </h1>

        <p className="hidden sm:block text-sm text-gray-400 mb-8">
          press{" "}
          <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
            /
          </kbd>{" "}
          to search •{" "}
          <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
            ↑
          </kbd>{" "}
          <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
            ↓
          </kbd>{" "}
          to navigate
        </p>

        <PostsList posts={posts} />
      </main>
    </>
  )
}

export const metadata: Metadata = {
  title: "Blog",
  description: "Writings on programming, computer science, and more.",
  openGraph: {
    images: [
      {
        url: "https://www.rajvishwakarma.dev/og/home?title=blog",
      },
    ],
  },
}
