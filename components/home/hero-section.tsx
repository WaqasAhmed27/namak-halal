"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLampGlow } from "@/components/providers/lamp-glow-provider"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const { isGlowOn } = useLampGlow()

  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center px-3 md:px-4 pt-16 md:pt-20">
      {isGlowOn && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full opacity-15 blur-3xl pointer-events-none transition-opacity duration-1000"
          style={{
            background: "radial-gradient(circle, rgba(80,120,200,0.3) 0%, rgba(60,100,180,0.15) 40%, transparent 70%)",
          }}
        />
      )}

      <div className="container mx-auto text-center max-w-3xl md:max-w-4xl relative z-10">
        {/* Badge - smaller on mobile */}
        <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-secondary/50 border border-border mb-6 md:mb-8">
          <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary" />
          <span className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide uppercase">
            From Khewra Salt Mines
          </span>
        </div>

        {/* Headline - bold, sharp typography, smaller on mobile */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-4 md:mb-6 leading-[1.1]">
          <span className="text-foreground">Illuminate Your Space with </span>
          <span
            className={cn(
              "transition-all duration-500",
              isGlowOn ? "text-primary drop-shadow-[0_0_20px_rgba(80,120,200,0.4)]" : "text-muted-foreground",
            )}
          >
            Authentic Himalayan
          </span>
          <span className="text-foreground"> Salt Lamps</span>
        </h1>

        {/* Subheadline - smaller on mobile */}
        <p className="text-sm md:text-lg text-muted-foreground max-w-xl md:max-w-2xl mx-auto mb-8 md:mb-10 text-pretty leading-relaxed">
          Hand-carved from ancient Khewra salt deposits. Each lamp is a unique masterpiece that brings warmth and
          natural beauty to your space.
        </p>

        {/* CTAs - smaller on mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <Button
            asChild
            size="default"
            className="min-w-[140px] md:min-w-[180px] h-10 md:h-11 text-sm md:text-base font-semibold group"
          >
            <Link href="/shop">
              Shop Now
              <ArrowRight className="ml-2 h-3.5 w-3.5 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="default"
            className="min-w-[140px] md:min-w-[180px] h-10 md:h-11 text-sm md:text-base font-semibold bg-transparent"
          >
            <Link href="/about">Learn Our Story</Link>
          </Button>
        </div>

        {/* Trust indicators - smaller on mobile */}
        <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-green-500" />
            <span className="font-medium">100% Natural</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary" />
            <span className="font-medium">Hand-carved</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-accent" />
            <span className="font-medium">Direct from Khewra</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator - smaller on mobile */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 md:w-6 md:h-10 border border-muted-foreground/50 rounded-full flex justify-center pt-1.5 md:pt-2">
          <div className="w-0.5 md:w-1 h-1.5 md:h-2 bg-muted-foreground rounded-full" />
        </div>
      </div>
    </section>
  )
}
