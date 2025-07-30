'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { FormViewer } from '@/components/forms/form-viewer'
import { Form } from '@/lib/types/forms'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface FormPageProps {
  params: Promise<{ id: string }>
}

export default function FormPage({ params }: FormPageProps) {
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
      
      if (!data.is_active) {
        router.push('/404')
        return
      }
      
      setForm(data)
    } catch (error) {
      console.error('Error fetching form:', error)
      router.push('/404')
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form not found</h1>
          <p className="text-gray-600">The form you&apos;re looking for doesn&apos;t exist or is no longer active.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-6">
      <div className="w-full">
        <FormViewer form={form} />
      </div>
    </div>
  )
}