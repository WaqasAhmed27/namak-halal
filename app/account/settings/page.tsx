"use client"

import { useUser, UserProfile } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Starfield } from "@/components/ui/starfield"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in")
    return null
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <>
        <Starfield />
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="flex items-center justify-center py-20">
              <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Starfield />
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/account">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Account
            </Link>
          </Button>

          <h1 className="text-3xl font-bold text-foreground mb-8">Account Settings</h1>

          {/* Use Clerk's built-in UserProfile component */}
          <div className="clerk-user-profile">
            <UserProfile
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-card/50 border-border shadow-none",
                  navbar: "hidden",
                  pageScrollBox: "p-0",
                }
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
