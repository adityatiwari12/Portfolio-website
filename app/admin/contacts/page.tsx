"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getContacts, updateContactStatus } from "@/app/actions/contact"
import type { Contact } from "@/lib/supabase"
import { Mail, Calendar, User, MessageSquare, RefreshCw, CheckCircle, Eye, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchContacts = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getContacts()
      if (result.success && result.data) {
        setContacts(result.data)
      } else {
        setError(result.error || "Failed to load contacts")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: number, status: "new" | "read" | "replied") => {
    setUpdating(id)
    try {
      const result = await updateContactStatus(id, status)
      if (result.success) {
        setContacts(contacts.map((contact) => (contact.id === id ? { ...contact, status } : contact)))
      } else {
        setError(result.error || "Failed to update status")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "read":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "replied":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4 mr-1" />
      case "read":
        return <Eye className="h-4 w-4 mr-1" />
      case "replied":
        return <CheckCircle className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <Button onClick={fetchContacts} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {contacts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No contact messages yet.</p>
            </CardContent>
          </Card>
        ) : (
          contacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {contact.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(contact.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(contact.status)}>
                    <div className="flex items-center">
                      {getStatusIcon(contact.status)}
                      {contact.status}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Subject:</h4>
                    <p className="text-muted-foreground">{contact.subject}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Message:</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{contact.message}</p>
                  </div>
                  <div className="flex gap-2 pt-4">
                    {contact.status === "new" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(contact.id, "read")}
                        disabled={updating === contact.id}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Mark as Read
                      </Button>
                    )}
                    {contact.status !== "replied" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(contact.id, "replied")}
                        disabled={updating === contact.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark as Replied
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}>Reply via Email</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
