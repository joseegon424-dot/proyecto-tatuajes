'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Star, Clock, Shield, Zap, MapPin, Phone, Mail, Instagram, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/* ═══════════════════════════════════════════════════════════
   SECTION: HERO — Full-Screen Cinematic
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-end">
      {/* Parallax Background */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <Image src="/images/hero-bg.png" alt="InkMaster Studio" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </motion.div>

      {/* Noise overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }} />

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 pb-16 md:pb-24">
        <div className="flex flex-col gap-6">
          <motion.div initial={{ width: 0 }} animate={{ width: 120 }} transition={{ duration: 1.5, delay: 0.3 }} className="h-[2px] bg-gold" />

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="text-gold uppercase tracking-[0.4em] text-xs md:text-sm font-bold"
          >
            Estudio Premium de Tatuajes — CDMX
          </motion.p>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
              className="text-[14vw] md:text-[10vw] lg:text-[8vw] font-black leading-[0.85] tracking-[-0.04em] uppercase"
            >
              Arte Que<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold">Trasciende</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}
            className="text-white/60 max-w-lg text-base md:text-lg leading-relaxed font-light"
          >
            Cada pieza es una obra maestra irrepetible. Realismo, blackwork, minimalismo y neotradicional
            ejecutados con precisión quirúrgica en un espacio diseñado para la excelencia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Link href="/client/booking" className="group relative overflow-hidden">
              <div className="bg-gold text-black px-10 py-5 font-black uppercase tracking-[0.2em] text-sm flex items-center gap-4 relative z-10">
                Reservar Sesión
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
            </Link>
            <Link href="/client/gallery" className="group border border-white/20 hover:border-gold/50 transition-colors">
              <div className="px-10 py-5 font-bold uppercase tracking-[0.2em] text-sm text-white/80 hover:text-white transition-colors flex items-center gap-4">
                Explorar Portafolio
                <div className="w-2 h-2 rounded-full bg-gold group-hover:scale-150 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 right-12 hidden md:flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold [writing-mode:vertical-lr]">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="w-4 h-4 text-gold" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: MARQUEE — Infinite Scroll Text
   ═══════════════════════════════════════════════════════════ */
function MarqueeSection() {
  const items = ['REALISMO', 'BLACKWORK', 'NEOTRADICIONAL', 'MINIMALISTA', 'JAPONÉS', 'FINE LINE', 'ACUARELA', 'GEOMÉTRICO'];
  return (
    <section className="py-6 border-y border-white/5 overflow-hidden bg-black relative">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white/[0.03] mx-8 select-none">
            {item}
            <span className="inline-block mx-8 text-gold/20">✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: ABOUT — Split Layout
   ═══════════════════════════════════════════════════════════ */
function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 md:py-40 px-6 md:px-12 lg:px-24 max-w-[1800px] mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: -80 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          className="relative aspect-[3/4] overflow-hidden group"
        >
          <Image src="/images/artist.png" alt="Artista" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-2">Fundador & Artista Principal</p>
            <h3 className="text-3xl font-black uppercase tracking-tight">Santiago R.</h3>
          </div>
          {/* Corner accent */}
          <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-gold" />
          <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-gold" />
        </motion.div>

        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: 80 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
          className="space-y-8"
        >
          <div>
            <p className="text-gold uppercase tracking-[0.4em] text-xs font-bold mb-4">Sobre Nosotros</p>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
              No Hacemos<br />Tatuajes.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-white">Creamos Legado.</span>
            </h2>
          </div>

          <p className="text-white/50 text-lg leading-relaxed max-w-lg">
            Con más de 8 años de experiencia y cientos de piezas ejecutadas, InkMaster Studio se ha convertido
            en referente de la escena del tatuaje artístico. Cada sesión es una inmersión completa en tu visión,
            llevada a la piel con técnicas que desafían lo convencional.
          </p>

          <div className="grid grid-cols-3 gap-8 pt-4 border-t border-white/10">
            {[
              { number: '800+', label: 'Obras Completadas' },
              { number: '8', label: 'Años de Trayectoria' },
              { number: '99%', label: 'Satisfacción' }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-black text-gold">{stat.number}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1 font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: SERVICES — Horizontal Cards
   ═══════════════════════════════════════════════════════════ */
function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('services').select('*').order('base_price', { ascending: true }).then(({ data }: any) => {
      if (data) setServices(data);
    });
  }, []);

  const fallbackServices = [
    { name: 'Realismo', description: 'Réplica fotográfica sobre piel. Retratos, naturaleza y un nivel de detalle que desafía la percepción.', base_price: 350000, min_duration: 4, icon: '🎨' },
    { name: 'Blackwork', description: 'Negro absoluto. Geometría sagrada, tribal contemporáneo y coberturas de alto impacto visual.', base_price: 250000, min_duration: 3, icon: '⬛' },
    { name: 'Fine Line', description: 'Trazos microscópicos y elegancia silenciosa. Minimalismo que habla con sutileza.', base_price: 150000, min_duration: 2, icon: '✒️' },
    { name: 'Neotradicional', description: 'Color vibrante con líneas audaces. La evolución del tatuaje clásico americano con estética contemporánea.', base_price: 300000, min_duration: 3, icon: '🔥' },
  ];

  const displayServices = services.length > 0 ? services : fallbackServices;

  const formatPrice = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

  return (
    <section ref={ref} className="py-24 md:py-40 px-6 md:px-12 lg:px-24 max-w-[1800px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
      >
        <div>
          <p className="text-gold uppercase tracking-[0.4em] text-xs font-bold mb-4">Estilos & Especialidades</p>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
            Nuestro<br /><span className="text-outline">Arsenal</span>
          </h2>
        </div>
        <p className="text-white/40 max-w-md text-sm leading-relaxed">
          Cada estilo tiene su alma. Dominamos las técnicas que definen la vanguardia del tatuaje contemporáneo.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-[1px] bg-white/5">
        {displayServices.map((service, i) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            <Link href={`/client/booking?style=${service.name}`} className="group block bg-black p-8 md:p-12 hover:bg-white/[0.02] transition-colors duration-500 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="flex justify-between items-start mb-8 relative z-10">
                <span className="text-6xl">{service.icon || '◆'}</span>
                <span className="text-gold font-black text-2xl">{formatPrice(service.base_price)}</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3 relative z-10 group-hover:text-gold transition-colors duration-300">{service.name}</h3>

              <p className="text-white/40 text-sm leading-relaxed mb-6 relative z-10 max-w-sm">
                {service.description || `Sesión profesional de ${service.name.toLowerCase()} con técnicas de última generación.`}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/10 relative z-10">
                <div className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-widest font-bold">
                  <Clock className="w-3.5 h-3.5" /> Desde {service.min_duration}h
                </div>
                <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Reservar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: GALLERY — Featured Works
   ═══════════════════════════════════════════════════════════ */
function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const works = [
    { src: '/images/work-1.png', title: 'León Realista', category: 'Realismo', span: 'row-span-2' },
    { src: '/images/work-2.png', title: 'Geométrico Lunar', category: 'Fine Line', span: '' },
    { src: '/images/work-3.png', title: 'Dragón Japonés', category: 'Neotradicional', span: '' },
    { src: '/images/work-4.png', title: 'Mandala Sagrada', category: 'Blackwork', span: 'row-span-2' },
  ];

  return (
    <section ref={ref} className="py-24 md:py-40 bg-[#030303] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-[1] pointer-events-none" />

      <div className="px-6 md:px-12 lg:px-24 max-w-[1800px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-gold uppercase tracking-[0.4em] text-xs font-bold mb-4">Trabajos Seleccionados</p>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
              Galería<br /><span className="text-outline">Maestra</span>
            </h2>
          </div>
          <Link href="/client/gallery" className="group flex items-center gap-3 text-gold uppercase tracking-[0.2em] text-xs font-bold hover:text-white transition-colors">
            Ver Todas Las Obras
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[250px] md:auto-rows-[300px]">
          {works.map((work, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative overflow-hidden group cursor-pointer ${work.span}`}
            >
              <Image src={work.src} alt={work.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-500" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold mb-1">{work.category}</span>
                <h3 className="text-2xl font-black uppercase tracking-tight">{work.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: WHY US — Features
   ═══════════════════════════════════════════════════════════ */
function WhyUsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    { icon: Shield, title: 'Bioseguridad Nivel Hospital', desc: 'Autoclave clase B, agujas descartables certificadas y protocolos que superan los estándares sanitarios.' },
    { icon: Star, title: 'Consulta Personalizada', desc: 'Cada diseño nace de una conversación profunda. No tatuamos plantillas, tatuamos tu historia.' },
    { icon: Zap, title: 'Tecnología de Punta', desc: 'Máquinas de última generación, tintas veganas premium y técnicas que minimizan el dolor.' },
    { icon: Clock, title: 'Reserva Sin Fricción', desc: 'Agenda online 24/7, confirmación instantánea y un asistente IA que resuelve todas tus dudas.' },
  ];

  return (
    <section ref={ref} className="py-24 md:py-40 px-6 md:px-12 lg:px-24 max-w-[1800px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <p className="text-gold uppercase tracking-[0.4em] text-xs font-bold mb-4">La Diferencia InkMaster</p>
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
          Por Qué <span className="text-outline">Elegirnos</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group p-8 bg-white/[0.02] border border-white/5 hover:border-gold/20 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <f.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight mb-3">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: TESTIMONIALS
   ═══════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const reviews = [
    { name: 'María C.', text: 'La experiencia fue increíble. Desde la consulta hasta el resultado final, todo fue impecable. Mi retrato realista quedó perfecto.', rating: 5, style: 'Realismo' },
    { name: 'Andrés F.', text: 'Nunca había sentido que mi idea se entendiera tan bien. El artista mejoró mi boceto y el resultado superó mis expectativas.', rating: 5, style: 'Neotradicional' },
    { name: 'Valentina R.', text: 'El estudio es otro nivel. Limpio, premium y la atención es personalizada de verdad. Volvería mil veces.', rating: 5, style: 'Fine Line' },
  ];

  return (
    <section ref={ref} className="py-24 md:py-40 bg-[#030303] relative overflow-hidden">
      <div className="px-6 md:px-12 lg:px-24 max-w-[1800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-gold uppercase tracking-[0.4em] text-xs font-bold mb-4">Testimonios</p>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
            Voces <span className="text-outline">Reales</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-8 md:p-10 relative overflow-hidden group hover:border-gold/20 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-all" />
              <div className="flex gap-1 mb-6">
                {Array.from({ length: review.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-8 italic">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div>
                  <p className="font-bold text-sm uppercase tracking-wider">{review.name}</p>
                  <p className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold mt-1">{review.style}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: CTA — Full Width Call to Action
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 md:py-48 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[200px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
          Tu Próxima<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-white">Pieza Maestra</span><br />
          Te Espera
        </h2>

        <p className="text-white/40 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          No importa si es tu primer tatuaje o el número cien. Cada pieza merece un artista que entienda tu visión
          y la eleve más allá de lo que imaginaste.
        </p>

        <Link href="/client/booking" className="group inline-flex items-center gap-4 relative overflow-hidden">
          <div className="bg-gold text-black px-14 py-6 font-black uppercase tracking-[0.2em] text-lg relative z-10 flex items-center gap-4">
            Agendar Ahora
            <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-300" />
          </div>
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
        </Link>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION: FOOTER
   ═══════════════════════════════════════════════════════════ */
function FooterSection() {
  return (
    <footer className="border-t border-white/5 bg-black">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Top */}
        <div className="py-16 md:py-24 grid md:grid-cols-3 gap-12 md:gap-24">
          <div className="space-y-6">
            <h3 className="text-3xl font-black uppercase tracking-tight text-gold">InkMaster</h3>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              Estudio premium de tatuajes artísticos. Donde la piel se convierte en lienzo y cada trazo cuenta una historia.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-white/10 hover:border-gold/50 flex items-center justify-center text-white/40 hover:text-gold transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-gold">Navegación</h4>
            <div className="flex flex-col gap-3">
              {[
                { href: '/client/gallery', label: 'Galería' },
                { href: '/client/booking', label: 'Reservar Cita' },
                { href: '/owner/login', label: 'Panel Artista' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-white/30 hover:text-white text-sm uppercase tracking-wider transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-gold">Contacto</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-white/30 text-sm">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" /> Centro de la Ciudad, Local 42
              </div>
              <div className="flex items-center gap-3 text-white/30 text-sm">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" /> +57 320 000 0000
              </div>
              <div className="flex items-center gap-3 text-white/30 text-sm">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" /> hello@inkmaster.studio
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.2em]">© 2026 InkMaster Studio. Todos los derechos reservados.</p>
          <p className="text-white/10 text-[10px] uppercase tracking-[0.2em]">Diseñado con ◆ y precisión</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE — Composition
   ═══════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <GallerySection />
      <WhyUsSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </>
  );
}
