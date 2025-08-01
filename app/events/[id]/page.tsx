import { Event } from '@/lib/types/events'
import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface EventPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const supabase = createClient()
  const { id } = await params

  try {
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (!event) {
      return {
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
      }
    }

    return {
      title: `${event.title} - Events`,
      description: event.description || `Join us for ${event.title} on ${event.date} at ${event.location}.`,
      openGraph: {
        title: event.title,
        description: event.description || `Join us for ${event.title} on ${event.date} at ${event.location}.`,
        images: event.thumbnail_url ? [event.thumbnail_url] : ['/og-image.png'],
        type: 'article',
        siteName: 'Computer Science Society - USLS',
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title,
        description: event.description || `Join us for ${event.title} on ${event.date} at ${event.location}.`,
        images: event.thumbnail_url ? [event.thumbnail_url] : ['/og-image.png'],
      },
    }
  } catch (error) {
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found.',
    }
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const supabase = createClient()
  const { id } = await params

  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error || !event) {
      notFound()
    }

    function formatDate(dateString: string) {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    function getCategoryColor(category: string) {
      const colors = {
        'workshop': 'bg-blue-100 text-blue-800',
        'hackathon': 'bg-purple-100 text-purple-800',
        'networking': 'bg-green-100 text-green-800',
        'competition': 'bg-red-100 text-red-800',
        'bootcamp': 'bg-orange-100 text-orange-800',
        'club-fair': 'bg-indigo-100 text-indigo-800',
        'club-icon': 'bg-pink-100 text-pink-800',
        'event': 'bg-gray-100 text-gray-800',
        'default': 'bg-gray-100 text-gray-800'
      }
      return colors[category as keyof typeof colors] || colors.default
    }

    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/events">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                ← Back to Events
              </Button>
            </Link>
          </div>

          {/* Event Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            {/* Thumbnail */}
            {event.thumbnail_url && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={event.thumbnail_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Event Info */}
            <div className="p-8">
              {/* Meta */}
              <div className="flex items-center gap-3 mb-6">
                <Badge className={`${getCategoryColor(event.category)} text-sm`}>
                  {event.category}
                </Badge>
                {event.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-sm">
                    Featured Event
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {event.title}
              </h1>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{event.time}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{event.location}</p>
                    </div>
                  </div>
                  {event.max_attendees && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-medium">
                          {event.current_attendees || 0} / {event.max_attendees} attendees
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Button */}
              {event.registration_url && (
                <div className="mb-8">
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Register for Event
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Event Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
} 