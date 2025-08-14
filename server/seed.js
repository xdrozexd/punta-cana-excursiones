import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear actividades
  const activitiesData = [
    // ——— Isla Saona ———
    {
      name: 'Isla Saona Clásica',
      slug: 'isla-saona-clasica',
      description: 'Día completo en Isla Saona saliendo de Bayahibe. Traslado terrestre, lancha rápida, parada en piscina natural, tiempo libre en playa, almuerzo buffet y bebidas locales.',
      shortDescription: 'Saona clásico con piscina natural, almuerzo y bebidas.',
      price: 89.0,
      originalPrice: 99.0,
      duration: 480,
      location: 'Bayahibe',
      imageUrl: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
      featured: true,
      category: 'tour',
      capacity: 30,
      highlights: ['Piscina natural', 'Almuerzo buffet', 'Bebidas locales', 'Playas vírgenes'],
      included: ['Traslado terrestre', 'Lancha rápida', 'Guía', 'Almuerzo buffet', 'Bebidas locales'],
      notIncluded: ['Fotos', 'Propinas'],
      tags: ['saona', 'playa', 'caribe'],
      images: [
        'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg'
      ],
      languages: ['Español', 'Inglés'],
      availability: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      startTime: ['7:00 AM', '9:00 AM'],
      pickupIncluded: true,
      meetingPoint: 'Hoteles en Bávaro/Punta Cana o punto en Bayahibe',
      itinerary: [{ step: 'Recogida y traslado a Bayahibe' }, { step: 'Lancha a piscina natural' }, { step: 'Tiempo en Isla Saona' }, { step: 'Almuerzo buffet' }]
    },
    {
      name: 'Isla Saona Premium',
      slug: 'isla-saona-premium',
      description: 'Versión premium con playa exclusiva, bar premium, almuerzo mejorado y grupos más pequeños para mayor comodidad.',
      shortDescription: 'Saona con servicio premium y playa exclusiva.',
      price: 120.0,
      originalPrice: 135.0,
      duration: 480,
      location: 'Bayahibe',
      imageUrl: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg',
      featured: true,
      category: 'tour',
      capacity: 20,
      highlights: ['Playa exclusiva', 'Bar premium', 'Grupo reducido'],
      included: ['Traslados', 'Barco rápido o catamarán', 'Bar premium', 'Almuerzo premium'],
      notIncluded: ['Fotos', 'Propinas'],
      tags: ['saona', 'premium'],
      images: ['https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg'],
      languages: ['Español', 'Inglés'],
      availability: ['Lunes', 'Miércoles', 'Viernes', 'Sábado'],
      startTime: ['7:00 AM'],
      pickupIncluded: true,
      meetingPoint: 'Lobby del hotel',
      itinerary: [{ step: 'Check-in en Bayahibe' }, { step: 'Catamarán/lancha a Saona' }, { step: 'Club de playa premium' }]
    },
    {
      name: 'Isla Saona en Catamarán',
      slug: 'isla-saona-catamaran',
      description: 'Experiencia en catamarán hacia/desde Isla Saona con música y ambiente festivo, snorkeling opcional y parada en piscina natural.',
      shortDescription: 'Saona navegando en catamarán.',
      price: 105.0,
      duration: 540,
      location: 'Bayahibe',
      imageUrl: 'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg',
      featured: false,
      category: 'tour',
      capacity: 40,
      highlights: ['Catamarán', 'Piscina natural', 'Snorkel opcional'],
      included: ['Traslados', 'Catamarán/lancha', 'Bebidas', 'Almuerzo'],
      notIncluded: ['Fotos', 'Propinas'],
      tags: ['saona', 'catamaran'],
      images: ['https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg']
    },

    // ——— Isla Catalina ———
    {
      name: 'Isla Catalina Snorkel',
      slug: 'isla-catalina-snorkel',
      description: 'Salida en barco a Isla Catalina con 2 paradas de snorkel (muro y arrecife), almuerzo en playa y bebidas.',
      shortDescription: 'Snorkel en Isla Catalina con almuerzo.',
      price: 95.0,
      duration: 420,
      location: 'La Romana',
      imageUrl: 'https://images.pexels.com/photos/1645028/pexels-photo-1645028.jpeg',
      featured: true,
      category: 'acuático',
      capacity: 25,
      highlights: ['2 spots de snorkel', 'Agua cristalina', 'Almuerzo en playa'],
      included: ['Equipo snorkel', 'Guía', 'Barco', 'Almuerzo', 'Bebidas'],
      notIncluded: ['Fotos', 'Propinas']
    },
    {
      name: 'Isla Catalina Buceo (2 tanques)',
      slug: 'isla-catalina-buceo',
      description: 'Para buzos certificados: 2 inmersiones (muro y arrecife) con divemaster, almuerzo y bebidas. Opcional equipo.',
      shortDescription: 'Doble inmersión en Catalina.',
      price: 160.0,
      duration: 420,
      location: 'La Romana',
      imageUrl: 'https://images.pexels.com/photos/1893532/pexels-photo-1893532.jpeg',
      featured: false,
      category: 'acuático',
      capacity: 12,
      highlights: ['Muro de Catalina', 'Arrecife', 'Divemaster'],
      included: ['Barco', 'Divemaster', 'Tanques y plomos', 'Almuerzo', 'Bebidas'],
      notIncluded: ['Equipo completo (opcional)']
    },
    {
      name: 'Isla Catalina Paseo',
      slug: 'isla-catalina-paseo',
      description: 'Día de playa en Isla Catalina con traslado en barco, tiempo libre, almuerzo y barra de bebidas.',
      shortDescription: 'Relajación en Catalina con almuerzo.',
      price: 110.0,
      duration: 420,
      location: 'La Romana',
      imageUrl: 'https://images.pexels.com/photos/2613941/pexels-photo-2613941.jpeg',
      featured: false,
      category: 'tour',
      capacity: 30
    },

    // ——— Combinados y eco ———
    {
      name: 'Costa Esmeralda + Montaña Redonda + Quad El Limón',
      slug: 'costa-esmeralda-montana-redonda-quad-el-limon',
      description: 'Ruta panorámica por Costa Esmeralda, subida a Montaña Redonda con columpios y vistas 360°, y recorrido en quad por El Limón.',
      shortDescription: 'Playa, mirador y aventura en quad.',
      price: 139.0,
      duration: 540,
      location: 'Miches / El Limón',
      imageUrl: 'https://images.pexels.com/photos/461593/pexels-photo-461593.jpeg',
      featured: true,
      category: 'aventura',
      capacity: 16,
      highlights: ['Montaña Redonda', 'Costa Esmeralda', 'Quad'],
      included: ['Transporte', 'Entradas', 'Guía', 'Equipo quad compartido', 'Almuerzo'],
      notIncluded: ['Fotos', 'Propinas']
    },
    {
      name: 'Parque Nacional Los Haitises + Montaña Redonda',
      slug: 'los-haitises-montana-redonda',
      description: 'Explora manglares y cuevas de Los Haitises en lancha, observa aves y pinturas rupestres; continúa hacia Montaña Redonda para vistas increíbles.',
      shortDescription: 'Haitises en lancha + mirador.',
      price: 145.0,
      duration: 600,
      location: 'Samaná / Miches',
      imageUrl: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
      featured: true,
      category: 'eco',
      capacity: 20
    },
    {
      name: 'Excursión a Santo Domingo Colonial',
      slug: 'santo-domingo-colonial',
      description: 'City tour guiado por la Zona Colonial: Catedral Primada, Alcázar de Colón, Parque Colón, cuevas de Los Tres Ojos y tiempo para compras.',
      shortDescription: 'Historia y cultura en la primera ciudad de América.',
      price: 70.0,
      duration: 600,
      location: 'Santo Domingo',
      imageUrl: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
      featured: false,
      category: 'cultural',
      capacity: 40
    },
    {
      name: 'Samaná Explorer Terrestre',
      slug: 'samana-explorer-terrestre',
      description: 'Recorrido terrestre por Samaná con visita al Salto El Limón (caminata/caballo) y tiempo en playa El Valle o Rincón según temporada.',
      shortDescription: 'Aventura terrestre por Samaná y El Limón.',
      price: 135.0,
      duration: 720,
      location: 'Samaná',
      imageUrl: 'https://images.pexels.com/photos/158773/forest-trees-fog-nature-158773.jpeg',
      featured: false,
      category: 'aventura',
      capacity: 20
    },
    {
      name: 'Río Chavón + Isla Saona Combinada',
      slug: 'rio-chavon-saona-combinada',
      description: 'Paseo panorámico por Río Chavón en barcaza con vistas de selva y cañón, seguido por experiencia de Isla Saona con almuerzo.',
      shortDescription: 'Río Chavón + Saona en un día.',
      price: 129.0,
      duration: 600,
      location: 'La Romana / Bayahibe',
      imageUrl: 'https://images.pexels.com/photos/478938/pexels-photo-478938.jpeg',
      featured: false,
      category: 'tour',
      capacity: 30
    },

    // ——— Aventura y adrenalina ———
    {
      name: 'Tour en Buggy por Macao',
      slug: 'buggy-macao',
      description: 'Conduce buggy por caminos rurales hasta la playa de Macao. Paradas en cenote y rancho local. Opción de buggy doble.',
      shortDescription: 'Aventura off-road hasta Macao.',
      price: 60.0,
      duration: 240,
      location: 'Macao / Punta Cana',
      imageUrl: 'https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg',
      featured: true,
      category: 'aventura',
      capacity: 20
    },
    {
      name: 'Buggy Nocturno con Cena y Danza Taína',
      slug: 'buggy-nocturno-cena-taina',
      description: 'Recorrido nocturno en buggy seguido de cena temática y espectáculo de danza taína.',
      shortDescription: 'Buggy nocturno + cena show.',
      price: 85.0,
      duration: 240,
      location: 'Bávaro',
      imageUrl: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg',
      featured: false,
      category: 'aventura',
      capacity: 20
    },
    {
      name: 'ATV por Senderos y Playas',
      slug: 'atv-senderos-playas',
      description: 'Ruta en cuatrimoto por senderos y tramos de playa. Ideal para amantes de la adrenalina.',
      shortDescription: 'ATV off-road costero.',
      price: 75.0,
      duration: 180,
      location: 'Punta Cana',
      imageUrl: 'https://images.pexels.com/photos/3593926/pexels-photo-3593926.jpeg',
      featured: false,
      category: 'aventura',
      capacity: 16
    },
    {
      name: 'Canopy Zip Lines Bávaro',
      slug: 'canopy-zip-lines-bavaro',
      description: 'Circuito de tirolesas entre plataformas con equipos de seguridad certificados y guías expertos.',
      shortDescription: 'Tirolesas en la selva de Bávaro.',
      price: 70.0,
      duration: 180,
      location: 'Bávaro',
      imageUrl: 'https://images.pexels.com/photos/1660995/pexels-photo-1660995.jpeg',
      featured: false,
      category: 'aventura',
      capacity: 18
    },
    {
      name: 'Parasailing en Bávaro',
      slug: 'parasailing-bavaro',
      description: 'Vuelo en parasailing sobre la costa de Bávaro con vistas del arrecife y las playas.',
      shortDescription: 'Parasailing con vistas al Caribe.',
      price: 55.0,
      duration: 60,
      location: 'Bávaro',
      imageUrl: 'https://images.pexels.com/photos/462331/pexels-photo-462331.jpeg',
      featured: false,
      category: 'acuático',
      capacity: 10
    },
    {
      name: 'Bavaro Adventure Park (Combo)',
      slug: 'bavaro-adventure-park-combo',
      description: 'Combo de actividades como paintball, tirolesa y escalada en Bavaro Adventure Park. Incluye equipo y supervisión.',
      shortDescription: 'Parque de aventura multi-actividad.',
      price: 89.0,
      duration: 300,
      location: 'Bávaro',
      imageUrl: 'https://images.pexels.com/photos/48824/people-fall-hiking-adventure-48824.jpeg',
      featured: false,
      category: 'aventura',
      capacity: 20
    },
    {
      name: 'Monkeyland + Safari Cacao & Café',
      slug: 'monkeyland-safari-cacao-cafe',
      description: 'Interacción con monos ardilla en un entorno controlado y visita educativa a plantaciones de cacao y café.',
      shortDescription: 'Monos + cultura del cacao y café.',
      price: 79.0,
      duration: 300,
      location: 'Anamuya / Bávaro',
      imageUrl: 'https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg',
      featured: true,
      category: 'eco',
      capacity: 20
    },

    // ——— Acuáticas y marinas ———
    {
      name: 'Party Boat en Catamarán',
      slug: 'party-boat-catamaran',
      description: 'Fiesta en catamarán con barra libre, música, animación y parada para snorkel y piscina natural.',
      shortDescription: 'Catamarán con música y drinks.',
      price: 65.0,
      duration: 180,
      location: 'Punta Cana',
      imageUrl: 'https://images.pexels.com/photos/3781517/pexels-photo-3781517.jpeg',
      featured: true,
      category: 'fiesta',
      capacity: 45
    },
    {
      name: 'Barco Pirata Bávaro',
      slug: 'barco-pirata-bavaro',
      description: 'Espectáculo temático pirata con actividades a bordo, snorkeling y animación para toda la familia.',
      shortDescription: 'Show pirata + snorkel.',
      price: 75.0,
      duration: 180,
      location: 'Bávaro',
      imageUrl: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
      featured: false,
      category: 'familiar',
      capacity: 60
    },
    {
      name: 'Pesca de Altura en Punta Cana',
      slug: 'pesca-altura-punta-cana',
      description: 'Salida en yate para pesca de altura (mahi-mahi, wahoo, atún) con equipo completo y capitán.',
      shortDescription: 'Charter de pesca deportiva.',
      price: 120.0,
      duration: 240,
      location: 'Punta Cana',
      imageUrl: 'https://images.pexels.com/photos/38153/fisherman-fishing-man-rod-38153.jpeg',
      featured: false,
      category: 'acuático',
      capacity: 6
    },
    {
      name: 'Seaquarium (Paseo Submarino)',
      slug: 'seaquarium-paseo-submarino',
      description: 'Caminata submarina con casco Sea Trek en plataforma, snorkeling y paseo en catamarán.',
      shortDescription: 'Caminata submarina segura.',
      price: 110.0,
      duration: 180,
      location: 'Bávaro',
      imageUrl: 'https://images.pexels.com/photos/256319/pexels-photo-256319.jpeg',
      featured: false,
      category: 'acuático',
      capacity: 20
    },
    {
      name: 'Ocean Spa Dr Fish',
      slug: 'ocean-spa-dr-fish',
      description: 'Experiencia de relajación en catamarán con masajes, estiramientos, jacuzzi marino y terapia Dr. Fish.',
      shortDescription: 'Spa flotante en el Caribe.',
      price: 135.0,
      duration: 180,
      location: 'Bávaro',
      imageUrl: 'https://images.pexels.com/photos/161780/relax-relaxing-bench-rest-161780.jpeg',
      featured: true,
      category: 'relax',
      capacity: 30
    },
    {
      name: 'Nado con Delfines (Intermedio)',
      slug: 'nado-delfines-intermedio',
      description: 'Interacción con delfines que incluye beso, abrazo, saludo y empuje dorsal o belly ride según programa.',
      shortDescription: 'Programa intermedio con delfines.',
      price: 139.0,
      duration: 60,
      location: 'Bávaro',
      imageUrl: 'https://images.pexels.com/photos/870170/pexels-photo-870170.jpeg',
      featured: true,
      category: 'familiar',
      capacity: 12,
      minAge: 6
    },

    // ——— Vida nocturna y experiencias ———
    {
      name: 'Coco Bongo (Entrada Estándar)',
      slug: 'coco-bongo-estandar',
      description: 'Entrada a Coco Bongo con shows en vivo, música y barra libre nacional. Traslados opcionales.',
      shortDescription: 'Noche de shows y fiesta.',
      price: 85.0,
      duration: 300,
      location: 'Bávaro',
      imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
      featured: true,
      category: 'nocturno',
      capacity: 200
    },
    {
      name: 'Cena Temática con Danza Taína',
      slug: 'cena-tematica-danza-taina',
      description: 'Cena temática al aire libre acompañada de espectáculo cultural taíno con música y danzas tradicionales.',
      shortDescription: 'Cultura y gastronomía caribeña.',
      price: 69.0,
      duration: 150,
      location: 'Bávaro / Cabeza de Toro',
      imageUrl: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
      featured: false,
      category: 'cultural',
      capacity: 80
    },
    {
      name: 'Evento Privado en Catamarán',
      slug: 'evento-privado-catamaran',
      description: 'Charter privado de catamarán para eventos, con barra libre, música y paradas para snorkel o piscina natural.',
      shortDescription: 'Catamarán privado a tu medida.',
      price: 650.0,
      duration: 180,
      location: 'Punta Cana',
      imageUrl: 'https://images.pexels.com/photos/3781520/pexels-photo-3781520.jpeg',
      featured: true,
      category: 'privado',
      capacity: 40
    },
    {
      name: 'Evento Privado en Playa',
      slug: 'evento-privado-playa',
      description: 'Montaje privado en playa para celebraciones o eventos corporativos con catering y música.',
      shortDescription: 'Evento en playa personalizado.',
      price: 900.0,
      duration: 240,
      location: 'Playa de Punta Cana',
      imageUrl: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
      featured: false,
      category: 'privado',
      capacity: 80
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
