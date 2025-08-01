import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Event } from '@/lib/types/events'
import { createClient } from '@/lib/supabase/server'
import { Calendar, Search, ArrowRight, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events & Activities',
  description: 'Discover upcoming workshops, hackathons, networking events, and competitions organized by the Computer Science Society.',
  openGraph: {
    title: 'Events & Activities',
    description: 'Discover upcoming workshops, hackathons, networking events, and competitions organized by the Computer Science Society.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Events & Activities',
      },
    ],
    type: 'website',
    siteName: 'Computer Science Society - USLS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events & Activities',
    description: 'Discover upcoming workshops, hackathons, networking events, and competitions organized by the Computer Science Society.',
    images: ['/og-image.png'],
  },
}

export default async function EventsPage() {
  const supabase = createClient()
  let events: Event[] = []

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('featured', { ascending: false })
      .order('date', { ascending: true })

    if (error) throw error
    events = data || []
  } catch (error) {
    console.error('Error fetching events:', error)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Events & Activities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover upcoming workshops, hackathons, networking events, and competitions organized by the Computer Science Society.
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              No events have been published yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <article key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Thumbnail */}
                {event.thumbnail_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.thumbnail_url}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className={`${getCategoryColor(event.category)} text-xs`}>
                      {event.category}
                    </Badge>
                    {event.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        Featured
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.date)}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {event.title}
                  </h2>

                  {/* Description */}
                  {event.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    {event.max_attendees && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span>Capacity: {event.current_attendees || 0}/{event.max_attendees}</span>
                      </div>
                    )}
                  </div>

                  {/* Read More */}
                  <Link href={`/events/${event.id}`}>
                    <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 