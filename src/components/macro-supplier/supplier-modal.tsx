"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Supplier } from "@/types/supplier"
import { getUniqueSubcategories } from "@/lib/dynamodb"

interface SupplierModalProps {
  open: boolean
  supplier: Supplier | null
  onClose: () => void
  onSave: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}

export function SupplierModal({ 
  open, 
  supplier, 
  onClose,
  onSave,
  onDelete 
}: SupplierModalProps) {
  const [activeTab, setActiveTab] = useState('details')
  const [formData, setFormData] = useState<Supplier>(supplier || {
    id: "",
    name: "",
    category: "",
    subcategory: "",
    expirationDate: "",
    contractNumber: "",
    threeYearSpend: 0,
    criticalityScore: 0,
    contractDescription: ""
  })
  const [subcategories, setSubcategories] = useState<{ [category: string]: string[] }>({})
  const [loading, setLoading] = useState(true)

  // Reset form when supplier changes
  useEffect(() => {
    if (supplier) {
      setFormData(supplier)
    }
  }, [supplier])

  // Add useEffect to load subcategories
  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        const userId = "user123" // Demo user ID
        const data = await getUniqueSubcategories(userId)
        setSubcategories(data)
      } catch (error) {
        console.error('Error loading subcategories:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSubcategories()
  }, [])

  // Use these categories from the database instead of hardcoded ones
  const categories = Object.keys(subcategories)

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= 1000) {
      setFormData(prev => ({ ...prev, contractDescription: text }))
    }
  }

  const handleInputChange = (field: keyof Supplier, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      handleInputChange('expirationDate', format(date, 'yyyy-MM-dd'))
    }
  }

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const handleSpendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove currency formatting to get raw number
    const rawValue = e.target.value.replace(/[^0-9.]/g, '')
    const numberValue = parseFloat(rawValue) || 0
    handleInputChange('threeYearSpend', numberValue)
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{supplier?.id ? "Edit" : "Add"} Supplier</DialogTitle>
        </DialogHeader>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('details')}
              className={cn(
                "py-2 border-b-2 font-medium text-sm",
                activeTab === 'details'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              )}
            >
              Supplier Details
            </button>
            <button
              onClick={() => setActiveTab('calculated')}
              disabled={!supplier?.id}
              className={cn(
                "py-2 border-b-2 font-medium text-sm",
                activeTab === 'calculated'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300",
                !supplier?.id && "opacity-50 cursor-not-allowed"
              )}
            >
              Calculated Values
            </button>
          </nav>
        </div>

        <div className="py-4">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Supplier Name</Label>
                <Input 
                  id="name" 
                  value={formData.name || ''} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(value) => handleInputChange('subcategory', value)}
                  disabled={!formData.category || loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Loading subcategories..." : "Select subcategory"} />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && subcategories[formData.category]?.map((subcat) => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.expirationDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expirationDate ? format(new Date(formData.expirationDate), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.expirationDate ? new Date(formData.expirationDate) : undefined}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractNumber">Contract Number</Label>
                <Input 
                  id="contractNumber" 
                  value={formData.contractNumber || ''} 
                  onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                  placeholder="CTR-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="threeYearSpend">3-Year Average Spend</Label>
                <Input 
                  id="threeYearSpend" 
                  value={formatCurrency(formData.threeYearSpend)} 
                  onChange={handleSpendChange}
                  placeholder="$0.00"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="contractDescription">Contract Description</Label>
                <Textarea
                  id="contractDescription"
                  value={formData.contractDescription || ''}
                  onChange={handleDescriptionChange}
                  placeholder="Enter contract description..."
                  className="resize-none h-32"
                />
                <p className="text-sm text-muted-foreground">
                  {formData.contractDescription?.length || 0}/1000 characters
                </p>
              </div>
            </div>
          )}

          {activeTab === 'calculated' && supplier?.id && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contract % of Category</Label>
                  <div className="mt-1 text-2xl font-semibold">
                    {supplier.categoryPercentage?.toFixed(2)}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Percentage of total spend in {supplier.category} category
                  </p>
                </div>
                <div>
                  <Label>Contract % of Subcategory</Label>
                  <div className="mt-1 text-2xl font-semibold">
                    {supplier.subcategoryPercentage?.toFixed(2)}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Percentage of total spend in {supplier.subcategory} subcategory
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Spend (000s)</Label>
                  <div className="mt-1 text-2xl font-semibold">
                    {supplier.spendCategory}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on 3-year average spend
                  </p>
                </div>
                <div>
                  <Label>Subcategory Size</Label>
                  <div className="mt-1 text-2xl font-semibold">
                    {supplier.subcategorySize === "many" ? "Many (6 or more)" :
                     supplier.subcategorySize === "few" ? "Few (2-5)" :
                     "One"}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on number of suppliers ({supplier.subcategoryCount})
                  </p>
                </div>
                <div>
                  <Label>Spend Allocation</Label>
                  <div className="mt-1 text-2xl font-semibold">
                    {supplier.spendAllocation}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on subcategory spend percentage
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <div>
            {supplier?.id && (
              <Button
                variant="destructive"
                onClick={() => onDelete(supplier)}
              >
                Delete Supplier
              </Button>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 sm:flex-none">
              {supplier?.id ? "Save Changes" : "Create Supplier"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 