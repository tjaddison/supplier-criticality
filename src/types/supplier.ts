export interface Supplier {
  id: string
  name: string
  category: string
  subcategory: string
  expirationDate: string
  contractNumber: string
  threeYearSpend: number
  contractDescription?: string
  criticalityScore: number
  userId?: string
  // Calculated fields
  supplierCount?: number
  categoryPercentage?: number
  subcategoryPercentage?: number
  spendAllocation?: string
  spend?: number
  subcategorySize?: "one" | "few" | "many"
  replacementEase?: "low" | "medium" | "high"
  utilization?: "low" | "moderate" | "high"
  riskLevel?: "low" | "medium" | "high"
  subcategoryCount?: number
  spendCategory?: string
} 