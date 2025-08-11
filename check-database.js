// Script para verificar el estado de la base de datos
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Verificando estado de la base de datos...\n');
    
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa\n');
    
    // Contar actividades
    const activityCount = await prisma.activity.count();
    console.log(`📊 Total de actividades en la base de datos: ${activityCount}\n`);
    
    if (activityCount > 0) {
      // Mostrar las últimas 5 actividades
      const recentActivities = await prisma.activity.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          active: true
        }
      });
      
      console.log('📋 Últimas actividades:');
      recentActivities.forEach((activity, index) => {
        console.log(`${index + 1}. ID: ${activity.id}`);
        console.log(`   Nombre: ${activity.name}`);
        console.log(`   Creada: ${activity.createdAt}`);
        console.log(`   Actualizada: ${activity.updatedAt}`);
        console.log(`   Activa: ${activity.active}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No hay actividades en la base de datos\n');
    }
    
    // Verificar estructura de la tabla
    console.log('🔧 Verificando estructura de la tabla Activity...');
    const sampleActivity = await prisma.activity.findFirst();
    
    if (sampleActivity) {
      console.log('✅ Tabla Activity existe y tiene datos');
      console.log('📋 Campos disponibles:', Object.keys(sampleActivity));
    } else {
      console.log('⚠️  Tabla Activity existe pero está vacía');
    }
    
  } catch (error) {
    console.error('❌ Error al verificar la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
