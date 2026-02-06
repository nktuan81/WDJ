import { z } from 'zod';

// Reservation schemas
export const createReservationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(1, 'Phone is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  guests: z.number().int().min(1).max(20),
  notes: z.string().optional(),
});

export const updateReservationSchema = createReservationSchema.partial().extend({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
});

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Menu item schemas
export const createMenuItemSchema = z.object({
  name_de: z.string().min(1),
  name_en: z.string().min(1),
  name_cn: z.string().min(1),
  description_de: z.string().min(1),
  description_en: z.string().min(1),
  description_cn: z.string().min(1),
  price: z.number().positive(),
  element: z.enum(['metal', 'wood', 'water', 'fire', 'earth']),
  category: z.enum(['protein', 'vegetable', 'starch', 'soup']),
  image: z.string().url().optional().or(z.literal('')),
  story_de: z.string().optional(),
  story_en: z.string().optional(),
  story_cn: z.string().optional(),
  available: z.boolean().optional(),
});

// Discount code schemas
export const createDiscountCodeSchema = z.object({
  code: z.string().min(1),
  discountPercent: z.number().int().min(1).max(100),
  dishId: z.string().optional(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  maxUses: z.number().int().positive().optional(),
  active: z.boolean().optional(),
});

// Blog post schemas
export const createBlogPostSchema = z.object({
  title_de: z.string().min(1),
  title_en: z.string().min(1),
  title_cn: z.string().min(1),
  content_de: z.string().min(1),
  content_en: z.string().min(1),
  content_cn: z.string().min(1),
  dishId: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  published: z.boolean().optional(),
});
