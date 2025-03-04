import MicroSupplierTierClient from "@/app/dashboard/micro-supplier-tier/client"
import { getSuppliers } from "@/lib/dynamodb"

export default async function MicroSupplierTierPage() {
  try {
    const userId = "user123" // Demo user ID
    const suppliers = await getSuppliers(userId)
    
    return <MicroSupplierTierClient initialSuppliers={suppliers} />
  } catch (error) {
    console.error('Error loading suppliers:', error)
    return <div className="p-6">Error loading suppliers. Please try again later.</div>
  }
} 