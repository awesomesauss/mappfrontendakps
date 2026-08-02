import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, VT323, Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import { SmartHomeProvider } from '@/lib/store/smart-home-context';
import { ThemeProvider } from '@/lib/store/theme-context';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

const vt323 = VT323({
  weight: '400',
  variable: '--font-vt323',
  subsets: ['latin'],
});

const shareTech = Share_Tech_Mono({
  weight: '400',
  variable: '--font-share-tech',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Automatic Solar System (ASS) | Command Center',
  description:
    'The fastest way to control your solar system with real-time telemetry, hardware state sync, and security logs.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${vt323.variable} ${shareTech.variable} font-sans antialiased min-h-screen selection:bg-orange-500 selection:text-black`}
      >
        <ThemeProvider>
          <SmartHomeProvider>{children}</SmartHomeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
