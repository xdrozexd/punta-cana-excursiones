import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Award, 
  MapPin, 
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui';
import { TourCard } from '../components/ui/TourCard';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

// Datos de ejemplo para tours destacados
const featuredTours = [
  {
    id: '1',
    title: 'Isla Saona - Tour Completo',
    description: 'Descubre la paradisíaca Isla Saona con sus playas de arena blanca y aguas cristalinas. Incluye transporte, almuerzo buffet y bebidas.',
    price: 89,
    duration: '8 horas',
    rating: 4.9,
    reviewCount: 128,
    maxPeople: 20,
    location: 'Isla Saona',
    category: 'tours-islas' as const,
    imageUrl: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    images: ['https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'],
    included: ['Transporte', 'Almuerzo buffet', 'Bebidas'],
    featured: true,
    tags: ['Destacado', 'Playa'],
  },
  {
    id: '2',
    title: 'Hoyo Azul y Scape Park',
    description: 'Aventura en el parque ecológico Scape Park con acceso al impresionante cenote Hoyo Azul. Incluye tirolinas y actividades de aventura.',
    price: 125,
    duration: '6 horas',
    rating: 4.8,
    reviewCount: 96,
    maxPeople: 15,
    location: 'Cap Cana',
    category: 'aventura' as const,
    imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    images: ['https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'],
    included: ['Entrada al parque', 'Tirolinas', 'Guía'],
    featured: true,
    tags: ['Aventura'],
  },
  {
    id: '3',
    title: 'Catamarán Party',
    description: 'Disfruta de un día en alta mar con música, bebidas ilimitadas y snorkeling en los arrecifes más hermosos de Punta Cana.',
    price: 95,
    duration: '5 horas',
    rating: 4.7,
    reviewCount: 112,
    maxPeople: 25,
    location: 'Playa Bávaro',
    category: 'acuaticos' as const,
    imageUrl: 'https://images.pexels.com/photos/1430672/pexels-photo-1430672.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    images: ['https://images.pexels.com/photos/1430672/pexels-photo-1430672.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'],
    included: ['Bebidas ilimitadas', 'Snorkeling', 'Música'],
    featured: true,
    tags: ['Fiesta', 'Acuático'],
  },
  {
    id: '4',
    title: 'Safari Aventura',
    description: 'Explora la auténtica República Dominicana visitando plantaciones, escuelas rurales y conociendo la cultura local.',
    price: 79,
    duration: '7 horas',
    rating: 4.6,
    reviewCount: 85,
    maxPeople: 12,
    location: 'Interior de la isla',
    category: 'cultural' as const,
    imageUrl: 'https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    images: ['https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'],
    included: ['Transporte 4x4', 'Guía local', 'Visita escuela'],
    featured: true,
    tags: ['Cultural'],
  },
];

// Datos de ejemplo para testimonios
const testimonials = [
  {
    id: '1',
    name: 'María García',
    location: 'España',
    rating: 5,
    comment: 'Una experiencia inolvidable. El tour a Isla Saona superó todas nuestras expectativas. El guía fue muy profesional y amable.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300',
    avatarFallback: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300',
    tour: 'Isla Saona',
  },
  {
    id: '2',
    name: 'Robert Johnson',
    location: 'Estados Unidos',
    rating: 5,
    comment: 'El mejor servicio que hemos tenido en nuestras vacaciones. Muy puntuales y el catamarán party fue increíble.',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300&h=300',
    avatarFallback: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300&h=300',
    tour: 'Catamarán Party',
  },
  {
    id: '3',
    name: 'Sophie Dubois',
    location: 'Francia',
    rating: 4,
    comment: 'Excelente experiencia en el Safari Aventura. Conocimos la verdadera cultura dominicana y la gente fue muy amable.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300',
    avatarFallback: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300',
    tour: 'Safari Aventura',
  },
];

// Componente principal
export const Home: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Referencias para animaciones basadas en scroll
  const [featuredRef, featuredInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // Cambia el testimonio cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Variantes para animaciones
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600">
        <div className="absolute inset-0 bg-black/40"></div>
                  <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.pexels.com/photos/1874641/pexels-photo-1874641.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"), url("https://images.pexels.com/photos/1450372/pexels-photo-1450372.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080")`
          }}
        ></div>
        
        <div className="relative z-10 text-center text-white container-custom">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="heading-primary mb-6"
          >
            Descubre el Paraíso en{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Punta Cana
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100"
          >
            Vive experiencias únicas con nuestros tours exclusivos. Desde playas paradisíacas hasta aventuras emocionantes.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              href="/tours"
              variant="primary"
              size="xl"
              rightIcon={<ArrowRight />}
            >
              Explorar Tours
            </Button>
            
            <Button 
              href="/contact"
              variant="outline"
              size="xl"
              className="bg-white/10 border-white text-white hover:bg-white hover:text-gray-900"
            >
              Contactar Ahora
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section 
        ref={statsRef} 
        className="py-16 bg-white"
      >
        <div className="container-custom">
          <motion.div 
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <motion.div variants={fadeInUp} className="p-6">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-caribbean-50 text-caribbean-600">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-3xl font-bold text-gray-900">15,000+</h3>
              <p className="text-gray-600">Clientes Satisfechos</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="p-6">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-3xl font-bold text-gray-900">25+</h3>
              <p className="text-gray-600">Destinos Exclusivos</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="p-6">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-3xl font-bold text-gray-900">4.9</h3>
              <p className="text-gray-600">Calificación Promedio</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="p-6">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-3xl font-bold text-gray-900">8+</h3>
              <p className="text-gray-600">Años de Experiencia</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section 
        ref={featuredRef} 
        className="py-20 bg-gray-50"
      >
        <div className="container-custom">
          <div className="mb-12 text-center">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={featuredInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-full bg-caribbean-100 px-3 py-1 text-sm font-medium text-caribbean-800"
            >
              Tours Destacados
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="heading-secondary mt-2 mb-4"
            >
              Experiencias Populares en Punta Cana
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={featuredInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mx-auto max-w-2xl text-gray-600"
            >
              Descubre nuestras excursiones más solicitadas y vive momentos inolvidables en el paraíso caribeño.
            </motion.p>
          </div>

          <motion.div 
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredTours.map((tour, index) => (
              <motion.div 
                key={tour.id}
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TourCard tour={tour} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={featuredInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <Button 
              href="/tours"
              variant="outline"
              size="lg"
              rightIcon={<ChevronRight />}
            >
              Ver Todos los Tours
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block rounded-full bg-caribbean-100 px-3 py-1 text-sm font-medium text-caribbean-800 mb-4">
                ¿Por Qué Elegirnos?
              </span>
              
              <h2 className="heading-secondary mb-6">
                La Mejor Experiencia en Excursiones de Punta Cana
              </h2>
              
              <p className="text-gray-600 mb-8">
                Nos dedicamos a ofrecer experiencias inolvidables con atención personalizada, guías expertos y los mejores servicios para que disfrutes al máximo de tu visita a Punta Cana.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-caribbean-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Guías Locales Certificados</h3>
                    <p className="mt-1 text-gray-600">Conocedores de la cultura e historia dominicana que harán tu experiencia más enriquecedora.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-caribbean-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Transporte Cómodo y Seguro</h3>
                    <p className="mt-1 text-gray-600">Vehículos modernos con aire acondicionado y conductores profesionales.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-caribbean-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Grupos Reducidos</h3>
                    <p className="mt-1 text-gray-600">Garantizamos una atención personalizada y una experiencia más íntima.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-caribbean-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Satisfacción Garantizada</h3>
                    <p className="mt-1 text-gray-600">Si no estás satisfecho con nuestro servicio, te ofrecemos un reembolso o una nueva excursión.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  href="/about"
                  variant="primary"
                  size="lg"
                >
                  Conoce Más Sobre Nosotros
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <ImageWithFallback 
                    src="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=600&h=800" 
                    alt="Excursión en Punta Cana" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e" 
                    alt="Playa en Punta Cana" 
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1468824357306-a439d58ccb1c" 
                    alt="Actividad en Punta Cana" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1603068990000-9c0d6a9b7147" 
                    alt="Aventura en Punta Cana" 
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialsRef}
        className="py-20 bg-caribbean-600 text-white"
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={testimonialsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white"
            >
              Testimonios
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="heading-secondary mt-2 mb-4"
            >
              Lo Que Dicen Nuestros Clientes
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={testimonialsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mx-auto max-w-2xl text-caribbean-100"
            >
              Miles de viajeros han tenido experiencias increíbles con nuestras excursiones. Estas son algunas de sus historias.
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto">
            <motion.div 
              key={testimonials[currentTestimonial].id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-gray-900"
            >
              <div className="flex items-center mb-6">
                <ImageWithFallback 
                  src={testimonials[currentTestimonial].avatar} 
                  fallbackSrc={testimonials[currentTestimonial].avatarFallback}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-caribbean-100"
                  width={64}
                  height={64}
                />
                <div className="ml-4">
                  <h4 className="text-xl font-bold">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-gray-600">{testimonials[currentTestimonial].location}</p>
                </div>
                <div className="ml-auto">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < testimonials[currentTestimonial].rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill={i < testimonials[currentTestimonial].rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Tour: {testimonials[currentTestimonial].tour}</p>
                </div>
              </div>
              <blockquote className="text-lg italic text-gray-700">
                "{testimonials[currentTestimonial].comment}"
              </blockquote>
            </motion.div>

            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    index === currentTestimonial ? 'bg-white' : 'bg-white/30'
                  }`}
                  aria-label={`Ver testimonio ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-20 bg-gray-900 text-white"
      >
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7 }}
              className="heading-secondary mb-6"
            >
              ¿Listo para Vivir una Experiencia Inolvidable?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={ctaInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              Reserva ahora y obtén un 10% de descuento en tu primera excursión. Oferta por tiempo limitado.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                href="/tours"
                variant="primary"
                size="xl"
                className="bg-caribbean-500 hover:bg-caribbean-600"
              >
                Ver Excursiones
              </Button>
              
              <Button 
                href="/contact"
                variant="outline"
                size="xl"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                Contactar
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};