"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Supplier } from "@/types/supplier"
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { SupplierCriticalityOverview } from "./supplier-criticality-overview"
import { SupplierSearch, SearchFilters } from "./supplier-search"
import { calculateCategoryPercentage, calculateSubcategoryCount, calculateSubcategoryPercentage, getSpendAllocationCategory, getSpendCategory, getSubcategorySize, getHiddenSpendAllocation, getHiddenSpendValue, getHiddenSubcategorySize, calculateHiddenUtilization, calculateHiddenEaseOfReplacement, calculateHiddenRisk, getEaseOfReplacement, getUtilizationLevel, getRiskLevel, calculateHiddenWeightsSpendAllocation, calculateHiddenWeightsSpendValue, calculateHiddenWeightsSubcategorySize, calculateHiddenWeightsEaseOfReplacement, calculateHiddenWeightsUtilization, calculateHiddenWeightsRisk } from "@/lib/utils/calculations"

interface SupplierListProps {
  weights: {
    spendPercentage: number
    threeYearAverage: number
    marketSize: number
    replacementComplexity: number
    utilization: number
    riskLevel: number
  }
  userId: string
  onView: (supplier: Supplier) => void
  refreshTrigger?: number
}

type SortField = 'name' | 'category' | 'subcategory' | 'expirationDate' | 'contractNumber' | 'threeYearSpend'
type SortDirection = 'asc' | 'desc'

export function SupplierList({
  weights = {
    spendPercentage: 20,
    threeYearAverage: 20,
    marketSize: 15,
    replacementComplexity: 15,
    utilization: 15,
    riskLevel: 15
  },
  userId,
  onView,
  refreshTrigger
}: SupplierListProps) {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const loadedRef = useRef(false)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({
    category: "",
    subcategory: "",
    minSpend: 0,
    maxSpend: 0,
    riskLevel: ""
  })

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, set to ascending
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Get unique categories and subcategories for filter dropdowns
  const categories = useMemo(() => {
    return Array.from(new Set(suppliers.map(s => s.category).filter(Boolean))).sort()
  }, [suppliers])

  const subcategories = useMemo(() => {
    return Array.from(new Set(suppliers.map(s => s.subcategory).filter(Boolean))).sort()
  }, [suppliers])

  // Filter suppliers based on search and filters
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const matchesSearch =
          supplier.name?.toLowerCase().includes(search) ||
          supplier.category?.toLowerCase().includes(search) ||
          supplier.subcategory?.toLowerCase().includes(search) ||
          supplier.contractNumber?.toLowerCase().includes(search)
        if (!matchesSearch) return false
      }

      // Category filter
      if (filters.category && supplier.category !== filters.category) return false

      // Subcategory filter
      if (filters.subcategory && supplier.subcategory !== filters.subcategory) return false

      // Spend range filter
      if (filters.minSpend > 0 && supplier.threeYearSpend < filters.minSpend) return false
      if (filters.maxSpend > 0 && supplier.threeYearSpend > filters.maxSpend) return false

      // Risk level filter (based on criticality score)
      if (filters.riskLevel) {
        const score = supplier.criticalityScore || 0
        if (filters.riskLevel === "High" && score < 75) return false
        if (filters.riskLevel === "Medium" && (score < 50 || score >= 75)) return false
        if (filters.riskLevel === "Low" && score >= 50) return false
      }

      return true
    })
  }, [suppliers, searchTerm, filters])

  const sortedSuppliers = useMemo(() => {
    return [...filteredSuppliers].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1

      switch (sortField) {
        case 'name':
        case 'category':
        case 'subcategory':
        case 'contractNumber':
          const aValue = a[sortField] || ''
          const bValue = b[sortField] || ''
          return direction * aValue.toString().localeCompare(bValue.toString())
        case 'expirationDate':
          const aDate = a.expirationDate ? new Date(a.expirationDate) : new Date(0)
          const bDate = b.expirationDate ? new Date(b.expirationDate) : new Date(0)
          return direction * (aDate.getTime() - bDate.getTime())
        case 'threeYearSpend':
          const aSpend = a.threeYearSpend || 0
          const bSpend = b.threeYearSpend || 0
          return direction * (aSpend - bSpend)
        default:
          return 0
      }
    })
  }, [filteredSuppliers, sortField, sortDirection])

  // Update pagination based on filtered results
  const totalPages = Math.ceil(sortedSuppliers.length / pageSize)
  const paginatedSuppliers = sortedSuppliers.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters])

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value)
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  // Navigation handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const loadSuppliers = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/suppliers', {
        credentials: 'include'
      })
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/auth/login'
          return
        }
        throw new Error('Failed to fetch suppliers')
      }
      const { suppliers: data } = await response.json()
      if (data) {
        // Calculate criticality scores for all suppliers
        const suppliersWithCriticalityScores = data.map((supplier: Supplier) => {
          // Calculate all the hidden values and weights
          const subcategoryPercentage = calculateSubcategoryPercentage(supplier, data)
          const subcategoryCount = calculateSubcategoryCount(supplier, data)
          const spendAllocation = getSpendAllocationCategory(subcategoryPercentage)
          const spendCategory = getSpendCategory(supplier.threeYearSpend)
          const subcategorySize = getSubcategorySize(subcategoryCount)
          const hiddenSpendAllocation = getHiddenSpendAllocation(spendAllocation)
          const hiddenSpendValue = getHiddenSpendValue(spendCategory)
          const hiddenSubcategorySize = getHiddenSubcategorySize(subcategorySize)
          const hiddenUtilization = calculateHiddenUtilization(hiddenSpendAllocation, hiddenSpendValue)
          const hiddenEaseOfReplacement = calculateHiddenEaseOfReplacement(
            hiddenSpendValue,
            hiddenUtilization,
            hiddenSubcategorySize
          )
          const hiddenRisk = calculateHiddenRisk(hiddenEaseOfReplacement, hiddenUtilization)
          
          // Calculate weighted values
          const hiddenWeightsSpendAllocation = calculateHiddenWeightsSpendAllocation(
            hiddenSpendAllocation,
            { spendPercentage: weights.spendPercentage }
          )
          
          const hiddenWeightsSpendValue = calculateHiddenWeightsSpendValue(
            hiddenSpendValue,
            { threeYearAverage: weights.threeYearAverage }
          )
          
          const hiddenWeightsSubcategorySize = calculateHiddenWeightsSubcategorySize(
            hiddenSubcategorySize,
            { marketSize: weights.marketSize }
          )
          
          const hiddenWeightsEaseOfReplacement = calculateHiddenWeightsEaseOfReplacement(
            hiddenEaseOfReplacement,
            { replacementComplexity: weights.replacementComplexity }
          )
          
          const hiddenWeightsUtilization = calculateHiddenWeightsUtilization(
            hiddenUtilization,
            { utilization: weights.utilization }
          )
          
          const hiddenWeightsRisk = calculateHiddenWeightsRisk(
            hiddenRisk,
            { riskLevel: weights.riskLevel }
          )
          
          // Calculate the overall criticality value
          const criticalityScore = 
            hiddenWeightsSpendAllocation +
            hiddenWeightsSpendValue +
            hiddenWeightsSubcategorySize +
            hiddenWeightsEaseOfReplacement +
            hiddenWeightsUtilization +
            hiddenWeightsRisk;
          
          return {
            ...supplier,
            criticalityScore
          }
        })
        
        setSuppliers(suppliersWithCriticalityScores)
      }
    } catch (error) {
      console.error('Error loading suppliers:', error)
    } finally {
      setLoading(false)
    }
  }, [weights, userId])

  // Load suppliers when component mounts or when weights/userId change
  useEffect(() => {
    if (userId && weights && !loadedRef.current) {
      loadedRef.current = true
      loadSuppliers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weights, userId])

  // Reload suppliers when refresh is triggered
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadedRef.current = false // Reset to allow refresh
      loadSuppliers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger])


  const handleRowClick = (supplier: Supplier) => {
    // Calculate values before passing to modal
    const subcategoryPercentage = calculateSubcategoryPercentage(supplier, suppliers)
    const subcategoryCount = calculateSubcategoryCount(supplier, suppliers)
    const spendAllocation = getSpendAllocationCategory(subcategoryPercentage)
    const spendCategory = getSpendCategory(supplier.threeYearSpend)
    const subcategorySize = getSubcategorySize(subcategoryCount)
    const hiddenSpendAllocation = getHiddenSpendAllocation(spendAllocation)
    const hiddenSpendValue = getHiddenSpendValue(spendCategory)
    const hiddenSubcategorySize = getHiddenSubcategorySize(subcategorySize)
    const hiddenUtilization = calculateHiddenUtilization(hiddenSpendAllocation, hiddenSpendValue)
    const hiddenEaseOfReplacement = calculateHiddenEaseOfReplacement(
      hiddenSpendValue,
      hiddenUtilization,
      hiddenSubcategorySize
    )
    const hiddenRisk = calculateHiddenRisk(hiddenEaseOfReplacement, hiddenUtilization)

    // Get weights from props
    const hiddenWeightsSpendAllocation = calculateHiddenWeightsSpendAllocation(
      hiddenSpendAllocation,
      { spendPercentage: weights.spendPercentage }
    )

    const hiddenWeightsSpendValue = calculateHiddenWeightsSpendValue(
      hiddenSpendValue,
      { threeYearAverage: weights.threeYearAverage }
    )

    const hiddenWeightsSubcategorySize = calculateHiddenWeightsSubcategorySize(
      hiddenSubcategorySize,
      { marketSize: weights.marketSize }
    )

    const hiddenWeightsEaseOfReplacement = calculateHiddenWeightsEaseOfReplacement(
      hiddenEaseOfReplacement,
      { replacementComplexity: weights.replacementComplexity }
    )

    const hiddenWeightsUtilization = calculateHiddenWeightsUtilization(
      hiddenUtilization,
      { utilization: weights.utilization }
    )

    const hiddenWeightsRisk = calculateHiddenWeightsRisk(
      hiddenRisk,
      { riskLevel: weights.riskLevel }
    )

    // Calculate the overall criticality value
    const supplierCriticalityValue =
      hiddenWeightsSpendAllocation +
      hiddenWeightsSpendValue +
      hiddenWeightsSubcategorySize +
      hiddenWeightsEaseOfReplacement +
      hiddenWeightsUtilization +
      hiddenWeightsRisk;

    onView({
      ...supplier,
      categoryPercentage: calculateCategoryPercentage(supplier, suppliers),
      subcategoryCount,
      subcategoryPercentage,
      spendAllocation,
      spendCategory,
      subcategorySize,
      hiddenSpendAllocation,
      hiddenSpendValue,
      hiddenSubcategorySize,
      hiddenUtilization,
      hiddenEaseOfReplacement,
      hiddenRisk,
      easeOfReplacement: getEaseOfReplacement(hiddenEaseOfReplacement),
      utilization: getUtilizationLevel(hiddenUtilization),
      risk: getRiskLevel(hiddenRisk),
      hiddenWeightsSpendAllocation,
      hiddenWeightsSpendValue,
      hiddenWeightsSubcategorySize,
      hiddenWeightsEaseOfReplacement,
      hiddenWeightsUtilization,
      hiddenWeightsRisk,
      criticalityScore: supplierCriticalityValue // Set the criticality score
    })
  }

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-[#194866] flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3CDBDD] mb-4"></div>
          Loading suppliers...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Criticality Overview - moved to top */}
      <SupplierCriticalityOverview
        suppliers={suppliers.map(s => ({
          id: s.id,
          name: s.name,
          criticalityScore: s.criticalityScore || 0
        }))}
      />

      {/* Search and Filter */}
      <SupplierSearch
        onSearch={setSearchTerm}
        onFilterChange={setFilters}
        categories={categories}
        subcategories={subcategories}
      />

      {/* Supplier Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-[#194866]/70">
            Showing {sortedSuppliers.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, sortedSuppliers.length)} of {sortedSuppliers.length} suppliers
            {filteredSuppliers.length < suppliers.length && (
              <span className="ml-2 text-[#3CDBDD]">
                (filtered from {suppliers.length} total)
              </span>
            )}
          </div>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[180px] border-[#194866]/20 focus:border-[#3CDBDD] focus:ring-[#3CDBDD]">
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border border-[#194866]/20 rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-[#f0f9fa] to-white hover:from-[#f0f9fa] hover:to-white">
                <TableHead
                  className="cursor-pointer text-[#194866] font-semibold hover:text-[#3CDBDD]"
                  onClick={() => handleSort('name')}
                >
                  Supplier Name <SortIndicator field="name" />
                </TableHead>
                <TableHead
                  className="cursor-pointer text-[#194866] font-semibold hover:text-[#3CDBDD]"
                  onClick={() => handleSort('category')}
                >
                  Category <SortIndicator field="category" />
                </TableHead>
                <TableHead
                  className="cursor-pointer text-[#194866] font-semibold hover:text-[#3CDBDD]"
                  onClick={() => handleSort('subcategory')}
                >
                  Subcategory <SortIndicator field="subcategory" />
                </TableHead>
                <TableHead
                  className="cursor-pointer text-[#194866] font-semibold hover:text-[#3CDBDD]"
                  onClick={() => handleSort('expirationDate')}
                >
                  Expiration Date <SortIndicator field="expirationDate" />
                </TableHead>
                <TableHead
                  className="cursor-pointer text-[#194866] font-semibold hover:text-[#3CDBDD]"
                  onClick={() => handleSort('contractNumber')}
                >
                  Contract # <SortIndicator field="contractNumber" />
                </TableHead>
                <TableHead
                  className="cursor-pointer text-[#194866] font-semibold hover:text-[#3CDBDD]"
                  onClick={() => handleSort('threeYearSpend')}
                >
                  3-yr Avg Spend <SortIndicator field="threeYearSpend" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-[#194866]/70">
                    No suppliers found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSuppliers.map((supplier) => (
                  <TableRow
                    key={supplier.id}
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-[#f0f9fa] hover:to-white transition-colors"
                    onClick={() => handleRowClick(supplier)}
                  >
                    <TableCell className="font-medium text-[#194866]">{supplier.name}</TableCell>
                    <TableCell className="text-[#194866]/80">{supplier.category}</TableCell>
                    <TableCell className="text-[#194866]/80">{supplier.subcategory}</TableCell>
                    <TableCell className="text-[#194866]/80">{supplier.expirationDate}</TableCell>
                    <TableCell className="text-[#194866]/80">{supplier.contractNumber}</TableCell>
                    <TableCell className="text-[#194866] font-semibold">${supplier.threeYearSpend.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#194866]/70">
            Page {currentPage} of {totalPages || 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="border-[#194866] text-[#194866] hover:bg-[#194866] hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="text-sm font-medium text-[#194866]">
              Page {currentPage} of {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="border-[#194866] text-[#194866] hover:bg-[#194866] hover:text-white disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 