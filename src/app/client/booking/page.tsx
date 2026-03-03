'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, Phone, FileText, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Calendar as CalendarIcon, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format, addDays, isSameDay, startOfToday, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSearchParams } from 'next/navigation';

type BookingStep = 'service' | 'date' | 'details' | 'confirm';

const timeSlots = ["10:00 AM", "11:30 AM", "01:00 PM", "03:00 PM", "04:30 PM", "06:00 PM"];

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground uppercase tracking-widest text-sm">Cargando reservas...</div>}>
            <BookingContent />
        </Suspense>
    );
}

function BookingContent() {
    const [isMounted, setIsMounted] = useState(false);
    const searchParams = useSearchParams();
    const preSelectedStyle = searchParams ? searchParams.get('style') : null;

    const [currentStep, setCurrentStep] = useState<BookingStep>('service');
    const [servicesList, setServicesList] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState(preSelectedStyle || '');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [clientInfo, setClientInfo] = useState({ name: '', phone: '', email: '', notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const availableDates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

    useEffect(() => {
        setIsMounted(true);
        const fetchServices = async () => {
            const { data } = await supabase.from('services').select('*').order('base_price', { ascending: true });
            if (data) setServicesList(data.map(s => ({ name: s.name, basePrice: s.base_price, minDuration: s.min_duration })));
        };
        fetchServices();
    }, []);

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

    const getSelectedService = () => servicesList.find(s => s.name === selectedService);

    const canProceed = () => {
        switch (currentStep) {
            case 'service': return !!selectedService;
            case 'date': return !!selectedDate && !!selectedTime;
            case 'details': return clientInfo.name && clientInfo.phone && clientInfo.email;
            default: return true;
        }
    };

    const nextStep = () => {
        const steps: BookingStep[] = ['service', 'date', 'details', 'confirm'];
        const currentIndex = steps.indexOf(currentStep);
        if (canProceed() && currentIndex < steps.length - 1) setCurrentStep(steps[currentIndex + 1]);
    };

    const prevStep = () => {
        const steps: BookingStep[] = ['service', 'date', 'details', 'confirm'];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) setCurrentStep(steps[currentIndex - 1]);
    };

    const generateGoogleCalendarLink = () => {
        if (!selectedDate || !selectedTime) return '#';
        try {
            const timeDate = parse(selectedTime, 'h:mm a', new Date());
            const hours = timeDate.getHours();
            const minutes = timeDate.getMinutes();

            const startDateTime = new Date(selectedDate);
            startDateTime.setHours(hours, minutes, 0);

            const serviceDuration = getSelectedService()?.minDuration || 2;
            const endDateTime = new Date(startDateTime);
            endDateTime.setHours(startDateTime.getHours() + serviceDuration);

            const formatTz = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');

            const title = encodeURIComponent(`Cita de Tatuaje - ${selectedService}`);
            const details = encodeURIComponent(`Cita confirmada en InkMaster Studio.\n\nServicio: ${selectedService}\nCliente: ${clientInfo.name}\nTeléfono: ${clientInfo.phone}`);
            const location = encodeURIComponent('InkMaster Studio, Centro de la Ciudad');
            const dates = `${formatTz(startDateTime)}/${formatTz(endDateTime)}`;

            return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
        } catch {
            return '#';
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await supabase.from('appointments').insert([{
                client_name: clientInfo.name,
                client_phone: clientInfo.phone,
                client_email: clientInfo.email,
                service: selectedService,
                appointment_date: selectedDate?.toISOString().split('T')[0],
                appointment_time: selectedTime,
                notes: clientInfo.notes,
                status: 'pending'
            }]);
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            alert('Error al reservar.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { id: 'service', label: '1. SERVICIO' },
        { id: 'date', label: '2. HORARIO' },
        { id: 'details', label: '3. CONTACTO' },
        { id: 'confirm', label: '4. VALIDAR' }
    ];

    /* ---------------- SUCCESS STATE ---------------- */
    if (isSuccess) {
        return (
            <div className="min-h-screen py-32 px-4 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gold/5 blur-[100px] pointer-events-none" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full">
                    <div className="bg-black/60 backdrop-blur-xl border border-gold/30 p-8 md:p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] transition-opacity opacity-50 group-hover:opacity-100" />

                        <div className="w-24 h-24 mx-auto rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-8">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-center uppercase tracking-tighter mb-4 text-glow">
                            SESIÓN <span className="text-gold">CONFIRMADA</span>
                        </h2>

                        <p className="text-center text-muted-foreground uppercase tracking-widest text-sm mb-10">
                            La solicitud ha sido registrada en nuestro panel principal.
                        </p>

                        <div className="bg-white/5 border border-white/10 p-6 space-y-4 mb-8">
                            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Tatuaje</span>
                                <span className="font-bold text-white uppercase">{selectedService}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Fecha / Hora</span>
                                <span className="font-bold text-white uppercase">{selectedDate && format(selectedDate, "d MMM", { locale: es })} — {selectedTime}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Inversión (Base)</span>
                                <span className="font-black text-gold text-lg">{formatCurrency(getSelectedService()?.basePrice || 0)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-500/10 border border-blue-500/30 p-4 relative overflow-hidden">
                                <div className="flex gap-2 font-bold mb-2 text-blue-400 uppercase tracking-widest text-xs items-center">
                                    <Mail className="w-4 h-4" /> ALERTA DE CORREO
                                </div>
                                <p className="text-sm text-blue-100/70">
                                    Integra React Email o Email.js para disparar confirmaciones reales a <b className="text-white">{clientInfo.email}</b> sin incurrir en costos de Backend (200 gratis/mes).
                                </p>
                            </div>

                            <motion.a
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                href={generateGoogleCalendarLink()} target="_blank" rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-3 bg-gold text-black py-5 font-black uppercase tracking-widest transition-colors hover:bg-white"
                            >
                                <CalendarIcon className="w-5 h-5" /> Importar al Calendario Oficial
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!isMounted) return null;

    /* ---------------- BOOKING WIZARD ---------------- */
    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 max-w-5xl mx-auto flex flex-col">

            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-kinetic leading-none text-glow">
                    INICIA TU <br /> <span className="text-gold">PROYECTO</span>
                </h1>
                <p className="text-muted-foreground uppercase tracking-widest text-xs md:text-sm max-w-2xl mx-auto font-bold">
                    Reserva una cita con nuestros artistas bajo tus términos.
                </p>
            </div>

            {/* Progress Bar Extreme */}
            <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-4 relative">
                <div className="absolute bottom-0 left-0 h-[1px] bg-gold transition-all duration-500"
                    style={{ width: `${((steps.findIndex(s => s.id === currentStep) + 1) / steps.length) * 100}%` }}
                />
                {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isPast = steps.findIndex(s => s.id === currentStep) > index;
                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 px-2 relative z-10">
                            <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-gold' : isPast ? 'text-white' : 'text-white/30'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Form Area */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-12 relative overflow-hidden min-h-[400px]"
                    >
                        {/* 1. SERVICE */}
                        {currentStep === 'service' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-black uppercase tracking-widest mb-6">Elige el Estilo</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {servicesList.map(s => (
                                        <div
                                            key={s.name} onClick={() => setSelectedService(s.name)}
                                            className={`p-6 border-2 transition-all cursor-pointer group ${selectedService === s.name ? 'border-gold bg-gold/5' : 'border-white/5 hover:border-gold/30 bg-white/5'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold uppercase tracking-wider text-lg">{s.name}</h3>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">SESIÓN: ~{s.minDuration}H</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-black text-xl ${selectedService === s.name ? 'text-gold' : 'text-white group-hover:text-gold transition-colors'}`}>
                                                        {formatCurrency(s.basePrice)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. DATE */}
                        {currentStep === 'date' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-widest mb-1">Día y Hora</h2>
                                    <p className="text-muted-foreground uppercase text-xs tracking-widest">{selectedService} — Bloque de aprox {getSelectedService()?.minDuration} horas</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gold">Fechas Libres</label>
                                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                                        {availableDates.map(date => {
                                            const isSelected = selectedDate && isSameDay(date, selectedDate);
                                            return (
                                                <button key={date.toISOString()} onClick={() => setSelectedDate(date)}
                                                    className={`py-4 flex flex-col items-center justify-center border transition-all ${isSelected ? 'bg-gold text-black border-gold' : 'border-white/10 bg-white/5 hover:border-gold/50 text-white'}`}
                                                >
                                                    <span className="text-[10px] uppercase font-bold tracking-widest">{format(date, 'EEE', { locale: es })}</span>
                                                    <span className="text-2xl font-black mt-1 leading-none">{format(date, 'd')}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {selectedDate && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gold">Slots de Tiempo</label>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                            {timeSlots.map(time => (
                                                <button key={time} onClick={() => setSelectedTime(time)}
                                                    className={`py-3 flex items-center justify-center gap-2 border transition-all text-sm font-bold tracking-widest ${selectedTime === time ? 'bg-gold text-black border-gold' : 'border-white/10 bg-white/5 hover:border-gold/50 text-white'}`}
                                                >
                                                    <Clock className="w-3 h-3" /> {time}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* 3. DETAILS */}
                        {currentStep === 'details' && (
                            <div className="space-y-6 max-w-2xl">
                                <h2 className="text-2xl font-black uppercase tracking-widest mb-6">Identidad</h2>

                                <div className="space-y-5">
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                        <input type="text" placeholder="TU NOMBRE (CÓMO DEBEMOS LLAMARTE)" value={clientInfo.name} onChange={e => setClientInfo({ ...clientInfo, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-sm font-bold uppercase tracking-wider placeholder:text-white/20 focus:outline-none focus:border-gold text-white transition-colors" />
                                    </div>

                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                        <input type="tel" placeholder="NÚMERO MÓVIL (WHATSAPP)" value={clientInfo.phone} onChange={e => setClientInfo({ ...clientInfo, phone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-sm font-bold uppercase tracking-wider placeholder:text-white/20 focus:outline-none focus:border-gold text-white transition-colors" />
                                    </div>

                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                        <input type="email" placeholder="CORREO ELECTRÓNICO OFICIAL" value={clientInfo.email} onChange={e => setClientInfo({ ...clientInfo, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-sm font-bold uppercase tracking-wider placeholder:text-white/20 focus:outline-none focus:border-gold text-white transition-colors" />
                                    </div>

                                    <div className="relative group">
                                        <FileText className="absolute left-4 top-5 w-4 h-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                                        <textarea placeholder="DESARROLLA TU IDEA (TAMAÑO, REFERENCIAS, ZONA DEL CUERPO...)" value={clientInfo.notes} onChange={e => setClientInfo({ ...clientInfo, notes: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 pl-12 min-h-[120px] text-sm font-bold uppercase tracking-wider placeholder:text-white/20 focus:outline-none focus:border-gold text-white transition-colors block" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. CONFIRM */}
                        {currentStep === 'confirm' && (
                            <div className="space-y-8">
                                <h2 className="text-2xl font-black uppercase tracking-widest mb-6"><Sparkles className="inline w-6 h-6 text-gold mb-1 mr-2" /> Resumen de Sesión</h2>

                                <div className="bg-white/5 border border-white/10 p-6 md:p-8 space-y-6">
                                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                        <span className="text-xs uppercase tracking-widest text-muted-foreground">Servicio Seleccionado</span>
                                        <span className="font-black text-xl uppercase text-gold">{selectedService}</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                        <span className="text-xs uppercase tracking-widest text-muted-foreground">Fecha Coordinada</span>
                                        <span className="font-bold text-lg uppercase text-white text-right">
                                            {selectedDate && format(selectedDate, "d MMMM yyyy", { locale: es })} <br />
                                            <span className="text-gold whitespace-nowrap">{selectedTime}</span>
                                        </span>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6 pt-2">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">Nombre Completo</span>
                                            <span className="font-bold text-sm uppercase">{clientInfo.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">Vía de Contacto</span>
                                            <span className="font-bold text-sm uppercase">{clientInfo.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-gold/10 border border-gold/30">
                                    <span className="font-black uppercase tracking-widest text-gold text-sm md:text-base">Inversión Aproximada (Se ajustará)</span>
                                    <span className="font-black text-3xl md:text-4xl text-white">{formatCurrency(getSelectedService()?.basePrice || 0)}</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Floating Navigation Brutalist Buttons */}
            <div className="flex justify-between mt-8 gap-4">
                <button
                    onClick={prevStep}
                    className={`px-6 md:px-10 py-4 border border-white/20 font-black uppercase tracking-widest transition-all hover:bg-white/5 ${currentStep === 'service' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <ChevronLeft className="inline w-5 h-5 mr-2 -translate-y-[1px]" /> Atrás
                </button>

                {currentStep !== 'confirm' ? (
                    <button
                        onClick={nextStep} disabled={!canProceed()}
                        className={`px-8 md:px-12 py-4 bg-gold text-black font-black uppercase tracking-widest transition-all ${!canProceed() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'}`}
                    >
                        Continuar <ChevronRight className="inline w-5 h-5 ml-2 -translate-y-[1px]" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit} disabled={isSubmitting}
                        className="px-8 md:px-16 py-4 bg-white text-black font-black uppercase tracking-widest transition-all hover:bg-gold relative overflow-hidden group"
                    >
                        {isSubmitting ? 'Cifrando Datos...' : 'Bloquear Agenda Y Confirmar'}
                        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                )}
            </div>
        </div>
    );
}
