"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateOrderStatus } from "@/lib/actions/orders"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: string
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  processing: "bg-purple-500/20 text-purple-400",
  shipped: "bg-cyan-500/20 text-cyan-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    const previousStatus = status
    setStatus(newStatus) // Optimistic update

    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Order status updated to ${newStatus}`)
      router.refresh()
    } catch (error) {
      console.error("Error updating order status:", error)
      setStatus(previousStatus) // Rollback on error
      toast.error("Failed to update order status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
      <SelectTrigger className={`w-32 border-0 ${statusColors[status] || "bg-gray-500/20 text-gray-400"}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="confirmed">Confirmed</SelectItem>
        <SelectItem value="processing">Processing</SelectItem>
        <SelectItem value="shipped">Shipped</SelectItem>
        <SelectItem value="delivered">Delivered</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  )
}
