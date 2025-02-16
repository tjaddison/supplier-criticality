import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ProcureSciLogo } from "@/components/ui/logo"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <ProcureSciLogo />
          <h2 className="text-2xl font-bold">Welcome to ProcureSci</h2>
          <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Use the demo credentials below to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  placeholder="demo@example.com" 
                  type="email" 
                  defaultValue="demo@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  defaultValue="demo123"
                />
              </div>
              <Link href="/dashboard">
                <Button className="w-full">Sign In</Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 