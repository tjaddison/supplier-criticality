"use client"

import { useState } from "react"
import { SupplierList } from "../../../components/macro-supplier/supplier-list"
import { CriteriaWeights } from "@/components/macro-supplier/criteria-weights"
import { updateCriteriaWeights, getCriteriaWeights } from "@/lib/dynamodb"
import { useEffect } from "react"

const DEFAULT_WEIGHTS = {
  spendPercentage: 20,
  threeYearAverage: 20,
  marketSize: 15,
  replacementComplexity: 15,
  utilization: 15,
  riskLevel: 15
}

export default function SuppliersPage() {
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS)
  const [loading, setLoading] = useState(true)
  const userId = "user123" // Demo user ID

  useEffect(() => {
    loadWeights()
  }, [])

  const loadWeights = async () => {
    try {
      const savedWeights = await getCriteriaWeights(userId)
      if (savedWeights) {
        const typedWeights = {
          spendPercentage: Number(savedWeights.spendPercentage) || DEFAULT_WEIGHTS.spendPercentage,
          threeYearAverage: Number(savedWeights.threeYearAverage) || DEFAULT_WEIGHTS.threeYearAverage,
          marketSize: Number(savedWeights.marketSize) || DEFAULT_WEIGHTS.marketSize,
          replacementComplexity: Number(savedWeights.replacementComplexity) || DEFAULT_WEIGHTS.replacementComplexity,
          utilization: Number(savedWeights.utilization) || DEFAULT_WEIGHTS.utilization,
          riskLevel: Number(savedWeights.riskLevel) || DEFAULT_WEIGHTS.riskLevel,
        }
        setWeights(typedWeights)
      }
    } catch (error) {
      console.error('Error loading weights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWeightsChange = async (newWeights: typeof weights) => {
    try {
      await updateCriteriaWeights(userId, newWeights)
      setWeights(newWeights)
    } catch (error) {
      console.error('Error updating weights:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg text-[#194866] flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mb-4"></div>
          Loading supplier data...
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">Supplier Analysis</h1>

      <CriteriaWeights
        weights={weights}
        onWeightsChange={handleWeightsChange}
      />

      <SupplierList weights={weights} />
    </div>
  )
} 