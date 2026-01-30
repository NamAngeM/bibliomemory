import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'BiblioMemory - Bibliothèque Numérique Académique',
  description:
    'Plateforme de consultation de mémoires, thèses et rapports de stage académiques. Accès libre et gratuit.',
  keywords: ['mémoire', 'thèse', 'rapport', 'stage', 'académique', 'université', 'bibliothèque'],
  authors: [{ name: 'BiblioMemory' }],
  openGraph: {
    title: 'BiblioMemory - Bibliothèque Numérique Académique',
    description: 'Plateforme de consultation de mémoires et thèses académiques',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} font-sans flex min-h-screen flex-col antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
