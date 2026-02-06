"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Activity, LineChart, Layers, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Supplier } from "@/types/supplier"

export default function DashboardPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()

  const loadSuppliers = useCallback(async () => {
    try {
      const userId = user?.sub
      if (!userId) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/suppliers')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (result.suppliers) {
        setSuppliers(result.suppliers)
      }
    } catch (error) {
      console.error('Error loading suppliers:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadSuppliers()
      } else {
        setLoading(false)
      }
    }
  }, [user, authLoading, loadSuppliers])

  // Calculate dashboard metrics from actual supplier data
  const metrics = useMemo(() => {
    const totalSuppliers = suppliers.length
    const totalSpend = suppliers.reduce((sum, s) => sum + (s.threeYearSpend || 0), 0)

    // Critical suppliers have criticalityScore > 90 (based on getRelationshipType function)
    const criticalSuppliers = suppliers.filter(s => s.criticalityScore > 90).length

    // Suppliers needing attention: high criticality but expiring within 90 days
    const today = new Date()
    const ninetyDaysFromNow = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
    const suppliersNeedingAttention = suppliers.filter(s => {
      const expDate = new Date(s.expirationDate)
      return s.criticalityScore > 70 && expDate <= ninetyDaysFromNow && expDate >= today
    }).length

    // Active contracts: contracts with expiration date in the future
    const activeContracts = suppliers.filter(s => new Date(s.expirationDate) >= today).length

    // Expiring soon: contracts expiring within 30 days
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const expiringSoon = suppliers.filter(s => {
      const expDate = new Date(s.expirationDate)
      return expDate >= today && expDate <= thirtyDaysFromNow
    }).length

    return {
      totalSuppliers,
      totalSpend,
      criticalSuppliers,
      suppliersNeedingAttention,
      activeContracts,
      expiringSoon
    }
  }, [suppliers])

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const isLoading = authLoading || loading

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#194866] to-[#3CDBDD] text-white p-6 md:p-8 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Supplier Insights Dashboard</h1>
        <p className="text-white/90 text-sm md:text-base max-w-3xl">
          Monitor and analyze your supplier relationships, spending patterns, and criticality metrics at a glance.
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-[#f0f9fa] via-white to-[#f0f9fa]">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-[#194866]/20 shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#194866]">Total Suppliers</CardTitle>
                <Users className="h-5 w-5 text-[#3CDBDD]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#194866]">
                  {isLoading ? "..." : metrics.totalSuppliers.toLocaleString()}
                </div>
                <p className="text-xs text-[#194866]/60">
                  Across all categories
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#194866]/20 shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#194866]">Total Spend (3-Year)</CardTitle>
                <DollarSign className="h-5 w-5 text-[#3CDBDD]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#194866]">
                  {isLoading ? "..." : formatCurrency(metrics.totalSpend)}
                </div>
                <p className="text-xs text-[#194866]/60">
                  Combined supplier spend
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#194866]/20 shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#194866]">Critical Suppliers</CardTitle>
                <Activity className="h-5 w-5 text-[#3CDBDD]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#194866]">
                  {isLoading ? "..." : metrics.criticalSuppliers}
                </div>
                {metrics.suppliersNeedingAttention > 0 ? (
                  <p className="text-xs text-amber-600 flex items-center">
                    <span className="inline-block mr-1">⚠</span> {metrics.suppliersNeedingAttention} require attention
                  </p>
                ) : (
                  <p className="text-xs text-[#194866]/60">
                    Score above 90
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-[#194866]/20 shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#194866]">Active Contracts</CardTitle>
                <LineChart className="h-5 w-5 text-[#3CDBDD]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#194866]">
                  {isLoading ? "..." : metrics.activeContracts}
                </div>
                {metrics.expiringSoon > 0 ? (
                  <p className="text-xs text-amber-600 flex items-center">
                    <span className="inline-block mr-1">⚠</span> {metrics.expiringSoon} expiring soon
                  </p>
                ) : (
                  <p className="text-xs text-[#194866]/60">
                    Not expired
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Sections */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-[#194866]/20 shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#194866] to-[#3CDBDD] text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Supplier Tiers</CardTitle>
                  <Layers className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-[#194866]/70 mb-4">View and manage your supplier segmentation and comparative criticality assessments</p>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/dashboard/macro-supplier-tier" className="inline-block">
                    <div className="bg-gradient-to-br from-[#E5F9FA] to-white hover:from-[#d0f4f5] hover:to-[#f0f9fa] transition-colors p-4 rounded-lg text-center border border-[#3CDBDD]/30">
                      <h3 className="font-medium text-[#194866] mb-1">Supplier Segmentation</h3>
                      <p className="text-sm text-[#194866]/70">High-level supplier view</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/micro-supplier-tier" className="inline-block">
                    <div className="bg-gradient-to-br from-[#E5F9FA] to-white hover:from-[#d0f4f5] hover:to-[#f0f9fa] transition-colors p-4 rounded-lg text-center border border-[#3CDBDD]/30">
                      <h3 className="font-medium text-[#194866] mb-1">Comparative Criticality</h3>
                      <p className="text-sm text-[#194866]/70">Detailed supplier analysis</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#194866]/20 shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#194866] to-[#3CDBDD] text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Supplier Insights</CardTitle>
                  <BarChart3 className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <p className="text-[#194866]/60">Loading insights...</p>
                ) : suppliers.length === 0 ? (
                  <p className="text-[#194866]/60">No supplier data available. Upload suppliers to see insights.</p>
                ) : (
                  <div className="space-y-4">
                    {/* Expiring Contracts */}
                    {(() => {
                      const today = new Date()
                      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
                      const expiringSoon = suppliers
                        .filter(s => {
                          const expDate = new Date(s.expirationDate)
                          return expDate >= today && expDate <= thirtyDaysFromNow
                        })
                        .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime())
                        .slice(0, 2)

                      if (expiringSoon.length > 0) {
                        return (
                          <div className="border-b border-[#194866]/10 pb-3">
                            <h3 className="font-medium text-amber-600">Contracts Expiring Soon</h3>
                            {expiringSoon.map(s => (
                              <p key={s.id} className="text-sm text-[#194866]/70">
                                {s.name} - expires {new Date(s.expirationDate).toLocaleDateString()}
                              </p>
                            ))}
                          </div>
                        )
                      }
                      return null
                    })()}

                    {/* Top Critical Suppliers */}
                    {(() => {
                      const criticalSuppliers = suppliers
                        .filter(s => s.criticalityScore > 80)
                        .sort((a, b) => b.criticalityScore - a.criticalityScore)
                        .slice(0, 2)

                      if (criticalSuppliers.length > 0) {
                        return (
                          <div className="border-b border-[#194866]/10 pb-3">
                            <h3 className="font-medium text-[#194866]">Top Critical Suppliers</h3>
                            {criticalSuppliers.map(s => (
                              <p key={s.id} className="text-sm text-[#194866]/70">
                                {s.name} - Score: {s.criticalityScore}
                              </p>
                            ))}
                          </div>
                        )
                      }
                      return null
                    })()}

                    {/* Category Breakdown */}
                    {(() => {
                      const categories = Array.from(new Set(suppliers.map(s => s.category)))
                      const topSpendCategory = categories
                        .map(cat => ({
                          category: cat,
                          spend: suppliers.filter(s => s.category === cat).reduce((sum, s) => sum + (s.threeYearSpend || 0), 0)
                        }))
                        .sort((a, b) => b.spend - a.spend)[0]

                      return (
                        <div>
                          <h3 className="font-medium text-[#194866]">Portfolio Summary</h3>
                          <p className="text-sm text-[#194866]/70">
                            {suppliers.length} suppliers across {categories.length} categories
                          </p>
                          {topSpendCategory && (
                            <p className="text-sm text-[#194866]/70">
                              Highest spend: {topSpendCategory.category} ({formatCurrency(topSpendCategory.spend)})
                            </p>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
