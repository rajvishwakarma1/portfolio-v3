"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        if (username === "admin" && password === "admin") {
            document.cookie = "admin_auth=true; path=/; max-age=86400"
            router.push("/admin/dashboard")
        } else {
            setError("invalid credentials")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-sm">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">
                    admin login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                            placeholder="enter username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                            placeholder="enter password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-accent text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "logging in..." : "login"}
                    </button>
                </form>
            </div>
        </div>
    )
}
