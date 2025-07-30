'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { QuestionRenderer } from './question-renderer'
import { Form, QuestionResponse } from '@/lib/types/forms'
import { supabase } from '@/lib/supabase/client'

interface FormViewerProps {
  form: Form
  onSubmit?: (responses: QuestionResponse[]) => void
}

export function FormViewer({ form, onSubmit }: FormViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const currentQuestion = form.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / form.questions.length) * 100
  const isLastQuestion = currentQuestionIndex === form.questions.length - 1
  const canGoNext = hasValidResponse(currentQuestion.id)

  function hasValidResponse(questionId: string): boolean {
    const response = responses.find(r => r.question_id === questionId)
    if (!response) return false
    
    const question = form.questions.find(q => q.id === questionId)
    if (question?.required) {
      if (Array.isArray(response.answer)) {
        return response.answer.length > 0
      }
      return response.answer !== '' && response.answer !== null && response.answer !== undefined
    }
    return true
  }

  function updateResponse(questionId: string, answer: string | string[] | number) {
    setResponses(prev => {
      const existing = prev.findIndex(r => r.question_id === questionId)
      const newResponse = { question_id: questionId, answer }
      
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = newResponse
        return updated
      }
      return [...prev, newResponse]
    })
  }

  function goToNext() {
    if (canGoNext && currentQuestionIndex < form.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  function goToPrevious() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  async function handleSubmit() {
    if (!canGoNext) return
    
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('form_responses')
        .insert({
          form_id: form.id,
          responses: responses,
          submitted_at: new Date().toISOString()
        })

      if (error) throw error

      setIsSubmitted(true)
      onSubmit?.(responses)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank you!</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Your response has been recorded successfully. We appreciate you taking the time to complete this form.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {form.questions.length}
          </span>
          <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Form Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{form.title}</h1>
        {form.description && (
          <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">{form.description}</p>
        )}
      </div>

      {/* Current Question */}
      <div className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <QuestionRenderer
          question={currentQuestion}
          value={responses.find(r => r.question_id === currentQuestion.id)?.answer}
          onChange={(answer) => updateResponse(currentQuestion.id, answer)}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-6 py-3 text-base"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={!canGoNext || isSubmitting}
            className="flex items-center gap-2 px-8 py-3 text-base bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
            <Check className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            onClick={goToNext}
            disabled={!canGoNext}
            className="flex items-center gap-2 px-6 py-3 text-base"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )
}