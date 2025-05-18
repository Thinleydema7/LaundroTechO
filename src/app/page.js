'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RoleSelectionPage() {
  const router = useRouter();

  const roles = [
    {
      title: 'Customer',
      description: 'Book laundry services and manage your orders',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      path: '/auth/signin?role=user'
    },
    {
      title: 'Employee',
      description: 'Manage orders and handle customer requests',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      path: '/auth/signin?role=employee'
    },
    {
      title: 'Admin',
      description: 'Manage system settings and user access',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/auth/signin?role=admin'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-100 to-primary-200 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="relative w-24 h-24 mx-auto mb-6">
          <Image
            src="/logo.png"
            alt="LaundroTech Logo"
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-primary-800 mb-4">Welcome to LaundroTech</h1>
        <p className="text-primary-600">Please select your role to continue</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
        {roles.map((role, index) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => router.push(role.path)}
          >
            <div className="text-primary-600 mb-4">
              {role.icon}
            </div>
            <h2 className="text-2xl font-semibold text-primary-800 mb-2">{role.title}</h2>
            <p className="text-primary-600">{role.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 