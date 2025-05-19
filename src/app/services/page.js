'use client';

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary-600 mb-8">Our Services</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Wash & Fold Service */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-primary-500 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Wash & Fold</h3>
          <p className="text-gray-600 mb-4">Professional washing and folding service for your everyday laundry needs.</p>
          <p className="text-primary-600 font-semibold">From Nu.100/lb</p>
        </div>

        {/* Dry Cleaning Service */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-primary-500 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Dry Cleaning</h3>
          <p className="text-gray-600 mb-4">Expert dry cleaning for your delicate and special garments.</p>
          <p className="text-primary-600 font-semibold">From Nu.150/item</p>
        </div>

        {/* Express Service */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-primary-500 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Express Service</h3>
          <p className="text-gray-600 mb-4">Same-day service for when you need your laundry done quickly.</p>
          <p className="text-primary-600 font-semibold">+50% Express Fee</p>
        </div>
      </div>
    </div>
  );
}
