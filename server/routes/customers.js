import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes', error: error.message });
  }
});

// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            activity: true
          }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
  }
});

// Crear un nuevo cliente
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Verificar si el cliente ya existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { email }
    });
    
    if (existingCustomer) {
      return res.status(400).json({ 
        message: 'Ya existe un cliente con este email',
        customer: existingCustomer
      });
    }
    
    const newCustomer = await prisma.customer.create({
      data: req.body
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el cliente', error: error.message });
  }
});

// Actualizar un cliente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: req.body
    });
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el cliente', error: error.message });
  }
});

// Eliminar un cliente
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el cliente tiene reservas
    const customerWithBookings = await prisma.customer.findUnique({
      where: { id },
      include: {
        bookings: true
      }
    });
    
    if (customerWithBookings?.bookings.length > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar el cliente porque tiene reservas asociadas'
      });
    }
    
    await prisma.customer.delete({
      where: { id }
    });
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el cliente', error: error.message });
  }
});

export default router;
