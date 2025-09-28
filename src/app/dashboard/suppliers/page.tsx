"use client"

import { useState, useCallback } from "react"
import { SupplierList } from "../../../components/macro-supplier/supplier-list"
import { Supplier } from "@/types/supplier"
import { SupplierModal } from "@/components/macro-supplier/supplier-modal"
import { CriteriaWeights } from "@/components/macro-supplier/criteria-weights"
import { updateCriteriaWeights, getCriteriaWeights } from "@/lib/dynamodb"
import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

const DEFAULT_WEIGHTS = {
  spendPercentage: 20,
  threeYearAverage: 20,
  marketSize: 15,
  replacementComplexity: 15,
  utilization: 15,
  riskLevel: 15
}

export default function SuppliersPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null)
  const [refreshTrigger] = useState(0)
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS)
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading, login, getUserId } = useAuth()

  const loadWeights = useCallback(async () => {
    try {
      const userId = getUserId()
      if (!userId) return

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
  }, [getUserId])

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadWeights()
      } else {
        setLoading(false)
      }
    }
  }, [user, authLoading, loadWeights])

  const handleViewSupplier = (supplier: Supplier) => {
    setCurrentSupplier(supplier)
    setModalOpen(true)
  }

  const handleWeightsChange = async (newWeights: typeof weights): Promise<void> => {
    try {
      const userId = getUserId()
      if (!userId) throw new Error('User not authenticated')

      await updateCriteriaWeights(userId, newWeights)
      setWeights(newWeights)
    } catch (error) {
      console.error('Error updating weights:', error)
      throw error
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg text-[#194866] flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mb-4"></div>
          Loading supplier data...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#194866] mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to access the supplier analysis dashboard.</p>
          <button
            onClick={login}
            className="px-6 py-3 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">Supplier Management</h1>

      <CriteriaWeights
        weights={weights}
        onWeightsChange={handleWeightsChange}
      />

      {getUserId() && (
        <SupplierList
          weights={weights}
          userId={getUserId()!}
          onView={handleViewSupplier}
          refreshTrigger={refreshTrigger}
        />
      )}

      <SupplierModal
        open={modalOpen}
        supplier={currentSupplier}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
} 