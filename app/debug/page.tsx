import { createClient } from '@/lib/supabase/server'
import { Feature } from '@/lib/types/features'

export default async function DebugPage() {
  const supabase = createClient()
  
  try {
    // Check all features (published and unpublished)
    const { data: allFeatures, error: allError } = await supabase
      .from('features')
      .select('*')
      .order('created_at', { ascending: false })

    // Check only published features
    const { data: publishedFeatures, error: publishedError } = await supabase
      .from('features')
      .select('*')
      .eq('is_published', true)
      .order('featured', { ascending: false })
      .order('published_at', { ascending: false })

    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-8">Database Debug Info</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* All Features */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">All Features ({allFeatures?.length || 0})</h2>
              {allError && (
                <div className="text-red-600 mb-4">
                  <strong>Error:</strong> {allError.message}
                </div>
              )}
              {allFeatures && allFeatures.length > 0 ? (
                <div className="space-y-3">
                  {allFeatures.map((feature: Feature) => (
                    <div key={feature.id} className="border p-3 rounded">
                      <div className="font-medium">{feature.title}</div>
                      <div className="text-sm text-gray-600">
                        Published: {feature.is_published ? 'Yes' : 'No'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Featured: {feature.featured ? 'Yes' : 'No'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Published At: {feature.published_at || 'Not set'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No features found in database</p>
              )}
            </div>

            {/* Published Features */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Published Features ({publishedFeatures?.length || 0})</h2>
              {publishedError && (
                <div className="text-red-600 mb-4">
                  <strong>Error:</strong> {publishedError.message}
                </div>
              )}
              {publishedFeatures && publishedFeatures.length > 0 ? (
                <div className="space-y-3">
                  {publishedFeatures.map((feature: Feature) => (
                    <div key={feature.id} className="border p-3 rounded">
                      <div className="font-medium">{feature.title}</div>
                      <div className="text-sm text-gray-600">
                        Featured: {feature.featured ? 'Yes' : 'No'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Published At: {feature.published_at || 'Not set'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No published features found</p>
              )}
            </div>
          </div>

          {/* Environment Info */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
            <div className="text-sm">
              <div>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}</div>
              <div>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-8">Database Debug Error</h1>
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 mb-4">Error occurred</h2>
            <pre className="text-red-700 text-sm">{JSON.stringify(error, null, 2)}</pre>
          </div>
        </div>
      </div>
    )
  }
} 