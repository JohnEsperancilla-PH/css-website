import { FormViewer } from '@/components/forms/form-viewer'
import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface FormPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: FormPageProps): Promise<Metadata> {
  const supabase = createClient()
  const { id } = await params

  try {
    const { data: form } = await supabase
      .from('forms')
      .select('title, description')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (!form) {
      return {
        title: 'Form Not Found',
        description: 'The requested form could not be found or is no longer active.'
      }
    }

    // Generate OG image URL using API route
    const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/og/form?title=${encodeURIComponent(form.title)}${form.description ? `&description=${encodeURIComponent(form.description)}` : ''}`

    return {
      title: `${form.title} - Forms`,
      description: form.description || `Fill out the ${form.title} form.`,
      openGraph: {
        title: form.title,
        description: form.description || `Fill out the ${form.title} form.`,
        images: [ogImageUrl],
        type: 'website',
        siteName: 'Computer Science Society - USLS',
      },
      twitter: {
        card: 'summary_large_image',
        title: form.title,
        description: form.description || `Fill out the ${form.title} form.`,
        images: [ogImageUrl],
      },
    }
  } catch {
    return {
      title: 'Form Not Found',
      description: 'The requested form could not be found or is no longer active.'
    }
  }
}

export default async function FormPage({ params }: FormPageProps) {
  const supabase = createClient()
  const { id } = await params

  try {
    const { data: form, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !form) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-6">
        <div className="w-full">
          <FormViewer form={form} />
        </div>
      </div>
    )
  } catch {
    notFound()
  }
}