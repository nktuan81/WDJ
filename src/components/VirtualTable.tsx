import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ShoppingCart, Users, X, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { calculateFoodQuantity } from '@/lib/teaPairing';
import { apiClient } from '@/lib/api';

interface DishItem {
  id: string;
  name: { de: string; en: string; cn: string };
  category: 'protein' | 'vegetable' | 'starch';
  price: number;
  image: string;
}

const dishes: DishItem[] = [
  { id: 'd1', name: { de: 'Pekingente', en: 'Peking Duck', cn: '北京烤鸭' }, category: 'protein', price: 32.9, image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=200' },
  { id: 'd2', name: { de: 'Kung Pao Huhn', en: 'Kung Pao Chicken', cn: '宫保鸡丁' }, category: 'protein', price: 16.9, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200' },
  { id: 'd3', name: { de: 'Garnelen', en: 'Shrimp', cn: '大虾' }, category: 'protein', price: 18.9, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200' },
  { id: 'd4', name: { de: 'Rindfleisch', en: 'Beef', cn: '牛肉' }, category: 'protein', price: 19.9, image: 'https://images.unsplash.com/photo-1544025162-d76978f8e8a4?w=200' },
  { id: 'd5', name: { de: 'Tofu', en: 'Tofu', cn: '豆腐' }, category: 'protein', price: 12.9, image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200' },
  { id: 'd6', name: { de: 'Brokkoli', en: 'Broccoli', cn: '西兰花' }, category: 'vegetable', price: 10.9, image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200' },
  { id: 'd7', name: { de: 'Pak Choi', en: 'Bok Choy', cn: '小白菜' }, category: 'vegetable', price: 9.9, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200' },
  { id: 'd8', name: { de: 'Pilze', en: 'Mushrooms', cn: '蘑菇' }, category: 'vegetable', price: 11.9, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200' },
  { id: 'd9', name: { de: 'Gebratener Reis', en: 'Fried Rice', cn: '炒饭' }, category: 'starch', price: 9.9, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200' },
  { id: 'd10', name: { de: 'Nudeln', en: 'Noodles', cn: '面条' }, category: 'starch', price: 10.9, image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=200' },
  { id: 'd11', name: { de: 'Mantou', en: 'Mantou Buns', cn: '馒头' }, category: 'starch', price: 5.9, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=200' },
  { id: 'd12', name: { de: 'Frühlingsrollen', en: 'Spring Rolls', cn: '春卷' }, category: 'starch', price: 7.9, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200' },
];

const translations = {
  title: { de: 'Familienfest-Planer', en: 'Virtual Reunion Table', cn: '家庭宴席' },
  subtitle: { de: 'Stellen Sie Ihr Festmahl zusammen', en: 'Compose Your Feast', cn: '组合您的宴席' },
  protein: { de: 'Protein', en: 'Protein', cn: '蛋白质' },
  vegetable: { de: 'Gemüse', en: 'Vegetable', cn: '蔬菜' },
  starch: { de: 'Kohlenhydrate', en: 'Starch', cn: '主食' },
  balance: { de: 'Ausgewogenheit', en: 'Balance', cn: '平衡度' },
  total: { de: 'Gesamt', en: 'Total', cn: '总计' },
  checkout: { de: 'Bestellung aufgeben', en: 'Confirm Order', cn: '确认订单' },
  clear: { de: 'Tisch leeren', en: 'Clear Table', cn: '清空' },
  dragHint: { de: 'Klicken um Gerichte zum Tisch hinzuzufügen', en: 'Click dishes to add to the table', cn: '点击菜品添加到餐桌' },
  balanced: { de: 'Perfekt ausgewogen!', en: 'Perfectly balanced!', cn: '完美平衡!' },
  needMore: { de: 'Braucht mehr', en: 'Needs more', cn: '需要更多' },
  tableNumber: { de: 'Tischnummer', en: 'Table Number', cn: '桌号' },
  tableNumberPlaceholder: { de: 'z.B. 3', en: 'e.g. 3', cn: '例如：3' },
};

const WHATSAPP_ORDER_NUMBER = '4915203879098';

const VirtualTable: React.FC = () => {
  const { language } = useLanguage();
  const [selectedDishes, setSelectedDishes] = useState<DishItem[]>([]);
  const [rotation, setRotation] = useState(0);
  const [guests, setGuests] = useState(2);
  const [tableNumber, setTableNumber] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('virtual_table_combo');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSelectedDishes(data.dishes || []);
        setGuests(data.guests || 2);
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (selectedDishes.length > 0 || guests !== 2) {
      localStorage.setItem('virtual_table_combo', JSON.stringify({
        dishes: selectedDishes,
        guests,
      }));
    }
  }, [selectedDishes, guests]);

  const addDish = (dish: DishItem) => {
    if (selectedDishes.length < 12) {
      setSelectedDishes([...selectedDishes, dish]);
      setRotation(rotation + 30);
    }
  };

  const removeDish = (index: number) => {
    setSelectedDishes(selectedDishes.filter((_, i) => i !== index));
  };

  const clearTable = () => {
    setSelectedDishes([]);
    setRotation(0);
  };

  const getBalance = () => {
    const protein = selectedDishes.filter(d => d.category === 'protein').length;
    const vegetable = selectedDishes.filter(d => d.category === 'vegetable').length;
    const starch = selectedDishes.filter(d => d.category === 'starch').length;
    const total = selectedDishes.length;
    
    if (total === 0) return { protein: 0, vegetable: 0, starch: 0, isBalanced: false };
    
    const proteinPct = (protein / total) * 100;
    const vegetablePct = (vegetable / total) * 100;
    const starchPct = (starch / total) * 100;
    
    // Balanced: 30-50% protein, 30-40% vegetable, 20-30% starch
    const isBalanced = proteinPct >= 25 && proteinPct <= 50 &&
                       vegetablePct >= 25 && vegetablePct <= 45 &&
                       starchPct >= 15 && starchPct <= 35;
    
    return { protein: proteinPct, vegetable: vegetablePct, starch: starchPct, isBalanced };
  };

  const balance = getBalance();
  const baseTotal = selectedDishes.reduce((sum, d) => sum + d.price, 0);
  const discountAmount = (baseTotal * discountPercent) / 100;
  const total = baseTotal - discountAmount;
  const foodQuantity = calculateFoodQuantity(guests);

  const handleValidateDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('');
      setDiscountPercent(0);
      return;
    }

    try {
      const discount = await apiClient.validateDiscountCode(discountCode.toUpperCase());
      setDiscountPercent(discount.discountPercent);
      setDiscountError('');
      toast.success('Discount code applied!');
    } catch (error) {
      setDiscountPercent(0);
      setDiscountError(error instanceof Error ? error.message : 'Invalid discount code');
      toast.error('Invalid discount code');
    }
  };

  const handleCheckout = () => {
    if (selectedDishes.length === 0) return;
    const tableNum = tableNumber.trim();
    if (!tableNum) {
      toast.error(
        language === 'de' ? 'Bitte Tischnummer eingeben' : language === 'en' ? 'Please enter table number' : '请输入桌号',
        { description: language === 'de' ? 'Tischnummer ist erforderlich' : language === 'en' ? 'Table number is required' : '桌号为必填项' }
      );
      return;
    }
    // Group dishes by id for quantity
    const dishCounts = selectedDishes.reduce<Record<string, { dish: DishItem; qty: number }>>((acc, d) => {
      const key = d.id;
      if (!acc[key]) acc[key] = { dish: d, qty: 0 };
      acc[key].qty += 1;
      return acc;
    }, {});
    const lines: string[] = [
      '🍜 *Weidaojia - Bestellung / Order*',
      '',
      `${translations.tableNumber[language]}: ${tableNum}`,
      language === 'de' ? `Gäste: ${guests}` : language === 'en' ? `Guests: ${guests}` : `人数: ${guests}`,
      '',
      language === 'de' ? '*Gerichte:*' : language === 'en' ? '*Dishes:*' : '*菜品:*',
    ];
    Object.values(dishCounts).forEach(({ dish, qty }) => {
      const name = dish.name[language];
      lines.push(`• ${name} €${dish.price.toFixed(2)}${qty > 1 ? ` x${qty}` : ''}`);
    });
    lines.push('');
    if (discountPercent > 0) {
      lines.push(
        (language === 'de' ? 'Zwischensumme: ' : language === 'en' ? 'Subtotal: ' : '小计: ') + `€${baseTotal.toFixed(2)}`,
        (language === 'de' ? 'Rabatt: ' : language === 'en' ? 'Discount: ' : '折扣: ') + `${discountPercent}%`,
        (language === 'de' ? 'Gesamt: ' : language === 'en' ? 'Total: ' : '总计: ') + `€${total.toFixed(2)}`
      );
    } else {
      lines.push((language === 'de' ? 'Gesamt: ' : language === 'en' ? 'Total: ' : '总计: ') + `€${total.toFixed(2)}`);
    }
    const message = lines.join('\n');
    const whatsappUrl = `https://wa.me/${WHATSAPP_ORDER_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    toast.success('🎉 ' + translations.checkout[language], {
      description: language === 'de' ? 'WhatsApp wird geöffnet – Bestellung senden' : language === 'en' ? 'Opening WhatsApp – send the order' : '正在打开 WhatsApp – 请发送订单',
    });
  };

  return (
    <section className="section-imperial py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-champagne-light mb-3 sm:mb-4">
            {translations.title[language]}
          </h2>
          <p className="text-champagne/70 text-base sm:text-lg px-1">{translations.subtitle[language]}</p>
          <div className="divider-imperial max-w-md mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Left: Dish Selection */}
          <div className="space-y-4 sm:space-y-6 min-w-0">
            {/* Guest Count Input */}
            <div className="card-imperial">
              <label className="block text-champagne/70 text-sm mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {language === 'de' ? 'Anzahl der Gäste' : language === 'en' ? 'Number of Guests' : '人数'}
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                className="w-full bg-charcoal-dark border border-champagne/20 rounded-lg py-2 px-4 text-champagne-light focus:outline-none focus:border-champagne/50 transition-colors"
              />
              <p className="text-champagne/50 text-xs mt-2">
                {language === 'de' 
                  ? `Empfohlen: ${foodQuantity.recommendedDishes} Gerichte für ${guests} Gäste`
                  : language === 'en'
                  ? `Recommended: ${foodQuantity.recommendedDishes} dishes for ${guests} guests`
                  : `推荐: ${foodQuantity.recommendedDishes} 道菜给 ${guests} 位客人`}
              </p>
              {selectedDishes.length < foodQuantity.minDishes && selectedDishes.length > 0 && (
                <p className="text-orange-400 text-xs mt-1">
                  {language === 'de' 
                    ? `⚠️ Mindestens ${foodQuantity.minDishes} Gerichte empfohlen`
                    : language === 'en'
                    ? `⚠️ At least ${foodQuantity.minDishes} dishes recommended`
                    : `⚠️ 建议至少 ${foodQuantity.minDishes} 道菜`}
                </p>
              )}
            </div>

            <p className="text-champagne/60 text-center text-xs sm:text-sm px-1">{translations.dragHint[language]}</p>
            
            {/* Category Filters */}
            {(['protein', 'vegetable', 'starch'] as const).map((category) => (
              <div key={category} className="space-y-2 sm:space-y-3">
                <h4 className="text-champagne font-medium flex items-center gap-2 text-sm sm:text-base">
                  <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0 ${
                    category === 'protein' ? 'bg-red-500' : 
                    category === 'vegetable' ? 'bg-green-500' : 'bg-amber-500'
                  }`} />
                  {translations[category][language]}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {dishes.filter(d => d.category === category).map((dish) => (
                    <motion.button
                      key={dish.id}
                      type="button"
                      onClick={() => addDish(dish)}
                      className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-3 sm:py-2 bg-charcoal border border-champagne/20 rounded-lg hover:border-champagne/50 transition-colors group cursor-pointer select-none touch-manipulation min-h-[44px]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img src={dish.image} alt="" className="w-7 h-7 sm:w-8 sm:h-8 rounded object-cover pointer-events-none shrink-0" />
                      <span className="text-champagne-light text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{dish.name[language]}</span>
                      <span className="text-champagne/50 text-xs shrink-0">€{dish.price}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Virtual Table */}
          <div className="space-y-4 sm:space-y-6 min-w-0 w-full overflow-hidden">
            {/* Round Table */}
            <div className="relative mx-auto w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 max-w-[min(100%,20rem)] sm:max-w-none overflow-hidden">
              {/* Table Surface */}
              <motion.div
                animate={{ rotate: rotation }}
                transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-900/50 to-amber-950/80 border-4 border-champagne/30 shadow-2xl"
                style={{ boxShadow: '0 0 60px rgba(197, 160, 89, 0.2), inset 0 0 30px rgba(0,0,0,0.5)' }}
              >
                {/* Center decoration */}
                <div className="absolute inset-4 sm:inset-6 lg:inset-8 rounded-full border border-champagne/20" aria-hidden />
                
                {/* Dishes on table */}
                {selectedDishes.map((dish, index) => {
                  const angle = (index * 30) - 90; // Distribute around the circle
                  const radius = 100; // Distance from center
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute w-14 h-14 -ml-7 -mt-7"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                    >
                      <div className="relative group">
                        <img
                          src={dish.image}
                          alt={dish.name[language]}
                          className="w-full h-full rounded-full object-cover border-2 border-champagne/40 shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeDish(index); }}
                          className="absolute -top-0.5 -right-0.5 w-6 h-6 min-w-[28px] min-h-[28px] sm:w-5 sm:h-5 sm:min-w-0 sm:min-h-0 bg-burgundy rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
                          aria-label="Remove dish"
                        >
                          <X className="w-3 h-3 text-champagne" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
              
              {/* Rotate button */}
              <motion.button
                type="button"
                onClick={() => setRotation(rotation + 45)}
                className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] bg-burgundy rounded-full flex items-center justify-center border border-champagne/30 shadow-lg touch-manipulation"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Rotate table"
              >
                <RotateCcw className="w-5 h-5 text-champagne" />
              </motion.button>
            </div>

            {/* Balance Meter */}
            <div className="card-imperial p-4 sm:p-6">
              <h4 className="text-champagne font-medium mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base flex-wrap">
                <Users className="w-5 h-5 shrink-0" />
                {translations.balance[language]}
                {balance.isBalanced && selectedDishes.length >= 3 && (
                  <span className="ml-auto text-green-400 text-sm">✓ {translations.balanced[language]}</span>
                )}
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="text-champagne/60 text-xs sm:text-sm shrink-0 min-w-[3.5rem] sm:min-w-[5rem]">{translations.protein[language]}</span>
                  <div className="flex-1 min-w-0 h-2.5 sm:h-3 bg-charcoal-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${balance.protein}%` }}
                      className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                    />
                  </div>
                  <span className="text-champagne text-xs sm:text-sm w-8 sm:w-10 shrink-0 text-right">{Math.round(balance.protein)}%</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="text-champagne/60 text-xs sm:text-sm shrink-0 min-w-[3.5rem] sm:min-w-[5rem]">{translations.vegetable[language]}</span>
                  <div className="flex-1 min-w-0 h-2.5 sm:h-3 bg-charcoal-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${balance.vegetable}%` }}
                      className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                    />
                  </div>
                  <span className="text-champagne text-xs sm:text-sm w-8 sm:w-10 shrink-0 text-right">{Math.round(balance.vegetable)}%</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="text-champagne/60 text-xs sm:text-sm shrink-0 min-w-[3.5rem] sm:min-w-[5rem]">{translations.starch[language]}</span>
                  <div className="flex-1 min-w-0 h-2.5 sm:h-3 bg-charcoal-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${balance.starch}%` }}
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                    />
                  </div>
                  <span className="text-champagne text-xs sm:text-sm w-8 sm:w-10 shrink-0 text-right">{Math.round(balance.starch)}%</span>
                </div>
              </div>
            </div>

            {/* Table Number */}
            <div className="card-imperial p-4 sm:p-6">
              <label className="block text-champagne font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                {translations.tableNumber[language]}:
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder={translations.tableNumberPlaceholder[language]}
                className="w-full bg-charcoal-dark border border-champagne/20 rounded-lg py-2 px-4 text-champagne-light placeholder:text-champagne/30 focus:outline-none focus:border-champagne/50 transition-colors min-h-[44px]"
                inputMode="numeric"
              />
            </div>

            {/* Discount Code */}
            <div className="card-imperial p-4 sm:p-6">
              <h4 className="text-champagne font-medium mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 shrink-0" />
                {language === 'de' ? 'Rabattcode' : language === 'en' ? 'Discount Code' : '折扣码'}
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value.toUpperCase());
                    setDiscountError('');
                  }}
                  placeholder={language === 'de' ? 'Code eingeben' : language === 'en' ? 'Enter code' : '输入代码'}
                  className="flex-1 min-w-0 bg-charcoal-dark border border-champagne/20 rounded-lg py-2 px-4 text-champagne-light focus:outline-none focus:border-champagne/50 transition-colors min-h-[44px]"
                />
                <motion.button
                  onClick={handleValidateDiscount}
                  className="px-4 py-2 min-h-[44px] bg-burgundy/30 border border-champagne/20 rounded-lg text-champagne hover:bg-burgundy/50 transition-colors text-sm touch-manipulation shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {language === 'de' ? 'Anwenden' : language === 'en' ? 'Apply' : '应用'}
                </motion.button>
              </div>
              {discountError && (
                <p className="text-red-400 text-xs mt-1">{discountError}</p>
              )}
              {discountPercent > 0 && (
                <p className="text-green-400 text-xs mt-1">
                  {language === 'de' 
                    ? `✓ ${discountPercent}% Rabatt angewendet`
                    : language === 'en'
                    ? `✓ ${discountPercent}% discount applied`
                    : `✓ 已应用 ${discountPercent}% 折扣`}
                </p>
              )}
            </div>

            {/* Total & Checkout */}
            <div className="card-imperial p-4 sm:p-6">
              <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
                <span className="text-champagne/60 text-xs sm:text-sm shrink-0">{translations.total[language]}</span>
                <div className="text-right min-w-0">
                  {discountPercent > 0 && (
                    <p className="text-champagne/50 text-xs line-through">€{baseTotal.toFixed(2)}</p>
                  )}
                  <p className="text-xl sm:text-2xl font-heading text-champagne-light truncate">€{total.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
                <motion.button
                  type="button"
                  onClick={clearTable}
                  className="sm:order-1 px-4 py-3 sm:py-2 min-h-[44px] border border-champagne/30 rounded-lg text-champagne/70 hover:text-champagne hover:border-champagne/50 transition-colors text-sm touch-manipulation w-full sm:w-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {translations.clear[language]}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCheckout}
                  disabled={selectedDishes.length === 0 || !tableNumber.trim()}
                  className="sm:order-2 flex-1 min-h-[48px] btn-imperial rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation w-full sm:w-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <span className="truncate">{translations.checkout[language]}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualTable;
