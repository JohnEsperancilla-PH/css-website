'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { ResponseViewer } from '@/components/forms/response-viewer'
import { UserMenu } from '@/components/auth/user-menu'
import { Form } from '@/lib/types/forms'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ResponsesPageProps {
  params: Promise<{ id: string }>
}

export default function ResponsesPage({ params }: ResponsesPageProps) {
  const router = useRouter()
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const { id } = use(params)

  const fetchForm = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setForm(data)
    } catch (error) {
      console.error('Error fetching form:', error)
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    fetchForm()
  }, [fetchForm])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form not found</h1>
          <p className="text-gray-600">The form you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/admin">
              <Button variant="ghost" className="flex items-center gap-2 text-base">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <UserMenu />
          </div>
        </div>
        <ResponseViewer form={form} />
      </div>
    </div>
  )
}