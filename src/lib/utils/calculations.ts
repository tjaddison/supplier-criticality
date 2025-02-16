import { Supplier } from "@/types/supplier"

export function calculateCategoryPercentage(supplier: Supplier, allSuppliers: Supplier[]): number {
  // Get all suppliers in the same category
  const categorySuppliers = allSuppliers.filter(s => s.category === supplier.category)
  
  // Calculate total spend for the category
  const categoryTotalSpend = categorySuppliers.reduce((sum, s) => sum + s.threeYearSpend, 0)
  
  // Calculate percentage (handle division by zero)
  if (categoryTotalSpend === 0) return 0
  
  // Return percentage rounded to 2 decimal places
  return Number(((supplier.threeYearSpend / categoryTotalSpend) * 100).toFixed(2))
}

export function calculateSubcategoryCount(supplier: Supplier, allSuppliers: Supplier[]): number {
  // Count suppliers in the same subcategory
  return allSuppliers.filter(s => 
    s.category === supplier.category && 
    s.subcategory === supplier.subcategory
  ).length
}

export function calculateSubcategoryPercentage(supplier: Supplier, allSuppliers: Supplier[]): number {
  // Get all suppliers in the same subcategory
  const subcategorySuppliers = allSuppliers.filter(s => 
    s.category === supplier.category && 
    s.subcategory === supplier.subcategory
  )
  
  // Calculate total spend for the subcategory
  const subcategoryTotalSpend = subcategorySuppliers.reduce((sum, s) => sum + s.threeYearSpend, 0)
  
  // Calculate percentage (handle division by zero)
  if (subcategoryTotalSpend === 0) return 0
  
  // Return percentage rounded to 2 decimal places
  return Number(((supplier.threeYearSpend / subcategoryTotalSpend) * 100).toFixed(2))
}

export function getSpendAllocationCategory(subcategoryPercentage: number): string {
  if (subcategoryPercentage >= 71) return "71+%"
  if (subcategoryPercentage >= 36) return "36-70%"
  if (subcategoryPercentage >= 10) return "10-35%"
  return "Less than 10%"
}

export function getSpendCategory(threeYearSpend: number): string {
  const spendInThousands = threeYearSpend / 1000;
  
  if (spendInThousands >= 10000) return "$10M+"
  if (spendInThousands >= 1000) return "$250k-$1M"
  if (spendInThousands >= 250) return "$250k-$1M"
  return "Less than $250k"
}

export function getSubcategorySize(supplierCount: number): "one" | "few" | "many" {
  if (supplierCount >= 6) return "many"
  if (supplierCount >= 2) return "few"
  return "one"
}