'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, User, Phone, Mail, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import gsap from 'gsap';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay,
  addMonths, subMonths, startOfWeek, endOfWeek, isToday, parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
  status: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: AlertCircle },
  confirmed: { label: 'Confirmada', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
  completed: { label: 'Completada', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20', icon: CheckCircle2 },
  cancelled: { label: 'Cancelada', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: XCircle },
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_date', start)
        .lte('appointment_date', end)
        .order('appointment_time', { ascending: true });
      if (data) setAppointments(data);
      setLoading(false);
    };
    fetchAppointments();
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(a => a.appointment_date === dateStr);
  };

  const selectedAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('appointments').update({ status: newStatus }).eq('id', id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-6 border-b border-white/5">
        <h1 ref={titleRef} className="text-[3rem] md:text-[4rem] font-black leading-none tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-rose-400">Calendario</span>
        </h1>
        <p className="text-white/30 uppercase tracking-[0.2em] text-xs mt-2 font-bold">
          {appointments.length} citas este mes
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card className="bg-white/[0.02] border-white/5 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-violet-500 to-rose-500" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5 text-white/50" />
                </button>
                <CardTitle className="text-xl font-black uppercase tracking-wider">
                  {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </CardTitle>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-white/50" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                  <div key={d} className="text-center text-[10px] uppercase tracking-widest text-white/20 font-bold py-2">{d}</div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day: any, i: number) => {
                  const dayAppointments = getAppointmentsForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentDay = isToday(day);
                  const hasAppointments = dayAppointments.length > 0;

                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(day)}
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-lg transition-all text-sm font-bold
                        ${!isCurrentMonth ? 'text-white/10' : 'text-white/60'}
                        ${isSelected ? 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 text-white' : 'hover:bg-white/5'}
                        ${isCurrentDay && !isSelected ? 'border border-gold/30 text-gold' : ''}
                      `}
                    >
                      <span className="text-base">{format(day, 'd')}</span>
                      {hasAppointments && (
                        <div className="flex gap-0.5 mt-1">
                          {dayAppointments.slice(0, 3).map((_, j) => (
                            <div key={j} className={`w-1.5 h-1.5 rounded-full ${j === 0 ? 'bg-violet-400' : j === 1 ? 'bg-gold' : 'bg-rose-400'
                              }`} />
                          ))}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar — Selected Day Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/[0.02] border-white/5 overflow-hidden sticky top-28">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold to-rose-500" />
            <CardHeader>
              <CardTitle className="text-base font-bold uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                {selectedDate ? format(selectedDate, "d 'de' MMMM", { locale: es }) : 'Selecciona un día'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {selectedAppointments.length > 0 ? (
                  selectedAppointments.map((apt: any, i: number) => {
                    const status = statusConfig[apt.status] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    return (
                      <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 bg-white/[0.03] border border-white/5 rounded-xl space-y-3 hover:border-white/15 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-sm uppercase tracking-wider">{apt.client_name}</p>
                            <p className="text-violet-300 text-xs font-bold mt-0.5">{apt.service}</p>
                          </div>
                          <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-full flex items-center gap-1 ${status.color}`}>
                            <StatusIcon className="w-3 h-3" /> {status.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.appointment_time}</div>
                          {apt.client_phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {apt.client_phone}</div>}
                        </div>

                        {apt.notes && (
                          <p className="text-[11px] text-white/25 leading-relaxed border-t border-white/5 pt-2">{apt.notes}</p>
                        )}

                        {/* Quick Actions */}
                        {apt.status === 'pending' && (
                          <div className="flex gap-2 pt-1">
                            <button onClick={() => updateStatus(apt.id, 'confirmed')} className="flex-1 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-colors">
                              Confirmar
                            </button>
                            <button onClick={() => updateStatus(apt.id, 'cancelled')} className="flex-1 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-rose-500/20 transition-colors">
                              Cancelar
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center">
                      <Clock className="w-7 h-7 text-white/10" />
                    </div>
                    <p className="text-white/15 text-xs uppercase tracking-widest font-bold">Sin citas este día</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
