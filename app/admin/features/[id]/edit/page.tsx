'use client'

import { useState, useEffect } from 'react'
import { FeatureEditor } from '@/components/forms/feature-editor'
import { Feature } from '@/lib/types/features'
import { supabase } from '@/lib/supabase/client'
import { UserMenu } from '@/components/auth/user-menu'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function EditFeaturePage() {
  const [feature, setFeature] = useState<Feature | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedFeature, setSavedFeature] = useState<Feature | null>(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      fetchFeature(params.id as string)
    }
  }, [params.id])

  async function fetchFeature(id: string) {
    try {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setFeature(data)
    } catch (error) {
      console.error('Error fetching feature:', error)
      alert('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  function handleSave(updatedFeature: Feature) {
    setSavedFeature(updatedFeature)
    setFeature(updatedFeature)
    // Optionally redirect to the features dashboard after a short delay
    setTimeout(() => {
      router.push('/admin/features')
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!feature) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <p className="text-gray-600 mb-6">The project you&apos;re trying to edit doesn&apos;t exist or has been removed.</p>
            <Link href="/admin/features">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Features Dashboard
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
                <Link href="/admin/features">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Features Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Project</h1>
              <p className="text-lg text-gray-600">Update the student project showcase</p>
            </div>
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Success Message */}
        {savedFeature && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-green-800 font-medium">
                Project &quot;{savedFeature.title}&quot; updated successfully! Redirecting to dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Feature Editor */}
        <FeatureEditor feature={feature} onSave={handleSave} />
      </div>
    </div>
  )
} 