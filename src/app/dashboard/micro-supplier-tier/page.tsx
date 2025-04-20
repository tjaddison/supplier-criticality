import MicroSupplierTierClient from "@/app/dashboard/micro-supplier-tier/client"
import { getSuppliers } from "@/lib/dynamodb"

export default async function MicroSupplierTierPage() {
  try {
    const userId = "user123" // Demo user ID
    const suppliers = await getSuppliers(userId)
    
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#0f2942] to-[#194866] text-white p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Micro Supplier Tier</h1>
          <p className="text-blue-100 text-sm md:text-base max-w-3xl">
            Detailed supplier analysis at a granular level. Examine supplier performance metrics, 
            contract details, and subcategory relationships.
          </p>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <MicroSupplierTierClient initialSuppliers={suppliers} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading suppliers:', error)
    
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen">
        <div className="bg-gradient-to-r from-[#0f2942] to-[#194866] text-white p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Micro Supplier Tier</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md border border-red-100 max-w-md">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Suppliers</h2>
            <p className="text-gray-600 mb-4">We couldn&apos;t load your supplier data. Please try again later or contact support if the problem persists.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[#194866] text-white rounded hover:bg-[#0f2942] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }
} 