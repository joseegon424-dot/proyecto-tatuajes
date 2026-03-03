'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight, Fingerprint } from 'lucide-react';
import gsap from 'gsap';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const bgRef = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // GSAP floating orbs animation
        if (bgRef.current) {
            const orbs = bgRef.current.querySelectorAll('.login-orb');
            orbs.forEach((orb, i) => {
                gsap.to(orb, {
                    x: `random(-100, 100)`,
                    y: `random(-100, 100)`,
                    duration: gsap.utils.random(4, 8),
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: i * 0.5,
                });
            });
        }
        // Fingerprint pulse
        if (orbitRef.current) {
            gsap.to(orbitRef.current, {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'none',
            });
        }
    }, []);

    const handleLogin = async () => {
        setIsLoading(true);
        setError('');
        await new Promise(r => setTimeout(r, 800));

        if (password === 'inkmaster2026') {
            localStorage.setItem('inkmaster_auth', 'true');
            router.push('/owner/dashboard');
        } else {
            setError('CÓDIGO INVÁLIDO');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
            {/* Animated Background Orbs */}
            <div ref={bgRef} className="absolute inset-0 pointer-events-none">
                <div className="login-orb absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[150px]" />
                <div className="login-orb absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[120px]" />
                <div className="login-orb absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[100px]" />
                <div className="login-orb absolute bottom-1/3 left-1/3 w-[250px] h-[250px] bg-cyan-500/8 rounded-full blur-[80px]" />
            </div>

            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }} />

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 md:p-14 relative overflow-hidden">
                    {/* Top gradient bar */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 via-gold to-rose-500" />

                    {/* Rotating orbit ring */}
                    <div className="flex justify-center mb-10">
                        <div className="relative w-24 h-24">
                            <div ref={orbitRef} className="absolute inset-0 border border-white/10 rounded-full">
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet-500 rounded-full" />
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold rounded-full" />
                            </div>
                            <div className="absolute inset-3 bg-gradient-to-br from-violet-500/20 to-gold/20 rounded-full flex items-center justify-center border border-white/5">
                                <Fingerprint className="w-10 h-10 text-white/60" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
                            Acceso <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-gold">Exclusivo</span>
                        </h1>
                        <p className="text-white/30 text-xs uppercase tracking-[0.3em]">Panel de Control del Artista</p>
                    </div>

                    <div className="space-y-6">
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-violet-400 transition-colors" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                placeholder="CÓDIGO DE ACCESO"
                                className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-12 text-sm font-bold tracking-[0.2em] uppercase placeholder:text-white/15 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-white"
                            />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                className="text-rose-400 text-xs font-black uppercase tracking-widest text-center py-3 bg-rose-500/10 border border-rose-500/20"
                            >
                                ⚠ {error}
                            </motion.div>
                        )}

                        <button
                            onClick={handleLogin}
                            disabled={isLoading || !password}
                            className="w-full bg-gradient-to-r from-violet-600 to-gold text-white py-5 font-black uppercase tracking-[0.2em] text-sm relative overflow-hidden group disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isLoading ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                ) : (
                                    <>Ingresar <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-gold to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
