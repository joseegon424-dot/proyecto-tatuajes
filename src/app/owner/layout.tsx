'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Image as ImageIcon, CalendarDays, LogOut, Palette, TrendingUp } from 'lucide-react';

const sidebarVariants: any = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100, damping: 20, staggerChildren: 0.1 }
    }
};

const itemVariants: any = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
};

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // If on login page, render children directly — no auth needed
    const isLoginPage = pathname === '/owner/login';

    useEffect(() => {
        setIsMounted(true);
        if (!isLoginPage) {
            const auth = localStorage.getItem('inkmaster_auth');
            if (auth === 'true') {
                setIsAuthenticated(true);
            } else {
                router.replace('/owner/login');
            }
        }
    }, [router, isLoginPage]);

    const handleLogout = () => {
        localStorage.removeItem('inkmaster_auth');
        router.replace('/owner/login');
    };

    const menuItems = [
        { href: '/owner/dashboard', icon: LayoutDashboard, label: 'Resumen' },
        { href: '/owner/gallery', icon: ImageIcon, label: 'Portafolio' },
        { href: '/owner/calendar', icon: CalendarDays, label: 'Calendario' },
    ];

    // Login page renders without sidebar
    if (isLoginPage) {
        if (!isMounted) return null;
        return <>{children}</>;
    }

    if (!isMounted || !isAuthenticated) return null;

    return (
        <div className="flex min-h-screen bg-background text-foreground selection:bg-gold/30">
            {/* Glassmorphism Sidebar with color accent */}
            <motion.aside
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                className="w-72 fixed h-full bg-black/80 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col z-40"
            >
                {/* Gradient accent bar */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 via-gold to-rose-500" />

                <div className="mb-12 mt-20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-gold rounded-lg flex items-center justify-center">
                            <Palette className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-widest text-white">
                                PANEL
                            </h2>
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">
                                InkMaster Studio
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <motion.div key={item.href} variants={itemVariants}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 relative group ${isActive
                                        ? 'bg-gradient-to-r from-violet-500/10 to-gold/10 text-white border border-white/10'
                                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : 'group-hover:text-gold transition-colors'}`} />
                                    <span className="font-bold text-sm tracking-wider uppercase">{item.label}</span>

                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-500 to-gold rounded-r-full"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Stats Summary */}
                <div className="mb-6 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Quick Stats</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-xl font-black text-white">45</p>
                            <p className="text-[9px] text-white/30 uppercase tracking-wider">Citas/Mes</p>
                        </div>
                        <div>
                            <p className="text-xl font-black text-emerald-400">+12%</p>
                            <p className="text-[9px] text-white/30 uppercase tracking-wider">Crecimiento</p>
                        </div>
                    </div>
                </div>

                <motion.div variants={itemVariants}>
                    <button onClick={handleLogout} className="flex items-center gap-4 px-5 py-4 w-full text-white/30 hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-500/10">
                        <LogOut className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-wider uppercase">Cerrar Sesión</span>
                    </button>
                </motion.div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-72 p-8 pt-28 min-h-screen relative">
                {/* Subtle gradient background */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[200px] pointer-events-none" />
                <div className="fixed bottom-0 left-72 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[200px] pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="relative z-10"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
