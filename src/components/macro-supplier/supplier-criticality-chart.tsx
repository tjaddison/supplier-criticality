"use client"

import { useMemo } from "react"

interface SupplierCriticalityChartProps {
  suppliers: Array<{
    id: string
    name: string
    criticalityScore: number
  }>
}

export function SupplierCriticalityChart({ suppliers }: SupplierCriticalityChartProps) {
  // Sort suppliers by criticality score in descending order
  const sortedSuppliers = useMemo(() => {
    return [...suppliers]
      .sort((a, b) => b.criticalityScore - a.criticalityScore);
  }, [suppliers]);

  // Calculate the maximum score for scaling
  const maxScore = useMemo(() => {
    return Math.max(...sortedSuppliers.map(s => s.criticalityScore), 100);
  }, [sortedSuppliers]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Supplier Criticality</h3>
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {sortedSuppliers.map((supplier) => (
          <div key={supplier.id} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{supplier.name}</span>
              <span className="font-medium">{supplier.criticalityScore.toFixed(1)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${(supplier.criticalityScore / maxScore) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 