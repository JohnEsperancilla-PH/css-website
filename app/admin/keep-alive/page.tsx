'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/auth/user-menu'
import { ArrowLeft, Activity, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'

interface KeepAliveResponse {
  success: boolean
  message?: string
  error?: string
  timestamp: string
  recordsFound?: number
}

export default function KeepAlivePage() {
  const [response, setResponse] = useState<KeepAliveResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const testKeepAlive = async () => {
    setLoading(true)
    setResponse(null)

    try {
      const res = await fetch('/api/keep-alive')
      const data = await res.json()
      setResponse(data)
    } catch (error) {
      setResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch',
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="flex items-center gap-2 text-base">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <UserMenu />
        </div>

        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Activity className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Keep-Alive Monitor</h1>
          <p className="text-lg text-gray-600">Monitor and test your Supabase keep-alive functionality</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Cron Schedule</h3>
              </div>
              <p className="text-blue-700">Every 10 minutes</p>
              <p className="text-sm text-blue-600 mt-1">Vercel Cron + GitHub Actions</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Database Query</h3>
              </div>
              <p className="text-green-700">Simple SELECT from forms table</p>
              <p className="text-sm text-green-600 mt-1">Minimal resource usage</p>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={testKeepAlive}
              disabled={loading}
              size="lg"
              className="px-8 py-3"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Activity className="w-5 h-5 mr-2" />
              )}
              Test Keep-Alive Now
            </Button>
          </div>
        </div>

        {response && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Last Test Result</h3>
            
            <div className={`p-4 rounded-lg mb-4 ${
              response.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {response.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  response.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {response.success ? 'Success' : 'Failed'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Timestamp:</span> {response.timestamp}
                </div>
                {response.message && (
                  <div>
                    <span className="font-medium">Message:</span> {response.message}
                  </div>
                )}
                {response.recordsFound !== undefined && (
                  <div>
                    <span className="font-medium">Records Found:</span> {response.recordsFound}
                  </div>
                )}
                {response.error && (
                  <div className="text-red-700">
                    <span className="font-medium">Error:</span> {response.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">How It Works</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• <strong>Vercel Cron:</strong> Automatically calls /api/keep-alive every 10 minutes when deployed</li>
            <li>• <strong>GitHub Actions:</strong> Backup cron job that pings your site externally</li>
            <li>• <strong>Database Query:</strong> Simple SELECT query to maintain active connection</li>
            <li>• <strong>Lightweight:</strong> Minimal resource usage to respect free tier limits</li>
          </ul>
        </div>
      </div>
    </div>
  )
}