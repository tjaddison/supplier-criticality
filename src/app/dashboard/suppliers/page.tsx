"use client"

import { useState } from "react"
import { SupplierList } from "../../../components/macro-supplier/supplier-list"
import { Supplier } from "@/types/supplier"
import { SupplierModal } from "@/components/macro-supplier/supplier-modal"
import { CriteriaWeights } from "@/components/macro-supplier/criteria-weights"
import { createSupplier, updateSupplier, deleteSupplier } from "@/lib/dynamodb"

export default function SuppliersPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [weights, setWeights] = useState({
    spendPercentage: 20,
    threeYearAverage: 20,
    marketSize: 15,
    replacementComplexity: 15,
    utilization: 15,
    riskLevel: 15
  })

  const handleEditSupplier = (supplier: Supplier) => {
    setCurrentSupplier(supplier)
    setModalOpen(true)
  }

  const handleDeleteSupplier = async (supplier: Supplier) => {
    try {
      await deleteSupplier(supplier.id)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Error deleting supplier:', error)
    }
  }

  const handleSaveSupplier = async (supplier: Supplier) => {
    try {
      if (supplier.id) {
        await updateSupplier(supplier)
      } else {
        await createSupplier(supplier)
      }
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Error saving supplier:', error)
    }
  }

  const handleWeightsChange = (newWeights: typeof weights) => {
    setWeights(newWeights)
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">Supplier Management</h1>
      
      <CriteriaWeights 
        weights={weights}
        onWeightsChange={handleWeightsChange}
      />
      
      <SupplierList 
        weights={weights}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
        refreshTrigger={refreshTrigger}
      />
      
      <SupplierModal
        open={modalOpen}
        supplier={currentSupplier}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSupplier}
        onDelete={handleDeleteSupplier}
      />
    </div>
  )
} 