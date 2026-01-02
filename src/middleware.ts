import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Protect admin dashboard routes
    if (pathname.startsWith("/admin/dashboard")) {
        const authCookie = request.cookies.get("admin_auth")

        if (!authCookie || authCookie.value !== "true") {
            // Redirect to login if not authenticated
            return NextResponse.redirect(new URL("/admin", request.url))
        }
    }

    // Protect API routes for work (except GET)
    if (pathname.startsWith("/api/work") && request.method !== "GET") {
        const authCookie = request.cookies.get("admin_auth")

        if (!authCookie || authCookie.value !== "true") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/dashboard/:path*", "/api/work/:path*"],
}
