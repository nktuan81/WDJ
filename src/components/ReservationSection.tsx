import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, User, MessageSquare, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

const ReservationSection: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createReservation({
        name: formData.name,
        email: formData.email.trim() || undefined,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests),
        notes: formData.notes.trim() || undefined,
      });
      toast.success(
        t('reservation.submit') + ' ✓',
        {
          description: `${formData.name} - ${formData.date} ${formData.time}`,
        }
      );
      setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: '2', notes: '' });
    } catch (error) {
      toast.error(
        'Reservation failed',
        {
          description: error instanceof Error ? error.message : 'Please try again',
        }
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="reservation" className="section-imperial">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <h2 className="font-heading text-4xl md:text-5xl text-champagne-light mb-4">
                {t('reservation.title')}
              </h2>
              <p className="text-champagne/70 text-sm md:text-base mb-6 max-w-lg mx-auto lg:mx-0">
                {t('reservation.largePartyNote')}
              </p>
              <div className="divider-imperial lg:mx-0" />
              
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="w-12 h-12 rounded-full bg-burgundy/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-champagne" />
                  </div>
                  <div className="text-left">
                    <p className="text-champagne/60 text-sm">{t('contact.hours')}</p>
                    <p className="text-champagne-light">{t('contact.hours.value')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="w-12 h-12 rounded-full bg-burgundy/30 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-champagne" />
                  </div>
                  <div className="text-left">
                    <p className="text-champagne/60 text-sm">{t('contact.phone')}</p>
                    <p className="text-champagne-light">030 94042558</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="card-imperial space-y-5">
                {/* Name */}
                <div className="relative">
                  <label className="block text-champagne/70 text-sm mb-2">
                    {t('reservation.name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne/40" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-charcoal-dark border border-champagne/20 rounded-lg py-3 pl-11 pr-4 text-champagne-light placeholder:text-champagne/30 focus:outline-none focus:border-champagne/50 transition-colors"
                      placeholder="Max Mustermann"
                    />
                  </div>
                </div>

                {/* Email (optional - for confirmation) */}
                <div className="relative">
                  <label className="block text-champagne/70 text-sm mb-2">
                    {t('reservation.email')} <span className="text-champagne/40 text-xs">({t('reservation.optional')})</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne/40" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-charcoal-dark border border-champagne/20 rounded-lg py-3 pl-11 pr-4 text-champagne-light placeholder:text-champagne/30 focus:outline-none focus:border-champagne/50 transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="relative">
                  <label className="block text-champagne/70 text-sm mb-2">
                    {t('reservation.phone')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne/40" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-charcoal-dark border border-champagne/20 rounded-lg py-3 pl-11 pr-4 text-champagne-light placeholder:text-champagne/30 focus:outline-none focus:border-champagne/50 transition-colors"
                      placeholder="+49 123 456789"
                    />
                  </div>
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-champagne/70 text-sm mb-2">
                      {t('reservation.date')}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne/40" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full bg-charcoal-dark border border-champagne/20 rounded-lg py-3 pl-11 pr-4 text-champagne-light focus:outline-none focus:border-champagne/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-champagne/70 text-sm mb-2">
                      {t('reservation.time')}
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne/40" />
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full bg-charcoal-dark border border-champagne/20 rounded-lg py-3 pl-11 pr-4 text-champagne-light focus:outline-none focus:border-champagne/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-champagne/70 text-sm mb-2">
                    {t('reservation.guests')}
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-champagne/40" />
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full bg-charcoal-dark border border-champagne/20 rounded-lg py-3 pl-11 pr-4 text-champagne-light focus:outline-none focus:border-champagne/50 transition-colors appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Gast' : 'Gäste'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special Request (optional) */}
                <div>
                  <label className="block text-champagne/70 text-sm mb-2">
                    {t('reservation.specialRequest')} <span className="text-champagne/40 text-xs">({t('reservation.optional')})</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-champagne/40" />
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder={t('reservation.specialRequest.placeholder')}
                      className="w-full bg-charcoal-dark border border-champagne/20 rounded-lg py-3 pl-11 pr-4 text-champagne-light placeholder:text-champagne/30 focus:outline-none focus:border-champagne/50 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="btn-imperial w-full rounded-lg mt-6"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {t('reservation.submit')}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
