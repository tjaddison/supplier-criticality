import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Activity, LineChart, Layers, BarChart3 } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="mb-10 bg-gradient-to-r from-[#0f2942] to-[#194866] rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Supplier Insights Dashboard</h1>
        <p className="text-blue-100 text-lg max-w-3xl">
          Monitor and analyze your supplier relationships, spending patterns, and criticality metrics at a glance.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <Card className="border border-[#e5e9f0] shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#194866]">Total Suppliers</CardTitle>
            <Users className="h-5 w-5 text-[#3b82f6]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600">
              <span className="inline-block mr-1">↑</span> 20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-[#e5e9f0] shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#194866]">Total Spend</CardTitle>
            <DollarSign className="h-5 w-5 text-[#3b82f6]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$45,231,890</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600">
              <span className="inline-block mr-1">↑</span> 15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-[#e5e9f0] shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#194866]">Critical Suppliers</CardTitle>
            <Activity className="h-5 w-5 text-[#3b82f6]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">23</div>
            <p className="text-xs text-muted-foreground flex items-center text-amber-600">
              <span className="inline-block mr-1">⚠</span> 3 require attention
            </p>
          </CardContent>
        </Card>

        <Card className="border border-[#e5e9f0] shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#194866]">Active Contracts</CardTitle>
            <LineChart className="h-5 w-5 text-[#3b82f6]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">573</div>
            <p className="text-xs text-muted-foreground flex items-center text-red-600">
              <span className="inline-block mr-1">↓</span> 12 expiring soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Sections */}
      <div className="grid gap-8 lg:grid-cols-2 mb-10">
        <Card className="border border-[#e5e9f0] shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-[#194866]">Supplier Tiers</CardTitle>
              <Layers className="h-5 w-5 text-[#3b82f6]" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">View and manage your supplier segmentation and comparative criticality assessments</p>
            <div className="grid grid-cols-2 gap-4">
              <a href="/dashboard/macro-supplier-tier" className="inline-block">
                <div className="bg-blue-50 hover:bg-blue-100 transition-colors p-4 rounded-lg text-center border border-blue-100">
                  <h3 className="font-medium text-[#194866] mb-1">Macro Tier</h3>
                  <p className="text-sm text-blue-700">High-level supplier view</p>
                </div>
              </a>
              <a href="/dashboard/micro-supplier-tier" className="inline-block">
                <div className="bg-blue-50 hover:bg-blue-100 transition-colors p-4 rounded-lg text-center border border-blue-100">
                  <h3 className="font-medium text-[#194866] mb-1">Micro Tier</h3>
                  <p className="text-sm text-blue-700">Detailed supplier analysis</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#e5e9f0] shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-[#194866]">Recent Activity</CardTitle>
              <BarChart3 className="h-5 w-5 text-[#3b82f6]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="font-medium text-[#194866]">Contract Updated</h3>
                <p className="text-sm text-muted-foreground">TechSolutions contract renewed for $1.2M</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
              <div className="border-b border-gray-100 pb-2">
                <h3 className="font-medium text-[#194866]">New Supplier Added</h3>
                <p className="text-sm text-muted-foreground">DataCorp added to Software category</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
              <div>
                <h3 className="font-medium text-[#194866]">Criticality Assessment</h3>
                <p className="text-sm text-muted-foreground">5 suppliers reclassified as critical</p>
                <p className="text-xs text-gray-400">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 