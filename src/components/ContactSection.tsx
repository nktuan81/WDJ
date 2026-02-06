import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactSection: React.FC = () => {
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: MapPin,
      label: t('contact.address'),
      value: 'Oderberger Str. 27\n10435 Berlin',
      link: 'https://maps.google.com/?q=Oderberger+Str.+27,+10435+Berlin',
    },
    {
      icon: Phone,
      label: t('contact.phone'),
      value: '030 94042558',
      link: 'tel:03094042558',
    },
    {
      icon: Clock,
      label: t('contact.hours'),
      value: t('contact.hours.value'),
    },
    {
      icon: Globe,
      label: 'Web',
      value: 'www.weidaojia.de',
      link: 'https://www.weidaojia.de',
    },
  ];

  return (
    <section id="contact" className="section-imperial">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-champagne-light mb-4">
            {t('nav.contact')}
          </h2>
          <div className="divider-imperial max-w-md mx-auto" />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-imperial text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-burgundy/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-burgundy/50 transition-colors">
                  <info.icon className="w-6 h-6 text-champagne" />
                </div>
                <p className="text-champagne/60 text-sm mb-2">{info.label}</p>
                {info.link ? (
                  <a
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-champagne-light hover:text-champagne transition-colors whitespace-pre-line"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-champagne-light whitespace-pre-line">{info.value}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-8 border-t border-champagne/10 text-center"
        >
          <div className="flex flex-col items-center mb-6">
            <span className="text-3xl font-heading text-gradient-gold font-bold tracking-widest mb-1">
              味道佳
            </span>
            <span className="text-sm text-champagne/50 tracking-[0.3em] uppercase">
              Weidaojia
            </span>
          </div>
          
          {/* Legal Links */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link
              to="/impressum"
              className="text-champagne/50 hover:text-champagne text-sm transition-colors"
            >
              Impressum
            </Link>
            <span className="text-champagne/30">|</span>
            <Link
              to="/datenschutz"
              className="text-champagne/50 hover:text-champagne text-sm transition-colors"
            >
              Datenschutz
            </Link>
          </div>
          
          <p className="text-champagne/40 text-sm">
            © {new Date().getFullYear()} Weidaojia 味道佳. All rights reserved.
          </p>
        </motion.footer>
      </div>
    </section>
  );
};

export default ContactSection;
