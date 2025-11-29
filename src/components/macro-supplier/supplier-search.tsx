"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SupplierSearchProps {
  onSearch: (searchTerm: string) => void
  onFilterChange: (filters: SearchFilters) => void
  categories: string[]
  subcategories: string[]
}

export interface SearchFilters {
  category: string
  subcategory: string
  minSpend: number
  maxSpend: number
  riskLevel: string
}

export function SupplierSearch({
  onSearch,
  onFilterChange,
  categories,
  subcategories
}: SupplierSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: "",
    subcategory: "",
    minSpend: 0,
    maxSpend: 0,
    riskLevel: ""
  })

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      category: "",
      subcategory: "",
      minSpend: 0,
      maxSpend: 0,
      riskLevel: ""
    })
    onSearch("")
    onFilterChange({
      category: "",
      subcategory: "",
      minSpend: 0,
      maxSpend: 0,
      riskLevel: ""
    })
  }

  const activeFilterCount = Object.values(filters).filter(v => v !== "" && v !== 0).length + (searchTerm ? 1 : 0)

  return (
    <div className="space-y-4 bg-white rounded-lg border border-[#3CDBDD]/20 p-4 shadow-sm">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#194866]/50" />
          <Input
            type="text"
            placeholder="Search by supplier name, category, contract #..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 border-[#194866]/20 focus:border-[#3CDBDD] focus:ring-[#3CDBDD]"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#194866]/50 hover:text-[#194866]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="border-[#194866] text-[#194866] hover:bg-[#194866] hover:text-white"
        >
          Advanced
          {showAdvanced ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-[#194866]/70 font-medium">Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="bg-[#3CDBDD]/20 text-[#194866]">
              Search: {searchTerm}
              <button onClick={() => handleSearchChange("")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="bg-[#3CDBDD]/20 text-[#194866]">
              Category: {filters.category}
              <button onClick={() => handleFilterChange("category", "")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.subcategory && (
            <Badge variant="secondary" className="bg-[#3CDBDD]/20 text-[#194866]">
              Subcategory: {filters.subcategory}
              <button onClick={() => handleFilterChange("subcategory", "")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.riskLevel && (
            <Badge variant="secondary" className="bg-[#3CDBDD]/20 text-[#194866]">
              Risk: {filters.riskLevel}
              <button onClick={() => handleFilterChange("riskLevel", "")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-[#194866] hover:text-[#194866] hover:bg-[#194866]/10"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#194866]/10">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#194866]">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-[#194866]/20 rounded-md focus:border-[#3CDBDD] focus:ring-[#3CDBDD] text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#194866]">Subcategory</label>
            <select
              value={filters.subcategory}
              onChange={(e) => handleFilterChange("subcategory", e.target.value)}
              className="w-full px-3 py-2 border border-[#194866]/20 rounded-md focus:border-[#3CDBDD] focus:ring-[#3CDBDD] text-sm"
            >
              <option value="">All Subcategories</option>
              {subcategories.map((subcat) => (
                <option key={subcat} value={subcat}>{subcat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#194866]">Spend Range</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minSpend || ""}
                onChange={(e) => handleFilterChange("minSpend", Number(e.target.value))}
                className="border-[#194866]/20 focus:border-[#3CDBDD] focus:ring-[#3CDBDD]"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxSpend || ""}
                onChange={(e) => handleFilterChange("maxSpend", Number(e.target.value))}
                className="border-[#194866]/20 focus:border-[#3CDBDD] focus:ring-[#3CDBDD]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#194866]">Risk Level</label>
            <select
              value={filters.riskLevel}
              onChange={(e) => handleFilterChange("riskLevel", e.target.value)}
              className="w-full px-3 py-2 border border-[#194866]/20 rounded-md focus:border-[#3CDBDD] focus:ring-[#3CDBDD] text-sm"
            >
              <option value="">All Risk Levels</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
