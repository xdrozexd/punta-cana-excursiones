import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, MapPin, Calendar, CheckCircle, XCircle, Loader, Shield } from 'lucide-react';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { useData } from '../contexts/DataContext';
import axios from 'axios';

interface TourParams {
  id: string;
  [key: string]: string | undefined;
}

export const TourDetail: React.FC = () => {
  const { id } = useParams<TourParams>();
  const navigate = useNavigate();
  const { activities, isLoading: isLoadingActivities } = useData();
  const [tour, setTour] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTourDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Primero intentamos encontrar la actividad en el contexto
        let foundTour = activities.find(activity => activity.id === id);
        
        // Si no está en el contexto, intentamos obtenerla directamente de la API
        if (!foundTour && id) {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const response = await axios.get(`${API_URL}/activities/${id}`);
          foundTour = response.data;
        }
        
        if (foundTour) {
          // Adaptamos los datos para que funcionen con la estructura que espera el componente
          const adaptedTour = {
            id: foundTour.id,
            title: foundTour.name || foundTour.title || 'Tour sin nombre',
            description: foundTour.description || '',
            price: foundTour.price || 0,
            originalPrice: foundTour.originalPrice,
            duration: typeof foundTour.duration === 'number' 
              ? `${Math.floor(foundTour.duration / 60)} horas ${foundTour.duration % 60 > 0 ? `${foundTour.duration % 60} minutos` : ''}`
              : foundTour.duration || 'Consultar',
            rating: foundTour.rating || 4.5,
            reviewCount: foundTour.reviews || foundTour.reviewCount || 0,
            maxGuests: foundTour.capacity || foundTour.maxPeople || 10,
            minAge: foundTour.minAge || 0,
            location: foundTour.location || 'Punta Cana',
            images: foundTour.images && foundTour.images.length > 0 
              ? foundTour.images 
              : foundTour.imageUrl 
                ? [foundTour.imageUrl, foundTour.imageUrl, foundTour.imageUrl] 
                : [
      'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
    ],
            highlights: foundTour.highlights || [
      'Transporte ida y vuelta desde tu hotel',
              'Guía turístico profesional',
              'Experiencia única en Punta Cana',
              'Actividades para toda la familia'
            ],
            included: foundTour.included || [
      'Transporte de ida y vuelta',
      'Guía bilingüe',
      'Seguro de viaje'
    ],
            excluded: foundTour.notIncluded || foundTour.excluded || [
      'Propinas',
              'Gastos personales'
            ],
            itinerary: foundTour.itinerary || [
      {
        time: '9:00 AM',
                title: 'Inicio de la actividad',
                description: 'Recogida en el hotel y traslado al punto de inicio.'
      },
      {
        time: '12:00 PM',
                title: 'Almuerzo',
                description: 'Tiempo para disfrutar de la gastronomía local.'
      },
      {
        time: '4:00 PM',
                title: 'Fin de la actividad',
                description: 'Regreso al hotel.'
              }
            ]
          };
          
          setTour(adaptedTour);
        } else {
          setError('No se encontró la actividad solicitada');
          // Redirigir después de 3 segundos
          setTimeout(() => {
            navigate('/tours');
          }, 3000);
        }
      } catch (err) {
        console.error('Error al obtener detalles del tour:', err);
        setError('Error al cargar los detalles del tour');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourDetails();
  }, [id, activities, navigate]);

  // Si está cargando, mostrar indicador de carga
  if (isLoading || isLoadingActivities) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-sky-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Cargando detalles del tour...</h2>
        </div>
          </div>
    );
  }

  // Si hay un error, mostrar mensaje de error
  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'No se pudo cargar la actividad'}</p>
          <p className="text-gray-500 text-sm mb-4">Serás redirigido a la página de tours en unos segundos...</p>
          <Link to="/tours" className="btn-primary inline-block">
            Volver a Tours
          </Link>
          </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header con información del tour - Estilo moderno */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-20 w-20 rounded-full overflow-hidden mr-6 border-2 border-white shadow-lg">
                <ImageWithFallback
                  src={tour.images[0]}
                  alt={tour.title}
                  className="h-full w-full object-cover"
                  width={80}
                  height={80}
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{tour.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-white text-white" />
                    <span className="font-semibold">{tour.rating}</span>
                    <span className="opacity-90">({tour.reviewCount} reseñas)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{tour.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100 mb-1">Precio por persona</div>
              <div className="text-3xl font-bold">${tour.price}</div>
              <div className="text-sm text-blue-100 mt-1">Reserva con depósito del 50%</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Gallery - Diseño moderno */}
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-72 md:h-[400px] p-4">
          <div className="md:col-span-2">
            <ImageWithFallback
              src={tour.images[0]} 
              alt={tour.title}
              className="w-full h-full object-cover rounded-xl shadow-lg"
              width={800}
              height={500}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            <ImageWithFallback
              src={tour.images[1]} 
              alt={tour.title}
              className="w-full h-full object-cover rounded-xl shadow-lg"
              width={400}
              height={250}
            />
            <ImageWithFallback
              src={tour.images[2]} 
              alt={tour.title}
              className="w-full h-full object-cover rounded-xl shadow-lg"
              width={400}
              height={250}
            />
          </div>
        </div>
      </section>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Descripción */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Descripción del Tour</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">{tour.description}</p>
              </div>
            </div>

            {/* Tour Info - Diseño moderno */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Información del Tour</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Duración</span>
                    </div>
                    <div className="font-semibold text-gray-900">{tour.duration}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center mb-2">
                      <Users className="w-5 h-5 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Grupo máximo</span>
                    </div>
                    <div className="font-semibold text-gray-900">{tour.maxGuests} personas</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Edad mínima</span>
                    </div>
                    <div className="font-semibold text-gray-900">{tour.minAge} años</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-5 h-5 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Recogida</span>
                    </div>
                    <div className="font-semibold text-gray-900">Hotel incluida</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights - Diseño moderno */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Lo Más Destacado
                </h3>
              </div>
              <div className="p-6">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Itinerary - Diseño moderno */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 text-indigo-600 mr-2" />
                  Itinerario Detallado
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-indigo-200">
                          <span className="font-semibold text-indigo-600 text-sm">{item.time}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Included/Excluded - Diseño moderno */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-green-700 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Incluido
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-red-700 flex items-center">
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    No Incluido
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {tour.excluded.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar - Diseño moderno */}
          <div className="lg:col-span-4">
            <div className="sticky top-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-4 px-6">
                  <h3 className="text-lg font-semibold">Reservar Ahora</h3>
                </div>
                
                <div className="p-6">
                  {/* Precio */}
                  <div className="mb-6">
                    <div className="flex items-baseline space-x-2 mb-2">
                      <span className="text-3xl font-bold text-indigo-600">${tour.price}</span>
                      <span className="text-sm text-gray-500">/persona</span>
                      {tour.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">${tour.originalPrice}</span>
                      )}
                    </div>
                    {tour.originalPrice && (
                      <div className="text-sm text-green-600 font-medium bg-green-50 p-2 rounded">
                        ¡Ahorra ${tour.originalPrice - tour.price}!
                      </div>
                    )}
                  </div>

                  {/* Formulario de reserva */}
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha del Tour</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                          type="date" 
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número de Personas</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <select className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                          <option value="1">1 persona</option>
                          <option value="2">2 personas</option>
                          <option value="3">3 personas</option>
                          <option value="4">4 personas</option>
                          <option value="5">5 personas</option>
                        </select>
                      </div>
                    </div>

                    {/* Resumen de precio */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-gray-600">Precio por persona</span>
                        <span className="font-medium">${tour.price}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-gray-600">Personas</span>
                        <span className="font-medium">1</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-indigo-600">${tour.price}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        * Depósito del 50% para confirmar
                      </div>
                    </div>

                    {/* Botón de reserva */}
                    <Link 
                      to={`/booking/${tour.id}`} 
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg text-center block transition duration-200 shadow-md"
                    >
                      Reservar Ahora
                    </Link>
                  </form>

                  {/* Badges de confianza */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-green-500 mr-1" />
                        <span>Pago Seguro</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Confirmación Inmediata</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        ✓ Cancelación gratuita hasta 24h antes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
