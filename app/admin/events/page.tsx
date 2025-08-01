'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, BarChart3, Eye, Edit, Trash2, ArrowLeft, Star, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Event } from '@/lib/types/events'
import { supabase } from '@/lib/supabase/client'
import { UserMenu } from '@/components/auth/user-menu'
import Link from 'next/link'

export default function EventsDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleEventStatus(eventId: string, isPublished: boolean) {
    try {
      const updateData: {
        is_published: boolean
        updated_at: string
        published_at?: string
      } = {
        is_published: !isPublished,
        updated_at: new Date().toISOString()
      }
      
      if (!isPublished) {
        updateData.published_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId)

      if (error) throw error
      
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                is_published: !isPublished,
                published_at: !isPublished ? new Date().toISOString() : event.published_at
              } 
            : event
        )
      )
    } catch (error) {
      console.error('Error updating event status:', error)
      alert('Failed to update event status')
    }
  }

  async function deleteEvent(eventId: string) {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error
      
      setEvents(prev => prev.filter(event => event.id !== eventId))
      alert('Event deleted successfully')
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event')
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString()
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-8">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Events Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Events Dashboard</h2>
              <p className="text-gray-600">Manage your events and activities</p>
            </div>
            <Link href="/admin/events/new">
              <Button size="lg" className="flex items-center gap-2 px-6 py-3">
                <Plus className="w-5 h-5" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">{events.length}</CardDescription>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">
                    {events.filter(e => e.is_published).length}
                  </CardDescription>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">
                    {events.filter(e => !e.is_published).length}
                  </CardDescription>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Featured</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">
                    {events.filter(e => e.featured).length}
                  </CardDescription>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No events yet</h3>
              <p className="text-gray-600 mb-6 text-lg">Get started by creating your first event.</p>
              <Link href="/admin/events/new">
                <Button size="lg" className="flex items-center gap-2 px-6 py-3">
                  <Plus className="w-5 h-5" />
                  Create Your First Event
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>Manage and monitor your events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          {event.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${getCategoryColor(event.category)} text-xs`}>
                          {event.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          event.is_published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/events/${event.id}`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/admin/events/${event.id}/edit`}>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEventStatus(event.id, event.is_published)}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {event.is_published ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
} 