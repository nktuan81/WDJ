import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@weidaojia.com' },
    update: {},
    create: {
      email: 'admin@weidaojia.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create sample menu items
  const menuItems = [
    {
      name_de: 'Knusprige Ente',
      name_en: 'Crispy Duck',
      name_cn: '脆皮烤鸭',
      description_de: 'Traditionelle Pekingente mit Pfannkuchen',
      description_en: 'Traditional Peking duck with pancakes',
      description_cn: '传统北京烤鸭配薄饼',
      price: 32.9,
      element: 'metal',
      category: 'protein',
      image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400',
      story_de: 'Ein kaiserliches Gericht aus der Ming-Dynastie',
      story_en: 'An imperial dish from the Ming Dynasty',
      story_cn: '明朝皇室御膳',
      available: true,
    },
    {
      name_de: 'Weiße Jade Dumplings',
      name_en: 'White Jade Dumplings',
      name_cn: '白玉饺子',
      description_de: 'Gedämpfte Teigtaschen mit Garnelen',
      description_en: 'Steamed dumplings with shrimp',
      description_cn: '鲜虾蒸饺',
      price: 14.9,
      element: 'metal',
      category: 'protein',
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400',
      story_de: 'Symbol für Reinheit und Wohlstand',
      story_en: 'Symbol of purity and prosperity',
      story_cn: '象征纯洁与繁荣',
      available: true,
    },
    {
      name_de: 'Grüner Drache Gemüse',
      name_en: 'Green Dragon Vegetables',
      name_cn: '青龙时蔬',
      description_de: 'Saisonales Gemüse mit Ingwer',
      description_en: 'Seasonal vegetables with ginger',
      description_cn: '时令蔬菜配姜',
      price: 12.9,
      element: 'wood',
      category: 'vegetable',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
      story_de: 'Fördert Wachstum und Erneuerung',
      story_en: 'Promotes growth and renewal',
      story_cn: '促进成长与更新',
      available: true,
    },
    {
      name_de: 'Feurige Phönix Flügel',
      name_en: 'Fiery Phoenix Wings',
      name_cn: '火凤翅膀',
      description_de: 'Scharfe Hühnerflügel mit Sichuanpfeffer',
      description_en: 'Spicy chicken wings with Sichuan pepper',
      description_cn: '麻辣鸡翅配四川花椒',
      price: 13.9,
      element: 'fire',
      category: 'protein',
      image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
      story_de: 'Leidenschaft und Transformation',
      story_en: 'Passion and transformation',
      story_cn: '热情与蜕变',
      available: true,
    },
    {
      name_de: 'Mapo Tofu Inferno',
      name_en: 'Mapo Tofu',
      name_cn: '麻婆豆腐',
      description_de: 'Klassisches Sichuan-Gericht',
      description_en: 'Classic Sichuan dish',
      description_cn: '经典四川菜',
      price: 14.9,
      element: 'fire',
      category: 'protein',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
      story_de: 'Die Flamme der Kreativität',
      story_en: 'The flame of creativity',
      story_cn: '创意之火',
      available: true,
    },
    {
      name_de: 'Fließender Fisch',
      name_en: 'Flowing Fish',
      name_cn: '流水鲜鱼',
      description_de: 'Gedämpfter Wolfsbarsch',
      description_en: 'Steamed sea bass',
      description_cn: '清蒸鲈鱼',
      price: 28.9,
      element: 'water',
      category: 'protein',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
      story_de: 'Anpassungsfähigkeit und Fluss',
      story_en: 'Adaptability and flow',
      story_cn: '适应与流动',
      available: true,
    },
    {
      name_de: 'Gelber Kaiser Reis',
      name_en: 'Yellow Emperor Rice',
      name_cn: '黄帝炒饭',
      description_de: 'Goldener gebratener Reis',
      description_en: 'Golden fried rice',
      description_cn: '金黄蛋炒饭',
      price: 11.9,
      element: 'earth',
      category: 'starch',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
      story_de: 'Stabilität und Nährung',
      story_en: 'Stability and nourishment',
      story_cn: '稳定与滋养',
      available: true,
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item,
    });
  }
  console.log(`✅ Created ${menuItems.length} menu items`);

  // Create sample discount codes
  const discountCodes = [
    {
      code: 'DRAGON5',
      discountPercent: 5,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      maxUses: 100,
      active: true,
    },
    {
      code: 'PHOENIX5',
      discountPercent: 5,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      maxUses: 100,
      active: true,
    },
  ];

  for (const code of discountCodes) {
    await prisma.discountCode.upsert({
      where: { code: code.code },
      update: code,
      create: code,
    });
  }
  console.log(`✅ Created ${discountCodes.length} discount codes`);

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
