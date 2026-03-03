import MagneticCursor from '@/components/ui/MagneticCursor';
import Navbar from '@/components/ui/Navbar';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { ChatbotBubble } from '@/components/chat/ChatbotBubble';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'InkMaster Studio | Premium Tattoo Art',
  description: 'Estudio de tatuajes exclusivo. Realismo, blackwork, fine line y neotradicional de clase mundial. Reserva tu sesión online.',
  keywords: 'tatuajes, tattoo studio, realismo, blackwork, fine line, reservar cita tatuaje',
  openGraph: {
    title: 'InkMaster Studio | Arte Que Trasciende',
    description: 'Diseños únicos ejecutados con precisión quirúrgica. Reserva tu sesión.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground tracking-tight selection:bg-gold/30 antialiased`}>
        <MagneticCursor />
        <Navbar />
        {children}
        <ChatbotBubble />
        <Toaster theme="dark" position="bottom-right" className="!font-mono !tracking-widest !uppercase" />
      </body>
    </html>
  );
}
