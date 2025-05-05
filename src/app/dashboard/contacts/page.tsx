"use client"

import { useState, useEffect } from 'react'
import { 
  getContactSubmissions, 
  updateContactStatus, 
  deleteContactSubmission,
  ContactSubmission 
} from '@/lib/contact-dynamodb'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadContacts()
  }, [])

  async function loadContacts() {
    try {
      setLoading(true)
      const data = await getContactSubmissions()
      // Sort by date, newest first
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setContacts(data)
    } catch (err) {
      console.error('Failed to load contacts:', err)
      setError('Failed to load contact submissions')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id: string, status: 'new' | 'contacted' | 'closed') {
    try {
      await updateContactStatus(id, status)
      // Update local state
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, status } : contact
      ))
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteContactSubmission(id);
      // Remove from local state
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="mb-10 bg-gradient-to-r from-[#0f2942] to-[#194866] rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-3">Contact Form Submissions</h1>
        <p className="text-blue-100 text-lg max-w-3xl">
          Manage and respond to inquiries from your website contact form.
        </p>
      </div>
      
      <Card className="border border-[#e5e9f0] shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Review and manage contact requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6]"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No submissions yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map(contact => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>
                      <a 
                        href={`mailto:${contact.email}`} 
                        className="text-blue-600 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </TableCell>
                    <TableCell>{contact.company}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          contact.status === 'new' 
                            ? 'bg-blue-100 text-blue-800' 
                            : contact.status === 'contacted' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }
                      >
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(contact.id, 'contacted')}
                          disabled={contact.status === 'contacted'}
                        >
                          Mark Contacted
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(contact.id, 'closed')}
                          disabled={contact.status === 'closed'}
                        >
                          Close
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(contact.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 