"use client"

import { ProcureSciLogo } from "@/components/ui/logo"
import Link from "next/link"
import { 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

// Navigation items with "Suppliers" removed
const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Macro Supplier Tier",
    href: "/dashboard/macro-supplier-tier",
  },
  {
    name: "Micro Supplier Tier",
    href: "/dashboard/micro-supplier-tier",
  },
]

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between">
        <ProcureSciLogo />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-64 bg-gray-900 text-white",
        "fixed md:static h-[calc(100vh-4rem)] md:h-screen z-20 transition-transform duration-200 ease-in-out",
        "md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Content Wrapper */}
        <div className="flex flex-col h-full p-4">
          {/* Logo Section */}
          <div className="hidden md:flex items-center space-x-2 mb-8">
            <ProcureSciLogo />
          </div>

          {/* Navigation Section */}
          <nav className="space-y-2 flex-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
              >
                <Button variant="ghost" className="w-full justify-start">
                  {item.name}
                </Button>
              </Link>
            ))}
            <Link href="/dashboard/settings" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>

          {/* Logout Section */}
          <div className="pt-4 border-t border-gray-800">
            <Link href="/login" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 min-h-screen md:min-h-0">
        {children}
      </main>
    </div>
  )
} 