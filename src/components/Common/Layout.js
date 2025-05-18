"use client"; // Add this line to make it a Client Component

import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}