import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface FortuneData {
  fortune: { de: string; en: string; cn: string };
  discount: {
    code: string;
    discountPercent: number;
    dishId?: string;
  };
}

const FortuneCookie: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentFortune, setCurrentFortune] = useState<FortuneData | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showTrigger, setShowTrigger] = useState(true);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // Check if user has drawn fortune today
  useEffect(() => {
    const today = new Date().toDateString();
    const lastDrawDate = localStorage.getItem('fortune_last_draw');
    const savedDiscount = localStorage.getItem('fortune_discount_code');
    
    if (lastDrawDate === today && savedDiscount) {
      setHasDrawnToday(true);
      // Load saved fortune
      try {
        const savedFortune = JSON.parse(localStorage.getItem('fortune_data') || '{}');
        if (savedFortune.fortune) {
          setCurrentFortune(savedFortune);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  const drawFortune = async () => {
    try {
      setIsDrawing(true);
      const data = await apiClient.drawFortune() as FortuneData;
      setCurrentFortune(data);
      setIsRevealed(false);
      
      // Save to localStorage
      const today = new Date().toDateString();
      localStorage.setItem('fortune_last_draw', today);
      localStorage.setItem('fortune_discount_code', data.discount.code);
      localStorage.setItem('fortune_data', JSON.stringify(data));
      setHasDrawnToday(true);
      
      setTimeout(() => setIsRevealed(true), 500);
    } catch (error) {
      toast.error(
        'Failed to draw fortune',
        {
          description: error instanceof Error ? error.message : 'Please try again later',
        }
      );
    } finally {
      setIsDrawing(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    if (!hasDrawnToday || !currentFortune) {
      drawFortune();
    } else {
      setIsRevealed(true);
    }
  };

  const copyDiscountCode = () => {
    if (currentFortune?.discount.code) {
      navigator.clipboard.writeText(currentFortune.discount.code);
      toast.success('Discount code copied to clipboard!');
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {showTrigger && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={openModal}
            className="fixed bottom-safe right-safe z-40 w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-burgundy border border-champagne/30 flex items-center justify-center shadow-lg hover:shadow-burgundy/50 transition-all group touch-manipulation"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-6 h-6 text-champagne group-hover:animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-champagne rounded-full animate-ping" />
            {hasDrawnToday && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-charcoal" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fortune Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-dark/90 backdrop-blur-sm overflow-y-auto"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-b from-charcoal to-charcoal-dark border border-champagne/30 rounded-2xl p-6 sm:p-8 shadow-2xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center text-champagne/50 hover:text-champagne transition-colors touch-manipulation"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-burgundy/30 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-champagne" />
                </div>
                <h3 className="font-heading text-2xl text-champagne-light">
                  {t('fortune.title')}
                </h3>
                <p className="text-champagne/60 text-sm mt-1">今日运势</p>
                {hasDrawnToday && (
                  <p className="text-champagne/40 text-xs mt-2">
                    {language === 'de' ? 'Heute bereits gezogen' : 
                     language === 'en' ? 'Already drawn today' : 
                     '今日已抽取'}
                  </p>
                )}
              </div>

              {/* Fortune Content */}
              <AnimatePresence mode="wait">
                {isDrawing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 text-champagne/60"
                  >
                    <p>Drawing your fortune...</p>
                  </motion.div>
                )}
                {!isDrawing && isRevealed && currentFortune && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Fortune Message */}
                    <div className="text-center p-6 bg-charcoal-dark/50 rounded-xl border border-champagne/10">
                      <p className="text-champagne-light text-lg italic font-heading">
                        "{currentFortune.fortune[language as keyof typeof currentFortune.fortune] || currentFortune.fortune.en || ''}"
                      </p>
                    </div>

                    {/* Discount */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center p-4 bg-burgundy/20 rounded-xl border border-burgundy/30"
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-champagne" />
                        <span className="text-champagne font-medium">
                          {currentFortune.discount.discountPercent}% {t('fortune.discount')}
                        </span>
                      </div>
                      <div className="mt-3 inline-block px-4 py-2 bg-charcoal rounded-lg border border-champagne/30 cursor-pointer hover:border-champagne/50 transition-colors"
                        onClick={copyDiscountCode}
                      >
                        <code className="text-champagne font-mono tracking-wider">
                          {currentFortune.discount.code}
                        </code>
                        <p className="text-champagne/50 text-xs mt-1">
                          {language === 'de' ? 'Klicken zum Kopieren' : 
                           language === 'en' ? 'Click to copy' : 
                           '点击复制'}
                        </p>
                      </div>
                    </motion.div>

                    {/* Draw Again (only if not drawn today) */}
                    {!hasDrawnToday && (
                      <motion.button
                        onClick={drawFortune}
                        className="w-full btn-gold rounded-lg text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {t('fortune.draw')} ✦
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FortuneCookie;
