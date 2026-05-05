import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'SAMVĀDA - AI Catalyst Discovery',
  description: 'Closed-loop AI discovery engine for catalysts and engineered biological pathways',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="lg:hidden h-16" /> {/* Spacer for mobile menu button */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
