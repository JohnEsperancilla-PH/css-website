import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  Newspaper, 
  Settings, 
  Users, 
  BarChart3, 
  Database,
  Plus,
  Eye
} from "lucide-react"
import { UserMenu } from "@/components/auth/user-menu"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Central admin dashboard for managing all applications",
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Admin Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Forms App */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-blue-100 rounded-xl">
                  <FileText className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Forms</CardTitle>
                </div>
                <Link href="/admin/forms">
                  <Button className="w-full" size="lg">
                    <Eye className="w-4 h-4 mr-2" />
                    Open Forms
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* News App */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-green-100 rounded-xl">
                  <Newspaper className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">News</CardTitle>
                </div>
                <Link href="/admin/news">
                  <Button className="w-full" size="lg">
                    <Eye className="w-4 h-4 mr-2" />
                    Open News
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Analytics App (Future) */}
          <Card className="hover:shadow-lg transition-shadow opacity-60">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-purple-100 rounded-xl">
                  <BarChart3 className="w-12 h-12 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Analytics</CardTitle>
                </div>
                <Button className="w-full" size="lg" disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users App (Future) */}
          <Card className="hover:shadow-lg transition-shadow opacity-60">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-orange-100 rounded-xl">
                  <Users className="w-12 h-12 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Users</CardTitle>
                </div>
                <Button className="w-full" size="lg" disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Database App (Future) */}
          <Card className="hover:shadow-lg transition-shadow opacity-60">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-red-100 rounded-xl">
                  <Database className="w-12 h-12 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Database</CardTitle>
                </div>
                <Button className="w-full" size="lg" disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings App (Future) */}
          <Card className="hover:shadow-lg transition-shadow opacity-60">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-xl">
                  <Settings className="w-12 h-12 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Settings</CardTitle>
                </div>
                <Button className="w-full" size="lg" disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/forms/new">
              <Button variant="outline" className="w-full h-14">
                <Plus className="w-4 h-4 mr-2" />
                Create New Form
              </Button>
            </Link>
            <Link href="/admin/news/new">
              <Button variant="outline" className="w-full h-14">
                <Plus className="w-4 h-4 mr-2" />
                Create News Article
              </Button>
            </Link>
            <Link href="/admin/forms">
              <Button variant="outline" className="w-full h-14">
                <FileText className="w-4 h-4 mr-2" />
                View All Forms
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}