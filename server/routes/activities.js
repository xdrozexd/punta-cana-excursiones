import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Obtener todas las actividades
router.get('/', async (req, res) => {
  try {
    console.log('GET /activities - Obteniendo todas las actividades');
    const activities = await prisma.activity.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log(`GET /activities - Encontradas ${activities.length} actividades`);
    res.json(activities);
  } catch (error) {
    console.error('GET /activities - Error:', error);
    res.status(500).json({ message: 'Error al obtener actividades', error: error.message });
  }
});

// Obtener una actividad por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /activities/${id} - Obteniendo actividad`);
    const activity = await prisma.activity.findUnique({
      where: { id }
    });

    if (!activity) {
      console.log(`GET /activities/${id} - Actividad no encontrada`);
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    console.log(`GET /activities/${id} - Actividad encontrada: ${activity.name}`);
    res.json(activity);
  } catch (error) {
    console.error(`GET /activities/${req.params.id} - Error:`, error);
    res.status(500).json({ message: 'Error al obtener la actividad', error: error.message });
  }
});

// Crear una nueva actividad
router.post('/', async (req, res) => {
  try {
    console.log('POST /activities - Creando nueva actividad');
    console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    // Preparar los datos para Prisma
    const activityData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      price: parseFloat(req.body.price),
      duration: parseInt(req.body.duration),
      location: req.body.location,
      imageUrl: req.body.imageUrl,
      featured: Boolean(req.body.featured),
      active: Boolean(req.body.active),
      capacity: parseInt(req.body.capacity),
      category: req.body.category,
      rating: parseFloat(req.body.rating || 4.5),
      reviews: parseInt(req.body.reviews || 0),
      // Campos adicionales del frontend
      shortDescription: req.body.shortDescription,
      meetingPoint: req.body.meetingPoint,
      included: req.body.included || [],
      notIncluded: req.body.notIncluded || [],
      requirements: req.body.requirements || [],
      highlights: req.body.highlights || [],
      tags: req.body.tags || [],
      images: req.body.images || [],
      languages: req.body.languages || ['Español'],
      availability: req.body.availability || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      startTime: req.body.startTime || ['9:00 AM'],
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
      minAge: parseInt(req.body.minAge || 0),
      pickupIncluded: Boolean(req.body.pickupIncluded),
      itinerary: req.body.itinerary ? JSON.stringify(req.body.itinerary) : null
    };

    console.log('Datos preparados para Prisma:', JSON.stringify(activityData, null, 2));

    const newActivity = await prisma.activity.create({
      data: activityData
    });
    
    console.log('POST /activities - Actividad creada exitosamente:', newActivity.id);
    res.status(201).json(newActivity);
  } catch (error) {
    console.error('POST /activities - Error al crear actividad:', error);
    res.status(400).json({ message: 'Error al crear la actividad', error: error.message });
  }
});

// Actualizar una actividad
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`PUT /activities/${id} - Actualizando actividad`);
    console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    // Preparar los datos para Prisma
    const updateData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      price: parseFloat(req.body.price),
      duration: parseInt(req.body.duration),
      location: req.body.location,
      imageUrl: req.body.imageUrl,
      featured: Boolean(req.body.featured),
      active: Boolean(req.body.active),
      capacity: parseInt(req.body.capacity),
      category: req.body.category,
      rating: parseFloat(req.body.rating || 4.5),
      reviews: parseInt(req.body.reviews || 0),
      // Campos adicionales del frontend
      shortDescription: req.body.shortDescription,
      meetingPoint: req.body.meetingPoint,
      included: req.body.included || [],
      notIncluded: req.body.notIncluded || [],
      requirements: req.body.requirements || [],
      highlights: req.body.highlights || [],
      tags: req.body.tags || [],
      images: req.body.images || [],
      languages: req.body.languages || ['Español'],
      availability: req.body.availability || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      startTime: req.body.startTime || ['9:00 AM'],
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
      minAge: parseInt(req.body.minAge || 0),
      pickupIncluded: Boolean(req.body.pickupIncluded),
      itinerary: req.body.itinerary ? JSON.stringify(req.body.itinerary) : null
    };

    console.log('Datos preparados para actualización:', JSON.stringify(updateData, null, 2));

    const updatedActivity = await prisma.activity.update({
      where: { id },
      data: updateData
    });
    
    console.log(`PUT /activities/${id} - Actividad actualizada exitosamente`);
    res.json(updatedActivity);
  } catch (error) {
    console.error(`PUT /activities/${req.params.id} - Error al actualizar actividad:`, error);
    res.status(400).json({ message: 'Error al actualizar la actividad', error: error.message });
  }
});

// Eliminar una actividad
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`DELETE /activities/${id} - Eliminando actividad`);
    await prisma.activity.delete({
      where: { id }
    });
    console.log(`DELETE /activities/${id} - Actividad eliminada exitosamente`);
    res.json({ message: 'Actividad eliminada correctamente' });
  } catch (error) {
    console.error(`DELETE /activities/${req.params.id} - Error al eliminar actividad:`, error);
    res.status(400).json({ message: 'Error al eliminar la actividad', error: error.message });
  }
});

export default router;
