"use client"

import { useState, useMemo } from "react"
import { Supplier } from "@/types/supplier"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  calculateSubcategoryPercentage,
  calculateSubcategoryCount,
  getSpendAllocationCategory,
  getSpendCategory,
  getSubcategorySize,
  getHiddenSpendAllocation,
  getHiddenSpendValue,
  getHiddenSubcategorySize,
  calculateHiddenUtilization,
  calculateHiddenEaseOfReplacement,
  calculateHiddenRisk,
  getEaseOfReplacement,
  getUtilizationLevel,
  getRiskLevel,
  calculateHiddenWeightsSpendAllocation,
  calculateHiddenWeightsSpendValue,
  calculateHiddenWeightsSubcategorySize,
  calculateHiddenWeightsEaseOfReplacement,
  calculateHiddenWeightsUtilization,
  calculateHiddenWeightsRisk
} from "@/lib/utils/calculations"

interface MicroSupplierTierClientProps {
  initialSuppliers: Supplier[]
}

// Function to determine relationship type based on criticality score
function getRelationshipType(score: number): string {
  if (score <= 20) return "Transactional"
  if (score <= 40) return "Acquisitional"
  if (score <= 90) return "Strategic"
  return "Critical"
}

export default function MicroSupplierTierClient({ initialSuppliers }: MicroSupplierTierClientProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null)

  // Sort suppliers alphabetically by name
  const sortedSuppliers = useMemo(() => {
    return [...initialSuppliers].sort((a, b) => a.name.localeCompare(b.name))
  }, [initialSuppliers])

  // Default weights
  const weights = {
    spendPercentage: 20,
    threeYearAverage: 20,
    marketSize: 15,
    replacementComplexity: 15,
    utilization: 15,
    riskLevel: 15
  }

  // Handle supplier selection
  const handleSupplierChange = (supplierId: string) => {
    setSelectedSupplierId(supplierId)
  }

  // Get the selected supplier
  const selectedSupplier = selectedSupplierId 
    ? initialSuppliers.find(s => s.id === selectedSupplierId) 
    : null

  // Calculate values for the selected supplier
  let calculatedValues = null
  if (selectedSupplier) {
    const subcategoryPercentage = calculateSubcategoryPercentage(selectedSupplier, initialSuppliers)
    const subcategoryCount = calculateSubcategoryCount(selectedSupplier, initialSuppliers)
    const spendAllocation = getSpendAllocationCategory(subcategoryPercentage)
    const spendCategory = getSpendCategory(selectedSupplier.threeYearSpend)
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
    
    // Calculate the overall criticality value (Supplier Criticality Value)
    const criticalityScore = 
      hiddenWeightsSpendAllocation +
      hiddenWeightsSpendValue +
      hiddenWeightsSubcategorySize +
      hiddenWeightsEaseOfReplacement +
      hiddenWeightsUtilization +
      hiddenWeightsRisk;
    
    // Determine relationship type based on criticality score
    const relationshipType = getRelationshipType(criticalityScore)
    
    calculatedValues = {
      subcategoryPercentage,
      spendAllocation,
      spendCategory,
      subcategoryCount,
      subcategorySize,
      easeOfReplacement: getEaseOfReplacement(hiddenEaseOfReplacement),
      utilization: getUtilizationLevel(hiddenUtilization),
      risk: getRiskLevel(hiddenRisk),
      hiddenSpendAllocation,
      hiddenSpendValue,
      hiddenSubcategorySize,
      hiddenUtilization,
      hiddenEaseOfReplacement,
      hiddenRisk,
      criticalityScore,
      relationshipType
    }
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Micro Supplier Tier</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Current State Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="supplier-select">Select a Supplier</Label>
                <Select onValueChange={handleSupplierChange}>
                  <SelectTrigger id="supplier-select">
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedSuppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSupplier && calculatedValues && (
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-500">
                        What is the supplier spend allocation in relation to either the total subcategory or category?
                      </Label>
                      <p className="font-medium">{calculatedValues.spendAllocation} ({calculatedValues.subcategoryPercentage.toFixed(2)}%)</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-500">
                        What is the 3 year average spend?
                      </Label>
                      <p className="font-medium">{calculatedValues.spendCategory} (${selectedSupplier.threeYearSpend.toLocaleString()})</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-500">
                        What is the number of available contracts in the subcategory? (One, Few (2-5), Many (6+))?
                      </Label>
                      <p className="font-medium">{calculatedValues.subcategorySize} ({calculatedValues.subcategoryCount})</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-500">
                        What is the anticipated complexity to replacing the supplier if necessary?
                      </Label>
                      <p className="font-medium">{calculatedValues.easeOfReplacement}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-500">
                        How heavily utilized is the supplier(s) across the customer base?
                      </Label>
                      <p className="font-medium">{calculatedValues.utilization}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-500">
                        What is the associated risk level for this supplier/subcategory?
                      </Label>
                      <p className="font-medium">{calculatedValues.risk}</p>
                    </div>
                    
                    <div className="space-y-1 pt-2 border-t">
                      <Label className="text-sm font-bold">
                        Weighted Total Score
                      </Label>
                      <p className="font-bold text-xl">{calculatedValues.criticalityScore.toFixed(1)}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm font-bold">
                        Current Relationship
                      </Label>
                      <p className="font-bold text-xl">{calculatedValues.relationshipType}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Target State Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Target state analysis will be implemented in a future update.</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Comparative Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Odometer chart for comparative analysis will be implemented in a future update.</p>
        </CardContent>
      </Card>
    </div>
  )
} 