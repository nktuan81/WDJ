import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { createDiscountCodeSchema } from '../utils/validation.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Public: Validate discount code
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const now = new Date();

    const discount = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!discount) {
      return res.status(404).json({ error: 'Discount code not found' });
    }

    if (!discount.active) {
      return res.status(400).json({ error: 'Discount code is inactive' });
    }

    const validFrom = new Date(discount.validFrom);
    const validUntil = new Date(discount.validUntil);

    if (now < validFrom || now > validUntil) {
      return res.status(400).json({ error: 'Discount code is expired or not yet valid' });
    }

    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return res.status(400).json({ error: 'Discount code has reached maximum uses' });
    }

    res.json({
      code: discount.code,
      discountPercent: discount.discountPercent,
      dishId: discount.dishId,
      valid: true,
    });
  } catch (error) {
    console.error('Validate discount error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get all discount codes
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const discounts = await prisma.discountCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(discounts);
  } catch (error) {
    console.error('Get discounts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create discount code
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const data = createDiscountCodeSchema.parse(req.body);
    const discount = await prisma.discountCode.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
      },
    });
    res.status(201).json(discount);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error });
    }
    console.error('Create discount error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update discount code
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const data = createDiscountCodeSchema.partial().parse(req.body);
    
    if (data.code) {
      data.code = data.code.toUpperCase();
    }

    const discount = await prisma.discountCode.update({
      where: { id },
      data,
    });
    res.json(discount);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error });
    }
    console.error('Update discount error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete discount code
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    await prisma.discountCode.delete({
      where: { id },
    });
    res.json({ message: 'Discount code deleted' });
  } catch (error) {
    console.error('Delete discount error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
