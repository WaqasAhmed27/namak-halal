"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ShoppingBag, User, Heart, Search } from "lucide-react"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { itemCount, openCart } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/90 backdrop-blur-lg border-b border-border" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex h-14 md:h-16 lg:h-20 items-center justify-between">
          {/* Logo - smaller on mobile */}
          <Logo size="sm" className="md:hidden" />
          <Logo size="md" className="hidden md:flex" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            {/* Auth UI - Clerk Components */}
            {/* Debug: Auth buttons always visible */}
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="default" size="sm">
                Sign Up
              </Button>
            </SignUpButton>
            <SignedIn>
              <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/account">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Cart ({itemCount} items)</span>
            </Button>
          </div>

          {/* Mobile Menu Button - smaller icons on mobile */}
          <div className="flex lg:hidden items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="relative text-muted-foreground hover:text-foreground h-9 w-9 p-0"
              onClick={openCart}
            >
              <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-foreground h-9 w-9 p-0"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {
        isMenuOpen && (
          <div className="lg:hidden bg-background/98 backdrop-blur-lg border-b border-border">
            <nav className="container mx-auto px-3 md:px-4 py-3 md:py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />

              {/* Mobile Auth UI */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/account"
                  className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Account
                </Link>
              </SignedIn>

              <Link
                href="/wishlist"
                className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
            </nav>
          </div>
        )
      }
    </header >
  )
}
