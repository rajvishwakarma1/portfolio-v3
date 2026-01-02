export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#111] text-gray-300">
            {children}
        </div>
    )
}
