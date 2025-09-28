import DashboardSidebar from '@/components/dashboard/sidebar';
import { requireAuth } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication and get real user data from session
  const session = await requireAuth();

  const user = {
    id: session.sub,
    email: session.email,
    name: session.name,
    picture: session.picture || '',
    role: session.role || 'free',
    subscription: session.subscription || 'free'
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <DashboardSidebar user={user} />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 min-h-screen md:min-h-0">
        {children}
      </main>
    </div>
  );
}