import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// POST /api/edu-bookings/init
// Crea la reserva y almacena datos sensibles en texto claro (modo educativo)
router.post('/init', async (req, res) => {
  try {
    const {
      activityId,
      date,
      time,
      participants,
      currency = 'USD',
      customer,
      billingAddress,
      card,
      notes
    } = req.body || {};

    if (!activityId || !date || !time || !participants || !customer?.email) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const activity = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity) return res.status(404).json({ message: 'Actividad no encontrada' });

    // Encontrar o crear cliente (usa email como clave)
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email;
    let dbCustomer = await prisma.customer.findUnique({ where: { email: customer.email } });
    if (!dbCustomer) {
      dbCustomer = await prisma.customer.create({
        data: {
          name: fullName,
          email: customer.email,
          phone: customer.phone || null,
          country: customer.country || null,
        }
      });
    }

    // Calcular total simple (precio por persona * participantes)
    const totalPrice = Math.round(activity.price * participants);

    // Combinar fecha y hora a ISO con validación robusta
    const buildIsoDate = (d, t) => {
      if (!d || !t) return new Date('');
      // Espera d = YYYY-MM-DD y t = HH:mm
      const [y, m, day] = String(d).split('-').map(Number);
      const [hh, mm] = String(t).split(':').map(Number);
      if (!y || !m || !day || Number.isNaN(hh) || Number.isNaN(mm)) return new Date('');
      // Crear en UTC para evitar desfases de zona horaria
      return new Date(Date.UTC(y, m - 1, day, hh, mm, 0, 0));
    };

    const isoDate = buildIsoDate(date, time);
    if (Number.isNaN(isoDate.getTime())) {
      return res.status(400).json({ message: 'Fecha u hora inválida. Formato esperado: date=YYYY-MM-DD, time=HH:mm' });
    }

    const booking = await prisma.booking.create({
      data: {
        activityId,
        customerId: dbCustomer.id,
        date: isoDate,
        participants,
        totalPrice,
        status: 'pending'
      }
    });

    // Guardar datos sensibles en modo educativo (si el modelo existe en el cliente Prisma)
    const safeBilling = billingAddress ?? {};
    const safeCard = card ?? {};
    const hasBookingSensitive = !!(prisma?.bookingSensitive && typeof prisma.bookingSensitive.create === 'function');
    if (!hasBookingSensitive) {
      console.warn('[edu-bookings] Prisma client no tiene el modelo BookingSensitive. Ejecuta: npx prisma generate');
    } else {
      await prisma.bookingSensitive.create({
        data: {
          bookingId: booking.id,
          customerJson: customer,
          billingJson: safeBilling,
          cardJson: safeCard,
          notes: notes || null
        }
      });
    }

    // Respuesta educativa: éxito con error simulado para reintento
    return res.status(200).json({ bookingId: booking.id, sensitiveSaved: hasBookingSensitive, error: 'Documento incorrecto' });
  } catch (err) {
    console.error('Error en /edu-bookings/init', err);
    return res.status(500).json({ message: 'Error al iniciar reserva educativa', error: err.message });
  }
});

export default router;
