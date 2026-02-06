import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'de' | 'en' | 'cn';

interface Translations {
  [key: string]: {
    de: string;
    en: string;
    cn: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': {
    de: 'Startseite',
    en: 'Home',
    cn: '首页',
  },
  'nav.menu': {
    de: 'Speisekarte',
    en: 'Menu',
    cn: '菜单',
  },
  'nav.reservation': {
    de: 'Reservierung',
    en: 'Reservation',
    cn: '预订',
  },
  'nav.about': {
    de: 'Über uns',
    en: 'About',
    cn: '关于我们',
  },
  'nav.contact': {
    de: 'Kontakt',
    en: 'Contact',
    cn: '联系我们',
  },
  'nav.blog': {
    de: 'Geschichten',
    en: 'Stories',
    cn: '故事',
  },
  
  // Hero Section
  'hero.title': {
    de: 'Der Tanz von Drache und Phönix',
    en: 'Dance of the Dragon and Phoenix',
    cn: '龙凤呈祥',
  },
  'hero.subtitle': {
    de: 'Echt. Chinesisch. Wie zu Hause.',
    en: 'Where True Chinese Flavor Comes Home',
    cn: '正宗中华风味，回家的味道',
  },
  'hero.description': {
    de: 'Entdecken Sie die Essenz der chinesischen Küche durch die Philosophie der Fünf Elemente und erleben Sie eine festliche Tafel der Zusammenkunft.',
    en: 'Discover the essence of Chinese cuisine through the philosophy of the Five Elements and experience a festive table of reunion.',
    cn: '通过五行哲学探索中华美食精髓，体验专属的团圆盛宴。',
  },
  'hero.cta.menu': {
    de: 'Speisekarte Entdecken',
    en: 'Explore Menu',
    cn: '探索菜单',
  },
  'hero.cta.reservation': {
    de: 'Jetzt Reservieren',
    en: 'Reserve Now',
    cn: '立即预订',
  },
  
  // Five Elements Menu
  'elements.title': {
    de: 'Fünf-Elemente-Menü',
    en: 'Five Elements Menu',
    cn: '元素菜单',
  },
  'elements.subtitle': {
    de: 'Harmonie von Körper und Geist',
    en: 'Harmony of Body and Spirit',
    cn: '身心和谐',
  },
  'elements.metal': {
    de: 'Metall',
    en: 'Metal',
    cn: '金',
  },
  'elements.wood': {
    de: 'Holz',
    en: 'Wood',
    cn: '木',
  },
  'elements.water': {
    de: 'Wasser',
    en: 'Water',
    cn: '水',
  },
  'elements.fire': {
    de: 'Feuer',
    en: 'Fire',
    cn: '火',
  },
  'elements.earth': {
    de: 'Erde',
    en: 'Earth',
    cn: '土',
  },
  
  // Contact
  'contact.address': {
    de: 'Adresse',
    en: 'Address',
    cn: '地址',
  },
  'contact.phone': {
    de: 'Telefon',
    en: 'Phone',
    cn: '电话',
  },
  'contact.hours': {
    de: 'Öffnungszeiten',
    en: 'Opening Hours',
    cn: '营业时间',
  },
  'contact.hours.value': {
    de: 'Täglich: 12:00 - 23:00 Uhr',
    en: 'Daily: 12:00 PM - 11:00 PM',
    cn: '每日: 12:00 - 23:00',
  },
  
  // Fortune
  'fortune.title': {
    de: 'Tägliches Glückslos',
    en: 'Daily Fortune',
    cn: '今日运势',
  },
  'fortune.draw': {
    de: 'Ziehen Sie Ihr Glück',
    en: 'Draw Your Fortune',
    cn: '抽取运势',
  },
  'fortune.discount': {
    de: '5% Rabatt auf',
    en: '5% off on',
    cn: '5% 折扣于',
  },
  
  // Reservation Form
  'reservation.title': {
    de: 'Tisch Reservieren',
    en: 'Reserve a Table',
    cn: '预订餐桌',
  },
  'reservation.largePartyNote': {
    de: 'Für Feiern mit mehr als 10 Gästen oder besondere Anlässe rufen Sie uns bitte direkt an. Wir erfüllen Ihnen gerne Ihre Wünsche.',
    en: "For parties larger than 10 guests or special events, please call us directly. We'd be happy to accommodate your needs.",
    cn: '超过10位客人或特殊活动请直接致电。我们乐意满足您的需求。',
  },
  'reservation.name': {
    de: 'Name',
    en: 'Name',
    cn: '姓名',
  },
  'reservation.email': {
    de: 'E-Mail (für Bestätigung)',
    en: 'Email (for confirmation)',
    cn: '邮箱（用于确认）',
  },
  'reservation.phone': {
    de: 'Telefonnummer',
    en: 'Phone Number',
    cn: '电话号码',
  },
  'reservation.date': {
    de: 'Datum',
    en: 'Date',
    cn: '日期',
  },
  'reservation.time': {
    de: 'Uhrzeit',
    en: 'Time',
    cn: '时间',
  },
  'reservation.guests': {
    de: 'Anzahl der Gäste',
    en: 'Number of Guests',
    cn: '人数',
  },
  'reservation.submit': {
    de: 'Reservierung Absenden',
    en: 'Submit Reservation',
    cn: '提交预订',
  },
  'reservation.specialRequest': {
    de: 'Besondere Wünsche',
    en: 'Special Request',
    cn: '特殊要求',
  },
  'reservation.specialRequest.placeholder': {
    de: 'z.B. besondere Anlässe, Allergien, Tisch am Fenster',
    en: 'e.g. special occasions, allergies, table near window',
    cn: '例如：特殊场合、过敏、靠窗座位',
  },
  'reservation.optional': {
    de: 'optional',
    en: 'optional',
    cn: '可选',
  },

  // Mood/State Selector
  'menu.mood.title': {
    de: 'Wählen Sie Ihre Stimmung',
    en: 'Choose Your Mood',
    cn: '选择您的心情',
  },
  'menu.state.title': {
    de: 'Wählen Sie Ihren Zustand',
    en: 'Choose Your State',
    cn: '选择您的状态',
  },
  'menu.mood.energy': {
    de: 'Brauche Energie',
    en: 'Need Energy',
    cn: '需要能量',
  },
  'menu.mood.cool': {
    de: 'Will abkühlen',
    en: 'Want to Cool Down',
    cn: '想要降温',
  },
  'menu.mood.balance': {
    de: 'Brauche Balance',
    en: 'Need Balance',
    cn: '需要平衡',
  },
  'menu.mood.focus': {
    de: 'Brauche Fokus',
    en: 'Need Focus',
    cn: '需要专注',
  },
  'menu.mood.relax': {
    de: 'Will entspannen',
    en: 'Want to Relax',
    cn: '想要放松',
  },
  'menu.state.tired': {
    de: 'Müde',
    en: 'Tired',
    cn: '疲惫',
  },
  'menu.state.stressed': {
    de: 'Gestresst',
    en: 'Stressed',
    cn: '压力大',
  },
  'menu.state.hungry': {
    de: 'Hungrig',
    en: 'Hungry',
    cn: '饥饿',
  },
  'menu.state.thirsty': {
    de: 'Durstig',
    en: 'Thirsty',
    cn: '口渴',
  },
  'menu.state.normal': {
    de: 'Normal',
    en: 'Normal',
    cn: '正常',
  },
  'menu.suggestions': {
    de: 'Empfohlene Gerichte',
    en: 'Recommended Dishes',
    cn: '推荐菜品',
  },
  'menu.all': {
    de: 'Alle anzeigen',
    en: 'Show All',
    cn: '显示全部',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('de');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
