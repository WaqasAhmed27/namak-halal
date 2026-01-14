import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isAdminRoute = createRouteMatcher(["/admin(.*)"])
const isAccountRoute = createRouteMatcher(["/account(.*)"])
const isCheckoutRoute = createRouteMatcher(["/checkout(.*)"])

export default clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl

    // ✅ HARD BYPASS — webhook must never touch Clerk auth
    if (pathname === "/api/clerk/webhook") {
        return NextResponse.next()
    }

    // ⬇️ ONLY now is it safe to evaluate auth
    const { userId, sessionClaims } = await auth()

    // Admin routes
    if (isAdminRoute(req)) {
        if (!userId) {
            const signInUrl = new URL("/sign-in", req.url)
            signInUrl.searchParams.set("redirect_url", req.url)
            return NextResponse.redirect(signInUrl)
        }

        const role = (sessionClaims?.metadata as { role?: string })?.role
        if (role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    // Account routes
    if (isAccountRoute(req)) {
        if (!userId) {
            const signInUrl = new URL("/sign-in", req.url)
            signInUrl.searchParams.set("redirect_url", req.url)
            return NextResponse.redirect(signInUrl)
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        "/((?!_next|favicon.ico|.*\\..*).*)",
    ],
}
