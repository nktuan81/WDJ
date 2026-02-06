import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-dark/70 via-charcoal-dark/50 to-charcoal-dark" />
        <div className="absolute inset-0 bg-burgundy/20 mix-blend-overlay" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="text-champagne fill-current">
          <path d="M50 0C50 27.6 27.6 50 0 50C27.6 50 50 72.4 50 100C50 72.4 72.4 50 100 50C72.4 50 50 27.6 50 0Z" />
        </svg>
      </div>
      <div className="absolute bottom-1/4 right-10 w-48 h-48 opacity-10">
        <svg viewBox="0 0 100 100" className="text-champagne fill-current">
          <path d="M50 0C50 27.6 27.6 50 0 50C27.6 50 50 72.4 50 100C50 72.4 72.4 50 100 50C72.4 50 50 27.6 50 0Z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-3xl md:text-5xl lg:text-6xl text-champagne-light mb-4 leading-tight"
        >
          {t('hero.title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-heading text-xl md:text-2xl text-champagne italic mb-8"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="w-32 h-px bg-gradient-to-r from-transparent via-champagne to-transparent mx-auto mb-8"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-body text-lg md:text-xl text-champagne-light/80 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {t('hero.description')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#menu"
            className="btn-imperial rounded-sm min-w-[200px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('hero.cta.menu')}
          </motion.a>
          <motion.a
            href="#reservation"
            className="btn-gold rounded-sm min-w-[200px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('hero.cta.reservation')}
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-champagne/50 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1 h-2 bg-champagne rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
