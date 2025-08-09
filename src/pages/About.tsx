import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Globe, Heart, Star, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

export const About: React.FC = () => {
  const stats = [
    { number: '15,000+', label: 'Clientes Satisfechos', icon: Users },
    { number: '50+', label: 'Tours Únicos', icon: MapPin },
    { number: '10+', label: 'Años de Experiencia', icon: Award },
    { number: '4.9/5', label: 'Calificación Promedio', icon: Star }
  ];

  const team = [
    {
      name: 'Carlos Rodríguez',
      role: 'CEO & Fundador',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
      description: 'Apasionado por el turismo dominicano con más de 15 años de experiencia.'
    },
    {
      name: 'María González',
      role: 'Directora de Operaciones',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
      description: 'Experta en logística turística y experiencias personalizadas.'
    },
    {
      name: 'Pedro Martínez',
      role: 'Guía Principal',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
      description: 'Guía certificado con conocimiento profundo de la flora y fauna local.'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Pasión por el Servicio',
      description: 'Cada tour es diseñado con amor y dedicación para crear experiencias memorables.'
    },
    {
      icon: Award,
      title: 'Excelencia en Calidad',
      description: 'Mantenemos los más altos estándares en seguridad, comodidad y satisfacción.'
    },
    {
      icon: Globe,
      title: 'Turismo Sostenible',
      description: 'Comprometidos con la conservación del medio ambiente y las comunidades locales.'
    },
    {
      icon: Users,
      title: 'Experiencias Personalizadas',
      description: 'Adaptamos cada tour a las preferencias y necesidades de nuestros huéspedes.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-sky-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback 
            src="https://images.pexels.com/photos/3369102/pexels-photo-3369102.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600"
            alt="Punta Cana"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container-custom text-center">
          <h1 className="heading-primary mb-6">Nuestra Historia</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Desde 2013, hemos sido pioneros en crear experiencias únicas e inolvidables en el paraíso caribeño de Punta Cana.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-sky-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-sky-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-secondary mb-6">Nuestra Misión</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  En Punta Cana Excursiones, creemos que cada viaje debe ser una aventura transformadora. 
                  Nuestra misión es conectar a los viajeros con la belleza natural, la cultura vibrante y 
                  la calidez humana de República Dominicana.
                </p>
                <p>
                  Fundada por un grupo de apasionados locales del turismo, nuestra empresa nació del deseo 
                  de compartir los tesoros ocultos de nuestra hermosa isla. Desde nuestros inicios en 2013, 
                  hemos crecido hasta convertirnos en uno de los operadores turísticos más confiables y 
                  respetados de la región.
                </p>
                <p>
                  Cada miembro de nuestro equipo comparte la misma pasión: crear experiencias auténticas 
                  que vayan más allá del turismo convencional. Trabajamos estrechamente con comunidades 
                  locales para ofrecer tours que beneficien tanto a nuestros huéspedes como a las 
                  personas que llaman hogar a estos lugares mágicos.
                </p>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback 
                src="https://images.pexels.com/photos/3350673/pexels-photo-3350673.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600"
                alt="Nuestra historia"
                className="w-full rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-sky-600 rounded-lg flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">10+</div>
                  <div className="text-sm">Años</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-secondary mb-4">Nuestros Valores</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Los principios que guían cada decisión y experiencia que creamos para nuestros huéspedes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-secondary mb-4">Conoce Nuestro Equipo</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesionales apasionados dedicados a hacer de tu experiencia algo extraordinario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <ImageWithFallback 
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  width={128}
                  height={128}
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-sky-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-blue-600 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-secondary mb-6">Nuestro Compromiso</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Seguridad Garantizada</h4>
                    <p className="text-white/90">Todos nuestros tours cumplen con los más altos estándares internacionales de seguridad.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Turismo Responsable</h4>
                    <p className="text-white/90">Promovemos prácticas sostenibles que protegen el medio ambiente y apoyan a las comunidades locales.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Satisfacción Total</h4>
                    <p className="text-white/90">Garantizamos tu satisfacción o devolvemos tu dinero. Tu felicidad es nuestro éxito.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">¿Listo para la Aventura?</h3>
                <p className="text-white/90 mb-6">
                  Únete a miles de viajeros que han confiado en nosotros para vivir experiencias únicas.
                </p>
                <Link to="/tours" className="btn-primary text-lg px-8 py-4 inline-block">
                  Reserva Tu Tour Ahora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
