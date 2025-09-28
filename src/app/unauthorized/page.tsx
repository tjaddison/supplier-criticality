import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to access this page. Please contact your administrator to upgrade your account.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link href="/dashboard">
            <Button className="w-full">
              Return to Dashboard
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" className="w-full">
              View Pricing Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}