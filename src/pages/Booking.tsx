import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Users, CreditCard, Shield, CheckCircle, Loader, XCircle, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { useData } from '../contexts/DataContext';
import axios from 'axios';

interface TourParams {
  tourId: string;
  [key: string]: string | undefined;
}

export const Booking: React.FC = () => {
  const { tourId } = useParams<TourParams>();
  const navigate = useNavigate();
  const { activities, isLoading: isLoadingActivities } = useData();
  const [tour, setTour] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    participants: [
      { firstName: '', lastName: '', age: 25, type: 'adult' }
    ],
    customerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      hotel: '',
      roomNumber: ''
    },
    specialRequests: '',
    agreeToTerms: false
  });

  // Obtener datos del tour desde la API o el contexto
  useEffect(() => {
    const fetchTourData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Primero intentamos encontrar la actividad en el contexto
        let foundTour = activities.find(activity => activity.id === tourId);
        
        // Si no está en el contexto, intentamos obtenerla directamente de la API
        if (!foundTour && tourId) {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const response = await axios.get(`${API_URL}/activities/${tourId}`);
          foundTour = response.data;
        }
        
        if (foundTour) {
          // Adaptamos los datos para que funcionen con la estructura que espera el componente
          const adaptedTour = {
            id: foundTour.id,
            title: foundTour.name || foundTour.title || 'Tour sin nombre',
            description: foundTour.description || '',
            price: foundTour.price || 0,
            duration: typeof foundTour.duration === 'number' 
              ? `${Math.floor(foundTour.duration / 60)} horas ${foundTour.duration % 60 > 0 ? `${foundTour.duration % 60} minutos` : ''}`
              : foundTour.duration || 'Consultar',
            image: foundTour.images && foundTour.images.length > 0 
              ? foundTour.images[0] 
              : foundTour.imageUrl || 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            location: foundTour.location || 'Punta Cana',
            capacity: foundTour.capacity || foundTour.maxPeople || 10
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

    fetchTourData();
  }, [tourId, activities, navigate]);

  const availableTimes = ['8:00 AM', '9:00 AM', '10:00 AM'];
  const steps = ['Detalles', 'Participantes', 'Información', 'Pago'];

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addParticipant = () => {
    setBookingData({
      ...bookingData,
      participants: [
        ...bookingData.participants,
        { firstName: '', lastName: '', age: 25, type: 'adult' }
      ]
    });
  };

  const removeParticipant = (index: number) => {
    if (bookingData.participants.length > 1) {
      setBookingData({
        ...bookingData,
        participants: bookingData.participants.filter((_, i) => i !== index)
      });
    }
  };

  const calculateTotal = () => {
    return bookingData.participants.length * tour.price;
  };

  // Si está cargando, mostrar indicador de carga
  if (isLoading || isLoadingActivities) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-sky-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Cargando información del tour...</h2>
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
          <p className="text-gray-600 mb-4">{error || 'No se pudo cargar la información del tour'}</p>
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
      {/* Header con información del tour */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-white shadow-lg">
              <ImageWithFallback
                src={tour.image}
                alt={tour.title}
                className="h-full w-full object-cover"
                width={64}
                height={64}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">{tour.title}</h1>
              <div className="flex items-center text-sm text-blue-100">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{tour.location}</span>
                <span className="mx-2">•</span>
                <Clock className="w-4 h-4 mr-1" />
                <span>{tour.duration}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Precio por persona</div>
            <div className="text-2xl font-bold">${tour.price}</div>
          </div>
        </div>
      </div>
      
      {/* Progress Steps - Diseño moderno y minimalista */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300 ${
                  currentStep > index + 1 
                      ? 'bg-green-500 text-white' 
                    : currentStep === index + 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {currentStep > index + 1 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span 
                  className={`text-xs mt-1 font-medium ${
                    currentStep > index + 1 
                      ? 'text-green-600' 
                      : currentStep === index + 1
                      ? 'text-indigo-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute h-[2px] bg-gray-200 top-4 left-8 right-0 -mr-8 z-0">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        currentStep > index + 1 ? 'bg-green-500 w-full' : 'bg-indigo-600 w-0'
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          </div>
        </div>

      <div className="container-custom py-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              {/* Step 1: Tour Details - Diseño moderno */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Selecciona Fecha y Hora</h3>
                    <p className="text-gray-500 text-sm mt-1">Elige la fecha y hora que mejor se adapte a tu itinerario</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha del Tour *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                        className="pl-10 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Hora de Inicio *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setBookingData({...bookingData, time})}
                          className={`p-4 rounded-lg flex items-center justify-center transition-all ${
                            bookingData.time === time
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                          }`}
                        >
                          <Clock className={`w-4 h-4 mr-2 ${bookingData.time === time ? 'text-indigo-100' : 'text-gray-400'}`} />
                          <span className="font-medium">{time}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">Los horarios están sujetos a disponibilidad</p>
                  </div>
                </div>
              )}

              {/* Step 2: Participants - Diseño moderno */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="border-b pb-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Información de Participantes</h3>
                      <p className="text-gray-500 text-sm mt-1">Ingresa los datos de cada persona que participará en el tour</p>
                    </div>
                    <button
                      onClick={addParticipant}
                      className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Agregar Participante
                    </button>
                  </div>

                  <div className="space-y-6">
                  {bookingData.participants.map((participant, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-b">
                          <h4 className="font-medium text-gray-700 flex items-center">
                            <Users className="w-4 h-4 mr-2 text-indigo-500" />
                            Participante {index + 1}
                          </h4>
                        {bookingData.participants.length > 1 && (
                          <button
                            onClick={() => removeParticipant(index)}
                              className="text-gray-400 hover:text-red-600 transition-colors text-sm flex items-center"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            Eliminar
                          </button>
                        )}
                      </div>
                      
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                          <input
                            type="text"
                            value={participant.firstName}
                            onChange={(e) => {
                              const updatedParticipants = [...bookingData.participants];
                              updatedParticipants[index].firstName = e.target.value;
                              setBookingData({...bookingData, participants: updatedParticipants});
                            }}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Nombre"
                            required
                          />
                        </div>
                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                          <input
                            type="text"
                            value={participant.lastName}
                            onChange={(e) => {
                              const updatedParticipants = [...bookingData.participants];
                              updatedParticipants[index].lastName = e.target.value;
                              setBookingData({...bookingData, participants: updatedParticipants});
                            }}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Apellido"
                            required
                          />
                        </div>
                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Edad *</label>
                              <div className="relative">
                          <input
                            type="number"
                            value={participant.age}
                            onChange={(e) => {
                              const updatedParticipants = [...bookingData.participants];
                              updatedParticipants[index].age = parseInt(e.target.value);
                              setBookingData({...bookingData, participants: updatedParticipants});
                            }}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            min="1"
                            max="99"
                            required
                          />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <span className="text-gray-500 sm:text-sm">años</span>
                                </div>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              )}

              {/* Step 3: Customer Information - Diseño moderno */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Información de Contacto</h3>
                    <p className="text-gray-500 text-sm mt-1">Proporciona tus datos para la confirmación de la reserva</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b">
                      <h4 className="font-medium text-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Datos Personales
                      </h4>
                    </div>
                    
                    <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                          <div className="relative">
                      <input
                        type="text"
                        value={bookingData.customerInfo.firstName}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerInfo: {...bookingData.customerInfo, firstName: e.target.value}
                        })}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="Tu nombre"
                        required
                      />
                          </div>
                    </div>
                    <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                      <input
                        type="text"
                        value={bookingData.customerInfo.lastName}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerInfo: {...bookingData.customerInfo, lastName: e.target.value}
                        })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Tu apellido"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                      <input
                        type="email"
                        value={bookingData.customerInfo.email}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerInfo: {...bookingData.customerInfo, email: e.target.value}
                        })}
                              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="ejemplo@correo.com"
                        required
                      />
                          </div>
                    </div>
                    <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                      <input
                        type="tel"
                        value={bookingData.customerInfo.phone}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerInfo: {...bookingData.customerInfo, phone: e.target.value}
                        })}
                              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="+1 234 567 890"
                        required
                      />
                    </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b">
                      <h4 className="font-medium text-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Información de Alojamiento
                      </h4>
                  </div>

                    <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">País *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                              </svg>
                            </div>
                      <input
                        type="text"
                        value={bookingData.customerInfo.country}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerInfo: {...bookingData.customerInfo, country: e.target.value}
                        })}
                              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="Tu país de residencia"
                        required
                      />
                          </div>
                    </div>
                    <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                      <input
                        type="text"
                        value={bookingData.customerInfo.hotel}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerInfo: {...bookingData.customerInfo, hotel: e.target.value}
                        })}
                              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="Nombre del hotel donde te hospedas"
                      />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Opcional - para coordinar la recogida</p>
                    </div>
                  </div>

                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Solicitudes Especiales</label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          rows={3}
                      placeholder="Menciona cualquier necesidad especial, alergias alimentarias, etc."
                    ></textarea>
                        <p className="text-xs text-gray-500 mt-1">Opcional - haremos lo posible por atender tus solicitudes</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment - Diseño moderno */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Información de Pago</h3>
                    <p className="text-gray-500 text-sm mt-1">Completa los datos de tu tarjeta para confirmar la reserva</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800">Pago seguro garantizado</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Solo se requiere un depósito del 50% para confirmar tu reserva. El resto se paga el día del tour.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b">
                      <h4 className="font-medium text-gray-700 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2 text-indigo-500" />
                        Detalles de la Tarjeta
                      </h4>
                  </div>

                    <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </div>
                      <input
                        type="text"
                              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                          </div>
                          <div className="mt-1 flex justify-end space-x-2">
                            <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" className="h-6" />
                            <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="MasterCard" className="h-6" />
                            <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="American Express" className="h-6" />
                          </div>
                    </div>

                        <div className="grid grid-cols-2 gap-6">
                      <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento *</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                              </div>
                        <input
                          type="text"
                                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="MM/YY"
                          required
                        />
                            </div>
                      </div>
                      <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                            <div className="relative">
                        <input
                          type="text"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="123"
                          required
                        />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                      </div>
                    </div>

                    <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la Tarjeta *</label>
                      <input
                        type="text"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Como aparece en la tarjeta"
                        required
                      />
                    </div>
                  </div>

                      <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={bookingData.agreeToTerms}
                      onChange={(e) => setBookingData({...bookingData, agreeToTerms: e.target.checked})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                          Acepto los <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">términos y condiciones</a> y la <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">política de privacidad</a> de Punta Cana Excursiones.
                    </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons - Diseño moderno */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    Anterior
                  </button>
                )}
                <div className="ml-auto">
                  {currentStep < 4 ? (
                    <button
                      onClick={handleNextStep}
                      className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors group shadow-md"
                    >
                      Siguiente
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                  ) : (
                    <button
                      className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Confirmar Reserva
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary - Diseño moderno */}
          <div className="lg:col-span-4">
            <div className="sticky top-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-4 px-6">
                  <h3 className="text-lg font-semibold">Resumen de Reserva</h3>
                </div>
                
                {/* Tour Info */}
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback 
                    src={tour.image} 
                    fallbackSrc="https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=800&h=600"
                    alt={tour.title}
                        className="w-full h-full object-cover"
                        width={80}
                        height={80}
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">{tour.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        <span>{tour.location}</span>
                      </div>
                    </div>
                </div>

                  {/* Divider */}
                  <div className="border-t border-dashed my-4"></div>

                {/* Booking Details */}
                  <div className="space-y-3 mb-4">
                    <h5 className="text-sm font-medium text-gray-700">Detalles de la Reserva</h5>
                    
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="bg-gray-50 rounded p-2">
                        <div className="text-xs text-gray-500">Fecha</div>
                        <div className="font-medium flex items-center">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500 mr-1" />
                          {bookingData.date || 'No seleccionada'}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded p-2">
                        <div className="text-xs text-gray-500">Hora</div>
                        <div className="font-medium flex items-center">
                          <Clock className="w-3.5 h-3.5 text-indigo-500 mr-1" />
                          {bookingData.time || 'No seleccionada'}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded p-2 col-span-2">
                        <div className="text-xs text-gray-500">Participantes</div>
                        <div className="font-medium flex items-center">
                          <Users className="w-3.5 h-3.5 text-indigo-500 mr-1" />
                          {bookingData.participants.length} {bookingData.participants.length === 1 ? 'persona' : 'personas'}
                    </div>
                    </div>
                  </div>
                </div>

                  {/* Divider */}
                  <div className="border-t border-dashed my-4"></div>

                {/* Price Breakdown */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">Resumen de Precio</h5>
                    
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-gray-600">Precio por persona</span>
                      <span className="font-medium">${tour.price}</span>
                  </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Participantes</span>
                      <span className="font-medium">x {bookingData.participants.length}</span>
                  </div>
                    
                    <div className="flex justify-between items-center text-sm font-medium pt-2 border-t">
                      <span>Subtotal</span>
                    <span>${calculateTotal()}</span>
                  </div>
                    
                  {currentStep === 4 && (
                      <div className="flex justify-between items-center text-sm text-indigo-700 bg-indigo-50 p-2 rounded">
                        <span className="font-medium">Depósito (50%)</span>
                        <span className="font-medium">${calculateTotal() / 2}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total a pagar</span>
                      <span className="text-xl font-bold text-indigo-600">
                        ${currentStep === 4 ? calculateTotal() / 2 : calculateTotal()}
                      </span>
                    </div>
                    {currentStep === 4 && (
                      <p className="text-xs text-gray-500 mt-1">
                        * El resto del pago se realizará el día del tour
                      </p>
                    )}
                </div>

                  {/* Security Badges */}
                  <div className="flex items-center justify-center space-x-4 mt-6 pt-4 border-t">
                    <div className="flex items-center text-xs text-gray-500">
                      <Shield className="w-4 h-4 text-green-500 mr-1" />
                      <span>Pago Seguro</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Confirmación Inmediata</span>
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
