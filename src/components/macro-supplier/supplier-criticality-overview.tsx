"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, TrendingUp } from "lucide-react"

interface SupplierCriticalityOverviewProps {
  suppliers: Array<{
    id: string
    name: string
    criticalityScore: number
  }>
}

export function SupplierCriticalityOverview({ suppliers }: SupplierCriticalityOverviewProps) {
  const [showAllDialog, setShowAllDialog] = useState(false)

  // Sort suppliers by criticality score in descending order
  const sortedSuppliers = useMemo(() => {
    return [...suppliers].sort((a, b) => b.criticalityScore - a.criticalityScore)
  }, [suppliers])

  // Get top 10 suppliers
  const top10Suppliers = sortedSuppliers.slice(0, 10)

  // Calculate stats
  const averageScore = useMemo(() => {
    if (suppliers.length === 0) return 0
    const sum = suppliers.reduce((acc, s) => acc + s.criticalityScore, 0)
    return sum / suppliers.length
  }, [suppliers])

  const highRiskCount = useMemo(() => {
    return suppliers.filter(s => s.criticalityScore >= 75).length
  }, [suppliers])

  const maxScore = useMemo(() => {
    return Math.max(...sortedSuppliers.map(s => s.criticalityScore), 100)
  }, [sortedSuppliers])

  if (suppliers.length === 0) {
    return null
  }

  return (
    <>
      <Card className="border-[#194866]/20 shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#194866] to-[#3CDBDD] text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Criticality Overview
            </CardTitle>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAllDialog(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#E5F9FA] to-white p-4 rounded-lg border border-[#3CDBDD]/30">
              <div className="text-sm text-[#194866]/70 font-medium">Average Score</div>
              <div className="text-3xl font-bold text-[#194866]">{averageScore.toFixed(1)}</div>
            </div>
            <div className="bg-gradient-to-br from-[#FFE5DC] to-white p-4 rounded-lg border border-[#FF7D4D]/30">
              <div className="text-sm text-[#194866]/70 font-medium flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-[#FF7D4D]" />
                High Risk (≥75)
              </div>
              <div className="text-3xl font-bold text-[#FF7D4D]">{highRiskCount}</div>
            </div>
            <div className="bg-gradient-to-br from-[#E5F9FA] to-white p-4 rounded-lg border border-[#194866]/30">
              <div className="text-sm text-[#194866]/70 font-medium">Top Critical</div>
              <div className="text-3xl font-bold text-[#194866]">{top10Suppliers.length}</div>
            </div>
          </div>

          {/* Top 10 Critical Suppliers */}
          <div>
            <h4 className="text-sm font-semibold text-[#194866] mb-3 uppercase tracking-wide">
              Top 10 Most Critical Suppliers
            </h4>
            <div className="space-y-3">
              {top10Suppliers.map((supplier, index) => (
                <div key={supplier.id} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                        index === 0 ? 'bg-[#FF7D4D]' :
                        index === 1 ? 'bg-[#FF9D7D]' :
                        index === 2 ? 'bg-[#FFBD9D]' :
                        'bg-[#194866]'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-[#194866]">{supplier.name}</span>
                    </div>
                    <span className="font-bold text-[#194866]">{supplier.criticalityScore.toFixed(1)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        supplier.criticalityScore >= 85 ? 'bg-gradient-to-r from-[#FF7D4D] to-[#FF6A33]' :
                        supplier.criticalityScore >= 75 ? 'bg-gradient-to-r from-[#FFB088] to-[#FF9D7D]' :
                        'bg-gradient-to-r from-[#194866] to-[#3CDBDD]'
                      }`}
                      style={{ width: `${(supplier.criticalityScore / maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full List Dialog */}
      <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#194866]">
              All Suppliers - Criticality Ranking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {sortedSuppliers.map((supplier, index) => (
              <div key={supplier.id} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white ${
                      index < 3 ? 'bg-[#FF7D4D]' :
                      index < 10 ? 'bg-[#194866]' :
                      'bg-[#194866]/70'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-[#194866]">{supplier.name}</span>
                  </div>
                  <span className="font-bold text-[#194866]">{supplier.criticalityScore.toFixed(1)}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      supplier.criticalityScore >= 85 ? 'bg-gradient-to-r from-[#FF7D4D] to-[#FF6A33]' :
                      supplier.criticalityScore >= 75 ? 'bg-gradient-to-r from-[#FFB088] to-[#FF9D7D]' :
                      'bg-gradient-to-r from-[#194866] to-[#3CDBDD]'
                    }`}
                    style={{ width: `${(supplier.criticalityScore / maxScore) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
