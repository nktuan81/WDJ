import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languageLabels: Record<Language, string> = {
    de: 'DE',
    en: 'EN',
    cn: '中文',
  };

  const navItems = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.menu', href: '/#menu' },
    { key: 'nav.blog', href: '/blog' },
    { key: 'nav.reservation', href: '/#reservation' },
    { key: 'nav.contact', href: '/#contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'blur-imperial py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl md:text-3xl font-heading text-gradient-gold font-bold tracking-widest">
              味道佳
            </span>
            <span className="text-xs md:text-sm text-champagne/70 tracking-[0.3em] uppercase">
              Weidaojia
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.key}
                href={item.href}
                className="relative text-champagne-light hover:text-champagne transition-colors font-medium tracking-wide group"
                whileHover={{ y: -2 }}
              >
                {t(item.key)}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-champagne group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* Language Switcher */}
          <div className="hidden lg:flex items-center space-x-2">
            {(Object.keys(languageLabels) as Language[]).map((lang) => (
              <motion.button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 text-sm font-medium rounded transition-all ${
                  language === lang
                    ? 'bg-burgundy text-champagne-light'
                    : 'text-champagne/60 hover:text-champagne'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {languageLabels[lang]}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden text-champagne p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 overflow-hidden"
            >
              <nav className="flex flex-col space-y-4 py-4">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    className="text-champagne-light hover:text-champagne transition-colors font-medium text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t(item.key)}
                  </a>
                ))}
                <div className="flex space-x-2 pt-4 border-t border-champagne/20">
                  {(Object.keys(languageLabels) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded ${
                        language === lang
                          ? 'bg-burgundy text-champagne-light'
                          : 'text-champagne/60 border border-champagne/30'
                      }`}
                    >
                      {languageLabels[lang]}
                    </button>
                  ))}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
