"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, Users, Activity, Eye, Mail, Trash2 } from "lucide-react"
import type { PostHogPersonStats } from "@/app/api/admin/posthog/route"
import type { ContactSubmission } from "@/lib/contact-dynamodb"

interface AdminUser {
  userId: string
  email: string
  name: string
  blocked: boolean
  role: string
  supplierCount: number
  lastLogin: string | null
  loginsCount: number
}

const ROLES = ['free', 'tier-1', 'tier-2', 'tier-3', 'tier-4', 'admin']
const DEMO_TIERS = ['free', 'tier-1', 'tier-2', 'tier-3', 'tier-4']

const roleBadgeColor: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  'tier-4': 'bg-blue-100 text-blue-800',
  'tier-3': 'bg-cyan-100 text-cyan-800',
  'tier-2': 'bg-teal-100 text-teal-800',
  'tier-1': 'bg-green-100 text-green-800',
  free: 'bg-gray-100 text-gray-700',
}

const contactStatusColor: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-green-100 text-green-800',
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function AdminClient() {
  const router = useRouter()

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([])
  const [posthogStats, setPosthogStats] = useState<Record<string, PostHogPersonStats>>({})
  const [usersLoading, setUsersLoading] = useState(true)
  const [savingUserId, setSavingUserId] = useState<string | null>(null)

  // Demo tier state
  const [demoTier, setDemoTier] = useState<string | null>(null)

  // Contacts state
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [contactsLoading, setContactsLoading] = useState(false)
  const [contactsLoaded, setContactsLoaded] = useState(false)
  const [savingContactId, setSavingContactId] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    const [usersRes, statsRes] = await Promise.all([
      fetch('/api/admin/users'),
      fetch('/api/admin/posthog'),
    ])
    const usersData = await usersRes.json()
    const statsData = await statsRes.json()
    setUsers(usersData.users || [])
    setPosthogStats(statsData.stats || {})
    setUsersLoading(false)
  }, [])

  const fetchContacts = useCallback(async () => {
    setContactsLoading(true)
    const res = await fetch('/api/admin/contacts')
    const data = await res.json()
    setContacts(data.contacts || [])
    setContactsLoading(false)
    setContactsLoaded(true)
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function updateUser(userId: string, patch: { role?: string; blocked?: boolean }) {
    setSavingUserId(userId)
    await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch),
    })
    await fetchUsers()
    setSavingUserId(null)
  }

  async function setDemo(tier: string) {
    await fetch('/api/admin/demo-tier', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tier }),
    })
    setDemoTier(tier)
    router.refresh()
  }

  async function exitDemo() {
    await fetch('/api/admin/demo-tier', { method: 'DELETE' })
    setDemoTier(null)
    router.refresh()
  }

  async function updateContactStatus(id: string, status: 'new' | 'contacted' | 'closed') {
    setSavingContactId(id)
    await fetch(`/api/admin/contacts/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    setSavingContactId(null)
  }

  async function deleteContact(id: string) {
    setSavingContactId(id)
    await fetch(`/api/admin/contacts/${encodeURIComponent(id)}`, { method: 'DELETE' })
    setContacts(prev => prev.filter(c => c.id !== id))
    setSavingContactId(null)
  }

  const totalUsers = users.length
  const activeUsers = users.filter(u => !u.blocked).length
  const newContacts = contacts.filter(c => c.status === 'new').length

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#194866] to-[#3CDBDD] text-white p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="h-7 w-7" />
          <h1 className="text-2xl md:text-3xl font-bold">Admin</h1>
        </div>
        <p className="text-white/80 text-sm">Manage users, tiers, contacts, and view activity</p>
      </div>

      <div className="flex-1 bg-gradient-to-br from-[#f0f9fa] via-white to-[#f0f9fa] p-6 space-y-6">

        {/* Demo Tier Switcher */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-800 flex items-center gap-2">
              <Eye className="h-4 w-4" /> Demo Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-purple-600 mb-3">
              Switch your view to experience the app as a specific tier user.
              {demoTier && <span className="font-semibold"> Currently viewing as: {demoTier}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {DEMO_TIERS.map(tier => (
                <Button
                  key={tier}
                  size="sm"
                  variant={demoTier === tier ? 'default' : 'outline'}
                  className={demoTier === tier ? 'bg-purple-700 hover:bg-purple-800' : 'border-purple-300 text-purple-700'}
                  onClick={() => setDemo(tier)}
                >
                  {tier === 'free' ? 'Free' : tier.replace('tier-', 'Tier ')}
                </Button>
              ))}
              {demoTier && (
                <Button size="sm" variant="outline" className="border-red-300 text-red-600" onClick={exitDemo}>
                  Exit Demo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#194866]/20">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#194866]/60">Total Users</span>
                <Users className="h-4 w-4 text-[#3CDBDD]" />
              </div>
              <div className="text-2xl font-bold text-[#194866]">{usersLoading ? '—' : totalUsers}</div>
            </CardContent>
          </Card>
          <Card className="border-[#194866]/20">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#194866]/60">Active Users</span>
                <Activity className="h-4 w-4 text-[#3CDBDD]" />
              </div>
              <div className="text-2xl font-bold text-[#194866]">{usersLoading ? '—' : activeUsers}</div>
            </CardContent>
          </Card>
          <Card className="border-[#194866]/20">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#194866]/60">New Contacts</span>
                <Mail className="h-4 w-4 text-[#3CDBDD]" />
              </div>
              <div className="text-2xl font-bold text-[#194866]">{contactsLoaded ? newContacts : '—'}</div>
            </CardContent>
          </Card>
          <Card className="border-[#194866]/20">
            <CardContent className="pt-5">
              <div className="text-xs text-[#194866]/60 mb-1">Tier Breakdown</div>
              <div className="flex flex-wrap gap-1">
                {usersLoading ? <span className="text-2xl font-bold text-[#194866]">—</span> : ROLES.slice(0, 5).map(r => {
                  const count = users.filter(u => u.role === r).length
                  if (count === 0) return null
                  return (
                    <span key={r} className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${roleBadgeColor[r]}`}>
                      {r === 'free' ? 'Free' : r.replace('tier-', 'T')}: {count}
                    </span>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="bg-white border mb-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="flex items-center gap-2"
              onClick={() => { if (!contactsLoaded) fetchContacts() }}
            >
              <Mail className="h-4 w-4" /> Contacts
              {contactsLoaded && newContacts > 0 && (
                <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                  {newContacts}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="border-[#194866]/20">
              <CardContent className="p-0">
                {usersLoading ? (
                  <div className="p-8 text-center text-[#194866]/50">Loading users...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#194866]/10 bg-[#f8fbfc]">
                          <th className="text-left px-4 py-3 text-[#194866]/70 font-medium">User</th>
                          <th className="text-left px-4 py-3 text-[#194866]/70 font-medium">Tier</th>
                          <th className="text-center px-4 py-3 text-[#194866]/70 font-medium">Suppliers</th>
                          <th className="text-left px-4 py-3 text-[#194866]/70 font-medium">Last Login</th>
                          <th className="text-left px-4 py-3 text-[#194866]/70 font-medium">PostHog</th>
                          <th className="text-center px-4 py-3 text-[#194866]/70 font-medium">Enabled</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => {
                          const ph = posthogStats[u.email] || posthogStats[u.userId]
                          const isSaving = savingUserId === u.userId
                          return (
                            <tr key={u.userId} className="border-b border-[#194866]/5 hover:bg-[#f0f9fa]/50">
                              <td className="px-4 py-3">
                                <div className="font-medium text-[#194866]">{u.name}</div>
                                <div className="text-xs text-[#194866]/50">{u.email}</div>
                              </td>
                              <td className="px-4 py-3">
                                <Select
                                  defaultValue={u.role}
                                  disabled={isSaving}
                                  onValueChange={role => updateUser(u.userId, { role })}
                                >
                                  <SelectTrigger className="h-7 w-32 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ROLES.map(r => (
                                      <SelectItem key={r} value={r} className="text-xs">
                                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${roleBadgeColor[r]}`}>
                                          {r}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Badge variant="outline" className="text-[#194866]">{u.supplierCount}</Badge>
                              </td>
                              <td className="px-4 py-3 text-xs text-[#194866]/60">{formatDate(u.lastLogin)}</td>
                              <td className="px-4 py-3">
                                {ph ? (
                                  <div className="text-xs text-[#194866]/70 space-y-0.5">
                                    <div>{ph.pageviews.toLocaleString()} page views</div>
                                    <div>{ph.sessions} sessions</div>
                                    <div className="text-[#194866]/40">Last: {formatDate(ph.lastSeen)}</div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-[#194866]/30">No data</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Switch
                                  checked={!u.blocked}
                                  disabled={isSaving}
                                  onCheckedChange={enabled => updateUser(u.userId, { blocked: !enabled })}
                                />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card className="border-[#194866]/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#194866]">Contact Submissions</CardTitle>
                <Button size="sm" variant="outline" onClick={fetchContacts} disabled={contactsLoading}>
                  Refresh
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {contactsLoading ? (
                  <div className="p-8 text-center text-[#194866]/50">Loading contacts...</div>
                ) : contacts.length === 0 ? (
                  <div className="p-8 text-center text-[#194866]/40">No submissions yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#194866]/10 bg-[#f8fbfc]">
                          <th className="text-left px-4 py-3 text-[#194866]/70 font-medium">Date</th>
                          <th className="text-left px-4 py-3 text-[#194866]/70 font-medium">Name</th>
                          <th className="text-left px-4 py-3 text-[#194866]/70 font-medium">Email</th>
                          <th className="text-left px-4 py-3 text-[#194866]/70 font-medium">Company</th>
                          <th className="text-left px-4 py-3 text-[#194866]/70 font-medium">Status</th>
                          <th className="text-left px-4 py-3 text-[#194866]/70 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map(c => {
                          const isSaving = savingContactId === c.id
                          return (
                            <tr key={c.id} className="border-b border-[#194866]/5 hover:bg-[#f0f9fa]/50">
                              <td className="px-4 py-3 text-xs text-[#194866]/60 whitespace-nowrap">
                                {formatDate(c.createdAt)}
                              </td>
                              <td className="px-4 py-3 font-medium text-[#194866]">{c.name}</td>
                              <td className="px-4 py-3">
                                <a href={`mailto:${c.email}`} className="text-[#3CDBDD] hover:underline text-xs">
                                  {c.email}
                                </a>
                              </td>
                              <td className="px-4 py-3 text-xs text-[#194866]/70">{c.company || '—'}</td>
                              <td className="px-4 py-3">
                                <Badge className={contactStatusColor[c.status] || 'bg-gray-100 text-gray-700'}>
                                  {c.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1.5 flex-wrap">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    disabled={isSaving || c.status === 'contacted'}
                                    onClick={() => updateContactStatus(c.id, 'contacted')}
                                  >
                                    Contacted
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    disabled={isSaving || c.status === 'closed'}
                                    onClick={() => updateContactStatus(c.id, 'closed')}
                                  >
                                    Close
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                    disabled={isSaving}
                                    onClick={() => deleteContact(c.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}
