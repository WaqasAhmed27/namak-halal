import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isAdminRoute = createRouteMatcher(["/admin(.*)"])
const isAccountRoute = createRouteMatcher(["/account(.*)"])

export default clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl

    // Safety bypass (should not run due to matcher, but kept anyway)
    if (pathname === "/api/clerk/webhook") {
        return NextResponse.next()
    }

    const { userId, sessionClaims } = await auth()

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
        "/((?!api/clerk/webhook|_next|favicon.ico).*)",
    ],
}
