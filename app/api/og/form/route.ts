import { NextRequest, NextResponse } from 'next/server'
import { generateFormOGImage } from '@/lib/utils/og-image-generator'
import { Form } from '@/lib/types/forms'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')
  const description = searchParams.get('description')

  if (!title) {
    return new NextResponse('Missing title parameter', { status: 400 })
  }

  try {
    const mockForm: Form = {
      id: 'og-generator',
      title: title,
      description: description || undefined,
      questions: [],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const ogImage = await generateFormOGImage(mockForm)
    
    // Convert data URL to buffer
    const base64Data = ogImage.replace(/^data:image\/svg\+xml;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new NextResponse('Error generating image', { status: 500 })
  }
} 