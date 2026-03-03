'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Clock, ArrowRight, Filter, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

interface TattooWork {
  id: string;
  title: string;
  category: string;
  image_url: string;
  price: number;
  duration: string;
  description: string;
  color: string;
}

const categories = [
  { id: 'all', name: 'TODOS', color: 'from-white/20 to-white/5' },
  { id: 'realismo', name: 'REALISMO', color: 'from-violet-500/20 to-violet-500/5' },
  { id: 'blackwork', name: 'BLACKWORK', color: 'from-white/20 to-white/5' },
  { id: 'neotradicional', name: 'NEOTRADICIONAL', color: 'from-rose-500/20 to-rose-500/5' },
  { id: 'minimalista', name: 'MINIMALISTA', color: 'from-cyan-400/20 to-cyan-400/5' },
  { id: 'japonés', name: 'JAPONÉS', color: 'from-red-500/20 to-red-500/5' },
  { id: 'acuarela', name: 'ACUARELA', color: 'from-pink-400/20 to-pink-400/5' },
];

// Fallback local gallery data with generated images
const localWorks: TattooWork[] = [
  { id: '1', title: 'León Majestuoso', category: 'Realismo', image_url: '/images/work-1.png', price: 450000, duration: '5h', description: 'Retrato hiperrealista en escala de grises con sombreado cinematográfico.', color: 'violet' },
  { id: '2', title: 'Constelación Lunar', category: 'Minimalista', image_url: '/images/work-2.png', price: 180000, duration: '2h', description: 'Fine line delicado con geometría sagrada y elementos celestiales.', color: 'cyan' },
  { id: '3', title: 'Dragón Imperial', category: 'Japonés', image_url: '/images/work-3.png', price: 650000, duration: '8h', description: 'Manga completa estilo Irezumi con koi, olas y flores de cerezo.', color: 'red' },
  { id: '4', title: 'Mandala Cósmica', category: 'Blackwork', image_url: '/images/work-4.png', price: 350000, duration: '4h', description: 'Geometría sagrada con dotwork de alta densidad y simetría perfecta.', color: 'white' },
  { id: '5', title: 'Mirada Eterna', category: 'Realismo', image_url: '/images/work-5.png', price: 380000, duration: '4h', description: 'Ojo hiperrealista con reflejos y lágrimas en blanco y negro.', color: 'violet' },
  { id: '6', title: 'Koi Legendario', category: 'Japonés', image_url: '/images/work-6.png', price: 550000, duration: '6h', description: 'Pez koi tradicional con olas kanagawa y detalles dorados.', color: 'red' },
  { id: '7', title: 'Lobo Geométrico', category: 'Blackwork', image_url: '/images/work-7.png', price: 320000, duration: '3h', description: 'Fusión de realismo orgánico con geometría precisa y dotwork.', color: 'white' },
  { id: '8', title: 'Jardín Etéreo', category: 'Acuarela', image_url: '/images/work-8.png', price: 420000, duration: '5h', description: 'Explosión de color tipo acuarela con rosas y peonías vibrantes.', color: 'pink' },
  { id: '9', title: 'Cráneo Renacido', category: 'Neotradicional', image_url: '/images/work-9.png', price: 380000, duration: '4h', description: 'Neo-trad americano con rosas, polillas y paleta rica en color.', color: 'rose' },
  { id: '10', title: 'Cosmonauta', category: 'Minimalista', image_url: '/images/work-10.png', price: 200000, duration: '2h', description: 'Micro-tatuaje de astronauta flotando entre estrellas en fine line.', color: 'cyan' },
  { id: '11', title: 'Serpiente Botánica', category: 'Blackwork', image_url: '/images/work-11.png', price: 400000, duration: '5h', description: 'Serpiente entrelazada con flora botánica en negro puro.', color: 'white' },
];

const colorMap: Record<string, string> = {
  violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  red: 'text-red-400 bg-red-500/10 border-red-500/20',
  white: 'text-white bg-white/10 border-white/20',
  pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  gold: 'text-gold bg-gold/10 border-gold/20',
};

export default function ClientGalleryPage() {
  const [works, setWorks] = useState<TattooWork[]>(localWorks);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedWorks, setLikedWorks] = useState<Set<string>>(new Set());
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load likes from local storage
    const savedLikes = localStorage.getItem('likedTattoos');
    if (savedLikes) {
      setLikedWorks(new Set(JSON.parse(savedLikes)));
    }

    // GSAP staggered reveal for header
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.querySelectorAll('.gsap-reveal'),
        { y: 60, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.15, ease: 'power3.out' }
      );
    }
  }, []);

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    const newLikes = new Set(likedWorks);
    if (newLikes.has(id)) {
      newLikes.delete(id);
    } else {
      newLikes.add(id);
    }
    setLikedWorks(newLikes);
    localStorage.setItem('likedTattoos', JSON.stringify(Array.from(newLikes)));
  };

  const filteredWorks = works.filter(work => {
    const matchesCategory = activeCategory === 'all' || work.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (work.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="w-full min-h-screen pt-24 pb-24">
      {/* Hero Header */}
      <div ref={headerRef} className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 mb-12">
        <div className="gsap-reveal">
          <p className="text-violet-400 uppercase tracking-[0.4em] text-xs font-bold mb-4">Colección Completa</p>
        </div>
        <h1 className="gsap-reveal text-[10vw] md:text-[7vw] font-black leading-[0.85] tracking-[-0.04em] uppercase mb-6">
          Galería <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-rose-400 to-gold">Maestra</span>
        </h1>
        <p className="gsap-reveal text-white/40 max-w-lg text-base leading-relaxed">
          Cada pieza cuenta una historia. Explora nuestra colección curada de obras maestras en piel.
        </p>
      </div>

      {/* Filters — Sticky with glassmorphism */}
      <div className="sticky top-[72px] z-40 bg-black/70 backdrop-blur-2xl border-y border-white/5 mb-12">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 border ${activeCategory === cat.id
                  ? 'bg-gradient-to-r ' + cat.color + ' text-white border-white/20 shadow-lg'
                  : 'bg-transparent text-white/30 border-white/5 hover:border-white/20 hover:text-white/60'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-auto min-w-[280px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-violet-400 transition-colors" />
            <input
              type="text"
              placeholder="BUSCAR OBRAS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-11 pr-4 text-xs font-bold uppercase tracking-wider placeholder:text-white/15 focus:outline-none focus:border-violet-500/50 transition-all text-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-white/30 hover:text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
          <AnimatePresence>
            {filteredWorks.map((work) => {
              const colors = colorMap[work.color] || colorMap.gold;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={work.id}
                  className="relative break-inside-avoid overflow-hidden group cursor-pointer border border-white/5 bg-white/[0.02] hover:border-white/15 transition-all duration-500"
                  onMouseEnter={() => setHoveredId(work.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Image */}
                  <div className="relative w-full overflow-hidden aspect-[4/5]">
                    <Image
                      src={work.image_url}
                      alt={work.title}
                      fill
                      className="object-cover transform-gpu transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLike(e, work.id)}
                    className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/80 hover:border-white/30 transition-all"
                  >
                    <Heart className={`w-4 h-4 transition-all duration-300 ${likedWorks.has(work.id) ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white/60 hover:scale-110'}`} />
                  </button>

                  {/* Category Badge (hover) */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: hoveredId === work.id ? 1 : 0, y: hoveredId === work.id ? 0 : -10 }}
                    className="absolute top-4 left-4 z-20"
                  >
                    <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border ${colors}`}>
                      {work.category}
                    </span>
                  </motion.div>

                  {/* Info Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                    <motion.div
                      animate={{ y: hoveredId === work.id ? 0 : 8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1 leading-tight">{work.title}</h3>

                      <motion.div
                        initial={false}
                        animate={{ opacity: hoveredId === work.id ? 1 : 0, height: hoveredId === work.id ? 'auto' : 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-white/50 mb-4 leading-relaxed line-clamp-2">{work.description}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div>
                            <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">Desde</p>
                            <p className="font-black text-gold text-base leading-none">{formatCurrency(work.price)}</p>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/40">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-bold text-xs tracking-wider">{work.duration}</span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Click Link */}
                  <Link
                    href={`/client/booking?style=${work.category}`}
                    className="absolute inset-0 z-0"
                    title={`Reservar estilo ${work.category}`}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredWorks.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <h2 className="text-6xl font-black text-white/5 uppercase tracking-tighter mb-4">SIN RESULTADOS</h2>
            <p className="text-white/30 uppercase tracking-widest text-xs font-bold">Intenta con otra categoría o término de búsqueda.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
