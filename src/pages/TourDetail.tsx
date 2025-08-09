import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Users, MapPin, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

export const TourDetail: React.FC = () => {
  const { } = useParams();

  // Mock data - en una aplicación real, esto vendría de una API
  const tour = {
    id: '1',
    title: 'Isla Saona Completa',
    description: 'Descubre el paraíso en la Isla Saona, un tesoro natural ubicado en el extremo sureste de República Dominicana. Este tour de día completo te llevará a través de aguas cristalinas, playas de arena blanca y manglares únicos.',
    price: 85,
    originalPrice: 120,
    duration: 'Todo el día (8 horas)',
    rating: 4.9,
    reviewCount: 2847,
    maxGuests: 12,
    minAge: 3,
    location: 'Isla Saona, Parque Nacional del Este',
    images: [
      'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
    ],
    highlights: [
      'Transporte ida y vuelta desde tu hotel',
      'Paseo en catamarán por aguas cristalinas',
      'Tiempo libre en la playa más hermosa del Caribe',
      'Almuerzo buffet dominicano incluido',
      'Bebidas ilimitadas durante el tour',
      'Snorkel en arrecifes de coral',
      'Guía turístico certificado'
    ],
    included: [
      'Transporte de ida y vuelta',
      'Almuerzo buffet',
      'Bebidas (agua, refrescos, cerveza)',
      'Equipo de snorkel',
      'Guía bilingüe',
      'Seguro de viaje'
    ],
    excluded: [
      'Fotos profesionales',
      'Propinas',
      'Gastos personales',
      'Bebidas alcohólicas premium'
    ],
    itinerary: [
      {
        time: '7:00 AM',
        title: 'Recogida en el hotel',
        description: 'Nuestro transporte te recogerá en tu hotel y te llevará al puerto de salida.'
      },
      {
        time: '9:00 AM',
        title: 'Salida en catamarán',
        description: 'Comenzamos nuestro viaje por las aguas cristalinas hacia la Isla Saona.'
      },
      {
        time: '10:30 AM',
        title: 'Primera parada - Piscina Natural',
        description: 'Disfruta de un refrescante baño en aguas poco profundas con estrellas de mar.'
      },
      {
        time: '12:00 PM',
        title: 'Llegada a Isla Saona',
        description: 'Tiempo libre en la playa para relajarte, nadar y tomar fotos.'
      },
      {
        time: '1:00 PM',
        title: 'Almuerzo buffet',
        description: 'Delicioso almuerzo con especialidades dominicanas frente al mar.'
      },
      {
        time: '3:00 PM',
        title: 'Actividades libres',
        description: 'Snorkel, voleibol de playa, o simplemente relájate bajo una palmera.'
      },
      {
        time: '4:00 PM',
        title: 'Regreso',
        description: 'Viaje de regreso al puerto con música y bebidas a bordo.'
      },
      {
        time: '6:00 PM',
        title: 'Llegada al hotel',
        description: 'Regreso a tu hotel con recuerdos inolvidables.'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-96 md:h-[500px]">
          <div className="md:col-span-2">
            <ImageWithFallback
              src={tour.images[0]} 
              alt={tour.title}
              className="w-full h-full object-cover"
              width={1200}
              height={800}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            <ImageWithFallback
              src={tour.images[1]} 
              alt={tour.title}
              className="w-full h-full object-cover"
              width={600}
              height={400}
            />
            <ImageWithFallback
              src={tour.images[2]} 
              alt={tour.title}
              className="w-full h-full object-cover"
              width={600}
              height={400}
            />
          </div>
        </div>
      </section>

      {/* Tour Title Banner - Destacado con margen superior */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white py-8 mt-8 mb-4">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-2">{tour.title}</h1>
          <div className="flex items-center space-x-6 text-white">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 fill-white text-white" />
              <span className="font-semibold">{tour.rating}</span>
              <span className="opacity-90">({tour.reviewCount} reseñas)</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>{tour.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <h2 className="heading-secondary mb-4">{tour.title}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{tour.description}</p>
            </div>

            {/* Tour Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <Clock className="w-6 h-6 text-sky-600 mb-2" />
                <div className="text-sm text-gray-600">Duración</div>
                <div className="font-semibold">{tour.duration}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <Users className="w-6 h-6 text-sky-600 mb-2" />
                <div className="text-sm text-gray-600">Grupo máximo</div>
                <div className="font-semibold">{tour.maxGuests} personas</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <Calendar className="w-6 h-6 text-sky-600 mb-2" />
                <div className="text-sm text-gray-600">Edad mínima</div>
                <div className="font-semibold">{tour.minAge} años</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <MapPin className="w-6 h-6 text-sky-600 mb-2" />
                <div className="text-sm text-gray-600">Recogida</div>
                <div className="font-semibold">Hotel incluida</div>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Lo Más Destacado</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Itinerary */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-6">Itinerario Detallado</h3>
              <div className="space-y-6">
                {tour.itinerary.map((item, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-sky-600 text-sm">{item.time}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Included/Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-green-700">Incluido</h3>
                <ul className="space-y-2">
                  {tour.included.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-red-700">No Incluido</h3>
                <ul className="space-y-2">
                  {tour.excluded.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-3xl font-bold text-sky-600">${tour.price}</span>
                    <span className="text-sm text-gray-500">/persona</span>
                    {tour.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">${tour.originalPrice}</span>
                    )}
                  </div>
                  {tour.originalPrice && (
                    <div className="text-sm text-green-600 font-medium">
                      ¡Ahorra ${tour.originalPrice - tour.price}!
                    </div>
                  )}
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="form-label">Fecha del Tour</label>
                    <input 
                      type="date" 
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="form-label">Número de Personas</label>
                    <select className="form-input">
                      <option value="1">1 persona</option>
                      <option value="2">2 personas</option>
                      <option value="3">3 personas</option>
                      <option value="4">4 personas</option>
                      <option value="5">5 personas</option>
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>Subtotal:</span>
                      <span className="font-semibold">${tour.price}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span>Total:</span>
                      <span className="text-xl font-bold text-sky-600">${tour.price}</span>
                    </div>
                  </div>

                  <Link to={`/booking/${tour.id}`} className="w-full btn-primary text-lg py-4 text-center block">
                    Reservar Ahora
                  </Link>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    ✓ Cancelación gratuita hasta 24h antes
                  </p>
                  <p className="text-sm text-gray-600">
                    ✓ Confirmación instantánea
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
