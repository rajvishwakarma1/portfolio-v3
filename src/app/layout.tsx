import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "../components/navbar"
import { DocumentTitleChanger } from "../components/document-title-changer"
import { ScrollNav } from "../components/scroll-nav"
import { ScrollPainter } from "../components/scroll-painter"
import { AmbientAudio } from "../components/ambient-audio"
import { ProjectsNav } from "../components/projects-nav"
import { CustomCursor } from "../components/custom-cursor"
import { ToolsNav } from "../components/tools-nav"
import { BackspaceNavigation } from "../components/backspace-navigation"
import { Preloader } from "../components/preloader"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://rajvishwakarma.dev"),
  title: {
    default: "Raj Vishwakarma",
    template: "%s | Raj Vishwakarma",
  },
  description: "Developer, cardist and maker of things.",
  openGraph: {
    title: "Raj Vishwakarma",
    description: "Developer, cardist and maker of things.",
    url: "https://rajvishwakarma.dev",
    siteName: "Raj Vishwakarma",
    locale: "en_US",
    type: "website",
    images: ["https://rajvishwakarma.dev/og/home"],
  },
  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
  twitter: {
    title: "Raj Vishwakarma",
    card: "summary_large_image",
    creator: "@303zion",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} antialiased min-h-screen font-mono`}
      >
        <Preloader />
        <DocumentTitleChanger />
        <CustomCursor />
        <BackspaceNavigation />
        <ScrollPainter />
        <ScrollNav />
        <ProjectsNav />
        <ToolsNav />
        <AmbientAudio />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  )
}
