"use client"

import { useEffect, useRef, useState } from "react"
import { useLampGlow } from "@/components/providers/lamp-glow-provider"

interface Star {
  x: number
  y: number
  size: number
  twinkleDuration: number
  twinkleDelay: number
}

interface ShootingStar {
  id: number
  x: number
  y: number
  angle: number
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])
  const { isGlowOn } = useLampGlow()
  const starsRef = useRef<Star[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      generateStars()
    }

    const generateStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 8000)
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        twinkleDuration: Math.random() * 3 + 2,
        twinkleDelay: Math.random() * 5,
      }))
    }

    const drawStars = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#020208")
      gradient.addColorStop(0.5, "#030310")
      gradient.addColorStop(1, "#020208")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars with twinkling effect
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(((time / 1000 + star.twinkleDelay) / star.twinkleDuration) * Math.PI * 2)
        const opacity = 0.3 + (twinkle + 1) * 0.35

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()

        if (isGlowOn && star.size > 1) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
          const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2)
          glowGradient.addColorStop(0, `rgba(100, 150, 255, ${opacity * 0.3})`)
          glowGradient.addColorStop(1, "transparent")
          ctx.fillStyle = glowGradient
          ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame(drawStars)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    animationRef.current = requestAnimationFrame(drawStars)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isGlowOn])

  // Shooting stars effect
  useEffect(() => {
    const createShootingStar = () => {
      const id = Date.now()
      const x = Math.random() * window.innerWidth * 0.7
      const y = Math.random() * window.innerHeight * 0.3
      const angle = Math.random() * 20 + 30

      setShootingStars((prev) => [...prev, { id, x, y, angle }])

      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== id))
      }, 1500)
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        createShootingStar()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="shooting-star absolute h-px w-24 bg-gradient-to-r from-transparent via-white to-white"
          style={{
            left: star.x,
            top: star.y,
            transform: `rotate(${star.angle}deg)`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  )
}
