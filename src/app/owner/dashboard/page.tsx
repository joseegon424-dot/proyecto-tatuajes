'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, Users, DollarSign, CheckCircle2, Clock, MessageSquare,
    ArrowUpRight, ArrowDownRight, Eye, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import gsap from 'gsap';

const containerVariants: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6 } }
};

export default function DashboardPage() {
    const [currentTime, setCurrentTime] = useState('');
    const [appointments, setAppointments] = useState<any[]>([]);
    const counterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentTime(new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

        // Fetch real appointments
        supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(5).then(({ data }) => {
            if (data) setAppointments(data);
        });
    }, []);

    // GSAP counter animation
    useEffect(() => {
        if (counterRef.current) {
            const counters = counterRef.current.querySelectorAll('.gsap-counter');
            counters.forEach((el) => {
                const target = parseInt(el.getAttribute('data-target') || '0');
                gsap.fromTo(el, { textContent: 0 }, {
                    textContent: target,
                    duration: 2,
                    snap: { textContent: 1 },
                    ease: 'power2.out',
                    delay: 0.5,
                });
            });
        }
    }, []);

    const stats = [
        { title: 'Citas del Mes', value: '45', change: '+12%', trend: 'up', icon: Calendar, gradient: 'from-violet-500 to-violet-700', glow: 'violet' },
        { title: 'Ingresos', value: '$8.4M', change: '+8%', trend: 'up', icon: DollarSign, gradient: 'from-emerald-500 to-emerald-700', glow: 'emerald' },
        { title: 'Nuevos Clientes', value: '18', change: '-2', trend: 'down', icon: Users, gradient: 'from-cyan-500 to-cyan-700', glow: 'cyan' },
        { title: 'Completadas', value: '94%', change: '+5%', trend: 'up', icon: CheckCircle2, gradient: 'from-gold to-amber-600', glow: 'gold' }
    ];

    return (
        <div ref={counterRef} className="space-y-8 w-full max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6"
            >
                <div>
                    <motion.h1
                        className="text-[3rem] md:text-[4rem] font-black leading-none tracking-tight"
                        initial={{ y: 50 }} animate={{ y: 0 }}
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-rose-400 to-gold">Dashboard</span>
                    </motion.h1>
                    <p className="text-white/30 uppercase tracking-[0.2em] text-xs mt-2 font-bold">{currentTime || 'Cargando...'}</p>
                </div>
                <div className="flex gap-3">
                    <Button className="bg-gradient-to-r from-violet-600 to-gold text-white border-0 font-bold tracking-wider uppercase text-xs px-6 py-5 hover:opacity-90">
                        <Calendar className="w-4 h-4 mr-2" /> Agendar Offline
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
                    return (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="bg-white/[0.02] border-white/5 hover:border-white/15 transition-all overflow-hidden relative group">
                                <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${stat.gradient}`} />
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.glow}-500/10 blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-100 opacity-50 transition-opacity`} />
                                <CardContent className="p-6 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3">
                                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">{stat.title}</p>
                                            <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                                            <div className="flex items-center gap-1.5">
                                                <TrendIcon className={`w-3.5 h-3.5 ${stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`} />
                                                <span className={`text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {stat.change}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-20`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Main Content Grid */}
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid lg:grid-cols-3 gap-6">
                {/* Upcoming Appointment — Span 2 */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="bg-white/[0.02] border-white/5 h-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 via-rose-500 to-gold" />
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-bold uppercase tracking-wider flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-violet-400" /> Próximo Tatuaje
                                </CardTitle>
                                <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                    En 2 horas
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden group hover:border-violet-500/20 transition-colors">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-[100px]" />
                                {appointments.length > 0 ? (
                                    <>
                                        <h3 className="text-3xl font-black mb-1">{appointments[0].client_name?.toUpperCase()}</h3>
                                        <p className="text-white/30 tracking-widest uppercase text-xs mb-6">{appointments[0].client_phone || appointments[0].client_email}</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><p className="text-[10px] text-white/30 uppercase tracking-wider">Servicio</p><p className="font-bold text-lg text-violet-300">{appointments[0].service}</p></div>
                                            <div><p className="text-[10px] text-white/30 uppercase tracking-wider">Hora</p><p className="font-bold text-lg text-gold">{appointments[0].appointment_time}</p></div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-3xl font-black mb-1">SIN CITAS</h3>
                                        <p className="text-white/30 tracking-widest uppercase text-xs">Esperando reservaciones...</p>
                                    </>
                                )}
                                <div className="mt-8 flex gap-4">
                                    <Button className="bg-gradient-to-r from-violet-600 to-gold text-white border-0 flex-1 uppercase tracking-widest font-bold">Iniciar Sesión</Button>
                                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 uppercase tracking-widest font-bold">Posponer</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Bot IA Status */}
                <motion.div variants={itemVariants}>
                    <Card className="bg-white/[0.02] border-white/5 h-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-emerald-500" />
                        <CardHeader>
                            <CardTitle className="text-lg font-bold uppercase tracking-wider flex items-center gap-3">
                                <Zap className="w-5 h-5 text-cyan-400" /> Bot IA
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
                                <div className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                                </div>
                                <p className="font-bold tracking-widest text-xs uppercase text-emerald-400">Operativo</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { label: 'Conversaciones Hoy', value: '24', color: 'text-white' },
                                    { label: 'Auto-Reservas', value: '8', color: 'text-gold' },
                                    { label: 'Latencia Promedio', value: '1.2s', color: 'text-cyan-400' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                        <span className="text-white/30 text-xs uppercase tracking-wider">{item.label}</span>
                                        <span className={`font-black text-lg ${item.color}`}>{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            <Button variant="outline" className="w-full border-white/10 uppercase tracking-widest font-bold text-[10px]">
                                <Eye className="w-3.5 h-3.5 mr-2" /> Ver Transcriptos
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Recent Appointments Table */}
            <motion.div variants={containerVariants} initial="hidden" animate="show">
                <motion.div variants={itemVariants}>
                    <Card className="bg-white/[0.02] border-white/5 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 to-violet-500" />
                        <CardHeader>
                            <CardTitle className="text-lg font-bold uppercase tracking-wider flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-rose-400" /> Citas Recientes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {appointments.length > 0 ? (
                                <div className="space-y-3">
                                    {appointments.map((apt, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/15 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-sm font-black text-white">
                                                    {(apt.client_name || '?')[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm uppercase tracking-wider">{apt.client_name}</p>
                                                    <p className="text-[10px] text-white/30 uppercase tracking-widest">{apt.service}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-gold">{apt.appointment_time}</p>
                                                <p className="text-[10px] text-white/30">{apt.appointment_date}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${apt.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    apt.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                        'bg-white/5 text-white/40 border border-white/10'
                                                }`}>
                                                {apt.status === 'pending' ? 'Pendiente' : apt.status === 'confirmed' ? 'Confirmada' : apt.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-white/20 uppercase tracking-widest text-xs py-12">No hay citas registradas aún</p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
