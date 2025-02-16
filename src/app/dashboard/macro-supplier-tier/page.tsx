"use client"

import { useState, useEffect } from "react"
import { CriteriaWeights } from "@/components/macro-supplier/criteria-weights"
import { SupplierList } from "@/components/macro-supplier/supplier-list"
import { SupplierModal } from "@/components/macro-supplier/supplier-modal"
import { DeleteConfirmationDialog } from "@/components/macro-supplier/delete-confirmation-dialog"
import { Supplier } from "@/types/supplier"
import { 
  getSuppliers, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier,
  getCriteriaWeights,
  updateCriteriaWeights
} from "@/lib/dynamodb"
import { v4 as uuidv4 } from 'uuid'

interface CriteriaWeights {
  spendPercentage: number
  threeYearAverage: number
  marketSize: number
  replacementComplexity: number
  utilization: number
  riskLevel: number
}

const DEFAULT_WEIGHTS: CriteriaWeights = {
  spendPercentage: 20,
  threeYearAverage: 30,
  marketSize: 5,
  replacementComplexity: 10,
  utilization: 10,
  riskLevel: 25
}

export default function MacroSupplierTierPage() {
  const [weights, setWeights] = useState<CriteriaWeights>(DEFAULT_WEIGHTS)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
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
        const typedWeights: CriteriaWeights = {
          spendPercentage: Number(savedWeights.spendPercentage) || DEFAULT_WEIGHTS.spendPercentage,
          threeYearAverage: Number(savedWeights.threeYearAverage) || DEFAULT_WEIGHTS.threeYearAverage,
          marketSize: Number(savedWeights.marketSize) || DEFAULT_WEIGHTS.marketSize,
          replacementComplexity: Number(savedWeights.replacementComplexity) || DEFAULT_WEIGHTS.replacementComplexity,
          utilization: Number(savedWeights.utilization) || DEFAULT_WEIGHTS.utilization,
          riskLevel: Number(savedWeights.riskLevel) || DEFAULT_WEIGHTS.riskLevel,
        }
        setWeights(typedWeights)
      }

      // Load suppliers
      const savedSuppliers = await getSuppliers(userId)
      if (savedSuppliers) {
        // Ensure all required fields are present with proper types
        const typedSuppliers: Supplier[] = savedSuppliers.map(supplier => ({
          id: supplier.id,
          name: supplier.name,
          category: supplier.category,
          subcategory: supplier.subcategory,
          expirationDate: supplier.expirationDate,
          contractNumber: supplier.contractNumber,
          threeYearSpend: Number(supplier.threeYearSpend),
          contractDescription: supplier.contractDescription,
          criticalityScore: Number(supplier.criticalityScore),
          // Add any other required fields with proper type conversion
        }))
        setSuppliers(typedSuppliers)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWeightsChange = async (newWeights: CriteriaWeights) => {
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
        await updateSupplier(userId, supplier)
      } else {
        const newSupplier = {
          ...supplier,
          id: uuidv4(),
          userId
        }
        await createSupplier(userId, newSupplier)
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
      await deleteSupplier(userId, supplierToDelete.id)
      
      // Trigger refresh
      setRefreshTrigger(prev => prev + 1)
      setDeleteDialogOpen(false)
      setSupplierToDelete(null)
    } catch (error) {
      console.error('Error deleting supplier:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen">
      {/* Fixed Header Panel */}
      <div className="bg-white dark:bg-gray-800 border-b p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Macro Supplier Tier</h1>
        <CriteriaWeights weights={weights} onWeightsChange={handleWeightsChange} />
      </div>

      {/* Scrollable Content Panel */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
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
        weights={weights}
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