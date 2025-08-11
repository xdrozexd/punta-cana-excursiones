import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, CheckCircle, XCircle, Shield, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { useData } from '../contexts/DataContext';
import { useActivitySync } from '../hooks';
import { GallerySkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import axios from 'axios';

interface TourParams {
  id: string;
  [key: string]: string | undefined;
}

export const TourDetail: React.FC = () => {
  const { id } = useParams<TourParams>();
  const navigate = useNavigate();
  const { activities, isLoading: isLoadingActivities, error: contextError, refreshData } = useData();
  const { forceRefresh } = useActivitySync();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [lastTourId, setLastTourId] = useState<string | null>(null);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  // Usar useMemo para calcular el tour actualizado automáticamente
  const tour = useMemo(() => {
    if (!activities.length || !id) return null;
    
    const foundTour = activities.find(activity => activity.id === id);
    
    if (!foundTour) return null;
    
    // Procesar las imágenes correctamente
    let processedImages: string[] = [];
    
    if (foundTour.images && Array.isArray(foundTour.images) && foundTour.images.length > 0) {
      processedImages = foundTour.images.filter(img => img && img.trim() !== '');
    } else if (foundTour.imageUrl) {
      processedImages = [foundTour.imageUrl];
    } else {
      processedImages = [
        'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
        'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
      ];
    }
    
    // Asegurarse de que siempre haya al menos una imagen
    if (processedImages.length === 0) {
      processedImages = ['https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'];
    }
    
    // Procesar el itinerario
    let processedItinerary: Array<{time: string; title: string; description: string}> = [
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
    ];
    
    if (foundTour.itinerary) {
      try {
        // Si es un string JSON, parsearlo
        if (typeof foundTour.itinerary === 'string') {
          const parsed = JSON.parse(foundTour.itinerary);
          if (Array.isArray(parsed)) {
            processedItinerary = parsed.map(item => ({
              time: item.time || 'TBD',
              title: item.title || 'Actividad',
              description: item.description || ''
            }));
          }
        } else if (Array.isArray(foundTour.itinerary)) {
          processedItinerary = foundTour.itinerary.map(item => ({
            time: item.time || 'TBD',
            title: item.title || 'Actividad',
            description: item.description || ''
          }));
        }
      } catch (error) {
        console.error('Error al procesar itinerario:', error);
      }
    }
    
    return {
      id: foundTour.id,
      title: foundTour.name || foundTour.title || 'Tour sin nombre',
      description: foundTour.description || '',
      shortDescription: foundTour.shortDescription || '',
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
      meetingPoint: foundTour.meetingPoint || '',
      pickupIncluded: foundTour.pickupIncluded || false,
      images: processedImages,
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
      requirements: foundTour.requirements || [
        'Ropa cómoda',
        'Protector solar',
        'Cámara fotográfica'
      ],
      tags: foundTour.tags || [],
      languages: foundTour.languages || ['Español'],
      availability: foundTour.availability || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      startTime: foundTour.startTime || ['9:00 AM'],
      itinerary: processedItinerary
    };
  }, [id, activities]);

  // Efecto para detectar cambios en el tour y forzar actualización
  useEffect(() => {
    if (tour && tour.id !== lastTourId) {
      console.log('TourDetail: Tour actualizado detectado:', tour.title);
      setLastTourId(tour.id);
      setCurrentImageIndex(0);
      setLoadedImages(new Set());
    }
  }, [tour, lastTourId]);

  // Función para manejar actualización manual
  const handleManualRefresh = async () => {
    try {
      await forceRefresh();
      setShowUpdateNotification(true);
      setTimeout(() => setShowUpdateNotification(false), 3000);
    } catch (error) {
      console.error('Error en actualización manual:', error);
    }
  };

  // Efecto para actualización automática periódica (cada 30 segundos)
  useEffect(() => {
    if (!id) return;
    
    const interval = setInterval(async () => {
      try {
        console.log('TourDetail: Actualización automática...');
        await refreshData();
      } catch (error) {
        console.error('TourDetail: Error en actualización automática:', error);
      }
    }, 30000); // 30 segundos
    
    return () => clearInterval(interval);
  }, [id, refreshData]);

  // Efecto para manejar la carga inicial y errores
  useEffect(() => {
    const fetchTourDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Si no hay tour en el contexto pero hay ID, intentar obtenerlo de la API
        if (!tour && id) {
          console.log('TourDetail: Tour no encontrado en contexto, buscando en API...');
          const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
          const response = await axios.get(`${API_URL}/activities/${id}`);
          const foundTour = response.data;
          
          if (foundTour) {
            console.log('TourDetail: Tour encontrado en API, refrescando contexto...');
            await refreshData();
          } else {
            setError('No se encontró la actividad solicitada');
            setTimeout(() => navigate('/tours'), 3000);
          }
        }
      } catch (err) {
        console.error('Error al obtener detalles del tour:', err);
        setError('Error al cargar los detalles del tour');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourDetails();
  }, [id, navigate, refreshData]); // Removido 'tour' de las dependencias para evitar loops

  // Efecto adicional para detectar cambios en las actividades y forzar actualización
  useEffect(() => {
    console.log('TourDetail: Actividades actualizadas, verificando tour...');
    if (activities.length > 0 && id) {
      const foundTour = activities.find(activity => activity.id === id);
      if (foundTour) {
        console.log('TourDetail: Tour encontrado en actividades actualizadas:', foundTour.name);
        // Forzar actualización si el tour ha cambiado
        if (lastTourId !== foundTour.id) {
          console.log('TourDetail: Cambio detectado, actualizando...');
          setLastTourId(foundTour.id);
        }
      } else {
        console.log('TourDetail: Tour no encontrado en actividades actualizadas');
      }
    }
  }, [activities, id, lastTourId]);

  // Resetear el índice de imagen cuando cambie el tour
  useEffect(() => {
    if (tour) {
      setCurrentImageIndex(0);
      setLoadedImages(new Set());
    }
  }, [tour?.id]);

  // Funciones para la galería de imágenes con useCallback
  const nextImage = useCallback(() => {
    if (!tour?.images?.length) return;
    setCurrentImageIndex(prev => 
      prev === tour.images.length - 1 ? 0 : prev + 1
    );
  }, [tour?.images?.length]);

  const prevImage = useCallback(() => {
    if (!tour?.images?.length) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? tour.images.length - 1 : prev - 1
    );
  }, [tour?.images?.length]);

  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setShowLightbox(false);
  }, []);

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  }, []);

  const handleImageClick = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  // Early return si no hay ID
  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">ID de tour no válido</p>
          <Link to="/tours" className="text-caribbean-600 hover:text-caribbean-700 underline">
            Volver a Tours
          </Link>
        </div>
      </div>
    );
  }

  // Early returns para estados de carga y error
  if (isLoading || isLoadingActivities) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          <GallerySkeleton />
        </div>
      </div>
    );
  }

  if (error || contextError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-bold">Error</p>
            <p>{error || contextError}</p>
          </div>
          <div className="space-y-2">
            <Button onClick={() => window.location.reload()} variant="primary">
              Reintentar
            </Button>
            <div>
              <Link to="/tours" className="text-caribbean-600 hover:text-caribbean-700 underline">
                Volver a Tours
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-gray-600 mb-4">No se encontró el tour solicitado</p>
          <Link to="/tours" className="text-caribbean-600 hover:text-caribbean-700 underline">
            Volver a Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Notificación de actualización */}
      {showUpdateNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Datos actualizados correctamente</span>
          </div>
        </div>
      )}

      {/* Header con información del tour */}
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
            
            <div className="flex flex-col items-end space-y-2">
              <div className="text-right">
                <div className="text-3xl font-bold mb-2">${tour.price}</div>
                {tour.originalPrice && tour.originalPrice > tour.price && (
                  <div className="text-lg line-through opacity-75">${tour.originalPrice}</div>
                )}
                <div className="text-sm opacity-90">por persona</div>
              </div>
              
              {/* Botón de actualización manual */}
              <Button
                onClick={handleManualRefresh}
                variant="ghost"
                size="sm"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
              >
                Actualizar datos
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galería de Imágenes Optimizada */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                {/* Imagen principal con lazy loading */}
                <div className="relative h-96 md:h-[500px] overflow-hidden">
                  <ImageWithFallback
                    src={tour.images}
                    alt={`${tour.title} - Imagen ${currentImageIndex + 1}`}
                    className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
                      loadedImages.has(currentImageIndex) ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => handleImageLoad(currentImageIndex)}
                    currentIndex={currentImageIndex}
                  />
                  
                  {/* Skeleton mientras carga */}
                  {!loadedImages.has(currentImageIndex) && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                  
                  {/* Overlay con controles */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300">
                    <div className="absolute top-4 right-4">
                      <Button
                        onClick={() => openLightbox(currentImageIndex)}
                        variant="ghost"
                        size="sm"
                        className="bg-white/90 backdrop-blur-sm hover:bg-white"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </Button>
                    </div>
                    
                    {/* Controles de navegación */}
                    {tour.images.length > 1 && (
                      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between">
                        <Button
                          onClick={prevImage}
                          variant="ghost"
                          size="sm"
                          className="bg-white/90 backdrop-blur-sm hover:bg-white"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button
                          onClick={nextImage}
                          variant="ghost"
                          size="sm"
                          className="bg-white/90 backdrop-blur-sm hover:bg-white"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Indicador de imagen actual */}
                  {tour.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                        {currentImageIndex + 1} / {tour.images.length}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Miniaturas optimizadas */}
                {tour.images.length > 1 && (
                  <div className="p-4 bg-gray-50">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {tour.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleImageClick(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            index === currentImageIndex 
                              ? 'border-caribbean-500 shadow-lg' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <ImageWithFallback
                            src={[image]}
                            alt={`Miniatura ${index + 1}`}
                            className="w-full h-full object-cover"
                            onLoad={() => handleImageLoad(index)}
                            currentIndex={0}
                          />
                          {!loadedImages.has(index) && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Descripción</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">{tour.description}</p>
                
                {tour.shortDescription && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
                    <p className="text-blue-800 font-medium">{tour.shortDescription}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Puntos Destacados */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="w-6 h-6 text-yellow-500 mr-3" />
                  Puntos Destacados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-caribbean-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerario */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerario</h2>
                <div className="space-y-6">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-caribbean-100 rounded-full flex items-center justify-center">
                          <span className="text-caribbean-600 font-semibold text-sm">{item.time}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información del Tour */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Información del Tour</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duración</span>
                  <span className="font-semibold">{tour.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Capacidad máxima</span>
                  <span className="font-semibold">{tour.maxGuests} personas</span>
                </div>
                {tour.minAge > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Edad mínima</span>
                    <span className="font-semibold">{tour.minAge} años</span>
                  </div>
                )}
                {tour.meetingPoint && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Punto de encuentro</span>
                    <span className="font-semibold text-sm">{tour.meetingPoint}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Incluye recogida</span>
                  <span className={`font-semibold ${tour.pickupIncluded ? 'text-green-600' : 'text-red-600'}`}>
                    {tour.pickupIncluded ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Lo que está Incluido */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Lo que está Incluido
              </h3>
              <ul className="space-y-2">
                {tour.included.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lo que NO está Incluido */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                Lo que NO está Incluido
              </h3>
              <ul className="space-y-2">
                {tour.excluded.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requisitos */}
            {tour.requirements && tour.requirements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  Requisitos
                </h3>
                <ul className="space-y-2">
                  {tour.requirements.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Botón de Reserva */}
            <div className="bg-gradient-to-r from-caribbean-500 to-caribbean-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">¿Te interesa este tour?</h3>
                <p className="text-caribbean-100 mb-4">Reserva ahora y asegura tu lugar</p>
                <Link
                  to={`/booking/${tour.id}`}
                  className="inline-block bg-white text-caribbean-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200"
                >
                  Reservar Ahora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox optimizado */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full p-4">
            <Button
              onClick={closeLightbox}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <X className="w-6 h-6" />
            </Button>
            
            <div className="relative">
              <ImageWithFallback
                src={tour.images[currentImageIndex]}
                alt={`${tour.title} - Imagen ${currentImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
              />
              
              {tour.images.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </Button>
                  <Button
                    onClick={nextImage}
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </Button>
                </>
              )}
            </div>
            
            {tour.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                  {currentImageIndex + 1} / {tour.images.length}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
