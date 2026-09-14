import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Closet — WhatsApp Revenue Demo',
  description: 'Demo of a WhatsApp-powered customer enquiry and product discovery system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}