import { requireAuth } from '@/lib/auth'
import { AdminClient } from './client'

export default async function AdminPage() {
  await requireAuth({ requiredRole: 'admin' })
  return <AdminClient />
}
