// Script para restaurar datos de ejemplo
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleActivities = [
  {
    name: "Isla Saona - Tour Completo",
    slug: "isla-saona-tour-completo",
    description: "Disfruta de un día completo en la hermosa Isla Saona, una de las joyas del Caribe. Incluye transporte, almuerzo buffet, bebidas ilimitadas y actividades acuáticas.",
    shortDescription: "Tour completo a la Isla Saona con transporte y almuerzo incluido",
    price: 89.99,
    originalPrice: 120.00,
    duration: 480, // 8 horas en minutos
    location: "Isla Saona, Punta Cana",
    imageUrl: "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800",
    featured: true,
    active: true,
    capacity: 20,
    category: "tours-islas",
    rating: 4.8,
    reviews: 156,
    meetingPoint: "Lobby del hotel o punto específico acordado",
    pickupIncluded: true,
    minAge: 3,
    included: [
      "Transporte de ida y vuelta desde tu hotel",
      "Guía bilingüe profesional",
      "Almuerzo buffet en la playa",
      "Bebidas ilimitadas (agua, refrescos, cerveza)",
      "Snorkel y equipo de playa",
      "Seguro de viaje",
      "Impuestos incluidos"
    ],
    notIncluded: [
      "Propinas para el guía y personal",
      "Actividades adicionales opcionales",
      "Fotos profesionales (opcional)",
      "Gastos personales"
    ],
    requirements: [
      "Ropa cómoda y traje de baño",
      "Protector solar",
      "Cámara fotográfica",
      "Documentos de identificación",
      "Dinero para propinas"
    ],
    highlights: [
      "Playa de arena blanca y aguas cristalinas",
      "Snorkel en arrecifes de coral",
      "Almuerzo buffet en la playa",
      "Bebidas ilimitadas",
      "Fotos profesionales opcionales",
      "Experiencia única en el Caribe"
    ],
    tags: ["isla", "playa", "snorkel", "almuerzo", "bebidas"],
    images: [
      "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800",
      "https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800"
    ],
    languages: ["Español", "Inglés"],
    availability: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    startTime: ["7:00 AM", "8:00 AM"],
    itinerary: [
      {
        time: "7:00 AM",
        title: "Recogida en el hotel",
        description: "Recogida en el lobby de tu hotel y traslado al puerto"
      },
      {
        time: "8:30 AM",
        title: "Salida en catamarán",
        description: "Navegación hacia la Isla Saona con bebidas incluidas"
      },
      {
        time: "10:00 AM",
        title: "Llegada a Isla Saona",
        description: "Llegada a la playa y tiempo libre para disfrutar"
      },
      {
        time: "12:00 PM",
        title: "Almuerzo buffet",
        description: "Almuerzo buffet en la playa con bebidas ilimitadas"
      },
      {
        time: "2:00 PM",
        title: "Actividades acuáticas",
        description: "Snorkel y actividades en el agua"
      },
      {
        time: "4:00 PM",
        title: "Regreso",
        description: "Regreso al puerto y traslado a tu hotel"
      }
    ]
  },
  {
    name: "Buggies y Safari",
    slug: "buggies-y-safari",
    description: "Aventúrate en un emocionante tour en buggies por los senderos de Punta Cana. Visita una plantación de café, una cueva y disfruta de la naturaleza.",
    shortDescription: "Tour en buggies por senderos y plantaciones de Punta Cana",
    price: 65.00,
    originalPrice: 85.00,
    duration: 240, // 4 horas en minutos
    location: "Punta Cana, República Dominicana",
    imageUrl: "https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800",
    featured: true,
    active: true,
    capacity: 15,
    category: "aventura",
    rating: 4.6,
    reviews: 89,
    meetingPoint: "Punto de encuentro en el centro de aventuras",
    pickupIncluded: true,
    minAge: 8,
    included: [
      "Transporte de ida y vuelta",
      "Buggy para 2 personas",
      "Guía profesional",
      "Equipo de seguridad",
      "Refrigerio",
      "Seguro de viaje"
    ],
    notIncluded: [
      "Propinas",
      "Fotos profesionales",
      "Bebidas adicionales"
    ],
    requirements: [
      "Licencia de conducir válida",
      "Ropa cómoda que se pueda ensuciar",
      "Zapatos cerrados",
      "Gafas de sol",
      "Protector solar"
    ],
    highlights: [
      "Conducción de buggies por senderos",
      "Visita a plantación de café",
      "Exploración de cueva natural",
      "Vistas panorámicas",
      "Experiencia de aventura única"
    ],
    tags: ["buggies", "aventura", "senderos", "café", "cueva"],
    images: [
      "https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800",
      "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800"
    ],
    languages: ["Español", "Inglés"],
    availability: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    startTime: ["9:00 AM", "2:00 PM"],
    itinerary: [
      {
        time: "9:00 AM",
        title: "Llegada y registro",
        description: "Registro y orientación de seguridad"
      },
      {
        time: "9:30 AM",
        title: "Inicio del tour",
        description: "Salida en buggies por los senderos"
      },
      {
        time: "11:00 AM",
        title: "Visita a plantación",
        description: "Visita a plantación de café y cacao"
      },
      {
        time: "12:00 PM",
        title: "Refrigerio",
        description: "Descanso y refrigerio"
      },
      {
        time: "1:00 PM",
        title: "Exploración de cueva",
        description: "Visita a cueva natural"
      },
      {
        time: "2:00 PM",
        title: "Regreso",
        description: "Regreso al punto de partida"
      }
    ]
  }
];

async function restoreSampleData() {
  try {
    console.log('🔄 Restaurando datos de ejemplo...\n');
    
    // Limpiar datos existentes
    await prisma.activity.deleteMany();
    console.log('🗑️  Datos existentes eliminados\n');
    
    // Insertar actividades de ejemplo
    for (const activity of sampleActivities) {
      const createdActivity = await prisma.activity.create({
        data: activity
      });
      console.log(`✅ Actividad creada: ${createdActivity.name} (ID: ${createdActivity.id})`);
    }
    
    // Verificar datos insertados
    const count = await prisma.activity.count();
    console.log(`\n📊 Total de actividades en la base de datos: ${count}`);
    
    console.log('\n🎉 Restauración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error al restaurar datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreSampleData();
