import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: { width: 100, height: 32 },
    md: { width: 140, height: 45 },
    lg: { width: 180, height: 58 },
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/namak_halal_logo.png"
        alt="Namak Halal"
        width={sizes[size].width}
        height={sizes[size].height}
        className="object-contain"
        priority
      />
    </div>
  )
}

export function LogoLink({ className, size = "md" }: LogoProps) {
  return (
    <Link href="/" className={className}>
      <Logo size={size} />
    </Link>
  )
}
