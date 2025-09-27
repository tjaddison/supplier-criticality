import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/sidebar';

async function getUserInfo() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value;

  if (!authToken) {
    return null;
  }

  try {
    const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (userResponse.ok) {
      return await userResponse.json();
    }
  } catch (error) {
    console.error('Failed to get user info:', error);
  }

  return null;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserInfo();

  if (!user) {
    redirect('/api/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <DashboardSidebar user={user} />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 min-h-screen md:min-h-0">
        {children}
      </main>
    </div>
  );
} 