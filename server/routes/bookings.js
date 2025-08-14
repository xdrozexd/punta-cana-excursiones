import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Obtener todas las reservas
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        activity: true,
        customer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas', error: error.message });
  }
});

// Iniciar una reserva (flujo Stripe) - crea Booking y Payment con clientSecret (stub)
router.post('/init', async (req, res) => {
  try {
    const {
      activityId,
      date,
      time,
      participants,
      currency = 'USD',
      customer,
      billingAddress, // opcional, no se guarda sensible aquí
      notes
    } = req.body || {};

    if (!activityId || !date || !time || !participants || !customer?.email) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const activity = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity) return res.status(404).json({ message: 'Actividad no encontrada' });

    // Buscar o crear customer por email
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

    // Precio total y depósito (50%)
    const totalPrice = Math.round(activity.price * participants);
    const deposit = Math.round(totalPrice / 2);

    // Combinar fecha y hora a ISO (UTC) con validación robusta
    const buildIsoDate = (d, t) => {
      if (!d || !t) return new Date('');
      const [y, m, day] = String(d).split('-').map(Number);
      const [hh, mm] = String(t).split(':').map(Number);
      if (!y || !m || !day || Number.isNaN(hh) || Number.isNaN(mm)) return new Date('');
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

    // Crear registro de Payment (Stripe) – aquí luego integraremos Stripe y su clientSecret real
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: deposit,
        currency,
        provider: 'stripe',
        status: 'requires_payment_method'
      }
    });

    // clientSecret simulado por ahora; cuando integremos Stripe, devolveremos el real
    const clientSecret = `test_client_secret_${payment.id}`;

    return res.status(200).json({ bookingId: booking.id, clientSecret });
  } catch (error) {
    console.error('Error en /bookings/init', error);
    return res.status(500).json({ message: 'Error al iniciar la reserva', error: error.message });
  }
});

// Obtener una reserva por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        activity: true,
        customer: true,
        payments: true,
        sensitive: true
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la reserva', error: error.message });
  }
});

// Crear una nueva reserva
router.post('/', async (req, res) => {
  try {
    const { activityId, customerData, date, participants, totalPrice } = req.body;
    
    // Verificar si el cliente ya existe o crear uno nuevo
    let customer;
    if (customerData.id) {
      customer = await prisma.customer.findUnique({
        where: { id: customerData.id }
      });
      
      if (!customer) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
    } else {
      // Buscar por email primero
      customer = await prisma.customer.findUnique({
        where: { email: customerData.email }
      });
      
      // Si no existe, crear nuevo cliente
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            country: customerData.country
          }
        });
      }
    }
    
    // Crear la reserva
    // Validar fecha recibida
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Fecha inválida para la reserva. Envíe un ISO 8601 válido o YYYY-MM-DDTHH:mm.' });
    }

    const newBooking = await prisma.booking.create({
      data: {
        activityId,
        customerId: customer.id,
        date: parsedDate,
        participants,
        totalPrice,
        status: 'pending'
      },
      include: {
        activity: true,
        customer: true
      }
    });
    
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la reserva', error: error.message });
  }
});

// Actualizar una reserva
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: req.body,
      include: {
        activity: true,
        customer: true
      }
    });
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la reserva', error: error.message });
  }
});

// Eliminar una reserva
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({
      where: { id }
    });
    res.json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar la reserva', error: error.message });
  }
});

export default router;
