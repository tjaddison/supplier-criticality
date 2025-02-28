import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Add the new route to the navigation items and remove "Suppliers"
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

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-semibold">Supplier Management</span>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
} 