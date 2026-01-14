"use client"

import { useState, useEffect } from "react"
import { Heart, Loader2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { toggleWishlist, isInWishlist } from "@/lib/actions/wishlist"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
    productId: string
    className?: string
    variant?: "icon" | "button"
}

export function WishlistButton({ productId, className, variant = "icon" }: WishlistButtonProps) {
    const { isSignedIn } = useUser()
    const [isInList, setIsInList] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isChecking, setIsChecking] = useState(true)

    // Check if item is in wishlist on mount
    useEffect(() => {
        const checkWishlist = async () => {
            if (!isSignedIn) {
                setIsChecking(false)
                return
            }

            try {
                const inWishlist = await isInWishlist(productId)
                setIsInList(inWishlist)
            } catch (error) {
                console.error("Failed to check wishlist:", error)
            } finally {
                setIsChecking(false)
            }
        }

        checkWishlist()
    }, [productId, isSignedIn])

    const handleToggle = async () => {
        if (!isSignedIn) {
            toast.error("Please sign in to add items to your wishlist")
            return
        }

        setIsLoading(true)
        try {
            const result = await toggleWishlist(productId)
            setIsInList(result.added)
            toast.success(result.added ? "Added to wishlist" : "Removed from wishlist")
        } catch (error) {
            console.error("Failed to toggle wishlist:", error)
            toast.error("Failed to update wishlist")
        } finally {
            setIsLoading(false)
        }
    }

    if (variant === "icon") {
        return (
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "bg-background/50 backdrop-blur-sm hover:bg-background/80",
                    isInList && "text-red-500 hover:text-red-600",
                    className
                )}
                onClick={handleToggle}
                disabled={isLoading || isChecking}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Heart className={cn("h-4 w-4", isInList && "fill-current")} />
                )}
            </Button>
        )
    }

    return (
        <Button
            variant="outline"
            className={cn(
                "gap-2",
                isInList && "text-red-500 border-red-500 hover:text-red-600 hover:border-red-600",
                className
            )}
            onClick={handleToggle}
            disabled={isLoading || isChecking}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Heart className={cn("h-4 w-4", isInList && "fill-current")} />
            )}
            {isInList ? "Remove from Wishlist" : "Add to Wishlist"}
        </Button>
    )
}
