'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);

  // Parallax effect for hero section
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const textY = useTransform(scrollY, [0, 300], [0, 100]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [timeSlots] = useState([
    { time: '09:00 AM', state: 'FREE', id: 1, price: 100 },
    { time: '10:00 AM', state: 'Booked', id: 2, price: 100 },
    { time: '11:00 AM', state: 'FREE', id: 3, price: 100 },
    { time: '02:00 PM', state: 'FREE', id: 4, price: 100 },
    { time: '03:00 PM', state: 'Booked', id: 5, price: 100 },
    { time: '04:00 PM', state: 'FREE', id: 6, price: 100 },
  ]);

  if (!isMounted) return null; // Prevent hydration issues

  return (
    <div className="w-full">
      {/* Hero Section with Parallax */}
      <motion.section 
        className="relative h-[500px] overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        <motion.div 
          className="absolute inset-0 bg-black/20"
          style={{ scale: heroScale }}
        >
          <Image
            src="/laundry.jpg"
            alt="Laundry Background"
            fill
            sizes="100vw"
            priority
            className="object-cover"
            quality={100}
          />
        </motion.div>
        <motion.div 
          className="relative z-10 h-full flex items-center justify-end"
          style={{ y: textY }}
        >
          <div className="container mx-auto px-4 flex justify-end">
            <motion.h1 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-4 text-white max-w-2xl text-right drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
            >
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-primary-200 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              >
                Free up your time
              </motion.span> and<br />
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-primary-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              >
                let us handle
              </motion.span> your{' '}
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-accent-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              >
                laundry
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              >
                - BOOK NOW!
              </motion.span>
            </motion.h1>
          </div>
        </motion.div>
      </motion.section>

      {/* Scheduling Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-white/90 backdrop-blur-sm relative z-20"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-primary-600 mb-8"
          >
            SCHEDULE YOUR TIME
          </motion.h2>
          
          {/* Date Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </motion.div>

          {/* Time Slots Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {timeSlots.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-lg shadow-md bg-white border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xl font-semibold text-primary-700">{slot.time}</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    slot.state === 'FREE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {slot.state}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Price: Nu.{slot.price}</p>
                  <p className="text-sm text-gray-500">
                    {slot.state === 'FREE' ? 'Available for booking' : 'Already booked'}
                  </p>
                </div>
                {slot.state === 'FREE' ? (
                  <button className="w-full bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Book Now</span>
                  </button>
                ) : (
                  <button disabled className="w-full bg-gray-300 text-gray-500 px-6 py-2 rounded-md cursor-not-allowed">
                    Not Available
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Quick Availability Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto mt-8 p-4 bg-primary-50 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-primary-700 mb-2">Today's Availability</h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{timeSlots.filter(slot => slot.state === 'FREE').length} slots available</span>
              </div>
              <Link href="/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View Full Schedule →
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-primary-100/95 text-primary-900 py-16 relative z-20"
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="mb-4">
                  <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-primary-800">Schedule your time.<br />Do it online or WhatsApp Us</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
