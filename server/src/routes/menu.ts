import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { createMenuItemSchema } from '../utils/validation.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Public: Get all menu items
router.get('/', async (req, res) => {
  try {
    const { element, available } = req.query;
    
    const where: any = {};
    if (element) {
      where.element = element as string;
    }
    if (available !== undefined) {
      where.available = available === 'true';
    }

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Public: Get menu items by element
router.get('/:element', async (req, res) => {
  try {
    const { element } = req.params;
    const validElements = ['metal', 'wood', 'water', 'fire', 'earth'];
    
    if (!validElements.includes(element)) {
      return res.status(400).json({ error: 'Invalid element' });
    }

    const items = await prisma.menuItem.findMany({
      where: {
        element,
        available: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    console.error('Get menu by element error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create menu item
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const data = createMenuItemSchema.parse(req.body);
    const item = await prisma.menuItem.create({
      data,
    });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error });
    }
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update menu item
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const data = createMenuItemSchema.partial().parse(req.body);
    
    const item = await prisma.menuItem.update({
      where: { id },
      data,
    });
    res.json(item);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error });
    }
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete menu item
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    await prisma.menuItem.delete({
      where: { id },
    });
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
