import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import { CartProvider } from "@/components/providers/cart-provider"
import { LampGlowProvider } from "@/components/providers/lamp-glow-provider"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { Toaster } from "sonner"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Namak Halal | Authentic Himalayan Salt Lamps from Khewra",
  description:
    "Discover premium hand-carved Himalayan salt lamps sourced directly from the ancient Khewra salt mines. Natural, authentic, and beautifully crafted.",
  keywords: [
    "Himalayan salt lamp",
    "Khewra salt",
    "natural salt lamp",
    "pink salt lamp",
    "authentic salt lamp",
    "Pakistan salt lamp",
  ],
  authors: [{ name: "Namak Halal" }],
  openGraph: {
    title: "Namak Halal | Authentic Himalayan Salt Lamps",
    description: "Premium hand-carved salt lamps from the ancient Khewra mines",
    type: "website",
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#030310",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider dynamic>
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
          <LampGlowProvider>
            <CartProvider>
              {children}
              <CartDrawer />
            </CartProvider>
          </LampGlowProvider>
          <Toaster
            position="bottom-right"
            richColors
            theme="dark"
            toastOptions={{
              className: "bg-card border-border",
            }}
          />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
