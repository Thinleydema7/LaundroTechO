import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Common/Header';
import Footer from '@/components/Common/Footer';

export const metadata = {
  title: 'LaundroTech',
  description: 'Professional Laundry Services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
