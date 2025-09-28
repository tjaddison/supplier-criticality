"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Supplier } from "@/types/supplier"

interface SupplierModalProps {
  open: boolean
  supplier: Supplier | null
  onClose: () => void
}

export function SupplierModal({
  open,
  supplier,
  onClose
}: SupplierModalProps) {
  const [activeTab, setActiveTab] = useState('details')

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  if (!supplier) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Supplier Details - {supplier?.name}</DialogTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-muted-foreground">Supplier Name</Label>
                <div className="mt-1 text-lg font-semibold">{supplier.name}</div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                <div className="mt-1 text-lg font-semibold">{supplier.category}</div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-muted-foreground">Subcategory</Label>
                <div className="mt-1 text-lg font-semibold">{supplier.subcategory}</div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-muted-foreground">Expiration Date</Label>
                <div className="mt-1 text-lg font-semibold">
                  {supplier.expirationDate ? format(new Date(supplier.expirationDate), "PPP") : "Not specified"}
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-muted-foreground">Contract Number</Label>
                <div className="mt-1 text-lg font-semibold">{supplier.contractNumber || "Not specified"}</div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-muted-foreground">3-Year Average Spend</Label>
                <div className="mt-1 text-lg font-semibold">{formatCurrency(supplier.threeYearSpend)}</div>
              </div>

              {supplier.contractDescription && (
                <div className="bg-muted/50 p-4 rounded-lg col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Contract Description</Label>
                  <div className="mt-1 text-base whitespace-pre-wrap">{supplier.contractDescription}</div>
                </div>
              )}

              <div className="bg-primary/10 p-4 rounded-lg col-span-2">
                <Label className="text-sm font-medium text-muted-foreground">Criticality Score</Label>
                <div className="mt-1 text-2xl font-bold text-primary">
                  {supplier.criticalityScore?.toFixed(2) || 'Not calculated'}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Overall risk assessment based on weighted criteria
                </p>
              </div>
            </div>
          )}

          {activeTab === 'calculated' && supplier && (
            <div className="space-y-8">
              {/* Contract Percentages Section */}
              <div>
                <h3 className="text-lg font-medium mb-3">Contract Percentages</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <Label>Contract % of Category</Label>
                    <div className="mt-1 text-2xl font-semibold">
                      {supplier.categoryPercentage?.toFixed(2)}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Percentage of total spend in {supplier.category} category
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <Label>Contract % of Subcategory</Label>
                    <div className="mt-1 text-2xl font-semibold">
                      {supplier.subcategoryPercentage?.toFixed(2)}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Percentage of total spend in {supplier.subcategory} subcategory
                    </p>
                  </div>
                </div>
              </div>

              {/* Spend & Market Information */}
              <div>
                <h3 className="text-lg font-medium mb-3">Spend & Market Information</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <Label>Spend (000s)</Label>
                    <div className="mt-1 text-2xl font-semibold">
                      {supplier.spendCategory}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on 3-year average spend
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
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
                  <div className="bg-muted/50 p-4 rounded-lg">
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

              {/* Risk Assessment */}
              <div>
                <h3 className="text-lg font-medium mb-3">Risk Assessment</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className={`p-4 rounded-lg ${
                    supplier.easeOfReplacement === "Challenging" ? "bg-red-50 dark:bg-red-950/20" :
                    supplier.easeOfReplacement === "Moderate Difficulty" ? "bg-yellow-50 dark:bg-yellow-950/20" :
                    "bg-green-50 dark:bg-green-950/20"
                  }`}>
                    <Label>Ease of Replacement</Label>
                    <div className="mt-1 text-2xl font-semibold">
                      {supplier.easeOfReplacement}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on spend, utilization, and market size
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    supplier.utilization === "High" ? "bg-red-50 dark:bg-red-950/20" :
                    supplier.utilization === "Moderate" ? "bg-yellow-50 dark:bg-yellow-950/20" :
                    "bg-green-50 dark:bg-green-950/20"
                  }`}>
                    <Label>Utilization</Label>
                    <div className="mt-1 text-2xl font-semibold">
                      {supplier.utilization}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on spend allocation and spend value
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    supplier.risk === "High" ? "bg-red-50 dark:bg-red-950/20" :
                    supplier.risk === "Moderate" ? "bg-yellow-50 dark:bg-yellow-950/20" :
                    "bg-green-50 dark:bg-green-950/20"
                  }`}>
                    <Label>Overall Risk</Label>
                    <div className="mt-1 text-2xl font-semibold">
                      {supplier.risk}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on ease of replacement and utilization
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}