"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { CriteriaWeights } from "@/components/macro-supplier/criteria-weights"
import { SupplierList } from "@/components/macro-supplier/supplier-list"
import { SupplierModal } from "@/components/macro-supplier/supplier-modal"
import { CSVUpload } from "@/components/csv-upload/csv-upload"
import { UploadHistory } from "@/components/csv-upload/upload-history"
import { Supplier } from "@/types/supplier"
import { getUserRole } from "@/lib/dynamodb"
import { ROLE_LIMITS } from "@/types/upload-audit"
import { InfoIcon, SlidersIcon } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [uploadHistoryRefresh, setUploadHistoryRefresh] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('free')
  const [maxSuppliers, setMaxSuppliers] = useState(5)
  const { user, loading: authLoading, login, getUserId } = useAuth()
  const dataLoadedRef = useRef(false)

  const loadData = useCallback(async () => {
    // Prevent multiple loads
    if (dataLoadedRef.current) return
    dataLoadedRef.current = true

    try {
      const userId = getUserId()
      if (!userId) return

      // Get user role and set limits
      if (user) {
        const role = getUserRole(user as unknown as { [key: string]: unknown })
        setUserRole(role)
        setMaxSuppliers(ROLE_LIMITS[role] || ROLE_LIMITS.free)
      }

      // Load weights
      const response = await fetch('/api/criteria-weights', {
        credentials: 'include'
      })
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/api/auth/login'
          return
        }
        throw new Error('Failed to fetch criteria weights')
      }
      const { weights: savedWeights } = await response.json()
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

        // Only update weights if they've actually changed
        setWeights(prevWeights => {
          const hasChanged =
            prevWeights.spendPercentage !== typedWeights.spendPercentage ||
            prevWeights.threeYearAverage !== typedWeights.threeYearAverage ||
            prevWeights.marketSize !== typedWeights.marketSize ||
            prevWeights.replacementComplexity !== typedWeights.replacementComplexity ||
            prevWeights.utilization !== typedWeights.utilization ||
            prevWeights.riskLevel !== typedWeights.riskLevel

          return hasChanged ? typedWeights : prevWeights
        })
      }
    } catch (error) {
      console.error('Error loading data:', error)
      dataLoadedRef.current = false // Reset on error so it can retry
    } finally {
      setLoading(false)
    }
  }, [getUserId, user])

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadData()
      } else {
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  const handleWeightsChange = async (newWeights: WeightCriteria): Promise<void> => {
    try {
      const userId = getUserId()
      if (!userId) throw new Error('User not authenticated')

      const response = await fetch('/api/criteria-weights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newWeights),
      })
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/api/auth/login'
          return
        }
        throw new Error('Failed to update criteria weights')
      }
      setWeights(newWeights)
    } catch (error) {
      console.error('Error updating weights:', error)
      throw error
    }
  }

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setModalOpen(true)
  }

  const handleUploadComplete = () => {
    // Refresh supplier list and upload history
    setRefreshTrigger(prev => prev + 1)
    setUploadHistoryRefresh(prev => prev + 1)
  }


  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg text-[#194866] flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mb-4"></div>
          Loading criteria and supplier data...
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
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#194866] text-white p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Supplier Management</h1>
        <p className="text-blue-100 text-sm md:text-base max-w-3xl mb-4">
          Manage your supplier data, upload CSV files, analyze criticality, and track upload history.
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

      {/* Tabbed Content Panel */}
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
        <Tabs defaultValue="suppliers" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="upload">CSV Upload</TabsTrigger>
            <TabsTrigger value="history">Upload History</TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers" className="flex-1 overflow-auto">
            {getUserId() && (
              <SupplierList
                weights={weights}
                userId={getUserId()!}
                refreshTrigger={refreshTrigger}
                onView={handleViewSupplier}
              />
            )}
          </TabsContent>

          <TabsContent value="upload" className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <CSVUpload
                onUploadComplete={handleUploadComplete}
                userRole={userRole}
                maxSuppliers={maxSuppliers}
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <UploadHistory refreshTrigger={uploadHistoryRefresh} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <SupplierModal
        open={modalOpen}
        supplier={selectedSupplier}
        onClose={() => {
          setModalOpen(false)
          setSelectedSupplier(null)
        }}
      />
    </div>
  )
} 