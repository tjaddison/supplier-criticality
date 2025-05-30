"use client"

import { useState, useEffect } from "react"
import { CriteriaWeights } from "@/components/macro-supplier/criteria-weights"
import { SupplierList } from "@/components/macro-supplier/supplier-list"
import { SupplierModal } from "@/components/macro-supplier/supplier-modal"
import { DeleteConfirmationDialog } from "@/components/macro-supplier/delete-confirmation-dialog"
import { Supplier } from "@/types/supplier"
import {  
  createSupplier, 
  updateSupplier, 
  deleteSupplier,
  getCriteriaWeights,
  updateCriteriaWeights
} from "@/lib/dynamodb"
import { v4 as uuidv4 } from 'uuid'
import { InfoIcon, SlidersIcon } from "lucide-react"

// Renamed to WeightCriteria to avoid naming conflict with the component
interface WeightCriteria {
  spendPercentage: number
  threeYearAverage: number
  marketSize: number
  replacementComplexity: number
  utilization: number
  riskLevel: number
}

const DEFAULT_WEIGHTS: WeightCriteria = {
  spendPercentage: 20,
  threeYearAverage: 30,
  marketSize: 5,
  replacementComplexity: 10,
  utilization: 10,
  riskLevel: 25
}

export default function MacroSupplierTierPage() {
  const [weights, setWeights] = useState<WeightCriteria>(DEFAULT_WEIGHTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [loading, setLoading] = useState(true)

  // Mock user ID (replace with actual user authentication)
  const userId = "user123"

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load weights
      const savedWeights = await getCriteriaWeights(userId)
      if (savedWeights) {
        // Ensure all required fields are present with proper types
        const typedWeights: WeightCriteria = {
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
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWeightsChange = async (newWeights: WeightCriteria) => {
    try {
      await updateCriteriaWeights(userId, newWeights)
      setWeights(newWeights)
    } catch (error) {
      console.error('Error updating weights:', error)
    }
  }

  const handleSaveSupplier = async (supplier: Supplier) => {
    try {
      const userId = "user123" // Demo user ID

      if (supplier.id) {
        await updateSupplier(supplier, userId)
      } else {
        const newSupplier = {
          ...supplier,
          id: uuidv4(),
          userId
        }
        await createSupplier(newSupplier, userId)
      }

      // Trigger refresh by incrementing the counter
      setRefreshTrigger(prev => prev + 1)
      setModalOpen(false)
      setSelectedSupplier(null)
    } catch (error) {
      console.error('Error saving supplier:', error)
    }
  }

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier)
    setDeleteDialogOpen(true)
    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!supplierToDelete) return

    try {
      const userId = "user123" // Demo user ID
      await deleteSupplier(supplierToDelete.id, userId)
      
      // Trigger refresh
      setRefreshTrigger(prev => prev + 1)
      setDeleteDialogOpen(false)
      setSupplierToDelete(null)
    } catch (error) {
      console.error('Error deleting supplier:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg text-[#194866] flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mb-4"></div>
          Loading criteria and supplier data...
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#194866] text-white p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Macro Supplier Tier</h1>
        <p className="text-blue-100 text-sm md:text-base max-w-3xl mb-4">
          Analyze and manage your critical suppliers based on strategic importance, spend metrics, and risk factors.
        </p>
      </div>
      
      {/* Criteria Weights Panel */}
      <div className="bg-white dark:bg-gray-800 border-b shadow-sm p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4 text-[#194866]">
          <SlidersIcon className="h-5 w-5" />
          <h2 className="text-lg md:text-xl font-semibold">Criticality Criteria Weights</h2>
          <div className="rounded-full bg-blue-100 p-1" title="Adjust these weights to customize how supplier criticality is calculated">
            <InfoIcon className="h-4 w-4 text-blue-700" />
          </div>
        </div>
        <CriteriaWeights weights={weights} onWeightsChange={handleWeightsChange} />
      </div>

      {/* Scrollable Content Panel */}
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
        <SupplierList 
          weights={weights}
          refreshTrigger={refreshTrigger}
          onEdit={(supplier) => {
            setSelectedSupplier(supplier)
            setModalOpen(true)
          }}
          onDelete={handleDeleteClick}
        />
      </div>

      <SupplierModal 
        open={modalOpen}
        supplier={selectedSupplier}
        onClose={() => {
          setModalOpen(false)
          setSelectedSupplier(null)
        }}
        onSave={handleSaveSupplier}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        supplierName={supplierToDelete?.name || ""}
      />
    </div>
  )
} 