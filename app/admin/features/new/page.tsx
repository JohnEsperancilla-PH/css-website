'use client'

import { useState } from 'react'
import { FeatureEditor } from '@/components/forms/feature-editor'
import { Feature } from '@/lib/types/features'
import { UserMenu } from '@/components/auth/user-menu'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewFeaturePage() {
  const [savedFeature, setSavedFeature] = useState<Feature | null>(null)
  const router = useRouter()

  function handleSave(feature: Feature) {
    setSavedFeature(feature)
    // Optionally redirect to the features dashboard after a short delay
    setTimeout(() => {
      router.push('/admin/features')
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
                <Link href="/admin/features">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Features Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Project</h1>
              <p className="text-lg text-gray-600">Add a new student project to showcase their work</p>
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
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">
                Project &quot;{savedFeature.title}&quot; saved successfully! Redirecting to dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Feature Editor */}
        <FeatureEditor onSave={handleSave} />
      </div>
    </div>
  )
} 