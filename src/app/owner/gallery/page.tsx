'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import gsap from 'gsap';

interface TattooWork {
    id: string;
    title: string;
    category: string;
    image_url: string;
    price: number;
    duration: string;
}

// Use local images as fallback
const localWorks: TattooWork[] = [
    { id: '1', title: 'León Majestuoso', category: 'Realismo', image_url: '/images/work-1.png', price: 450000, duration: '5h' },
    { id: '2', title: 'Constelación Lunar', category: 'Minimalista', image_url: '/images/work-2.png', price: 180000, duration: '2h' },
    { id: '3', title: 'Dragón Imperial', category: 'Japonés', image_url: '/images/work-3.png', price: 650000, duration: '8h' },
    { id: '4', title: 'Mandala Cósmica', category: 'Blackwork', image_url: '/images/work-4.png', price: 350000, duration: '4h' },
    { id: '5', title: 'Mirada Eterna', category: 'Realismo', image_url: '/images/work-5.png', price: 380000, duration: '4h' },
    { id: '6', title: 'Koi Legendario', category: 'Japonés', image_url: '/images/work-6.png', price: 550000, duration: '6h' },
    { id: '7', title: 'Lobo Geométrico', category: 'Blackwork', image_url: '/images/work-7.png', price: 320000, duration: '3h' },
    { id: '8', title: 'Jardín Etéreo', category: 'Acuarela', image_url: '/images/work-8.png', price: 420000, duration: '5h' },
];

const categoryColors: Record<string, string> = {
    'Realismo': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    'Minimalista': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'Japonés': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Blackwork': 'bg-white/10 text-white/70 border-white/20',
    'Neotradicional': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'Acuarela': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
};

export default function GalleryPage() {
    const [works, setWorks] = useState<TattooWork[]>(localWorks);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (titleRef.current) {
            gsap.fromTo(titleRef.current,
                { y: 80, opacity: 0, skewY: 5 },
                { y: 0, opacity: 1, skewY: 0, duration: 1.2, ease: 'power3.out' }
            );
        }
    }, []);

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 ref={titleRef} className="text-[3rem] md:text-[4rem] font-black leading-none tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-violet-400 to-cyan-400">Portafolio</span>
                    </h1>
                    <p className="text-white/30 uppercase tracking-[0.2em] text-xs mt-2 font-bold">{works.length} obras registradas</p>
                </div>
                <Button className="bg-gradient-to-r from-violet-600 to-rose-500 text-white border-0 font-bold tracking-wider uppercase text-xs px-8 py-5 hover:opacity-90 group">
                    <Upload className="w-4 h-4 mr-2 group-hover:translate-y-[-2px] transition-transform" /> Subir Obra
                </Button>
            </motion.div>

            {/* Grid */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {works.map((work, i) => (
                        <motion.div
                            key={work.id}
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                            onMouseEnter={() => setHoveredId(work.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className="relative aspect-[4/5] overflow-hidden bg-white/[0.02] border border-white/5 group hover:border-white/15 transition-all"
                        >
                            <Image
                                src={work.image_url}
                                alt={work.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />

                            {/* Hover Overlay */}
                            <motion.div
                                className="absolute inset-0 bg-black/70 backdrop-blur-sm p-6 flex flex-col justify-between"
                                initial={{ opacity: 0 }} animate={{ opacity: hoveredId === work.id ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border ${categoryColors[work.category] || 'bg-gold/10 text-gold border-gold/20'}`}>
                                        {work.category}
                                    </span>
                                    <div className="flex gap-2">
                                        <button className="p-2.5 bg-white/10 hover:bg-violet-500/30 text-white rounded-lg transition-colors backdrop-blur-md border border-white/10">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2.5 bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 rounded-lg transition-colors backdrop-blur-md border border-rose-500/20">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">{work.title}</h3>
                                    <div className="flex justify-between items-end pt-3 border-t border-white/10">
                                        <div>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">Inversión</p>
                                            <p className="font-black text-gold text-lg">{formatCurrency(work.price)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">Duración</p>
                                            <p className="font-bold text-white">{work.duration}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add New Card */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="aspect-[4/5] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-violet-500/30 transition-colors cursor-pointer group"
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/10 to-rose-500/10 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8 text-white/30 group-hover:text-violet-400 transition-colors" />
                    </div>
                    <p className="text-white/20 text-xs uppercase tracking-[0.2em] font-bold">Agregar Obra</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
