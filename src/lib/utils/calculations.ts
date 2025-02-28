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
  if (threeYearSpend >= 10000000) return "$10M+"
  if (threeYearSpend >= 5000000) return "$5-$10M"
  if (threeYearSpend >= 1000000) return "$1M-$5M"
  if (threeYearSpend >= 250000) return "$250k-$1M"
  return "Less than $250k"
}

export function getSubcategorySize(supplierCount: number): "one" | "few" | "many" {
  if (supplierCount >= 6) return "many"
  if (supplierCount >= 2) return "few"
  return "one"
}

export function getHiddenSpendAllocation(spendAllocation: string): number {
  switch (spendAllocation) {
    case "71+%":
      return 100;
    case "36-70%":
      return 66;
    case "10-35%":
      return 33;
    case "Less than 10%":
    default:
      return 1;
  }
}

export function getHiddenSpendValue(spendCategory: string): number {
  switch (spendCategory) {
    case "$10M+":
      return 100;
    case "$5-$10M":
      return 75;
    case "$1M-$5M":
      return 50;
    case "$250k-$1M":
      return 25;
    case "Less than $250k":
    default:
      return 1;
  }
}

export function getHiddenSubcategorySize(subcategorySize: "one" | "few" | "many"): number {
  switch (subcategorySize) {
    case "one":
      return 100;
    case "few":
      return 50;
    case "many":
    default:
      return 1;
  }
}

export function calculateHiddenUtilization(hiddenSpendAllocation: number, hiddenSpendValue: number): number {
  return Math.round((hiddenSpendAllocation + hiddenSpendValue) / 2);
}

export function calculateHiddenEaseOfReplacement(
  hiddenSpendValue: number, 
  hiddenUtilization: number, 
  hiddenSubcategorySize: number
): number {
  return Math.round((hiddenSpendValue + hiddenUtilization + hiddenSubcategorySize) / 3);
}

export function calculateHiddenRisk(
  hiddenEaseOfReplacement: number,
  hiddenUtilization: number
): number {
  return Math.round((hiddenEaseOfReplacement + hiddenUtilization) / 2);
}

export function getEaseOfReplacement(hiddenEaseOfReplacement: number): string {
  if (hiddenEaseOfReplacement > 60) return "Challenging";
  if (hiddenEaseOfReplacement >= 21) return "Moderate Difficulty";
  return "Easy";
}

export function getUtilizationLevel(hiddenUtilization: number): string {
  if (hiddenUtilization > 60) return "High";
  if (hiddenUtilization >= 21) return "Moderate";
  return "Low";
}

export function getRiskLevel(hiddenRisk: number): string {
  if (hiddenRisk >= 51) return "High";
  if (hiddenRisk >= 20) return "Moderate";
  return "Low";
}

export function calculateHiddenWeightsSpendAllocation(
  hiddenSpendAllocation: number,
  weights: { spendPercentage: number }
): number {
  // Convert percentage to decimal (e.g., 30% -> 0.3)
  const weightDecimal = weights.spendPercentage / 100;
  
  // Multiply hidden value by weight
  return Math.round(hiddenSpendAllocation * weightDecimal);
}

export function calculateHiddenWeightsSpendValue(
  hiddenSpendValue: number,
  weights: { threeYearAverage: number }
): number {
  // Convert percentage to decimal (e.g., 20% -> 0.2)
  const weightDecimal = weights.threeYearAverage / 100;
  
  // Multiply hidden value by weight
  return Math.round(hiddenSpendValue * weightDecimal);
}

export function calculateHiddenWeightsSubcategorySize(
  hiddenSubcategorySize: number,
  weights: { marketSize: number }
): number {
  // Convert percentage to decimal (e.g., 15% -> 0.15)
  const weightDecimal = weights.marketSize / 100;
  
  // Multiply hidden value by weight
  return Math.round(hiddenSubcategorySize * weightDecimal);
}

export function calculateHiddenWeightsEaseOfReplacement(
  hiddenEaseOfReplacement: number,
  weights: { replacementComplexity: number }
): number {
  // Convert percentage to decimal (e.g., 15% -> 0.15)
  const weightDecimal = weights.replacementComplexity / 100;
  
  // Multiply hidden value by weight
  return Math.round(hiddenEaseOfReplacement * weightDecimal);
}

export function calculateHiddenWeightsUtilization(
  hiddenUtilization: number,
  weights: { utilization: number }
): number {
  // Convert percentage to decimal (e.g., 15% -> 0.15)
  const weightDecimal = weights.utilization / 100;
  
  // Multiply hidden value by weight
  return Math.round(hiddenUtilization * weightDecimal);
}

export function calculateHiddenWeightsRisk(
  hiddenRisk: number,
  weights: { riskLevel: number }
): number {
  // Convert percentage to decimal (e.g., 15% -> 0.15)
  const weightDecimal = weights.riskLevel / 100;
  
  // Multiply hidden value by weight
  return Math.round(hiddenRisk * weightDecimal);
}