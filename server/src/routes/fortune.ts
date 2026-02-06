import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Public: Draw fortune (returns fortune message + discount code)
router.post('/', async (req, res) => {
  try {
    const now = new Date();
    
    // Get active discount codes that are valid (date range)
    const allActiveDiscounts = await prisma.discountCode.findMany({
      where: {
        active: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter: maxUses null = unlimited, else usedCount < maxUses
    const activeDiscounts = allActiveDiscounts.filter(
      (d) => d.maxUses === null || d.usedCount < d.maxUses
    );

    if (activeDiscounts.length === 0) {
      return res.status(404).json({ error: 'No active discount codes available' });
    }

    // Randomly select a discount code
    const randomDiscount = activeDiscounts[Math.floor(Math.random() * activeDiscounts.length)];

    // Fortune messages in all languages
    const fortunes = [
      {
        message: {
          de: 'Das Glück kommt zu denen, die geduldig warten',
          en: 'Fortune comes to those who wait patiently',
          cn: '好运来自耐心等待',
        },
      },
      {
        message: {
          de: 'Teile deine Mahlzeit, teile dein Glück',
          en: 'Share your meal, share your fortune',
          cn: '分享美食，分享好运',
        },
      },
      {
        message: {
          de: 'Der Drache in dir erwacht heute',
          en: 'The dragon within you awakens today',
          cn: '你心中的龙今天觉醒',
        },
      },
      {
        message: {
          de: 'Harmonie beginnt mit einem guten Essen',
          en: 'Harmony begins with a good meal',
          cn: '和谐始于美食',
        },
      },
      {
        message: {
          de: 'Die fünf Elemente führen dich zum Glück',
          en: 'The five elements guide you to fortune',
          cn: '五行指引你走向好运',
        },
      },
    ];

    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

    // Increment used count
    await prisma.discountCode.update({
      where: { id: randomDiscount.id },
      data: { usedCount: { increment: 1 } },
    });

    res.json({
      fortune: randomFortune.message,
      discount: {
        code: randomDiscount.code,
        discountPercent: randomDiscount.discountPercent,
        dishId: randomDiscount.dishId,
      },
    });
  } catch (error) {
    console.error('Draw fortune error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
