
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'NotiBin - Save Your Notifications',
  description: 'Easily save, manage, and summarize your notifications.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased'
        )}
        suppressHydrationWarning={true}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
