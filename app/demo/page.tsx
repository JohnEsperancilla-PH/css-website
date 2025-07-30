'use client'

import Link from 'next/link'
import { FileText, BarChart3, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Custom Forms System Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A Google Forms-inspired system with clean UI and powerful admin features
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin">
              <Button size="lg" className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Admin Dashboard
              </Button>
            </Link>
            <Link href="/admin/forms/new">
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Create Sample Form
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg border text-center">
            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Form Builder</h3>
            <p className="text-sm text-gray-600">
              Drag-and-drop interface with multiple question types
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border text-center">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">One Question Per Page</h3>
            <p className="text-sm text-gray-600">
              Clean, focused user experience with progress tracking
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border text-center">
            <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Response Analytics</h3>
            <p className="text-sm text-gray-600">
              View responses in tables and export to CSV
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border text-center">
            <Zap className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Easy to Customize</h3>
            <p className="text-sm text-gray-600">
              Built with modern React and TypeScript
            </p>
          </div>
        </div>

        {/* Question Types */}
        <div className="bg-white rounded-lg border p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Supported Question Types
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Short Text Input</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Long Text (Textarea)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Email with Validation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Number Input</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Multiple Choice (Radio)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Checkboxes (Multiple Selection)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Star Rating (1-5 stars)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Required Field Validation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Ready to Get Started?
          </h3>
          <p className="text-blue-700 mb-4">
            Follow the setup guide to configure your database and start creating forms
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/admin">View Admin Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/forms/new">Try Form Builder</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="/SETUP.md" target="_blank">Read Setup Guide</a>
            </Button>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Built With</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-white px-3 py-1 rounded border">Next.js 15</span>
            <span className="bg-white px-3 py-1 rounded border">React 19</span>
            <span className="bg-white px-3 py-1 rounded border">TypeScript</span>
            <span className="bg-white px-3 py-1 rounded border">Tailwind CSS</span>
            <span className="bg-white px-3 py-1 rounded border">Supabase</span>
            <span className="bg-white px-3 py-1 rounded border">Radix UI</span>
          </div>
        </div>
      </div>
    </div>
  )
}