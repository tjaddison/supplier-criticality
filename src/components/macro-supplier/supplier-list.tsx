"use client"

import { useState, useEffect } from "react"
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
import { PlusCircle, Trash2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { SupplierCriticalityChart } from "./supplier-criticality-chart"
import { getSuppliers } from "@/lib/dynamodb"

interface SupplierListProps {
  weights: {
    spendPercentage: number
    threeYearAverage: number
    marketSize: number
    replacementComplexity: number
    utilization: number
    riskLevel: number
  }
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
  refreshTrigger?: number
}

type SortField = 'name' | 'category' | 'subcategory' | 'expirationDate' | 'contractNumber' | 'threeYearSpend'
type SortDirection = 'asc' | 'desc'

export function SupplierList({ 
  onEdit,   // Fix: Keep onEdit separate
  onDelete, 
  refreshTrigger = 0 
}: SupplierListProps) {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const totalPages = Math.ceil(suppliers.length / pageSize)
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

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1
    
    switch (sortField) {
      case 'name':
      case 'category':
      case 'subcategory':
      case 'contractNumber':
        // Handle potentially undefined or null values
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

  // Update pagination to use sortedSuppliers
  const currentSuppliersSorted = sortedSuppliers.slice(startIndex, endIndex)

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

  useEffect(() => {
    loadSuppliers()
  }, [refreshTrigger])

  const loadSuppliers = async () => {
    try {
      const userId = "user123" // Demo user ID
      const data = await getSuppliers(userId)
      if (data) {
        // Type assertion to ensure data matches Supplier interface
        const typedSuppliers = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          subcategory: item.subcategory,
          expirationDate: item.expirationDate,
          contractNumber: item.contractNumber,
          threeYearSpend: Number(item.threeYearSpend),
          contractDescription: item.contractDescription,
          criticalityScore: Number(item.criticalityScore)
        })) as Supplier[]
        
        setSuppliers(typedSuppliers)
      }
    } catch (error) {
      console.error('Error loading suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent, supplier: Supplier) => {
    e.stopPropagation() // Prevent row click from triggering
    setSupplierToDelete(supplier)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (supplierToDelete) {
      onDelete(supplierToDelete)
    }
    setDeleteDialogOpen(false)
    setSupplierToDelete(null)
  }

  const handleRowClick = (supplier: Supplier) => {
    onEdit(supplier)  // Fix: Now onEdit is properly typed as a function
  }

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />
  }

  if (loading) {
    return <div>Loading suppliers...</div>
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Button onClick={() => onEdit({  // Fix: Now onEdit is properly typed as a function
            id: "",
            name: "",
            category: "",
            subcategory: "",
            expirationDate: "",
            contractNumber: "",
            threeYearSpend: 0,
            criticalityScore: 0,
            contractDescription: ""
          })}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Supplier Name <SortIndicator field="name" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  Category <SortIndicator field="category" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('subcategory')}
                >
                  Subcategory <SortIndicator field="subcategory" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('expirationDate')}
                >
                  Expiration Date <SortIndicator field="expirationDate" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('contractNumber')}
                >
                  Contract # <SortIndicator field="contractNumber" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('threeYearSpend')}
                >
                  3-yr Avg Spend <SortIndicator field="threeYearSpend" />
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSuppliersSorted.map((supplier) => (
                <TableRow 
                  key={supplier.id} 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleRowClick(supplier)}
                >
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>{supplier.subcategory}</TableCell>
                  <TableCell>{supplier.expirationDate}</TableCell>
                  <TableCell>{supplier.contractNumber}</TableCell>
                  <TableCell>${supplier.threeYearSpend.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-destructive hover:text-destructive-foreground"
                      onClick={(e) => {
                        e.stopPropagation() // Prevent row click
                        handleDeleteClick(e, supplier)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, suppliers.length)} of {suppliers.length} suppliers
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          supplierName={supplierToDelete?.name || ""}
        />
      </div>

      {/* Add the chart below the table */}
      <SupplierCriticalityChart 
        suppliers={suppliers.map(s => ({
          id: s.id,
          name: s.name,
          criticalityScore: s.criticalityScore
        }))} 
      />
    </div>
  )
} 