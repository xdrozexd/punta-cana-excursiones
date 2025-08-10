import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Obtener todas las configuraciones
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    
    // Convertir a objeto clave-valor para facilitar su uso en el frontend
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    res.json(settingsObject);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener configuraciones', error: error.message });
  }
});

// Obtener una configuración por clave
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await prisma.setting.findUnique({
      where: { key }
    });

    if (!setting) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }

    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la configuración', error: error.message });
  }
});

// Crear o actualizar una configuración
router.post('/', async (req, res) => {
  try {
    const { key, value } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({ message: 'Se requieren clave y valor' });
    }
    
    // Buscar si ya existe
    const existingSetting = await prisma.setting.findUnique({
      where: { key }
    });
    
    let setting;
    
    if (existingSetting) {
      // Actualizar
      setting = await prisma.setting.update({
        where: { key },
        data: { value }
      });
    } else {
      // Crear nuevo
      setting = await prisma.setting.create({
        data: { key, value }
      });
    }
    
    res.json(setting);
  } catch (error) {
    res.status(400).json({ message: 'Error al guardar la configuración', error: error.message });
  }
});

// Eliminar una configuración
router.delete('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    await prisma.setting.delete({
      where: { key }
    });
    res.json({ message: 'Configuración eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar la configuración', error: error.message });
  }
});

export default router;
