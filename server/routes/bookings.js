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

// Obtener una reserva por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        activity: true,
        customer: true
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
    const newBooking = await prisma.booking.create({
      data: {
        activityId,
        customerId: customer.id,
        date: new Date(date),
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
