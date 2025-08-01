'use client'

import { useState, useEffect } from 'react'
import { EventEditor } from '@/components/forms/event-editor'
import { Event } from '@/lib/types/events'
import { supabase } from '@/lib/supabase/client'
import { UserMenu } from '@/components/auth/user-menu'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function EditEventPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedEvent, setSavedEvent] = useState<Event | null>(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      fetchEvent(params.id as string)
    }
  }, [params.id])

  async function fetchEvent(id: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
      alert('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  function handleSave(updatedEvent: Event) {
    setSavedEvent(updatedEvent)
    setEvent(updatedEvent)
    // Optionally redirect to the events dashboard after a short delay
    setTimeout(() => {
      router.push('/admin/events')
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">The event you&apos;re trying to edit doesn&apos;t exist or has been removed.</p>
            <Link href="/admin/events">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Link href="/admin/events">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Event</h1>
              <p className="text-lg text-gray-600">Update your event or activity</p>
            </div>
            <UserMenu />
          </div>
        </div>

        {/* Success Message */}
        {savedEvent && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <p className="font-medium">Event updated successfully!</p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Redirecting to events dashboard...
            </p>
          </div>
        )}

        {/* Event Editor */}
        <EventEditor event={event} onSave={handleSave} />
      </div>
    </div>
  )
} 