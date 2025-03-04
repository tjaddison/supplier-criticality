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
import { Input } from "@/components/ui/input"
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

// Target state options
const spendAllocationOptions = [
  { key: "Less than 10%", value: 1 },
  { key: "10-35%", value: 33 },
  { key: "36-70%", value: 66 },
  { key: "71+%", value: 100 }
]

const averageSpendOptions = [
  { key: "Less than $250k", value: 1 },
  { key: "$250k-$1M", value: 25 },
  { key: "$1M-$5M", value: 50 },
  { key: "$5-$10M", value: 75 },
  { key: "$10M+", value: 100 }
]

const contractsOptions = [
  { key: "One", value: 100 },
  { key: "Few (2-5)", value: 50 },
  { key: "Many (6 or more)", value: 1 }
]

const utilizationOptions = [
  { key: "Low", value: 1 },
  { key: "Moderate", value: 50 },
  { key: "High", value: 100 }
]

const riskOptions = [
  { key: "Low", value: 1 },
  { key: "Moderate", value: 50 },
  { key: "High", value: 100 }
]

// Component for the gauge/odometer chart
function SupplierGaugeChart({ 
  currentScore = 0, 
  targetScore = 0 
}: { 
  currentScore: number, 
  targetScore: number 
}) {
  // Chart parameters
  const radius = 160;
  const strokeWidth = 40;
  const centerX = 200;
  const centerY = 200;
  const startAngle = -180;
  const endAngle = 0;

  // Calculate position on arc for a given score (0-100)
  const calculatePosition = (score: number) => {
    const angle = startAngle + (score / 100) * (endAngle - startAngle);
    const radians = (angle * Math.PI) / 180;
    return {
      x: centerX + (radius - strokeWidth / 2) * Math.cos(radians),
      y: centerY + (radius - strokeWidth / 2) * Math.sin(radians)
    };
  };

  // Calculate angle for needle
  const calculateNeedleAngle = (score: number) => {
    return startAngle + (score / 100) * (endAngle - startAngle);
  };

  // Calculate SVG arc path
  const describeArc = (startPercent: number, endPercent: number, color: string) => {
    const start = calculatePosition(startPercent);
    const end = calculatePosition(endPercent);
    
    const largeArcFlag = endPercent - startPercent <= 50 ? 0 : 1;
    
    return (
      <path 
        d={`
          M ${start.x},${start.y}
          A ${radius - strokeWidth / 2},${radius - strokeWidth / 2} 0 ${largeArcFlag} 1 ${end.x},${end.y}
        `}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
      />
    );
  };

  // Create needle component
  const Needle = ({ score, color }: { score: number, color: string }) => {
    const needleLength = radius - 60;
    const angle = calculateNeedleAngle(score);
    const radians = (angle * Math.PI) / 180;
    const tipX = centerX + needleLength * Math.cos(radians);
    const tipY = centerY + needleLength * Math.sin(radians);
    
    return (
      <line
        x1={centerX}
        y1={centerY}
        x2={tipX}
        y2={tipY}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    );
  };

  // Create labels for the gauge (10, 20, 30, etc.)
  const createLabels = () => {
    const labels = [];
    for (let i = 10; i <= 100; i += 10) {
      const pos = calculatePosition(i);
      // Adjust position for better readability
      const offset = 25;
      const angleRad = ((startAngle + (i / 100) * (endAngle - startAngle)) * Math.PI) / 180;
      const labelX = pos.x + offset * Math.cos(angleRad);
      const labelY = pos.y + offset * Math.sin(angleRad);
      
      labels.push(
        <text
          key={`label-${i}`}
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#4B5563"
        >
          {i}
        </text>
      );
    }
    return labels;
  };

  // Create dividing lines between sections
  const createDividers = () => {
    const dividers = [20, 40, 90]; // Divider positions
    return dividers.map(pos => {
      const angle = calculateNeedleAngle(pos);
      const radians = (angle * Math.PI) / 180;
      const innerX = centerX + (radius - strokeWidth) * Math.cos(radians);
      const innerY = centerY + (radius - strokeWidth) * Math.sin(radians);
      const outerX = centerX + radius * Math.cos(radians);
      const outerY = centerY + radius * Math.sin(radians);
      
      return (
        <line
          key={`divider-${pos}`}
          x1={innerX}
          y1={innerY}
          x2={outerX}
          y2={outerY}
          stroke="white"
          strokeWidth={2}
        />
      );
    });
  };

  // Calculate the percentage for target score
  const targetPercentage = Math.round((targetScore / 100) * 100);

  return (
    <div className="w-full flex justify-center">
      <svg width="400" height="300" viewBox="0 0 400 300">
        {/* Gauge background sections */}
        {describeArc(0, 20, 'rgb(209, 213, 219)')} {/* Transactional: Light gray */}
        {describeArc(20, 40, 'rgb(156, 163, 175)')} {/* Acquisitional: Medium gray */}
        {describeArc(40, 90, 'rgb(75, 85, 99)')}  {/* Strategic: Dark gray */}
        {describeArc(90, 100, 'rgb(55, 65, 81)')}  {/* Critical: Very dark gray */}

        {/* White divider lines between sections */}
        {createDividers()}
        
        {/* Numeric Labels */}
        {createLabels()}
        
        {/* Relationship type labels - positioned in the center of each section */}
        <text x="110" y="235" fontSize="14" fontWeight="500" fill="#6B7280" textAnchor="middle">Transactional</text>
        <text x="130" y="170" fontSize="14" fontWeight="500" fill="#6B7280" textAnchor="middle">Acquisitional</text>
        <text x="240" y="150" fontSize="14" fontWeight="500" fill="#F9FAFB" textAnchor="middle">Strategic</text>
        <text x="320" y="180" fontSize="14" fontWeight="500" fill="#F9FAFB" textAnchor="middle">Critical</text>
        
        {/* Current and Target state labels */}
        <text x="70" y="270" fontSize="14" fontWeight="bold" fill="#1F2937">Current State</text>
        <text x="330" y="270" fontSize="14" fontWeight="bold" fill="#1F2937">Target State</text>
        
        {/* Needles */}
        <Needle score={currentScore} color="black" />
        <Needle score={targetScore} color="#22C55E" /> {/* Green */}
        
        {/* Target Score Tooltip/Info Box */}
        <g transform={`translate(${calculatePosition(targetScore).x - 70}, ${calculatePosition(targetScore).y - 60})`}>
          <rect 
            width="160" 
            height="50" 
            fill="#1F2937" 
            rx="4"
          />
          <text x="10" y="20" fill="white" fontSize="12">
            Series "Target State" Point 1
          </text>
          <text x="10" y="38" fill="white" fontSize="14" fontWeight="bold">
            Value: {targetScore.toFixed(1)} ({targetPercentage}%)
          </text>
        </g>
      </svg>
    </div>
  );
}

export default function MicroSupplierTierClient({ initialSuppliers }: MicroSupplierTierClientProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null)
  
  // Target state form values
  const [targetState, setTargetState] = useState({
    spendAllocation: { selected: "", value: 0, weight: 20 },
    averageSpend: { selected: "", value: 0, weight: 30 },
    contracts: { selected: "", value: 0, weight: 5 },
    complexity: { selected: "", value: 0, weight: 10 },
    utilization: { selected: "", value: 0, weight: 10 },
    risk: { selected: "", value: 0, weight: 25 }
  })

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

  // Handle target state form changes
  const handleTargetStateChange = (field: string, type: 'selected' | 'weight', value: string) => {
    setTargetState(prev => {
      const newState = { ...prev }
      if (type === 'selected') {
        const option = getOptionByKey(field, value)
        newState[field as keyof typeof prev] = {
          ...newState[field as keyof typeof prev],
          selected: value,
          value: option?.value || 0
        }
      } else {
        newState[field as keyof typeof prev] = {
          ...newState[field as keyof typeof prev],
          weight: parseInt(value) || 0
        }
      }
      return newState
    })
  }

  // Helper to get option by key
  const getOptionByKey = (field: string, key: string) => {
    switch (field) {
      case 'spendAllocation':
        return spendAllocationOptions.find(opt => opt.key === key)
      case 'averageSpend':
        return averageSpendOptions.find(opt => opt.key === key)
      case 'contracts':
        return contractsOptions.find(opt => opt.key === key)
      case 'utilization':
        return utilizationOptions.find(opt => opt.key === key)
      case 'risk':
        return riskOptions.find(opt => opt.key === key)
      case 'complexity':
        return utilizationOptions.find(opt => opt.key === key) // Reusing utilization options for complexity
      default:
        return null
    }
  }

  // Calculate target state weighted score
  const calculateTargetScore = () => {
    const { spendAllocation, averageSpend, contracts, complexity, utilization, risk } = targetState
    
    const weightedSpendAllocation = (spendAllocation.value * spendAllocation.weight) / 100
    const weightedAverageSpend = (averageSpend.value * averageSpend.weight) / 100
    const weightedContracts = (contracts.value * contracts.weight) / 100
    const weightedComplexity = (complexity.value * complexity.weight) / 100
    const weightedUtilization = (utilization.value * utilization.weight) / 100
    const weightedRisk = (risk.value * risk.weight) / 100
    
    const totalScore = weightedSpendAllocation + weightedAverageSpend + weightedContracts + 
                       weightedComplexity + weightedUtilization + weightedRisk
    
    return {
      totalScore,
      relationship: getRelationshipType(totalScore)
    }
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

  // Calculate target state score if all fields are filled
  const targetScore = useMemo(() => {
    const { spendAllocation, averageSpend, contracts, complexity, utilization, risk } = targetState
    if (spendAllocation.selected && averageSpend.selected && contracts.selected && 
        complexity.selected && utilization.selected && risk.selected) {
      return calculateTargetScore()
    }
    return null
  }, [targetState])

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
            <div className="space-y-6">
              {/* Spend Allocation */}
              <div className="space-y-2">
                <Label className="text-sm">
                  What is the anticipated supplier spend allocation moving forward if awarded an agreement in relation to either the total subcategory or category
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Select 
                      onValueChange={(value) => handleTargetStateChange('spendAllocation', 'selected', value)}
                      value={targetState.spendAllocation.selected}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select allocation" />
                      </SelectTrigger>
                      <SelectContent>
                        {spendAllocationOptions.map(option => (
                          <SelectItem key={option.key} value={option.key}>
                            {option.key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Input 
                      type="number" 
                      placeholder="Weight %" 
                      value={targetState.spendAllocation.weight}
                      onChange={(e) => handleTargetStateChange('spendAllocation', 'weight', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Average Spend */}
              <div className="space-y-2">
                <Label className="text-sm">
                  What is the expected 3 year average spend?
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Select 
                      onValueChange={(value) => handleTargetStateChange('averageSpend', 'selected', value)}
                      value={targetState.averageSpend.selected}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select spend" />
                      </SelectTrigger>
                      <SelectContent>
                        {averageSpendOptions.map(option => (
                          <SelectItem key={option.key} value={option.key}>
                            {option.key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Input 
                      type="number" 
                      placeholder="Weight %" 
                      value={targetState.averageSpend.weight}
                      onChange={(e) => handleTargetStateChange('averageSpend', 'weight', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Contracts */}
              <div className="space-y-2">
                <Label className="text-sm">
                  What is the optimal number of available contracts in this subcategory? (one, few (2-5), many (6+))
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Select 
                      onValueChange={(value) => handleTargetStateChange('contracts', 'selected', value)}
                      value={targetState.contracts.selected}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        {contractsOptions.map(option => (
                          <SelectItem key={option.key} value={option.key}>
                            {option.key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Input 
                      type="number" 
                      placeholder="Weight %" 
                      value={targetState.contracts.weight}
                      onChange={(e) => handleTargetStateChange('contracts', 'weight', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Complexity */}
              <div className="space-y-2">
                <Label className="text-sm">
                  What is the anticipated complexity to replacing the supplier if necessary in the future?
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Select 
                      onValueChange={(value) => handleTargetStateChange('complexity', 'selected', value)}
                      value={targetState.complexity.selected}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        {utilizationOptions.map(option => (
                          <SelectItem key={option.key} value={option.key}>
                            {option.key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Input 
                      type="number" 
                      placeholder="Weight %" 
                      value={targetState.complexity.weight}
                      onChange={(e) => handleTargetStateChange('complexity', 'weight', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Utilization */}
              <div className="space-y-2">
                <Label className="text-sm">
                  What is the anticipated utilization across the customer base?
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Select 
                      onValueChange={(value) => handleTargetStateChange('utilization', 'selected', value)}
                      value={targetState.utilization.selected}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select utilization" />
                      </SelectTrigger>
                      <SelectContent>
                        {utilizationOptions.map(option => (
                          <SelectItem key={option.key} value={option.key}>
                            {option.key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Input 
                      type="number" 
                      placeholder="Weight %" 
                      value={targetState.utilization.weight}
                      onChange={(e) => handleTargetStateChange('utilization', 'weight', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Risk */}
              <div className="space-y-2">
                <Label className="text-sm">
                  What is the associated risk level for this supplier/subcategory in the future?
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Select 
                      onValueChange={(value) => handleTargetStateChange('risk', 'selected', value)}
                      value={targetState.risk.selected}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk" />
                      </SelectTrigger>
                      <SelectContent>
                        {riskOptions.map(option => (
                          <SelectItem key={option.key} value={option.key}>
                            {option.key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Input 
                      type="number" 
                      placeholder="Weight %" 
                      value={targetState.risk.weight}
                      onChange={(e) => handleTargetStateChange('risk', 'weight', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Results */}
              {targetScore && (
                <div className="pt-4 border-t space-y-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-bold">
                      Target Weighted Total Score
                    </Label>
                    <p className="font-bold text-xl">{targetScore.totalScore.toFixed(1)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm font-bold">
                      Target Relationship
                    </Label>
                    <p className="font-bold text-xl">{targetScore.relationship}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Comparative Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {calculatedValues && targetScore ? (
            <SupplierGaugeChart 
              currentScore={calculatedValues.criticalityScore} 
              targetScore={targetScore.totalScore} 
            />
          ) : (
            <p className="text-gray-500">Select a supplier and fill out the target state form to see the comparative analysis.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 