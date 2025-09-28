"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
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
  // Chart parameters - Doubled size
  const radius = 360; // Doubled outer radius
  const innerRadius = 240; // Doubled inner radius
  const centerX = 500; // Adjusted center X for doubled size
  const centerY = 440; // Adjusted center Y for doubled size
  const startAngle = -180;
  const endAngle = 0;

  // Calculate position on arc (no changes needed, uses new radii)
  const calculatePosition = (score: number, r = radius) => {
    const angle = startAngle + (score / 100) * (endAngle - startAngle);
    const radians = (angle * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(radians),
      y: centerY + r * Math.sin(radians)
    };
  };

  // Calculate angle for needle (no changes needed)
  const calculateNeedleAngle = (score: number) => {
    return startAngle + (score / 100) * (endAngle - startAngle);
  };

  // Calculate SVG arc path for outer colored segments (no changes needed, uses new radii)
  const describeOuterArc = (startPercent: number, endPercent: number, color: string) => {
    const startOuter = calculatePosition(startPercent, radius);
    const endOuter = calculatePosition(endPercent, radius);
    const startInner = calculatePosition(startPercent, innerRadius);
    const endInner = calculatePosition(endPercent, innerRadius);
    const largeArcFlag = endPercent - startPercent <= 50 ? 0 : 1;

    return (
      <path
        key={`outer-arc-${startPercent}-${endPercent}`}
        d={`
          M ${startOuter.x},${startOuter.y}
          A ${radius},${radius} 0 ${largeArcFlag} 1 ${endOuter.x},${endOuter.y}
          L ${endInner.x},${endInner.y}
          A ${innerRadius},${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x},${startInner.y}
          Z
        `}
        fill={color}
        stroke="none" // Dividers handle lines
      />
    );
  };

   // Calculate SVG arc path for the inner gray ring segments (no changes needed, uses new radii)
   const describeInnerRingSegment = (startPercent: number, endPercent: number, color: string) => {
    const startOuter = calculatePosition(startPercent, innerRadius);
    const endOuter = calculatePosition(endPercent, innerRadius);
    const largeArcFlag = endPercent - startPercent <= 50 ? 0 : 1;

    // Path for each inner ring segment
    return (
      <path
        key={`inner-ring-${startPercent}-${endPercent}`}
        d={`
          M ${startOuter.x},${startOuter.y}
          A ${innerRadius},${innerRadius} 0 ${largeArcFlag} 1 ${endOuter.x},${endOuter.y}
          L ${centerX},${centerY} Z
        `}
        fill={color}
        stroke="none"
      />
    );
  };


  // Create needle component
  const Needle = ({ score, color, thickness = 5 }: { score: number, color: string, thickness?: number }) => {
    const needleLength = radius - 40; // Adjusted length for larger radius
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
        strokeWidth={thickness} // Keep thickness the same
        strokeLinecap="round"
      />
    );
  };

  // Create labels for the gauge (10, 20, 30, etc.)
  const createNumericLabels = () => {
    const labels = [];
    for (let i = 10; i <= 100; i += 10) {
      // Scaled offset for positioning labels outside larger gauge
      const pos = calculatePosition(i, radius + 40);
      labels.push(
        <text
          key={`label-${i}`}
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12" // Keep font size the same
          fontWeight="500"
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
    const dividerPositions = [20, 40, 90];
    return dividerPositions.map(pos => {
      const angle = calculateNeedleAngle(pos);
      const radians = (angle * Math.PI) / 180;
      // Scaled offsets for extending dividers
      const innerX = centerX + (innerRadius - 10) * Math.cos(radians);
      const innerY = centerY + (innerRadius - 10) * Math.sin(radians);
      const outerX = centerX + (radius + 10) * Math.cos(radians);
      const outerY = centerY + (radius + 10) * Math.sin(radians);

      return (
        <line
          key={`divider-${pos}`}
          x1={innerX}
          y1={innerY}
          x2={outerX}
          y2={outerY}
          stroke="white"
          strokeWidth={2} // Keep stroke width the same
        />
      );
    });
  };

  // Colors matching the first image provided (no changes needed)
  const colors = {
    transactionalOuter: 'rgb(203, 213, 225)',
    acquisitionalOuter: 'rgb(148, 163, 184)',
    strategicOuter: 'rgb(71, 85, 105)',
    criticalOuter: 'rgb(51, 65, 85)',
    transactionalInner: '#E5E7EB', // Light Gray
    acquisitionalInner: '#D1D5DB', // Medium Gray
    strategicInner: '#9CA3AF',     // Darker Gray
    criticalInner: '#6B7280',      // Very Dark Gray
    needleGreen: '#84CC16',        // Vibrant Green
    textDark: '#374151',
    textLight: '#FFFFFF'
  };

  // Helper to calculate text position within the inner ring segments
  const calculateInnerLabelPos = (score: number) => {
      // Scaled offset for positioning text well within the wider inner ring
      return calculatePosition(score, innerRadius - 60);
  }

  // Calculate positions for the dynamic state labels
  // Position "Current State" label near the green needle (targetScore)
  const currentStateLabelDynamicPos = calculatePosition(targetScore, radius + 40); // Offset from outer radius
  // Position "Target State" label near the black needle (currentScore)
  const targetStateLabelDynamicPos = calculatePosition(currentScore, radius + 40); // Offset from outer radius


  return (
    // Increased SVG size significantly
    <div className="w-full flex justify-center">
      <svg width="1000" height="700" viewBox="0 0 1000 700">
        {/* REMOVED Comparative Analysis Title */}
        {/* <text x="500" y="60" textAnchor="middle" fontSize="18" fontWeight="600" fill={colors.textDark}>
          Comparative Analysis
        </text> */}

        {/* Draw Inner Gray Ring Segments First */}
        {describeInnerRingSegment(0, 20, colors.transactionalInner)}
        {describeInnerRingSegment(20, 40, colors.acquisitionalInner)}
        {describeInnerRingSegment(40, 90, colors.strategicInner)}
        {describeInnerRingSegment(90, 100, colors.criticalInner)}


        {/* Draw Outer Colored Segments */}
        {describeOuterArc(0, 20, colors.transactionalOuter)}
        {describeOuterArc(20, 40, colors.acquisitionalOuter)}
        {describeOuterArc(40, 90, colors.strategicOuter)}
        {describeOuterArc(90, 100, colors.criticalOuter)}

        {/* Draw White Dividers Over Segments */}
        {createDividers()}

        {/* Draw Numeric Labels */}
        {createNumericLabels()}

        {/* Relationship type labels - positioned inside the inner ring segments */}
        {/* Keep font size the same */}
        <text {...calculateInnerLabelPos(10)} dy="5" fontSize="14" fill={colors.textDark} textAnchor="middle">Transactional</text>
        <text {...calculateInnerLabelPos(30)} dy="5" fontSize="14" fill={colors.textDark} textAnchor="middle">Acquisitional</text>
        <text {...calculateInnerLabelPos(65)} dy="5" fontSize="14" fill={colors.textLight} textAnchor="middle">Strategic</text>
        <text {...calculateInnerLabelPos(95)} dy="5" fontSize="14" fill={colors.textLight} textAnchor="middle">Critical</text>

        {/* Dynamically Positioned State Labels */}
        {/* "Current State" label follows the green needle (targetScore) */}
        <text
          x={currentStateLabelDynamicPos.x}
          y={currentStateLabelDynamicPos.y}
          fontSize="13"
          fontWeight="600"
          fill={colors.textDark}
          textAnchor="middle"
          dominantBaseline="middle" // Center vertically as well
        >
          Current State
        </text>
        {/* "Target State" label follows the black needle (currentScore) */}
        <text
          x={targetStateLabelDynamicPos.x}
          y={targetStateLabelDynamicPos.y}
          fontSize="13"
          fontWeight="600"
          fill={colors.textDark}
          textAnchor="middle"
          dominantBaseline="middle" // Center vertically as well
        >
          Target State
        </text>

        {/* Needles - Drawn last */}
        {/* Assign scores as per the first image */}
        <Needle score={currentScore} color="black" thickness={5} />           {/* Current is Black */}
        <Needle score={targetScore} color={colors.needleGreen} thickness={5} /> {/* Target is Green */}

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
      case 'complexity':
      case 'utilization':
        return utilizationOptions.find(opt => opt.key === key)
      case 'risk':
        return riskOptions.find(opt => opt.key === key)
      default:
        return null
    }
  }

  // Function to calculate target score (using useCallback to avoid dependency issues)
  const calculateTargetScore = useCallback(() => {
    const { spendAllocation, averageSpend, contracts, complexity, utilization, risk } = targetState
    
    const weightedSpendAllocation = (spendAllocation.value * spendAllocation.weight) / 100
    const weightedAverageSpend = (averageSpend.value * averageSpend.weight) / 100
    const weightedContracts = (contracts.value * contracts.weight) / 100
    const weightedComplexity = (complexity.value * complexity.weight) / 100
    const weightedUtilization = (utilization.value * utilization.weight) / 100
    const weightedRisk = (risk.value * risk.weight) / 100
    
    const totalScore = weightedSpendAllocation +
                     weightedAverageSpend +
                     weightedContracts +
                     weightedComplexity +
                     weightedUtilization +
                     weightedRisk
    
    return {
      totalScore,
      relationship: getRelationshipType(totalScore)
    }
  }, [targetState])

  // Calculate the target score whenever target state changes
  const [targetScore, setTargetScore] = useState<{ totalScore: number, relationship: string } | null>(null)
  
  // Update the target score when form values change
  useEffect(() => {
    // Check if all fields have values selected
    const allFieldsSelected = Object.values(targetState).every(field => field.selected !== "")
    
    if (allFieldsSelected) {
      setTargetScore(calculateTargetScore())
    } else {
      setTargetScore(null)
    }
  }, [targetState, calculateTargetScore])

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
      <h1 className="text-2xl font-bold">Comparative Criticality Assessment</h1>
      
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
                  What is the anticipated supplier spend allocation moving forward if awarded an agreement in relation to either the total subcategory or category?
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
                  What is the optimal number of available contracts in this subcategory? (one, few (2-5), many (6+))?
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