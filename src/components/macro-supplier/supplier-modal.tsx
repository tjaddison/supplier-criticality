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

interface SupplierModalProps {
  open: boolean
  supplier: Supplier | null
  weights: {
    spendPercentage: number
    threeYearAverage: number
    marketSize: number
    replacementComplexity: number
    utilization: number
    riskLevel: number
  }
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

  // Reset form when supplier changes
  useEffect(() => {
    if (supplier) {
      setFormData(supplier)
    }
  }, [supplier])

  const categories = ["Hardware", "Software", "Services"]
  const subcategories = {
    Hardware: ["Raw", "Printers", "Networking"],
    Software: ["OS", "Applications", "Security"],
    Services: ["Consulting", "Support", "Training"]
  }

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

  const formatCurrency = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '')
    // Convert to number and format
    const number = parseInt(digits) || 0
    return (number / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }

  const handleSpendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '')
    const numberValue = parseInt(rawValue) || 0
    handleInputChange('threeYearSpend', numberValue)
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh] w-[95vw] sm:w-[90vw] md:w-[85vw]">
        <DialogHeader>
          <DialogTitle>{supplier?.id ? "Edit" : "Add"} Supplier</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
                disabled={!formData.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {formData.category && subcategories[formData.category as keyof typeof subcategories].map((subcat) => (
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
                value={formData.threeYearSpend ? 
                  formatCurrency(formData.threeYearSpend.toString()) : 
                  ''
                }
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

          {supplier?.id && (
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold">Calculated Values</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Count of Suppliers</Label>
                  <div className="mt-1">{supplier.supplierCount || "N/A"}</div>
                </div>
                <div>
                  <Label>Contract % of Category</Label>
                  <div className="mt-1">{supplier.categoryPercentage}%</div>
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