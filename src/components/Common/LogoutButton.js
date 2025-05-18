'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-primary-700 hover:text-primary-500 transition-colors duration-300"
    >
      Logout
    </button>
  );
} 