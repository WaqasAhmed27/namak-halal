import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define protected routes
const isAdminRoute = createRouteMatcher(["/admin(.*)"])
const isAccountRoute = createRouteMatcher(["/account(.*)"])
const isCheckoutRoute = createRouteMatcher(["/checkout(.*)"])

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth()

    // Admin routes: require authentication and admin role
    if (isAdminRoute(req)) {
        if (!userId) {
            const signInUrl = new URL("/sign-in", req.url)
            signInUrl.searchParams.set("redirect_url", req.url)
            return NextResponse.redirect(signInUrl)
        }

        // Check for admin role in publicMetadata
        const role = (sessionClaims?.metadata as { role?: string })?.role
        if (role !== "admin") {
            // Redirect non-admins to home page
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    // Account routes: require authentication
    if (isAccountRoute(req)) {
        if (!userId) {
            const signInUrl = new URL("/sign-in", req.url)
            signInUrl.searchParams.set("redirect_url", req.url)
            return NextResponse.redirect(signInUrl)
        }
    }

    // Checkout routes: allow both guests and authenticated users
    // No blocking here, checkout page handles guest checkout

    return NextResponse.next()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
}
