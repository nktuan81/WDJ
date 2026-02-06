import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiClient } from '@/lib/api';

type Element = 'metal' | 'wood' | 'water' | 'fire' | 'earth';
type Mood = 'energy' | 'cool' | 'balance' | 'focus' | 'relax' | null;
type PhysicalState = 'tired' | 'stressed' | 'hungry' | 'thirsty' | 'normal' | null;

interface MenuItem {
  id: string;
  name_de: string;
  name_en: string;
  name_cn: string;
  description_de: string;
  description_en: string;
  description_cn: string;
  price: number;
  element: Element;
  category: string;
  image?: string | null;
  story_de?: string | null;
  story_en?: string | null;
  story_cn?: string | null;
  available: boolean;
}

const elementColors: Record<Element, { bg: string; accent: string; glow: string }> = {
  metal: { bg: 'from-gray-400/20', accent: 'text-gray-300', glow: 'shadow-gray-400/30' },
  wood: { bg: 'from-green-600/20', accent: 'text-green-400', glow: 'shadow-green-500/30' },
  water: { bg: 'from-blue-600/20', accent: 'text-blue-400', glow: 'shadow-blue-500/30' },
  fire: { bg: 'from-orange-600/20', accent: 'text-orange-400', glow: 'shadow-orange-500/30' },
  earth: { bg: 'from-amber-600/20', accent: 'text-amber-400', glow: 'shadow-amber-500/30' },
};

const elementIcons: Record<Element, string> = {
  metal: '金',
  wood: '木',
  water: '水',
  fire: '火',
  earth: '土',
};

// Mood to Element mapping
const moodToElement: Record<Mood, Element> = {
  energy: 'fire',
  cool: 'water',
  balance: 'earth',
  focus: 'metal',
  relax: 'wood',
};

// State to Element mapping
const stateToElement: Record<PhysicalState, Element> = {
  tired: 'fire',
  stressed: 'water',
  hungry: 'earth',
  thirsty: 'water',
  normal: 'earth',
};

const FiveElementsMenu: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeElement, setActiveElement] = useState<Element>('fire');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [selectedState, setSelectedState] = useState<PhysicalState>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const elements: Element[] = ['metal', 'wood', 'water', 'fire', 'earth'];

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const items = await apiClient.getMenu() as MenuItem[];
        setMenuItems(items.filter(item => item.available !== false));
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Get items for active element
  const getItemsForElement = (element: Element) => {
    return menuItems.filter(item => item.element === element);
  };

  // Pure: get suggested items array (no setState)
  const getSuggestedItemsPure = (): MenuItem[] => {
    if (!selectedMood && !selectedState) return [];
    const suggestedElement = selectedMood
      ? moodToElement[selectedMood]
      : selectedState
        ? stateToElement[selectedState]
        : null;
    if (!suggestedElement) return [];
    return menuItems.filter((item) => item.element === suggestedElement);
  };

  // Sync activeElement/showSuggestions when mood/state changes
  useEffect(() => {
    if (selectedMood || selectedState) {
      const el = selectedMood
        ? moodToElement[selectedMood]
        : selectedState
          ? stateToElement[selectedState]
          : null;
      if (el) {
        setActiveElement(el);
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [selectedMood, selectedState]);

  const currentItems =
    showSuggestions && (selectedMood || selectedState)
      ? getSuggestedItemsPure()
      : getItemsForElement(activeElement);

  const getItemName = (item: MenuItem) => {
    return language === 'de' ? item.name_de : language === 'en' ? item.name_en : item.name_cn;
  };

  const getItemDescription = (item: MenuItem) => {
    return language === 'de' ? item.description_de : language === 'en' ? item.description_en : item.description_cn;
  };

  const getItemStory = (item: MenuItem) => {
    if (!item.story_de && !item.story_en && !item.story_cn) return null;
    return language === 'de' ? item.story_de : language === 'en' ? item.story_en : item.story_cn;
  };

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  return (
    <section 
      id="menu" 
      className={`section-imperial relative transition-all duration-700 theme-${activeElement}`}
    >
      {/* Background Gradient based on element */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${elementColors[activeElement].bg} to-transparent opacity-30 transition-all duration-700`} 
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-champagne-light mb-4">
            {t('elements.title')}
          </h2>
          <p className="text-champagne/70 text-lg">{t('elements.subtitle')}</p>
          <div className="divider-imperial max-w-md mx-auto" />
        </motion.div>

        {/* Mood/State Selector */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          {/* Mood Selector */}
          <div>
            <h3 className="text-champagne/70 text-sm mb-3 text-center">
              {t('menu.mood.title')}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {(['energy', 'cool', 'balance', 'focus', 'relax'] as Mood[]).map((mood) => (
                <motion.button
                  key={mood}
                  onClick={() => {
                    setSelectedMood(selectedMood === mood ? null : mood);
                    setSelectedState(null);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-sm transition-all touch-manipulation min-h-[44px] ${
                    selectedMood === mood
                      ? `bg-gradient-to-b ${elementColors[moodToElement[mood]].bg} border border-champagne/30 ${elementColors[moodToElement[mood]].accent}`
                      : 'bg-charcoal/50 border border-transparent hover:border-champagne/20 text-champagne/60'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t(`menu.mood.${mood}`)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Physical State Selector */}
          <div>
            <h3 className="text-champagne/70 text-sm mb-3 text-center">
              {t('menu.state.title')}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {(['tired', 'stressed', 'hungry', 'thirsty', 'normal'] as PhysicalState[]).map((state) => (
                <motion.button
                  key={state}
                  onClick={() => {
                    setSelectedState(selectedState === state ? null : state);
                    setSelectedMood(null);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-sm transition-all touch-manipulation min-h-[44px] ${
                    selectedState === state
                      ? `bg-gradient-to-b ${elementColors[stateToElement[state]].bg} border border-champagne/30 ${elementColors[stateToElement[state]].accent}`
                      : 'bg-charcoal/50 border border-transparent hover:border-champagne/20 text-champagne/60'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t(`menu.state.${state}`)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Show All Button */}
          {(selectedMood || selectedState) && (
            <div className="text-center">
              <motion.button
                onClick={() => {
                  setSelectedMood(null);
                  setSelectedState(null);
                  setShowSuggestions(false);
                }}
                className="px-6 py-2 bg-charcoal/50 border border-champagne/20 rounded-lg text-champagne/70 hover:text-champagne hover:border-champagne/50 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('menu.all')}
              </motion.button>
            </div>
          )}
        </div>

        {/* Element Tabs */}
        <div className="flex justify-center mb-12 flex-wrap gap-4">
          {elements.map((element) => (
            <motion.button
              key={element}
              onClick={() => {
                setActiveElement(element);
                setSelectedMood(null);
                setSelectedState(null);
                setShowSuggestions(false);
              }}
              className={`relative px-6 py-4 rounded-lg transition-all duration-300 ${
                activeElement === element
                  ? `bg-gradient-to-b ${elementColors[element].bg} to-charcoal border border-champagne/30 shadow-lg ${elementColors[element].glow}`
                  : 'bg-charcoal/50 border border-transparent hover:border-champagne/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={`text-3xl mb-1 block ${activeElement === element ? elementColors[element].accent : 'text-champagne/50'}`}>
                {elementIcons[element]}
              </span>
              <span className={`text-sm font-medium ${activeElement === element ? 'text-champagne-light' : 'text-champagne/60'}`}>
                {t(`elements.${element}`)}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="text-center text-champagne/60 py-12">
            Loading menu...
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeElement}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto"
            >
              {currentItems.length === 0 ? (
                <div className="col-span-2 text-center text-champagne/60 py-12">
                  No items available for this selection
                </div>
              ) : (
                currentItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-imperial group overflow-hidden"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0">
                        <motion.img
                          src={item.image || 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400'}
                          alt={getItemName(item)}
                          className="w-full h-full object-cover"
                          animate={{
                            scale: hoveredItem === item.id ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-heading text-xl text-champagne-light">
                            {getItemName(item)}
                          </h3>
                          <span className={`font-heading text-lg ${elementColors[activeElement].accent}`}>
                            {formatPrice(item.price)}
                          </span>
                        </div>
                        <p className="text-champagne/70 text-sm mb-3">
                          {getItemDescription(item)}
                        </p>
                        
                        {/* Story - shows on hover */}
                        <AnimatePresence>
                          {hoveredItem === item.id && getItemStory(item) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <p className={`text-xs italic ${elementColors[activeElement].accent}`}>
                                ✦ {getItemStory(item)}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default FiveElementsMenu;
