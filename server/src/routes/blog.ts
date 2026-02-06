import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { createBlogPostSchema } from '../utils/validation.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Admin: Get all blog posts (requires auth) - must be before /:id
router.get('/all', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    console.error('Get all blog posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Public: Get all published blog posts
router.get('/', async (req, res) => {
  try {
    const { dishId, published } = req.query;
    
    const where: any = {};
    if (dishId) {
      where.dishId = dishId as string;
    }
    if (published !== undefined) {
      where.published = published === 'true';
    } else {
      where.published = true;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Public: Get blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Only show published posts to public
    if (!post.published) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create blog post
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const data = createBlogPostSchema.parse(req.body);
    const post = await prisma.blogPost.create({
      data,
    });
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error });
    }
    console.error('Create blog post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update blog post
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const data = createBlogPostSchema.partial().parse(req.body);
    
    const post = await prisma.blogPost.update({
      where: { id },
      data,
    });
    res.json(post);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error });
    }
    console.error('Update blog post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete blog post
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    await prisma.blogPost.delete({
      where: { id },
    });
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
