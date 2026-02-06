// Tea pairing logic based on dish categories and elements

export interface Tea {
  id: string;
  name_de: string;
  name_en: string;
  name_cn: string;
  description_de: string;
  description_en: string;
  description_cn: string;
  type: 'green' | 'oolong' | 'black' | 'white' | 'pu-erh';
}

export const teas: Tea[] = [
  {
    id: 't1',
    name_de: 'Jasmin Tee',
    name_en: 'Jasmine Tea',
    name_cn: '茉莉花茶',
    description_de: 'Leicht und blumig, perfekt für leichte Gerichte',
    description_en: 'Light and floral, perfect for light dishes',
    description_cn: '清淡花香，适合清淡菜品',
    type: 'green',
  },
  {
    id: 't2',
    name_de: 'Tieguanyin',
    name_en: 'Tieguanyin Oolong',
    name_cn: '铁观音',
    description_de: 'Ausgewogen und aromatisch, passt zu den meisten Gerichten',
    description_en: 'Balanced and aromatic, pairs with most dishes',
    description_cn: '平衡芳香，适合大多数菜品',
    type: 'oolong',
  },
  {
    id: 't3',
    name_de: 'Pu-Erh Tee',
    name_en: 'Pu-Erh Tea',
    name_cn: '普洱茶',
    description_de: 'Erdig und kräftig, ideal für fettige und reichhaltige Gerichte',
    description_en: 'Earthy and robust, ideal for rich and fatty dishes',
    description_cn: '醇厚浓郁，适合油腻丰盛菜品',
    type: 'pu-erh',
  },
  {
    id: 't4',
    name_de: 'Longjing Tee',
    name_en: 'Longjing Green Tea',
    name_cn: '龙井茶',
    description_de: 'Frisch und zart, begleitet Meeresfrüchte perfekt',
    description_en: 'Fresh and delicate, pairs perfectly with seafood',
    description_cn: '清新淡雅，完美搭配海鲜',
    type: 'green',
  },
  {
    id: 't5',
    name_de: 'Weißer Tee',
    name_en: 'White Tea',
    name_cn: '白茶',
    description_de: 'Sanft und subtil, für zarte Aromen',
    description_en: 'Gentle and subtle, for delicate flavors',
    description_cn: '温和细腻，适合清淡口味',
    type: 'white',
  },
];

export const getRecommendedTea = (
  dishes: Array<{ category: string; element?: string }>
): Tea | null => {
  if (dishes.length === 0) return null;

  const categories = dishes.map(d => d.category);
  const elements = dishes.map(d => d.element).filter(Boolean);

  // If mostly protein and rich dishes, recommend Pu-Erh
  const proteinCount = categories.filter(c => c === 'protein').length;
  if (proteinCount > categories.length * 0.5) {
    return teas.find(t => t.id === 't3') || null;
  }

  // If mostly seafood, recommend Longjing
  const hasSeafood = dishes.some(d => 
    d.category === 'protein' && 
    (d.element === 'water' || d.element === 'metal')
  );
  if (hasSeafood) {
    return teas.find(t => t.id === 't4') || null;
  }

  // If balanced mix, recommend Tieguanyin
  if (categories.length >= 3) {
    return teas.find(t => t.id === 't2') || null;
  }

  // Default to Jasmine for light meals
  return teas.find(t => t.id === 't1') || null;
};

export const calculateFoodQuantity = (guests: number): {
  minDishes: number;
  recommendedDishes: number;
  servingsPerDish: number;
} => {
  // Chinese dining: typically 1-1.5 dishes per person
  const minDishes = Math.max(2, Math.ceil(guests * 0.8));
  const recommendedDishes = Math.ceil(guests * 1.2);
  const servingsPerDish = Math.ceil(guests / recommendedDishes);

  return {
    minDishes,
    recommendedDishes,
    servingsPerDish,
  };
};
