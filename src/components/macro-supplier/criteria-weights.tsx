"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface CriteriaWeightsProps {
  weights: {
    spendPercentage: number
    threeYearAverage: number
    marketSize: number
    replacementComplexity: number
    utilization: number
    riskLevel: number
  }
  onWeightsChange: (weights: CriteriaWeightsProps["weights"]) => void
}

export function CriteriaWeights({ weights, onWeightsChange }: CriteriaWeightsProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const handleWeightChange = (key: keyof typeof weights) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    onWeightsChange({ ...weights, [key]: value })
  }

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Criteria Weights</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className={cn(
        "grid transition-all duration-200",
        isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}>
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(weights).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <Label htmlFor={key}>
                  {key === "spendPercentage" && "What is the supplier spend in relation to the total subcategory?"}
                  {key === "threeYearAverage" && "What is the 3 year average spend?"}
                  {key === "marketSize" && "What is the market size (one, few, or many)?"}
                  {key === "replacementComplexity" && "What is the anticipated complexity to replacing the supplier if necessary?"}
                  {key === "utilization" && "How heavily utilized is the supplier(s) across the Commonwealth (low, moderate, high) relative to other suppliers in the subcategory"}
                  {key === "riskLevel" && "What is the associated risk level for this supplier (consider cloud, PII, type of data, financial investment)?"}
                </Label>
                <div className="relative w-24">
                  <input
                    id={key}
                    type="number"
                    value={value}
                    onChange={handleWeightChange(key as keyof typeof weights)}
                    className="w-full pr-8 text-right rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            Total Weight: {totalWeight}% {totalWeight !== 100 && "(Should equal 100%)"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 