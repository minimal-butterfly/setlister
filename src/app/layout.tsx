import type { Metadata } from 'next';
import { Space_Mono, Inter, VT323, Orbitron, Nunito } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import '@/styles/tokens/primitives.css';
import '@/styles/tokens/semantic.css';
import '@/styles/themes/techno.css';
import '@/styles/themes/acid.css';
import '@/styles/themes/trance.css';
import './globals.css';

const spaceMono = Space_Mono({ weight: ['400', '700'], variable: '--font-space-mono', subsets: ['latin'] });
const inter     = Inter({ weight: ['400', '500', '600', '700'], variable: '--font-inter', subsets: ['latin'] });
const vt323     = VT323({ weight: ['400'], variable: '--font-vt323', subsets: ['latin'] });
const orbitron  = Orbitron({ weight: ['400', '500', '700'], variable: '--font-orbitron', subsets: ['latin'] });
const nunito    = Nunito({ weight: ['400', '600', '700'], variable: '--font-nunito', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Setlister',
  description: 'Vinyl record management and DJ setlist tool',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const fonts = [spaceMono, inter, vt323, orbitron, nunito].map((f) => f.variable).join(' ');
  return (
    <html lang="en" className={fonts}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
