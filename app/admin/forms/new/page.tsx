'use client'

import { FormBuilder } from '@/components/forms/form-builder'
import { UserMenu } from '@/components/auth/user-menu'
import { Form } from '@/lib/types/forms'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NewFormPage() {
  const router = useRouter()

  function handleSave(form: Form) {
    router.push(`/admin/forms/${form.id}/edit`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="flex items-center gap-2 text-base">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <UserMenu />
        </div>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create New Form</h1>
          <p className="text-lg text-gray-600">Build your custom form with our easy-to-use form builder</p>
        </div>
        <FormBuilder onSave={handleSave} />
      </div>
    </div>
  )
}