import { cookies } from 'next/headers';
import DashboardSidebar from '@/components/dashboard/sidebar';
import { PostHogIdentify } from '@/components/providers/posthog-identify';
import { requireAuth } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // VERBOSE_LOG_START - Remove this entire logging block later
  console.log('[AUTH_FLOW] DashboardLayout: Starting authentication check');
  // VERBOSE_LOG_END

  // Check authentication and get real user data from session
  const session = await requireAuth();
  const cookieStore = await cookies();
  const demoTier = session.role === 'admin' ? (cookieStore.get('demo_tier')?.value || null) : null;

  // VERBOSE_LOG_START - Remove this entire logging block later
  console.log('[AUTH_FLOW] DashboardLayout: Auth check passed, user:', session.email);
  // VERBOSE_LOG_END

  const user = {
    id: session.sub,
    email: session.email,
    name: session.name,
    picture: session.picture,
    role: session.role,
    subscription: session.subscription
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <PostHogIdentify
        userId={user.id}
        email={user.email}
        name={user.name}
        role={user.role}
        subscription={user.subscription}
      />
      <DashboardSidebar user={user} demoTier={demoTier} />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 min-h-screen md:min-h-0">
        {children}
      </main>
    </div>
  );
}