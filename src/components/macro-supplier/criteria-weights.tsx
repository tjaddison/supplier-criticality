"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, Info, ChevronDown, ChevronUp, SlidersIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CriteriaWeightsProps {
  weights: {
    spendPercentage: number
    threeYearAverage: number
    marketSize: number
    replacementComplexity: number
    utilization: number
    riskLevel: number
  }
  onWeightsChange: (weights: CriteriaWeightsProps["weights"]) => Promise<void>
}

export function CriteriaWeights({ weights, onWeightsChange }: CriteriaWeightsProps) {
  const [localWeights, setLocalWeights] = useState(weights)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(true)

  // Calculate total percentage
  const totalPercentage = Object.values(localWeights).reduce((sum, value) => sum + value, 0)
  const isValid = totalPercentage === 100

  useEffect(() => {
    if (!isEditing) {
      setLocalWeights(weights)
    }
  }, [weights, isEditing])

  const handleSliderChange = (field: keyof typeof weights, value: number[]) => {
    const newValue = value[0]
    const currentValue = localWeights[field]
    const diff = newValue - currentValue
    
    // If adding this change would exceed 100%, don't allow the change
    if (totalPercentage + diff > 100) {
      return
    }
    
    setError(null)
    setLocalWeights(prev => ({
      ...prev,
      [field]: newValue
    }))
  }

  const handleInputChange = (field: keyof typeof weights, value: string) => {
    const numValue = parseInt(value) || 0
    
    // Ensure the value is between 0 and 100
    const clampedValue = Math.max(0, Math.min(100, numValue))
    
    const currentValue = localWeights[field]
    const diff = clampedValue - currentValue
    
    // If adding this change would exceed 100%, don't allow the change
    if (totalPercentage + diff > 100) {
      return
    }
    
    setError(null)
    setLocalWeights(prev => ({
      ...prev,
      [field]: clampedValue
    }))
  }

  const handleSave = async () => {
    if (isValid) {
      try {
        await onWeightsChange(localWeights)
        setIsEditing(false)
        setError(null)
      } catch (error) {
        console.error('Error saving weights:', error)
        setError("Failed to save weights. Please try again.")
      }
    } else {
      setError("Total percentage must equal 100% before saving")
    }
  }

  const handleCancel = () => {
    setLocalWeights(weights)
    setIsEditing(false)
    setError(null)
  }

  return (
    <Card className="border-[#194866]/20 shadow-sm">
      <CardHeader className="pb-3 bg-gradient-to-r from-[#f0f9fa] to-white cursor-pointer" onClick={() => !isEditing && setIsCollapsed(!isCollapsed)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersIcon className="h-5 w-5 text-[#194866]" />
            <CardTitle className="text-[#194866]">Criticality Criteria Weights</CardTitle>
            <Popover>
              <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button type="button" className="rounded-full bg-[#3CDBDD]/20 p-1 hover:bg-[#3CDBDD]/30 transition-colors">
                  <Info className="h-4 w-4 text-[#194866]" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                Adjust these weights to customize how supplier criticality is calculated. Total must equal 100%.
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditing(true)
                    setIsCollapsed(false)
                  }}
                  className="bg-[#194866] hover:bg-[#3CDBDD] text-white"
                >
                  Edit Weights
                </Button>
                <button onClick={(e) => {
                  e.stopPropagation()
                  setIsCollapsed(!isCollapsed)
                }}>
                  {isCollapsed ? <ChevronDown className="h-5 w-5 text-[#194866]" /> : <ChevronUp className="h-5 w-5 text-[#194866]" />}
                </button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel} className="border-[#194866] text-[#194866] hover:bg-[#194866] hover:text-white">Cancel</Button>
                <Button onClick={handleSave} disabled={!isValid} className="bg-[#3CDBDD] hover:bg-[#194866] text-white">Save Changes</Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      {!isCollapsed && <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(localWeights).map(([key, value]) => {
              const field = key as keyof typeof weights
              const label = {
                spendPercentage: "Size of Market",
                threeYearAverage: "Spend",
                marketSize: "Size of Contract Pool",
                replacementComplexity: "Ease of Replacement",
                utilization: "Utilization",
                riskLevel: "Risk"
              }[field]

              const definition = {
                spendPercentage: "Number of suppliers within the industry.",
                threeYearAverage: "The total spend with each supplier.",
                marketSize: "The count of contracted suppliers that offer the same good and/or services.",
                replacementComplexity: "The difficulty of transitioning from one supplier to a new one.",
                utilization: "The utilization rate of a supplier compared to other contracted suppliers.",
                riskLevel: "The level of risk associated with each supplier."
              }[field]

              return (
                <div key={field} className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor={field}>{label}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                          <Info className="h-3 w-3" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 text-sm">
                        {definition}
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex justify-between items-center">
                    <Slider
                      id={`${field}-slider`}
                      value={[value]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(newValue) => handleSliderChange(field, newValue)}
                      disabled={!isEditing}
                      className="flex-1 mr-4"
                    />
                    <div className="flex items-center gap-1">
                      <Input
                        id={field}
                        type="number"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-16 text-right"
                        disabled={!isEditing}
                      />
                      <span>%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 p-3 bg-gradient-to-r from-[#E5F9FA] to-white rounded-md flex justify-between items-center border border-[#3CDBDD]/30">
            <span className="font-medium text-[#194866]">Total:</span>
            <span className={`font-bold ${isValid ? 'text-[#3CDBDD]' : 'text-[#FF7D4D]'}`}>
              {totalPercentage}%
            </span>
          </div>
        </div>
      </CardContent>}
    </Card>
  )
} 