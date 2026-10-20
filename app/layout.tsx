import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { ToastContainer } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'CryptoCompass — Risk-Matched Crypto Guidance with Human Advisor in the Loop',
  description:
    'A risk-matched, explainable crypto guidance platform for beginners with a human advisor in the loop. Interactive 3D Risk Galaxy, explainable matches, and certified human verification.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-void text-text-primary min-h-screen flex flex-col antialiased selection:bg-accent selection:text-void">
        <Navbar />
        <ToastContainer />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
