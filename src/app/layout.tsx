import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase';
import './globals.css';

export const metadata: Metadata = {
  title: 'GDG SPEC',
  description: 'Google Developer Group on Campus - Shree Parekh Engineering College, Mahuva',
  keywords: ['GDG', 'SPEC', 'Google Developer Group', 'Mahuva', 'Engineering College'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseProvider>
          {children}
          <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
