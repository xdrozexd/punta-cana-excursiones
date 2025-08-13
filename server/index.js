import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import activitiesRoutes from './routes/activities.js';
import bookingsRoutes from './routes/bookings.js';
import customersRoutes from './routes/customers.js';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import blogPostsRoutes from './routes/blog-posts.js';

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

// Configurar Prisma para usar PostgreSQL
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:roselito1234@localhost:5432/punta_cana_excursiones"
    }
  }
});

// Middleware
const corsOptions = {
  // Accept single or comma-separated list of origins via env
  origin: ALLOWED_ORIGIN === '*' ? true : ALLOWED_ORIGIN.split(',').map(o => o.trim()),
  credentials: true
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

// Rutas
app.use('/api/activities', activitiesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/blog-posts', blogPostsRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Punta Cana Excursiones funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

// Cerrar Prisma al terminar
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
