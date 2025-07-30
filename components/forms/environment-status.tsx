'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EnvironmentStatus {
  supabaseUrl: boolean
  supabaseKey: boolean
  isConfigured: boolean
}

export function EnvironmentStatus() {
  const [status, setStatus] = useState<EnvironmentStatus | null>(null)

  useEffect(() => {
    // Check environment variables on client side
    const supabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    setStatus({
      supabaseUrl,
      supabaseKey,
      isConfigured: supabaseUrl && supabaseKey
    })
  }, [])

  if (!status) {
    return null
  }

  if (status.isConfigured) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-800">System Ready</h3>
            <p className="text-sm text-green-700">
              Your environment is configured correctly. You can create and manage forms.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const missing = []
  if (!status.supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!status.supabaseKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-yellow-800 mb-2">Setup Required</h3>
          <p className="text-sm text-yellow-700 mb-3">
            Missing environment variables: <code className="bg-yellow-100 px-1 rounded">{missing.join(', ')}</code>
          </p>
          <div className="text-sm text-yellow-700 space-y-2">
            <p className="font-medium">Quick Setup Steps:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-yellow-800 underline">supabase.com</a></li>
              <li>Copy your project URL and anon key from Settings → API</li>
              <li>Create a <code className="bg-yellow-100 px-1 rounded">.env.local</code> file in your project root</li>
              <li>Add your credentials and restart the dev server</li>
              <li>Run the database setup SQL in your Supabase dashboard</li>
            </ol>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                Open Supabase <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/SETUP.md" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                Setup Guide <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}