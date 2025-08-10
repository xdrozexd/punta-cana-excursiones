import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Obtener todas las actividades
router.get('/', async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener actividades', error: error.message });
  }
});

// Obtener una actividad por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await prisma.activity.findUnique({
      where: { id }
    });

    if (!activity) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la actividad', error: error.message });
  }
});

// Crear una nueva actividad
router.post('/', async (req, res) => {
  try {
    const newActivity = await prisma.activity.create({
      data: req.body
    });
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la actividad', error: error.message });
  }
});

// Actualizar una actividad
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedActivity = await prisma.activity.update({
      where: { id },
      data: req.body
    });
    res.json(updatedActivity);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la actividad', error: error.message });
  }
});

// Eliminar una actividad
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.activity.delete({
      where: { id }
    });
    res.json({ message: 'Actividad eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar la actividad', error: error.message });
  }
});

export default router;
