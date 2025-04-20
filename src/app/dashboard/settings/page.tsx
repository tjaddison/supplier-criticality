"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, User, Bell, Shield, Database } from "lucide-react"

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [dataExports, setDataExports] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-[#0f2942] to-[#194866] rounded-xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Settings className="h-7 w-7 text-white" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
        </div>
        <p className="text-blue-100 max-w-3xl">
          Customize your experience and manage your account preferences.
        </p>
      </div>
      
      {/* Settings Tabs */}
      <Tabs defaultValue="account" className="mb-8">
        <TabsList className="bg-white dark:bg-gray-800 border mb-6">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Data Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card className="border border-[#e5e9f0] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-[#194866]">Account Settings</CardTitle>
              <CardDescription>
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-[#194866] font-medium">Theme</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dark Mode</span>
                  <Switch
                    id="theme"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language" className="text-[#194866] font-medium">Language</Label>
                <select 
                  id="language"
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred language
                </p>
              </div>
              
              <div className="pt-4">
                <Button className="bg-[#194866] hover:bg-[#0f2942]">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="border border-[#e5e9f0] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-[#194866]">Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#194866] font-medium">Email Notifications</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Receive email alerts</span>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Get notified about contract expirations, supplier updates, and critical alerts
                </p>
              </div>
              
              <div className="pt-4">
                <Button className="bg-[#194866] hover:bg-[#0f2942]">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="border border-[#e5e9f0] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-[#194866]">Security Settings</CardTitle>
              <CardDescription>
                Update your security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Security settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card className="border border-[#e5e9f0] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-[#194866]">Data Management</CardTitle>
              <CardDescription>
                Export and manage your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#194866] font-medium">Data Exports</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Enable scheduled exports</span>
                  <Switch
                    checked={dataExports}
                    onCheckedChange={setDataExports}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically export supplier data on a weekly basis
                </p>
              </div>
              
              <div className="pt-4">
                <Button className="bg-[#194866] hover:bg-[#0f2942]">Save Changes</Button>
                <Button variant="outline" className="ml-2 border-[#194866] text-[#194866]">
                  Export Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 