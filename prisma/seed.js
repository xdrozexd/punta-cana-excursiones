import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear actividades
  const activitiesData = [
    {
      name: 'Isla Saona Clásica',
      slug: 'isla-saona-clasica',
      description: 'Disfruta de un día completo en la paradisíaca Isla Saona, con sus playas de arena blanca y aguas cristalinas. Incluye transporte, almuerzo buffet y bebidas.',
      price: 89.99,
      duration: 480, // 8 horas
      location: 'Bayahibe',
      imageUrl: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
      featured: true,
      category: 'tour',
      capacity: 25
    },
    {
      name: 'Buggy Adventure',
      slug: 'buggy-adventure',
      description: 'Explora los alrededores de Punta Cana en un emocionante recorrido en buggy. Visita plantaciones locales y disfruta de hermosos paisajes.',
      price: 65.00,
      duration: 240, // 4 horas
      location: 'Punta Cana',
      imageUrl: 'https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg',
      featured: true,
      category: 'aventura',
      capacity: 12
    },
    {
      name: 'Catamarán Party',
      slug: 'catamaran-party',
      description: 'Navega por las aguas turquesas del Caribe en un catamarán con música, bebidas y snorkeling incluido.',
      price: 79.99,
      duration: 300, // 5 horas
      location: 'Punta Cana',
      imageUrl: 'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg',
      featured: true,
      category: 'fiesta',
      capacity: 30
    },
    {
      name: 'Safari Aventura',
      slug: 'safari-aventura',
      description: 'Descubre la auténtica República Dominicana en un safari por pueblos rurales, conoce la cultura local y disfruta de la naturaleza.',
      price: 55.00,
      duration: 360, // 6 horas
      location: 'Punta Cana',
      imageUrl: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg',
      featured: false,
      category: 'cultural',
      capacity: 16
    },
    {
      name: 'Snorkeling en Catalina',
      slug: 'snorkeling-catalina',
      description: 'Explora los arrecifes de coral en la Isla Catalina, hogar de una gran diversidad marina y aguas cristalinas perfectas para snorkeling.',
      price: 95.00,
      duration: 420, // 7 horas
      location: 'La Romana',
      imageUrl: 'https://images.pexels.com/photos/1645028/pexels-photo-1645028.jpeg',
      featured: true,
      category: 'acuático',
      capacity: 20
    }
  ];

  console.log('Creando actividades...');
  for (const activity of activitiesData) {
    await prisma.activity.upsert({
      where: { slug: activity.slug },
      update: activity,
      create: activity
    });
  }

  // Crear usuario administrador
  console.log('Creando usuario administrador...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: hashedPassword
    },
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    }
  });

  // Crear configuraciones iniciales
  console.log('Creando configuraciones iniciales...');
  const settingsData = [
    { key: 'site_name', value: 'Punta Cana Excursiones' },
    { key: 'contact_email', value: 'info@puntacanaexcursiones.com' },
    { key: 'contact_phone', value: '+1 809-555-1234' },
    { key: 'currency', value: 'USD' },
    { key: 'tax_rate', value: '18' }
  ];

  for (const setting of settingsData) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });
  }

  console.log('✅ Seed completado con éxito!');
}

main()
  .catch((e) => {
    console.error('Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
