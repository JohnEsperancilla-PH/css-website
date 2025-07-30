'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { Input } from '@/components/ui/input'

import { Question } from '@/lib/types/forms'
import { cn } from '@/lib/utils'

interface QuestionRendererProps {
  question: Question
  value?: string | string[] | number
  onChange: (value: string | string[] | number) => void
}

export function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  const [textValue, setTextValue] = useState(
    typeof value === 'string' ? value : ''
  )

  // Clear text input when question changes or value changes
  useEffect(() => {
    if (typeof value === 'string') {
      setTextValue(value)
    } else {
      setTextValue('')
    }
  }, [value, question.id])

  function handleTextChange(newValue: string) {
    setTextValue(newValue)
    onChange(newValue)
  }

  function handleNumberChange(newValue: string) {
    const numValue = parseFloat(newValue)
    onChange(isNaN(numValue) ? '' : numValue)
  }

  function handleMultipleChoice(option: string) {
    onChange(option)
  }

  function handleCheckbox(option: string, checked: boolean) {
    const currentValues = Array.isArray(value) ? value : []
    if (checked) {
      onChange([...currentValues, option])
    } else {
      onChange(currentValues.filter(v => v !== option))
    }
  }

  function handleRating(rating: number) {
    onChange(rating)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Question Title */}
      <div className="text-center px-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
          {question.title}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h2>
        {question.description && (
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md mx-auto">{question.description}</p>
        )}
      </div>

      {/* Question Input */}
      <div className="mt-6 sm:mt-8 px-4">
        {question.type === 'short_text' && (
          <div className="max-w-md mx-auto">
            <Input
              type="text"
              value={textValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Your answer"
              className="w-full text-center text-base sm:text-lg py-3 sm:py-4 min-h-[44px]"
            />
          </div>
        )}

        {question.type === 'long_text' && (
          <div className="max-w-lg mx-auto">
            <textarea
              value={textValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Your answer"
              className="w-full min-h-[120px] sm:min-h-[150px] p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm sm:text-base"
            />
          </div>
        )}

        {question.type === 'email' && (
          <div className="max-w-md mx-auto">
            <Input
              type="email"
              value={textValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full text-center text-base sm:text-lg py-3 sm:py-4 min-h-[44px]"
            />
          </div>
        )}

        {question.type === 'number' && (
          <div className="max-w-sm mx-auto">
            <Input
              type="number"
              value={typeof value === 'number' ? value.toString() : ''}
              onChange={(e) => handleNumberChange(e.target.value)}
              placeholder="Enter a number"
              className="w-full text-center text-base sm:text-lg py-3 sm:py-4 min-h-[44px]"
              min={question.validation?.min}
              max={question.validation?.max}
            />
          </div>
        )}

        {question.type === 'multiple_choice' && question.options && (
          <div className="max-w-lg mx-auto space-y-3 sm:space-y-4">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:border-blue-300 transition-colors min-h-[52px] touch-manipulation">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={() => handleMultipleChoice(option)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3 sm:mr-4 flex-shrink-0"
                />
                <span className="text-gray-700 text-sm sm:text-base flex-1 leading-tight">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'checkbox' && question.options && (
          <div className="max-w-lg mx-auto space-y-3 sm:space-y-4">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:border-blue-300 transition-colors min-h-[52px] touch-manipulation">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => handleCheckbox(option, e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3 sm:mr-4 flex-shrink-0"
                />
                <span className="text-gray-700 text-sm sm:text-base flex-1 leading-tight">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'rating' && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRating(rating)}
                  className={cn(
                    "p-2 sm:p-3 rounded-lg transition-all duration-200 hover:scale-110 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center",
                    typeof value === 'number' && value >= rating
                      ? "text-yellow-400 shadow-md"
                      : "text-gray-300 hover:text-yellow-300"
                  )}
                >
                  <Star className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 fill-current" />
                </button>
              ))}
            </div>
            {typeof value === 'number' && (
              <p className="text-base sm:text-lg font-medium text-gray-700">{value} out of 5 stars</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}