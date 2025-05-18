// src/components/Common/Header.js

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import LogoutButton from './LogoutButton';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [homeLink, setHomeLink] = useState('/');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      const role = session.user.role.toLowerCase();
      switch (role) {
        case 'admin':
          setHomeLink('/dashboard/admin');
          break;
        case 'employee':
          setHomeLink('/dashboard/employee');
          break;
        case 'user':
          setHomeLink('/user-home');
          break;
        default:
          setHomeLink('/');
      }
    } else {
      setHomeLink('/');
    }
  }, [session, status]);

  return (
    <header className="bg-primary-100/90 text-primary-900 backdrop-blur-sm fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 overflow-hidden">
              <Image 
                src="/loogo.jpg" 
                alt="LoundroTech Logo" 
                fill
                className="rounded-full object-cover"
                priority
              />
            </div>
            <span className="text-xl font-bold text-primary-800">LaundroTech</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <Link href={homeLink} className="text-primary-700 hover:text-primary-500 transition-colors duration-300">Home</Link>
              <Link href="/services" className="text-primary-700 hover:text-primary-500 transition-colors duration-300">Services</Link>
              <Link href="/bookings/booknow" className="text-primary-700 hover:text-primary-500 transition-colors duration-300">Bookings</Link>
              <Link href="/profile" className="text-primary-700 hover:text-primary-500 transition-colors duration-300">Profile</Link>
              <Link href="/contact" className="text-primary-700 hover:text-primary-500 transition-colors duration-300">Contact</Link>
            </nav>
            {session?.user && <LogoutButton />}
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-primary-700 hover:text-primary-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-200">
            <div className="flex flex-col space-y-3">
              <Link 
                href={homeLink}
                className="text-primary-700 hover:text-primary-500 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/services" 
                className="text-primary-700 hover:text-primary-500 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/bookings/booknow" 
                className="text-primary-700 hover:text-primary-500 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bookings
              </Link>
              <Link 
                href="/profile" 
                className="text-primary-700 hover:text-primary-500 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link 
                href="/contact" 
                className="text-primary-700 hover:text-primary-500 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {session?.user && (
                <div className="pt-2 border-t border-primary-200">
                  <LogoutButton />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
