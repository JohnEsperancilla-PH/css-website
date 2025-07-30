import { supabase } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Perform a simple database query to keep Supabase active
    const { data, error } = await supabase
      .from('forms')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Keep-alive database query failed:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    console.log('Keep-alive ping successful at:', new Date().toISOString())
    
    return NextResponse.json({
      success: true,
      message: 'Database connection maintained',
      timestamp: new Date().toISOString(),
      recordsFound: data?.length || 0
    })

  } catch (error) {
    console.error('Keep-alive error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Also support POST requests (some cron services prefer POST)
export async function POST() {
  return GET()
}