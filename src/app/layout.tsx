import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EH Document Template Generator',
  description: 'Generate customized business documents for different industries',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}