'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/client/gallery', label: 'Galería' },
    { href: '/client/booking', label: 'Reservar' },
    { href: '/owner/login', label: 'Artista' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Main Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
                        ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4'
                        : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold flex items-center justify-center font-black text-black text-sm">
                            IM
                        </div>
                        <span className="text-sm font-black uppercase tracking-[0.3em] group-hover:text-gold transition-colors hidden sm:block">
                            InkMaster
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-colors relative group ${pathname === link.href ? 'text-gold' : 'text-white/50 hover:text-white'
                                    }`}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="navIndicator"
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* CTA + Hamburger */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/client/booking"
                            className="hidden md:flex items-center gap-2 bg-gold text-black px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-colors"
                        >
                            Agendar
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Fullscreen Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[49] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-8">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-4xl font-black uppercase tracking-tight hover:text-gold transition-colors ${pathname === link.href ? 'text-gold' : 'text-white'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-12"
                        >
                            <Link
                                href="/client/booking"
                                onClick={() => setIsOpen(false)}
                                className="bg-gold text-black px-12 py-5 font-black uppercase tracking-[0.2em] text-sm"
                            >
                                Reservar Sesión
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
