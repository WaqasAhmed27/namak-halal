"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { ZoomIn, RotateCw, Power } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLampGlow } from "@/components/providers/lamp-glow-provider"

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [rotation, setRotation] = useState(0)
  const [is360Mode, setIs360Mode] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const { isGlowOn, toggleGlow } = useLampGlow()

  // Ensure we have at least one image
  const galleryImages = images.length > 0 ? images : ["/placeholder.svg?height=600&width=600"]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setZoomPosition({ x, y })
  }

  const handle360Drag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is360Mode) return

    const handleDrag = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.movementX
      setRotation((prev) => (prev + deltaX) % 360)
    }

    const handleUp = () => {
      window.removeEventListener("mousemove", handleDrag)
      window.removeEventListener("mouseup", handleUp)
    }

    window.addEventListener("mousemove", handleDrag)
    window.addEventListener("mouseup", handleUp)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        ref={imageRef}
        className={cn(
          "relative aspect-square rounded-2xl overflow-hidden bg-card/50 border border-border cursor-zoom-in",
          isZoomed && "cursor-zoom-out",
          is360Mode && "cursor-grab active:cursor-grabbing",
        )}
        onClick={() => !is360Mode && setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        onMouseDown={handle360Drag}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <div
          className={cn("relative w-full h-full transition-transform duration-300", is360Mode && "cursor-grab")}
          style={{
            transform: is360Mode ? `rotateY(${rotation}deg)` : "none",
            transformStyle: "preserve-3d",
          }}
        >
          <Image
            src={galleryImages[activeIndex] || "/placeholder.svg"}
            alt={`${name} - Image ${activeIndex + 1}`}
            fill
            className={cn(
              "object-cover transition-all duration-300",
              isZoomed && "scale-200",
              isGlowOn && "brightness-105",
            )}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : undefined
            }
            priority
          />
        </div>

        {isGlowOn && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(80,120,200,0.15) 0%, rgba(60,100,180,0.05) 50%, transparent 70%)",
            }}
          />
        )}

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              toggleGlow()
            }}
            title="Toggle lamp glow"
          >
            <Power className={cn("h-4 w-4", isGlowOn && "text-primary")} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={cn("bg-background/80 backdrop-blur-sm", is360Mode && "bg-primary text-primary-foreground")}
            onClick={(e) => {
              e.stopPropagation()
              setIs360Mode(!is360Mode)
              setRotation(0)
            }}
            title="Toggle 360° view"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsZoomed(!isZoomed)
            }}
            title="Zoom"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* 360 indicator */}
        {is360Mode && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
            Drag to rotate • {Math.abs(rotation).toFixed(0)}°
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index)
                setIs360Mode(false)
              }}
              className={cn(
                "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                activeIndex === index ? "border-primary" : "border-border hover:border-primary/50",
              )}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
