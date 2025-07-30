export function checkEnvironmentSetup() {
  const results = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    isConfigured: false
  }
  
  results.isConfigured = results.supabaseUrl && results.supabaseKey
  
  return results
}

export function getSetupInstructions() {
  const check = checkEnvironmentSetup()
  
  if (check.isConfigured) {
    return {
      status: 'ready',
      message: 'Environment is configured correctly!',
      nextSteps: [
        'Visit /admin to create your first form',
        'Check the admin dashboard for form management',
        'Share form links with users to collect responses'
      ]
    }
  }
  
  const missing = []
  if (!check.supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!check.supabaseKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  
  return {
    status: 'needs-setup',
    message: `Missing environment variables: ${missing.join(', ')}`,
    nextSteps: [
      'Create a Supabase project at https://supabase.com',
      'Copy your project URL and anon key',
      'Create a .env.local file with your credentials',
      'Run the database setup SQL in your Supabase dashboard',
      'Restart your development server'
    ]
  }
}