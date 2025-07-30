import { AuthGuard } from '@/components/auth/auth-guard'

export const metadata = {
  title: "Form Admin Dashboard",
  description: "Manage your forms and view responses",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AuthGuard>
  );
}