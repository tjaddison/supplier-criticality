"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SuppliersPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the macro-supplier-tier page where CSV upload functionality now lives
    router.replace("/dashboard/macro-supplier-tier")
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-lg text-[#194866] flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mb-4"></div>
        Redirecting to Supplier Management...
      </div>
    </div>
  )
} 