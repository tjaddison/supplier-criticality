"use client";

import { ProcureSciLogo } from "@/components/ui/logo";
import Link from "next/link";
import {
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Navigation items with "Suppliers" removed
const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Supplier Segmentation",
    href: "/dashboard/macro-supplier-tier",
  },
  {
    name: "Comparative Criticality",
    href: "/dashboard/micro-supplier-tier",
  },
];

interface DashboardSidebarProps {
  user: {
    email?: string;
    name?: string;
  };
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
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
            {/* Settings feature will be implemented in a future release */}
            {/* <Link href="/dashboard/settings" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link> */}
          </nav>

          {/* User Info & Logout Section */}
          <div className="pt-4 border-t border-gray-800">
            {user && (
              <div className="px-4 py-2 text-sm text-gray-400">
                {user.email}
              </div>
            )}
            <Link href="/api/auth/logout" onClick={() => setSidebarOpen(false)}>
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
    </>
  );
} 