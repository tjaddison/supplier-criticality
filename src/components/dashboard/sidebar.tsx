"use client";

import { ProcureSciLogo } from "@/components/ui/logo";
import Link from "next/link";
import {
  LogOut,
  Menu,
  ShieldCheck,
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
    role?: string;
  };
  demoTier?: string | null;
}

export default function DashboardSidebar({ user, demoTier }: DashboardSidebarProps) {
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

          {/* Demo Mode Banner */}
          {demoTier && (
            <div className="mb-3 px-3 py-2 rounded-md bg-purple-900/50 border border-purple-500/40 text-xs text-purple-200">
              <span className="font-semibold text-purple-300">Demo Mode</span>
              <br />
              Viewing as{' '}
              <span className="font-bold text-white">
                {demoTier === 'free' ? 'Free' : demoTier.replace('tier-', 'Tier ')}
              </span>
            </div>
          )}

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
            {user.role === 'admin' && (
              <Link href="/dashboard/admin" onClick={() => setSidebarOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-purple-300 hover:text-purple-100 hover:bg-purple-900/30">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          {/* User Info & Logout Section */}
          <div className="pt-4 border-t border-gray-800">
            {user && (
              <div className="px-4 py-2 text-sm text-gray-400">
                {user.email}
              </div>
            )}
            <a href="/auth/logout" onClick={() => setSidebarOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </a>
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