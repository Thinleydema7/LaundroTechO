'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Register the user
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: formData.role.toUpperCase()
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      console.log('Registration successful:', data);

      // Wait a bit longer before attempting to sign in to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Sign in the user automatically after registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        console.error('Sign in error:', result.error);
        setError('Account created successfully, but automatic sign-in failed. Please try signing in manually.');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
        return;
      }

      // Redirect based on role
      const redirectPath = formData.role.toUpperCase() === 'ADMIN' 
        ? '/dashboard/admin' 
        : formData.role.toUpperCase() === 'EMPLOYEE'
          ? '/dashboard/employee'
          : '/dashboard/user';

      router.push(redirectPath);
    } catch (err) {
      console.error('Registration/Sign-in error:', err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-100 to-primary-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="LaundroTech Logo"
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-primary-800">Create Account</h1>
          <p className="text-primary-600 mt-2">Please fill in your information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              minLength={6}
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="USER">User</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm mt-2">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 