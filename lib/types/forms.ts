export type QuestionType = 
  | 'short_text' 
  | 'long_text' 
  | 'multiple_choice' 
  | 'checkbox' 
  | 'email' 
  | 'number' 
  | 'rating'

export interface Question {
  id: string
  type: QuestionType
  title: string
  description?: string
  required: boolean
  options?: string[] // For multiple choice and checkbox
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface Form {
  id: string
  title: string
  description?: string
  questions: Question[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FormResponse {
  id: string
  form_id: string
  responses: {
    question_id: string
    answer: string | string[] | number
  }[]
  submitted_at: string
  ip_address?: string
}

export interface QuestionResponse {
  question_id: string
  answer: string | string[] | number
}