'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, Question, QuestionType } from '@/lib/types/forms'
import { supabase } from '@/lib/supabase/client'
import { QRCodeGenerator } from './qr-code-generator'


interface FormBuilderProps {
  form?: Form
  onSave?: (form: Form) => void
}

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'short_text', label: 'Short Text' },
  { value: 'long_text', label: 'Long Text' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'rating', label: 'Rating (1-5 stars)' },
]

export function FormBuilder({ form, onSave }: FormBuilderProps) {
  const [title, setTitle] = useState(form?.title || '')
  const [description, setDescription] = useState(form?.description || '')
  const [questions, setQuestions] = useState<Question[]>(form?.questions || [])
  const [isSaving, setIsSaving] = useState(false)

  function addQuestion() {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type: 'short_text',
      title: 'Untitled Question',
      required: false,
    }
    setQuestions([...questions, newQuestion])
  }

  function updateQuestion(index: number, updates: Partial<Question>) {
    setQuestions(prev => 
      prev.map((q, i) => i === index ? { ...q, ...updates } : q)
    )
  }

  function deleteQuestion(index: number) {
    setQuestions(prev => prev.filter((_, i) => i !== index))
  }

  function addOption(questionIndex: number) {
    updateQuestion(questionIndex, {
      options: [...(questions[questionIndex].options || []), 'New Option']
    })
  }

  function updateOption(questionIndex: number, optionIndex: number, value: string) {
    const question = questions[questionIndex]
    const newOptions = [...(question.options || [])]
    newOptions[optionIndex] = value
    updateQuestion(questionIndex, { options: newOptions })
  }

  function deleteOption(questionIndex: number, optionIndex: number) {
    const question = questions[questionIndex]
    const newOptions = (question.options || []).filter((_, i) => i !== optionIndex)
    updateQuestion(questionIndex, { options: newOptions })
  }

  async function handleSave() {
    console.log('Save validation:', { 
      title: title.trim(), 
      titleLength: title.trim().length, 
      questionsCount: questions.length,
      questions: questions.map(q => ({ id: q.id, title: q.title, type: q.type }))
    })
    
    // More specific validation messages
    if (!title.trim()) {
      alert('Please add a form title.')
      return
    }
    
    if (questions.length === 0) {
      alert('Please add at least one question.')
      return
    }
    
    // Check if all questions have titles
    const questionsWithoutTitles = questions.filter(q => !q.title.trim())
    if (questionsWithoutTitles.length > 0) {
      alert('Please add titles to all questions and make sure they are not empty.')
      return
    }

    setIsSaving(true)
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase is not configured. Please check your environment variables.')
      }

      const formData = {
        title: title.trim(),
        description: description.trim() || null,
        questions,
        is_active: true,
        updated_at: new Date().toISOString()
      }

      console.log('Attempting to save form:', formData)

      let savedForm: Form

      if (form?.id) {
        console.log('Updating existing form:', form.id)
        const { data, error } = await supabase
          .from('forms')
          .update(formData)
          .eq('id', form.id)
          .select()
          .single()

        if (error) {
          console.error('Database update error:', error)
          throw error
        }
        savedForm = data
      } else {
        console.log('Creating new form')
        const { data, error } = await supabase
          .from('forms')
          .insert({
            ...formData,
            created_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) {
          console.error('Database insert error:', error)
          throw error
        }
        savedForm = data
      }

      console.log('Form saved successfully:', savedForm)
      onSave?.(savedForm)
      alert('Form saved successfully!')
    } catch (error: unknown) {
      console.error('Error saving form:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      if (errorMessage.includes('environment variables')) {
        alert('Database not configured. Please check the setup guide and configure your Supabase credentials.')
      } else if (errorMessage.includes('relation "forms" does not exist')) {
        alert('Database tables not created. Please run the setup SQL in your Supabase dashboard.')
      } else {
        alert(`Failed to save form: ${errorMessage || 'Please try again.'}`)
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Form Header */}
      <div className="mb-10 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your form title..."
              className={`text-2xl font-bold ${!title.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {!title.trim() && (
              <p className="text-red-500 text-sm mt-1">Form title is required</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description to help users understand your form..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id} className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <GripVertical className="w-5 h-5 text-gray-400 mt-1 cursor-move" />
              
              <div className="flex-1 space-y-4">
                {/* Question Title & Type */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      value={question.title}
                      onChange={(e) => updateQuestion(index, { title: e.target.value })}
                      placeholder="Enter question title..."
                      className={`${!question.title.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {!question.title.trim() && (
                      <p className="text-red-500 text-xs mt-1">Question title is required</p>
                    )}
                  </div>
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(index, { 
                      type: e.target.value as QuestionType,
                      options: ['multiple_choice', 'checkbox'].includes(e.target.value) 
                        ? question.options || ['Option 1'] 
                        : undefined
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
                  >
                    {questionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Description */}
                <Input
                  value={question.description || ''}
                  onChange={(e) => updateQuestion(index, { description: e.target.value })}
                  placeholder="Help text (optional)"
                  className="text-sm"
                />

                {/* Options for multiple choice and checkbox */}
                {(question.type === 'multiple_choice' || question.type === 'checkbox') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Options:</label>
                    {(question.options || []).map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 w-6">
                          {question.type === 'multiple_choice' ? '○' : '☐'}
                        </span>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteOption(index, optionIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addOption(index)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Option
                    </Button>
                  </div>
                )}

                {/* Question Settings */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Required</span>
                  </label>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuestion(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Question */}
      <div className="mt-10">
        <Button
          onClick={addQuestion}
          variant="outline"
          className="w-full h-20 border-2 border-dashed border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 rounded-xl text-lg"
        >
          <Plus className="w-6 h-6 mr-3" />
          Add Question
        </Button>
      </div>

      {/* Form Status Summary */}
      <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className={`flex items-center gap-2 ${title.trim() ? 'text-green-600' : 'text-red-600'}`}>
                {title.trim() ? '✓' : '✗'} Title: {title.trim() ? 'Added' : 'Required'}
              </span>
              <span className={`flex items-center gap-2 ${questions.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {questions.length > 0 ? '✓' : '✗'} Questions: {questions.length} added
              </span>
              {questions.length > 0 && (
                <span className={`flex items-center gap-2 ${questions.every(q => q.title.trim()) ? 'text-green-600' : 'text-red-600'}`}>
                  {questions.every(q => q.title.trim()) ? '✓' : '✗'} All questions have titles
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Show QR Code button only when editing existing form */}
            {form?.id && (
              <QRCodeGenerator 
                formId={form.id} 
                formTitle={form.title}
              />
            )}
            <Button
              onClick={handleSave}
              disabled={isSaving || !title.trim() || questions.length === 0 || !questions.every(q => q.title.trim())}
              size="lg"
              className="flex items-center gap-2 px-8 py-3"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Form'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}