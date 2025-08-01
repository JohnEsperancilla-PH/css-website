'use client'

import { useState } from 'react'
import { EventEditor } from '@/components/forms/event-editor'
import { Event } from '@/lib/types/events'
import { UserMenu } from '@/components/auth/user-menu'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewEventPage() {
  const [savedEvent, setSavedEvent] = useState<Event | null>(null)
  const router = useRouter()

  function handleSave(event: Event) {
    setSavedEvent(event)
    // Optionally redirect to the events dashboard after a short delay
    setTimeout(() => {
      router.push('/admin/events')
    }, 2000)
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Event</h1>
              <p className="text-lg text-gray-600">Create and publish a new event or activity</p>
            </div>
            <UserMenu />
          </div>
        </div>

        {/* Success Message */}
        {savedEvent && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <p className="font-medium">Event saved successfully!</p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Redirecting to events dashboard...
            </p>
          </div>
        )}

        {/* Event Editor */}
        <EventEditor onSave={handleSave} />
      </div>
    </div>
  )
} 