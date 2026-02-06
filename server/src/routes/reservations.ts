import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { createReservationSchema, updateReservationSchema } from '../utils/validation.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { sendReservationConfirmationEmail } from '../utils/email.js';

const router = Router();
const prisma = new PrismaClient();

function sanitizeReservationData(data: Record<string, unknown>): Record<string, unknown> {
  const out = { ...data };
  if (out.email === '') {
    delete out.email;
  }
  return out;
}

// Public: Create reservation
router.post('/', async (req, res) => {
  try {
    const parsed = createReservationSchema.parse(req.body);
    const data = sanitizeReservationData(parsed as Record<string, unknown>) as Parameters<typeof prisma.reservation.create>[0]['data'];
    const reservation = await prisma.reservation.create({
      data,
    });
    res.status(201).json(reservation);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error });
    }
    console.error('Create reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get all reservations
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status, date } = req.query;
    
    const where: any = {};
    if (status) {
      where.status = status as string;
    }
    if (date) {
      where.date = date as string;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(reservations);
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update reservation (sends confirmation email when status -> confirmed and reservation has email)
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const parsed = updateReservationSchema.parse(req.body);
    const data = sanitizeReservationData(parsed as Record<string, unknown>) as Parameters<typeof prisma.reservation.update>[0]['data'];
    const previous = await prisma.reservation.findUnique({ where: { id } });
    const reservation = await prisma.reservation.update({
      where: { id },
      data,
    });
    const newStatus = reservation.status;
    const becameConfirmed = newStatus === 'confirmed' && previous?.status !== 'confirmed';
    if (becameConfirmed && reservation.email) {
      sendReservationConfirmationEmail(reservation.email, reservation).catch((err) => {
        console.error('[Email] Failed to send confirmation to', reservation.email, err);
      });
    }
    res.json(reservation);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error });
    }
    console.error('Update reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete reservation
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    await prisma.reservation.delete({
      where: { id },
    });
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
