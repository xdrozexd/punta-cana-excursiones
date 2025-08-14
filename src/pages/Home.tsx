import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Award, 
  MapPin, 
  ChevronRight,
  CheckCircle,
  Sailboat,
  Mountain,
  Waves,
  Building2,
  MousePointerSquare,
  CalendarDays,
  Sun,
  ShieldCheck,
  Sparkles,
  BadgePercent
} from 'lucide-react';
import { Button } from '../components/ui';
import { TourCard } from '../components/ui/TourCard';
import { CategoryCard } from '../components/ui/CategoryCard';
import { FaqItem } from '../components/ui/FaqItem';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';

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

const tourCategories = [
  {
    icon: <Sailboat />,
    title: 'Islas y Catamaranes',
    to: '/tours?category=islas-y-catamaranes',
  },
  {
    icon: <Mountain />,
    title: 'Aventura y Safari',
    to: '/tours?category=aventura-y-safari',
  },
  {
    icon: <Waves />,
    title: 'Acuáticas y Snorkel',
    to: '/tours?category=acuaticas-y-snorkel',
  },
  {
    icon: <Building2 />,
    title: 'Culturales y Ciudad',
    to: '/tours?category=culturales-y-ciudad',
  },
];

const faqData = [
  {
    question: '¿Cuál es su política de cancelación?',
    answer: 'Ofrecemos cancelación gratuita hasta 24 horas antes del inicio de la excursión. Si cancelas con menos de 24 horas, se aplicará un cargo del 50%. Las no presentaciones no son reembolsables.',
  },
  {
    question: '¿El transporte desde mi hotel está incluido?',
    answer: 'Sí, la mayoría de nuestros tours incluyen transporte de ida y vuelta desde los principales hoteles de Punta Cana. Puedes verificar esta información en la sección \'Incluido\' de cada tour.',
  },
  {
    question: '¿Qué debo llevar a las excursiones?',
    answer: 'Recomendamos llevar traje de baño, toalla, protector solar biodegradable, sombrero o gorra, lentes de sol y dinero en efectivo para propinas o souvenirs. Para tours de aventura, es aconsejable llevar calzado cerrado.',
  },
  {
    question: '¿Qué sucede si llueve el día del tour?',
    answer: 'Las lluvias tropicales suelen ser breves. La mayoría de los tours se realizan con lluvia o sol. Si las condiciones climáticas son peligrosas (tormenta tropical, huracán), el tour se cancelará y te ofreceremos reprogramar o un reembolso completo.',
  },
];

// Componente principal
export const Home: React.FC = () => {
  const { activities, isLoading } = useData();
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
            <Link to="/tours">
              <Button 
                variant="primary"
                size="lg"
                className="flex items-center gap-2"
              >
                Explorar Tours
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            
            <Link to="/contact">
              <Button 
                variant="outline"
                size="lg"
                className="bg-white/10 border-white text-white hover:bg-white hover:text-gray-900"
              >
                Contactar Ahora
              </Button>
            </Link>
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

      {/* Tour Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ duration: 0.7 }}
          >
            <h2 className="heading-secondary">Explora por Categoría</h2>
            <p className="mx-auto max-w-2xl text-gray-600 mt-4">
              Encuentra la experiencia perfecta para ti. Navega por nuestras categorías de tours y descubre todo lo que Punta Cana tiene para ofrecer.
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {tourCategories.map((category, index) => (
              <CategoryCard 
                key={category.title}
                icon={category.icon}
                title={category.title}
                to={category.to}
                delay={index * 0.1}
              />
            ))}
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {isLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-caribbean-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Cargando actividades...</p>
                </div>
              </div>
            ) : (
              activities
                .filter(activity => activity.featured)
                .slice(0, 3)
                .map((tour, index) => (
                  <motion.div 
                    key={tour.id}
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="px-4 sm:px-6 w-full max-w-md sm:max-w-none mx-auto"
                  >
                    <TourCard tour={tour} />
                  </motion.div>
                ))
            )}
            
            {!isLoading && activities.filter(activity => activity.featured).length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No hay actividades destacadas disponibles en este momento.</p>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={featuredInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <Link to="/tours">
              <Button 
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                Ver Todos los Tours
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
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
                <Link to="/about">
                  <Button 
                    variant="primary"
                    size="lg"
                  >
                    Conoce Más Sobre Nosotros
                  </Button>
                </Link>
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

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="heading-secondary">Reserva en 3 Simples Pasos</h2>
            <p className="mx-auto max-w-2xl text-gray-600 mt-4">
              Tu próxima gran aventura está a solo unos clics de distancia. Nuestro proceso de reserva es rápido, fácil y seguro.
            </p>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-3 gap-8 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Step 1 */}
            <motion.div variants={fadeInUp} className="p-6">
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg text-caribbean-600">
                <MousePointerSquare className="h-10 w-10" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">1. Elige tu Aventura</h3>
              <p className="text-gray-600">Explora nuestra selección de tours y elige la experiencia que más te guste.</p>
            </motion.div>
            {/* Step 2 */}
            <motion.div variants={fadeInUp} className="p-6">
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg text-blue-600">
                <CalendarDays className="h-10 w-10" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">2. Reserva tu Fecha</h3>
              <p className="text-gray-600">Selecciona el día y la hora que prefieras y completa tus datos de forma segura.</p>
            </motion.div>
            {/* Step 3 */}
            <motion.div variants={fadeInUp} className="p-6">
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg text-amber-600">
                <Sun className="h-10 w-10" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">3. Disfruta el Paraíso</h3>
              <p className="text-gray-600">¡Todo listo! Prepárate para vivir una experiencia inolvidable en Punta Cana.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialsRef}
        className="py-20 bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600"
      >
        <div className="container-custom">
          <motion.div 
            className="mb-12 text-center"
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="heading-secondary text-white">Lo Que Dicen Nuestros Clientes</h2>
          </motion.div>

          <div className="relative">
            <motion.div 
              key={currentTestimonial}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative max-w-3xl mx-auto"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/50 backdrop-blur-sm rounded-2xl -z-10 transform -rotate-2"></div>
              <div className="p-8 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center mb-6">
                  <ImageWithFallback 
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    fallbackSrc={testimonials[currentTestimonial].avatarFallback}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-sm text-gray-500">{testimonials[currentTestimonial].location}</p>
                    <div className="flex items-center mt-1">
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
              </div>
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

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div 
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="heading-secondary">Preguntas Frecuentes</h2>
            <p className="mx-auto max-w-2xl text-gray-600 mt-4">
              Aquí respondemos algunas de las dudas más comunes de nuestros viajeros. Si no encuentras tu respuesta, no dudes en contactarnos.
            </p>
          </motion.div>
          <motion.div 
            className="max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {faqData.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <FaqItem question={faq.question} answer={faq.answer} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-10 w-10 text-green-600 mb-2" />
              <h4 className="font-semibold text-gray-800">Pago 100% Seguro</h4>
              <p className="text-sm text-gray-600">Transacciones encriptadas.</p>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="h-10 w-10 text-caribbean-600 mb-2" />
              <h4 className="font-semibold text-gray-800">Calidad Garantizada</h4>
              <p className="text-sm text-gray-600">Las mejores experiencias.</p>
            </div>
            <div className="flex flex-col items-center">
              <BadgePercent className="h-10 w-10 text-amber-600 mb-2" />
              <h4 className="font-semibold text-gray-800">Mejor Precio</h4>
              <p className="text-sm text-gray-600">Ofertas exclusivas online.</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="font-semibold text-gray-800 mb-2">Aceptamos</h4>
              <div className="flex space-x-2 items-center">
                <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-6"/>
                <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-6"/>
                <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-6"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
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
              <Link to="/tours">
                <Button 
                  variant="primary"
                  size="lg"
                  className="bg-caribbean-500 hover:bg-caribbean-600"
                >
                  Ver Excursiones
                </Button>
              </Link>
              
              <Link to="/contact">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                >
                  Contactar
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};