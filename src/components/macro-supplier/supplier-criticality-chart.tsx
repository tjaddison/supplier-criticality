"use client"

interface SupplierCriticalityChartProps {
  suppliers: Array<{
    id: string
    name: string
    criticalityScore: number
  }>
}

export function SupplierCriticalityChart({ suppliers }: SupplierCriticalityChartProps) {
  // Sort suppliers by criticality score in descending order
  const sortedSuppliers = [...suppliers].sort((a, b) => b.criticalityScore - a.criticalityScore)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Supplier Criticality</h3>
      <div className="space-y-4">
        {sortedSuppliers.map((supplier) => (
          <div key={supplier.id} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{supplier.name}</span>
              <span>{supplier.criticalityScore.toFixed(1)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${supplier.criticalityScore}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 