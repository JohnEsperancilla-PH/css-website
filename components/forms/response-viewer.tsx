'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, Eye, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { Form, FormResponse } from '@/lib/types/forms'
import { supabase } from '@/lib/supabase/client'
import { QRCodeGenerator } from './qr-code-generator'

interface ResponseViewerProps {
  form: Form
}

export function ResponseViewer({ form }: ResponseViewerProps) {
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null)

  const fetchResponses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('form_responses')
        .select('*')
        .eq('form_id', form.id)
        .order('submitted_at', { ascending: false })

      if (error) throw error
      setResponses(data || [])
    } catch (error) {
      console.error('Error fetching responses:', error)
    } finally {
      setLoading(false)
    }
  }, [form.id])

  useEffect(() => {
    fetchResponses()
  }, [fetchResponses])

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString()
  }

  function getAnswerDisplay(questionId: string, response: FormResponse): string {
    const answer = response.responses.find(r => r.question_id === questionId)?.answer
    if (!answer) return '-'
    
    if (Array.isArray(answer)) {
      return answer.join(', ')
    }
    
    return String(answer)
  }

  function exportToCSV() {
    if (responses.length === 0) {
      alert('No responses to export')
      return
    }

    // Create CSV headers
    const headers = ['Submission Date', ...form.questions.map(q => q.title)]
    
    // Create CSV rows
    const rows = responses.map(response => [
      formatDate(response.submitted_at),
      ...form.questions.map(q => getAnswerDisplay(q.id, response))
    ])

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-8">Loading responses...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{form.title}</h1>
            <p className="text-lg text-gray-600">{responses.length} responses collected</p>
          </div>
          <div className="flex items-center gap-3">
            <QRCodeGenerator 
              formId={form.id} 
              formTitle={form.title}
            />
            <Button
              onClick={exportToCSV}
              disabled={responses.length === 0}
              size="lg"
              className="flex items-center gap-2 px-6 py-3"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No responses yet</h3>
          <p className="text-lg text-gray-600">Responses will appear here once people start submitting your form.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Responses</p>
                  <p className="text-3xl font-bold text-gray-900">{responses.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Latest Response</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {responses.length > 0 ? formatDate(responses[0].submitted_at).split(',')[0] : '-'}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Questions</p>
                  <p className="text-3xl font-bold text-gray-900">{form.questions.length}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Responses Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    {form.questions.slice(0, 3).map(question => (
                      <th key={question.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {question.title.length > 20 ? `${question.title.substring(0, 20)}...` : question.title}
                      </th>
                    ))}
                    {form.questions.length > 3 && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responses.map((response) => (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(response.submitted_at)}
                      </td>
                      {form.questions.slice(0, 3).map(question => (
                        <td key={question.id} className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate">
                            {getAnswerDisplay(question.id, response)}
                          </div>
                        </td>
                      ))}
                      {form.questions.length > 3 && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedResponse(response)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Response Details</h3>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedResponse(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-6">
                <div className="text-sm text-gray-600">
                  Submitted: {formatDate(selectedResponse.submitted_at)}
                </div>

                {form.questions.map(question => (
                  <div key={question.id}>
                    <h4 className="font-medium text-gray-900 mb-2">{question.title}</h4>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {getAnswerDisplay(question.id, selectedResponse) || 'No answer provided'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}