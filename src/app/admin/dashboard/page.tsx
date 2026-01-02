"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Trash2, Edit2, LogOut, ExternalLink, Briefcase, FileText, FolderOpen, Link2, X, Upload, Image as ImageIcon, Wrench } from "lucide-react"

interface WorkProject {
    title: string
    links: { label: string; href: string }[]
    bullets: string[]
}

interface WorkItem {
    slug: string
    title: string
    href: string
    logo: string
    role: string
    period: string
    description: string
    longDescription: string
    tags: string[]
    projects: WorkProject[]
}

interface ProjectLink {
    label: string
    href: string
}

interface ProjectItem {
    slug: string
    title: string
    role: string
    description: string
    longDescription: string
    href: string
    tags: string[]
    links: ProjectLink[]
    livePreviewUrl: string
    youtubeUrl: string
    diagrams: string[]
}

interface BlogItem {
    slug: string
    title: string
    date: string
    filename: string
}

interface LinkItem {
    title: string
    href: string
}

interface ToolItem {
    name: string
    description: string
}

type TabType = "work" | "blog" | "projects" | "links" | "tools" | null
type ModalType = "work" | "project" | "link" | "tool" | null

export default function AdminDashboard() {
    const [workItems, setWorkItems] = useState<WorkItem[]>([])
    const [blogItems, setBlogItems] = useState<BlogItem[]>([])
    const [projectItems, setProjectItems] = useState<ProjectItem[]>([])
    const [linkItems, setLinkItems] = useState<LinkItem[]>([])
    const [toolItems, setToolItems] = useState<{ [key: string]: ToolItem[] }>({})
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<TabType>(null)
    const [modalType, setModalType] = useState<ModalType>(null)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Work form state
    const [workForm, setWorkForm] = useState({
        title: "", href: "", logo: "", role: "", period: "", description: "", longDescription: "", tags: "",
    })

    // Work projects state
    const [workProjects, setWorkProjects] = useState<WorkProject[]>([])

    // Project form state
    const [projectForm, setProjectForm] = useState({
        title: "", role: "", description: "", longDescription: "", href: "", tags: "", livePreviewUrl: "", youtubeUrl: "",
    })

    // Project links state
    const [projectLinks, setProjectLinks] = useState<ProjectLink[]>([])

    // Link form state
    const [linkForm, setLinkForm] = useState({ title: "", href: "" })

    // Tool form state
    const [toolForm, setToolForm] = useState({ name: "", description: "", category: "development" })
    const [editingToolName, setEditingToolName] = useState<string | null>(null)
    const [editingLinkTitle, setEditingLinkTitle] = useState<string | null>(null)

    useEffect(() => {
        const isAuth = document.cookie.includes("admin_auth=true")
        if (!isAuth) {
            router.push("/admin")
            return
        }
        fetchAllData()
    }, [router])

    // Parse period/role to get sortable value (present items first, then by date)
    const getSortValue = (text: string): number => {
        const months: { [key: string]: number } = {
            jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
            jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
        }
        const isPresent = text.toLowerCase().includes("present")
        const match = text.toLowerCase().match(/(\w+)\s+(\d{4})/)
        if (match) {
            const month = months[match[1]] ?? 0
            const year = parseInt(match[2])
            const dateValue = year * 12 + month
            return isPresent ? dateValue + 100000 : dateValue
        }
        return 0
    }

    const fetchAllData = async () => {
        try {
            const [workRes, blogRes, projectRes, linksRes, toolsRes] = await Promise.all([
                fetch("/api/work"),
                fetch("/api/blog"),
                fetch("/api/projects"),
                fetch("/api/links"),
                fetch("/api/tools"),
            ])

            // Sort work by period (present first, then by start date)
            const workData = await workRes.json()
            workData.sort((a: WorkItem, b: WorkItem) => getSortValue(b.period) - getSortValue(a.period))
            setWorkItems(workData)

            // Blog is already sorted by date in API
            setBlogItems(await blogRes.json())

            // Sort projects by role date (present first, then by start date)
            const projectData = await projectRes.json()
            projectData.sort((a: ProjectItem, b: ProjectItem) => getSortValue(b.role) - getSortValue(a.role))
            setProjectItems(projectData)

            // Links
            setLinkItems(await linksRes.json())

            // Tools
            setToolItems(await toolsRes.json())
        } catch (error) {
            console.error("Failed to fetch:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData })
            const data = await res.json()
            if (data.url) {
                setWorkForm({ ...workForm, logo: data.url })
            }
        } catch (error) {
            console.error("Upload failed:", error)
        } finally {
            setUploading(false)
        }
    }

    const handleWorkSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            ...workForm,
            tags: workForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
            projects: workProjects,
            slug: editingItem?.slug,
        }
        await fetch("/api/work", {
            method: editingItem ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        await fetchAllData()
        closeModal()
    }

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            ...projectForm,
            tags: projectForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
            links: projectLinks,
            diagrams: [],
            slug: editingItem?.slug,
        }
        await fetch("/api/projects", {
            method: editingItem ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        await fetchAllData()
        closeModal()
    }

    const handleDelete = async (type: string, slug: string) => {
        if (!confirm("delete this item?")) return
        await fetch(`/api/${type}?slug=${slug}`, { method: "DELETE" })
        await fetchAllData()
    }

    const handleLinkSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await fetch("/api/links", {
            method: editingLinkTitle ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...linkForm,
                originalTitle: editingLinkTitle,
            }),
        })
        await fetchAllData()
        closeModal()
    }

    const handleDeleteLink = async (title: string) => {
        if (!confirm("delete this link?")) return
        await fetch(`/api/links?title=${encodeURIComponent(title)}`, { method: "DELETE" })
        await fetchAllData()
    }

    const handleToolSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await fetch("/api/tools", {
            method: editingToolName ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...toolForm,
                originalName: editingToolName,
            }),
        })
        await fetchAllData()
        closeModal()
    }

    const handleDeleteTool = async (category: string, name: string) => {
        if (!confirm("delete this tool?")) return
        await fetch(`/api/tools?category=${encodeURIComponent(category)}&name=${encodeURIComponent(name)}`, { method: "DELETE" })
        await fetchAllData()
    }

    const openToolModal = (category?: string, item?: ToolItem) => {
        if (item && category) {
            setEditingToolName(item.name)
            setToolForm({ name: item.name, description: item.description, category })
        } else {
            setEditingToolName(null)
            setToolForm({ name: "", description: "", category: "development" })
        }
        setModalType("tool")
    }

    const openLinkModal = (item?: LinkItem) => {
        if (item) {
            setEditingLinkTitle(item.title)
            setLinkForm({ title: item.title, href: item.href })
        } else {
            setEditingLinkTitle(null)
            setLinkForm({ title: "", href: "" })
        }
        setModalType("link")
    }

    // Work Projects helpers
    const addWorkProject = () => {
        setWorkProjects([...workProjects, { title: "", links: [], bullets: [] }])
    }

    const updateWorkProject = (index: number, field: string, value: any) => {
        const updated = [...workProjects]
        updated[index] = { ...updated[index], [field]: value }
        setWorkProjects(updated)
    }

    const removeWorkProject = (index: number) => {
        setWorkProjects(workProjects.filter((_, i) => i !== index))
    }

    const addProjectLink = (projectIndex: number) => {
        const updated = [...workProjects]
        updated[projectIndex].links = [...updated[projectIndex].links, { label: "", href: "" }]
        setWorkProjects(updated)
    }

    const updateProjectLink = (projectIndex: number, linkIndex: number, field: string, value: string) => {
        const updated = [...workProjects]
        updated[projectIndex].links[linkIndex] = { ...updated[projectIndex].links[linkIndex], [field]: value }
        setWorkProjects(updated)
    }

    const removeProjectLink = (projectIndex: number, linkIndex: number) => {
        const updated = [...workProjects]
        updated[projectIndex].links = updated[projectIndex].links.filter((_, i) => i !== linkIndex)
        setWorkProjects(updated)
    }

    // Project Links helpers (for project detail)
    const addProjLink = () => {
        setProjectLinks([...projectLinks, { label: "", href: "" }])
    }

    const updateProjLink = (index: number, field: string, value: string) => {
        const updated = [...projectLinks]
        updated[index] = { ...updated[index], [field]: value }
        setProjectLinks(updated)
    }

    const removeProjLink = (index: number) => {
        setProjectLinks(projectLinks.filter((_, i) => i !== index))
    }

    const openWorkModal = (item?: WorkItem) => {
        if (item) {
            setEditingItem(item)
            setWorkForm({
                title: item.title, href: item.href, logo: item.logo || "", role: item.role, period: item.period,
                description: item.description, longDescription: item.longDescription, tags: item.tags.join(", "),
            })
            setWorkProjects(item.projects || [])
        } else {
            setEditingItem(null)
            setWorkForm({ title: "", href: "", logo: "", role: "", period: "", description: "", longDescription: "", tags: "" })
            setWorkProjects([])
        }
        setModalType("work")
    }

    const openProjectModal = (item?: ProjectItem) => {
        if (item) {
            setEditingItem(item)
            setProjectForm({
                title: item.title, role: item.role, description: item.description,
                longDescription: item.longDescription || "", href: item.href, tags: item.tags.join(", "),
                livePreviewUrl: item.livePreviewUrl || "", youtubeUrl: item.youtubeUrl || "",
            })
            setProjectLinks(item.links || [])
        } else {
            setEditingItem(null)
            setProjectForm({ title: "", role: "", description: "", longDescription: "", href: "", tags: "", livePreviewUrl: "", youtubeUrl: "" })
            setProjectLinks([])
        }
        setModalType("project")
    }

    const closeModal = () => {
        setModalType(null)
        setEditingItem(null)
        setWorkProjects([])
        setProjectLinks([])
        setEditingLinkTitle(null)
        setLinkForm({ title: "", href: "" })
        setEditingToolName(null)
        setToolForm({ name: "", description: "", category: "development" })
    }

    const handleLogout = () => {
        document.cookie = "admin_auth=; path=/; max-age=0"
        router.push("/admin")
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-400">loading...</div>
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar */}
            <div className="w-60 border-r border-neutral-800 p-6 flex flex-col">
                <h1 className="text-2xl font-bold text-white mb-8">admin</h1>

                <nav className="space-y-2 flex-1">
                    <button onClick={() => setActiveTab("work")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === "work" ? "bg-accent text-white" : "text-gray-400 hover:text-white hover:bg-neutral-800"}`}>
                        <Briefcase className="w-5 h-5" /> work
                    </button>
                    <button onClick={() => setActiveTab("blog")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === "blog" ? "bg-accent text-white" : "text-gray-400 hover:text-white hover:bg-neutral-800"}`}>
                        <FileText className="w-5 h-5" /> blog
                    </button>
                    <button onClick={() => setActiveTab("projects")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === "projects" ? "bg-accent text-white" : "text-gray-400 hover:text-white hover:bg-neutral-800"}`}>
                        <FolderOpen className="w-5 h-5" /> projects
                    </button>
                    <button onClick={() => setActiveTab("links")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === "links" ? "bg-accent text-white" : "text-gray-400 hover:text-white hover:bg-neutral-800"}`}>
                        <Link2 className="w-5 h-5" /> links
                    </button>
                    <button onClick={() => setActiveTab("tools")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === "tools" ? "bg-accent text-white" : "text-gray-400 hover:text-white hover:bg-neutral-800"}`}>
                        <Wrench className="w-5 h-5" /> tools
                    </button>
                </nav>

                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
                    <LogOut className="w-5 h-5" /> logout
                </button>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-8">
                {activeTab === null && (
                    <div className="flex items-center justify-center h-full text-gray-500 text-xl">select a section from the sidebar</div>
                )}

                {/* WORK TAB */}
                {activeTab === "work" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">work ({workItems.length})</h2>
                            <button onClick={() => openWorkModal()} className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-orange-600">
                                <Plus className="w-5 h-5" /> add work
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {workItems.map((item) => (
                                <div key={item.slug} className="flex items-center gap-4 p-5 bg-neutral-900 border border-neutral-800 rounded-xl group">
                                    {item.logo && <img src={item.logo} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                                    {!item.logo && <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center text-lg font-bold text-white">{item.title.charAt(0).toUpperCase()}</div>}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                                            {item.href && <Link href={item.href} target="_blank"><ExternalLink className="w-4 h-4 text-gray-500 hover:text-accent" /></Link>}
                                        </div>
                                        <p className="text-sm text-gray-400">{item.role} • {item.period}</p>
                                        {item.projects?.length > 0 && <p className="text-xs text-gray-500 mt-1">{item.projects.length} project(s)</p>}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openWorkModal(item)} className="p-2.5 text-gray-400 hover:text-accent rounded-lg hover:bg-neutral-800"><Edit2 className="w-5 h-5" /></button>
                                        <button onClick={() => handleDelete("work", item.slug)} className="p-2.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-neutral-800"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* BLOG TAB */}
                {activeTab === "blog" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">blog ({blogItems.length})</h2>
                            <p className="text-sm text-gray-500">edit posts in <code className="px-2 py-1 bg-neutral-800 rounded">posts/</code> folder</p>
                        </div>
                        <div className="grid gap-4">
                            {blogItems.map((item) => (
                                <div key={item.slug} className="flex items-center justify-between p-5 bg-neutral-900 border border-neutral-800 rounded-xl group">
                                    <div>
                                        <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                                        <p className="text-sm text-gray-400">{item.date}</p>
                                        <p className="text-xs text-gray-500 mt-1">{item.filename}</p>
                                    </div>
                                    <button onClick={() => handleDelete("blog", item.slug)} className="p-2.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PROJECTS TAB */}
                {activeTab === "projects" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">projects ({projectItems.length})</h2>
                            <button onClick={() => openProjectModal()} className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-orange-600">
                                <Plus className="w-5 h-5" /> add project
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {projectItems.map((item) => (
                                <div key={item.slug} className="flex items-center justify-between p-5 bg-neutral-900 border border-neutral-800 rounded-xl group">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                                            {item.href && <Link href={item.href} target="_blank"><ExternalLink className="w-4 h-4 text-gray-500 hover:text-accent" /></Link>}
                                        </div>
                                        <p className="text-sm text-gray-400">{item.role}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openProjectModal(item)} className="p-2.5 text-gray-400 hover:text-accent rounded-lg hover:bg-neutral-800"><Edit2 className="w-5 h-5" /></button>
                                        <button onClick={() => handleDelete("projects", item.slug)} className="p-2.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-neutral-800"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* LINKS TAB */}
                {activeTab === "links" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">links ({linkItems.length})</h2>
                            <button onClick={() => openLinkModal()} className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-orange-600">
                                <Plus className="w-5 h-5" /> add link
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {linkItems.map((item) => (
                                <div key={item.title} className="flex items-center justify-between p-5 bg-neutral-900 border border-neutral-800 rounded-xl group">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                                        <Link href={item.href} target="_blank" className="text-sm text-gray-400 hover:text-accent flex items-center gap-1">
                                            {item.href} <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openLinkModal(item)} className="p-2.5 text-gray-400 hover:text-accent rounded-lg hover:bg-neutral-800">
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDeleteLink(item.title)} className="p-2.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-neutral-800">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TOOLS TAB */}
                {activeTab === "tools" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">tools ({Object.values(toolItems).flat().length})</h2>
                            <button onClick={() => openToolModal()} className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-orange-600">
                                <Plus className="w-5 h-5" /> add tool
                            </button>
                        </div>
                        {Object.entries(toolItems).map(([category, tools]) => (
                            <div key={category} className="space-y-3">
                                <h3 className="text-lg font-semibold text-white capitalize">{category} ({tools.length})</h3>
                                <div className="grid gap-3">
                                    {tools.map((item) => (
                                        <div key={item.name} className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl group">
                                            <div>
                                                <h4 className="font-medium text-white">{item.name}</h4>
                                                <p className="text-sm text-gray-400">{item.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openToolModal(category, item)} className="p-2 text-gray-400 hover:text-accent rounded-lg hover:bg-neutral-800">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteTool(category, item.name)} className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-neutral-800">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL OVERLAY */}
            {modalType && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
                            <h2 className="text-xl font-bold text-white">
                                {editingItem ? "edit" : "add"} {modalType}
                            </h2>
                            <button onClick={closeModal} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-neutral-800">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* WORK FORM */}
                        {modalType === "work" && (
                            <form onSubmit={handleWorkSubmit} className="p-6 space-y-5">
                                {/* Logo Upload */}
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">logo</label>
                                    <div className="flex items-center gap-4">
                                        {workForm.logo ? (
                                            <img src={workForm.logo} alt="" className="w-16 h-16 rounded-xl object-cover" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl bg-neutral-800 flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6 text-gray-500" />
                                            </div>
                                        )}
                                        <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-4 py-2 border border-neutral-700 rounded-lg text-gray-400 hover:text-white hover:border-neutral-600 flex items-center gap-2">
                                            <Upload className="w-4 h-4" /> {uploading ? "uploading..." : "upload logo"}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">title *</label>
                                        <input type="text" value={workForm.title} onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">website url</label>
                                        <input type="url" value={workForm.href} onChange={(e) => setWorkForm({ ...workForm, href: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">role *</label>
                                        <input type="text" value={workForm.role} onChange={(e) => setWorkForm({ ...workForm, role: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">period *</label>
                                        <input type="text" value={workForm.period} onChange={(e) => setWorkForm({ ...workForm, period: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">short description *</label>
                                    <input type="text" value={workForm.description} onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">full description</label>
                                    <textarea value={workForm.longDescription} onChange={(e) => setWorkForm({ ...workForm, longDescription: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent min-h-[80px]" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">tags (comma separated)</label>
                                    <input type="text" value={workForm.tags} onChange={(e) => setWorkForm({ ...workForm, tags: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" />
                                </div>

                                {/* PROJECTS SECTION */}
                                <div className="border-t border-neutral-800 pt-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-sm text-gray-400">projects ({workProjects.length})</label>
                                        <button type="button" onClick={addWorkProject} className="text-sm text-accent hover:text-orange-400 flex items-center gap-1">
                                            <Plus className="w-4 h-4" /> add project
                                        </button>
                                    </div>

                                    {workProjects.map((project, pIndex) => (
                                        <div key={pIndex} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 mb-4">
                                            <div className="flex items-center justify-end mb-3">
                                                <button type="button" onClick={() => removeWorkProject(pIndex)} className="p-2 text-gray-400 hover:text-red-400">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Links */}
                                            <div className="mb-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs text-gray-500">links</span>
                                                    <button type="button" onClick={() => addProjectLink(pIndex)} className="text-xs text-accent hover:text-orange-400">+ add link</button>
                                                </div>
                                                {project.links.map((link, lIndex) => (
                                                    <div key={lIndex} className="flex gap-2 mb-2">
                                                        <input
                                                            type="text"
                                                            value={link.label}
                                                            onChange={(e) => updateProjectLink(pIndex, lIndex, "label", e.target.value)}
                                                            placeholder="label (e.g. web)"
                                                            className="w-1/3 px-2 py-1.5 text-sm bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:border-accent"
                                                        />
                                                        <input
                                                            type="url"
                                                            value={link.href}
                                                            onChange={(e) => updateProjectLink(pIndex, lIndex, "href", e.target.value)}
                                                            placeholder="https://..."
                                                            className="flex-1 px-2 py-1.5 text-sm bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:border-accent"
                                                        />
                                                        <button type="button" onClick={() => removeProjectLink(pIndex, lIndex)} className="p-1.5 text-gray-400 hover:text-red-400">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Bullets */}
                                            <div>
                                                <span className="text-xs text-gray-500 block mb-2">bullets (one per line)</span>
                                                <textarea
                                                    value={project.bullets.join("\n")}
                                                    onChange={(e) => updateWorkProject(pIndex, "bullets", e.target.value.split("\n"))}
                                                    placeholder="• built a flutter mobile app..."
                                                    className="w-full px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent min-h-[80px]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-orange-600 font-medium">{editingItem ? "update" : "save"}</button>
                                    <button type="button" onClick={closeModal} className="px-6 py-3 border border-neutral-700 text-gray-400 rounded-lg hover:text-white">cancel</button>
                                </div>
                            </form>
                        )}

                        {/* PROJECT FORM */}
                        {modalType === "project" && (
                            <form onSubmit={handleProjectSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">title *</label>
                                        <input type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">role *</label>
                                        <input type="text" value={projectForm.role} onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" placeholder="creator (jul 2024)" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">short description *</label>
                                    <input type="text" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">full description</label>
                                    <textarea value={projectForm.longDescription} onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent min-h-[80px]" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">tags (comma separated)</label>
                                    <input type="text" value={projectForm.tags} onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" />
                                </div>

                                {/* Links Section */}
                                <div className="border-t border-neutral-800 pt-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-sm text-gray-400">links ({projectLinks.length})</label>
                                        <button type="button" onClick={addProjLink} className="text-sm text-accent hover:text-orange-400 flex items-center gap-1">
                                            <Plus className="w-4 h-4" /> add link
                                        </button>
                                    </div>
                                    {projectLinks.map((link, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={link.label}
                                                onChange={(e) => updateProjLink(index, "label", e.target.value)}
                                                placeholder="label (e.g. github)"
                                                className="w-1/3 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:border-accent"
                                            />
                                            <input
                                                type="url"
                                                value={link.href}
                                                onChange={(e) => updateProjLink(index, "href", e.target.value)}
                                                placeholder="https://..."
                                                className="flex-1 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:border-accent"
                                            />
                                            <button type="button" onClick={() => removeProjLink(index)} className="p-2 text-gray-400 hover:text-red-400">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">live preview url</label>
                                        <input type="url" value={projectForm.livePreviewUrl} onChange={(e) => setProjectForm({ ...projectForm, livePreviewUrl: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" placeholder="https://..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">youtube url</label>
                                        <input type="url" value={projectForm.youtubeUrl} onChange={(e) => setProjectForm({ ...projectForm, youtubeUrl: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" placeholder="https://youtube.com/watch?v=..." />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-orange-600 font-medium">{editingItem ? "update" : "save"}</button>
                                    <button type="button" onClick={closeModal} className="px-6 py-3 border border-neutral-700 text-gray-400 rounded-lg hover:text-white">cancel</button>
                                </div>
                            </form>
                        )}

                        {/* LINK FORM */}
                        {modalType === "link" && (
                            <form onSubmit={handleLinkSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">title *</label>
                                    <input type="text" value={linkForm.title} onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" placeholder="e.g. github, twitter, email" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">url *</label>
                                    <input type="text" value={linkForm.href} onChange={(e) => setLinkForm({ ...linkForm, href: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" placeholder="https://... or mailto:..." required />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-orange-600 font-medium">{editingLinkTitle ? "update" : "save"}</button>
                                    <button type="button" onClick={closeModal} className="px-6 py-3 border border-neutral-700 text-gray-400 rounded-lg hover:text-white">cancel</button>
                                </div>
                            </form>
                        )}

                        {/* TOOL FORM */}
                        {modalType === "tool" && (
                            <form onSubmit={handleToolSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">category *</label>
                                    <select
                                        value={toolForm.category}
                                        onChange={(e) => setToolForm({ ...toolForm, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent"
                                    >
                                        <option value="development">development</option>
                                        <option value="design">design</option>
                                        <option value="productivity">productivity</option>
                                        <option value="hardware">hardware</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">name *</label>
                                    <input type="text" value={toolForm.name} onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" placeholder="e.g. VS Code, Figma" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">description</label>
                                    <input type="text" value={toolForm.description} onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-accent" placeholder="short description of the tool" />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-orange-600 font-medium">{editingToolName ? "update" : "save"}</button>
                                    <button type="button" onClick={closeModal} className="px-6 py-3 border border-neutral-700 text-gray-400 rounded-lg hover:text-white">cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
