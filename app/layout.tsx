import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Auto Frontend',
  description: 'Next.js 15 i18n + auth scaffold'
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
