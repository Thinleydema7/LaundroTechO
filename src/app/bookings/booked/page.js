'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BookedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard/user');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Booking Confirmed!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your laundry appointment has been successfully booked.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            You will be redirected to your dashboard in 5 seconds...
          </p>
        </div>

        <div className="mt-5 flex justify-center space-x-4">
          <Link
            href="/dashboard/user"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/bookings/booknow"
            className="inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50"
          >
            Book Another
          </Link>
        </div>
      </div>
    </div>
  );
}
