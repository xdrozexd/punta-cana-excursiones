import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Users, CreditCard, Shield, CheckCircle, Loader, XCircle, MapPin, ChevronLeft, ChevronRight, User, Mail, Phone } from 'lucide-react';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { useData } from '../contexts/DataContext';
import { createEducationalBooking, initStripeBooking, getTourById } from '../api';
import { isEducational, getCurrency } from '../utils/config';

interface TourParams {
  tourId: string;
  [key: string]: string | undefined;
}

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  location: string;
  capacity: number;
  startTime?: string[];
}

export const Booking: React.FC = () => {
  const { tourId } = useParams<TourParams>();
  const navigate = useNavigate();
  const { activities, isLoading: isLoadingActivities } = useData();
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    adults: 1,
    children: 0,
    childAges: [] as number[],
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

  // Errores de validación por campo y por paso
  const [contactErrors, setContactErrors] = useState<{ firstName?: string; lastName?: string; email?: string; phone?: string }>({});
  const [stepError, setStepError] = useState<string>('');

  // Estados para información de pago
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // Estados para dirección de facturación
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'República Dominicana',
    phone: '',
    birthday: '',
    useCustomerInfo: false
  });

  // Estado de envío
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitBanner, setSubmitBanner] = useState<string | null>(null);

  const isCardFormValid = () => {
    const isBillingAddressComplete =
      (billingAddress.useCustomerInfo || billingAddress.street) &&
      billingAddress.city &&
      billingAddress.state &&
      billingAddress.postalCode &&
      billingAddress.country &&
      billingAddress.phone &&
      billingAddress.birthday;

    return (
      cardData.cardNumber &&
      cardData.expiryDate &&
      cardData.cvv &&
      cardData.cardholderName &&
      isBillingAddressComplete
    );
  };

  // Funciones para el calendario interactivo
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Agregar días del mes anterior para completar la primera semana
    for (let i = 0; i < startingDay; i++) {
      const prevMonth = new Date(year, month, -startingDay + i + 1);
      days.push({ date: prevMonth, isCurrentMonth: false, isToday: false, isSelected: false });
    }
    
    // Agregar días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const today = new Date();
      const isToday = currentDate.toDateString() === today.toDateString();
      const isSelected = bookingData.date === currentDate.toISOString().split('T')[0];
      const isPast = currentDate < new Date(today.setHours(0, 0, 0, 0));
      
      days.push({ 
        date: currentDate, 
        isCurrentMonth: true, 
        isToday, 
        isSelected,
        isPast
      });
    }
    
    // Agregar días del siguiente mes para completar la última semana
    const remainingDays = 42 - days.length; // 6 semanas * 7 días
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonth = new Date(year, month + 1, i);
      days.push({ date: nextMonth, isCurrentMonth: false, isToday: false, isSelected: false });
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return; // No permitir fechas pasadas
    
    const dateString = date.toISOString().split('T')[0];
    setBookingData({ ...bookingData, date: dateString });
    setShowCalendar(false);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Cerrar calendario al hacer clic fuera y navegación por teclado
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showCalendar) return;
      
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          setShowCalendar(false);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevMonth();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextMonth();
          break;
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCalendar, currentMonth]);

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  // Lista completa de países (ISO 3166-1 alpha-2) -> nombres en español
  const COUNTRY_CODES = (
    'AF,AX,AL,DZ,AS,AD,AO,AI,AQ,AG,AR,AM,AW,AU,AT,AZ,BS,BH,BD,BB,BY,BE,BZ,BJ,BM,BT,BO,BQ,BA,BW,BV,BR,IO,BN,BG,BF,BI,KH,CM,CA,CV,KY,CF,TD,CL,CN,CX,CC,CO,KM,CG,CD,CK,CR,CI,HR,CU,CW,CY,CZ,DK,DJ,DM,DO,EC,EG,SV,GQ,ER,EE,SZ,ET,FK,FO,FJ,FI,FR,GF,PF,TF,GA,GM,GE,DE,GH,GI,GR,GL,GD,GP,GU,GT,GG,GN,GW,GY,HT,HM,VA,HN,HK,HU,IS,IN,ID,IR,IQ,IE,IM,IL,IT,JM,JP,JE,JO,KZ,KE,KI,KP,KR,KW,KG,LA,LV,LB,LS,LR,LY,LI,LT,LU,MO,MG,MW,MY,MV,ML,MT,MH,MQ,MR,MU,YT,MX,FM,MD,MC,MN,ME,MS,MA,MZ,MM,NA,NR,NP,NL,NC,NZ,NI,NE,NG,NU,NF,MP,NO,OM,PK,PW,PS,PA,PG,PY,PE,PH,PN,PL,PT,PR,QA,RE,RO,RU,RW,BL,SH,KN,LC,MF,PM,VC,WS,SM,ST,SA,SN,RS,SC,SL,SG,SX,SK,SI,SB,SO,ZA,GS,SS,ES,LK,SD,SR,SJ,SE,CH,SY,TW,TJ,TZ,TH,TL,TG,TK,TO,TT,TN,TR,TM,TC,TV,UG,UA,AE,GB,US,UM,UY,UZ,VU,VE,VN,VG,VI,WF,EH,YE,ZM,ZW'
  ).split(',');

  const regionNames = new (Intl as any).DisplayNames(['es'], { type: 'region' });
  const COUNTRIES = COUNTRY_CODES
    .map((code) => regionNames.of(code))
    .filter((n: string | undefined): n is string => Boolean(n))
    .sort((a: string, b: string) => a.localeCompare(b, 'es'));

  // Obtener datos del tour desde la API o el contexto
  useEffect(() => {
    const fetchTourData = async () => {
      if (!tourId) return;

      setIsLoading(true);
      setError(null);

      try {
        let activityData = activities.find(act => act.id === tourId);

        if (!activityData) {
          // getTourById devuelve un Tour directamente
          activityData = await getTourById(tourId) as any;
        }

        if (activityData) {
          const adaptedTour = {
            id: activityData.id,
            title: activityData.name || activityData.title || 'Tour sin nombre',
            description: activityData.description || '',
            price: activityData.price || 0,
            duration: typeof activityData.duration === 'number'
              ? `${Math.floor(activityData.duration / 60)}h ${activityData.duration % 60 > 0 ? `${activityData.duration % 60}m` : ''}`.trim()
              : activityData.duration || 'Consultar',
            image: (activityData.images && activityData.images[0]) || activityData.imageUrl || 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            location: activityData.location || 'Punta Cana',
            capacity: activityData.capacity || activityData.maxPeople || 10,
            startTime: activityData.startTime || ['8:00 AM', '9:00 AM', '10:00 AM'],
          };
          setTour(adaptedTour);
        } else {
          throw new Error('No se encontró la actividad solicitada.');
        }
      } catch (err: any) {
        console.error('Error al obtener detalles del tour:', err);
        setError(err.message || 'Error al cargar los detalles del tour.');
        setTimeout(() => navigate('/tours'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isLoadingActivities) {
        fetchTourData();
    }
  }, [tourId, activities, navigate, isLoadingActivities]);

  // Obtener horarios dinámicos de la actividad o usar horarios por defecto
  const availableTimes = tour?.startTime && tour.startTime.length > 0 
    ? tour.startTime 
    : ['8:00 AM', '9:00 AM', '10:00 AM'];
  const steps = ['Detalles', 'Participantes', 'Información', 'Pago'];

  const validateStep1 = () => {
    if (!bookingData.date) {
      setStepError('Por favor, selecciona una fecha para continuar.');
      return false;
    }
    if (!bookingData.time) {
      setStepError('Por favor, selecciona una hora de inicio para continuar.');
      return false;
    }
    return true;
  };

  // Normaliza horas tipo "8:00 AM" o "08:00" a formato HH:mm de 24 horas
  const toTimeHHmm = (t?: string): string => {
    if (!t) return '';
    const s = t.trim();
    // Si ya viene HH:mm (24h), devuélvelo
    if (/^\d{1,2}:\d{2}$/.test(s) && !/[ap]m/i.test(s)) {
      const [h, m] = s.split(':').map(Number);
      if (Number.isFinite(h) && Number.isFinite(m)) {
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        return `${hh}:${mm}`;
      }
    }
    // Formatos con AM/PM (e.g., "8:00 AM", "12:30 pm")
    const ampm = s.match(/(am|pm)/i)?.[1]?.toLowerCase();
    const hm = s.replace(/\s?(am|pm)/i, '');
    const [hStr, mStr = '00'] = hm.split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return '';
    if (ampm) {
      if (ampm === 'am') {
        if (h === 12) h = 0;
      } else if (ampm === 'pm') {
        if (h !== 12) h = (h % 12) + 12;
      }
    }
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  // Enviar reserva según modo (educativo/stripe)
  const handleConfirmBooking = async () => {
    if (!isCardFormValid() || !bookingData.agreeToTerms || !tourId || !tour) return;
    try {
      setSubmitLoading(true);
      setSubmitBanner(null);
      const participants = getTotalParticipants();
      const currency = getCurrency();
      const timeHHmm = toTimeHHmm(bookingData.time);

      if (isEducational()) {
        const res = await createEducationalBooking({
          activityId: tourId,
          date: bookingData.date,
          time: timeHHmm,
          participants,
          currency,
          customer: {
            firstName: bookingData.customerInfo.firstName,
            lastName: bookingData.customerInfo.lastName,
            email: bookingData.customerInfo.email,
            phone: bookingData.customerInfo.phone,
            country: bookingData.customerInfo.country,
            hotel: bookingData.customerInfo.hotel,
            roomNumber: bookingData.customerInfo.roomNumber,
          },
          billingAddress: {
            street: billingAddress.street,
            city: billingAddress.city,
            state: billingAddress.state,
            postalCode: billingAddress.postalCode,
            country: billingAddress.country,
            phone: billingAddress.phone,
            birthday: billingAddress.birthday,
          },
          card: {
            cardNumber: cardData.cardNumber,
            expiryDate: cardData.expiryDate,
            cvv: cardData.cvv,
            cardholderName: cardData.cardholderName,
          },
          notes: bookingData.specialRequests,
        });

        if (res?.data?.bookingId) {
          navigate(`/receipt/${res.data.bookingId}`);
        } else {
          const errorMsg = res?.data?.error || 'No pudimos validar la información proporcionada. Por favor revisa los datos e inténtalo nuevamente.';
          setSubmitBanner(errorMsg);
        }
      } else {
        const res = await initStripeBooking({
          activityId: tourId,
          date: bookingData.date,
          time: timeHHmm,
          participants,
          currency,
          customer: {
            firstName: bookingData.customerInfo.firstName,
            lastName: bookingData.customerInfo.lastName,
            email: bookingData.customerInfo.email,
            phone: bookingData.customerInfo.phone,
            country: bookingData.customerInfo.country,
            hotel: bookingData.customerInfo.hotel,
            roomNumber: bookingData.customerInfo.roomNumber,
          },
          notes: bookingData.specialRequests,
        });
        // Preparado para integrar Stripe Payment Element con clientSecret
        const clientSecret = (res as any)?.data?.clientSecret || (res as any)?.clientSecret;
        if (!clientSecret) {
          setSubmitBanner('No se pudo iniciar el pago.');
        } else {
          setSubmitBanner('Pago iniciado. Continúa con Stripe.');
        }
      }
    } catch (e: any) {
      console.error('Error al confirmar reserva:', e);
      setSubmitBanner(e?.response?.data?.message || e?.message || 'Error al confirmar la reserva');
    } finally {
      setSubmitLoading(false);
    }
  };

  const validateStep2 = () => {
    if (bookingData.adults < 1) {
      setStepError('Debe haber al menos 1 adulto.');
      return false;
    }
    if (bookingData.children !== bookingData.childAges.length) {
      setStepError('Por favor, indica la edad de cada niño.');
      return false;
    }
    return true;
  };

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone: string) => phone.replace(/\D/g, '').length >= 7; // validación básica

  const validateStep3 = () => {
    const errs: typeof contactErrors = {};
    if (!bookingData.customerInfo.firstName.trim()) errs.firstName = 'Nombre requerido';
    if (!bookingData.customerInfo.lastName.trim()) errs.lastName = 'Apellido requerido';
    if (!bookingData.customerInfo.email.trim()) errs.email = 'Email requerido';
    else if (!validateEmail(bookingData.customerInfo.email)) errs.email = 'Formato de email inválido';
    if (!bookingData.customerInfo.phone.trim()) errs.phone = 'Teléfono requerido';
    else if (!validatePhone(bookingData.customerInfo.phone)) errs.phone = 'Número de teléfono inválido';

    setContactErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStepError('Por favor, corrige los errores del formulario.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setStepError('');
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Funciones para el sistema de participantes simplificado
  const addAdult = () => {
    setBookingData({
      ...bookingData,
      adults: bookingData.adults + 1
    });
  };

  const removeAdult = () => {
    if (bookingData.adults > 1) {
      setBookingData({
        ...bookingData,
        adults: bookingData.adults - 1
      });
    }
  };

  const addChild = () => {
    setBookingData({
      ...bookingData,
      children: bookingData.children + 1,
      childAges: [...bookingData.childAges, 5]
    });
  };

  const removeChild = () => {
    if (bookingData.children > 0) {
      setBookingData({
        ...bookingData,
        children: bookingData.children - 1,
        childAges: bookingData.childAges.slice(0, -1)
      });
    }
  };

  const updateChildAge = (index: number, age: number) => {
    const newChildAges = [...bookingData.childAges];
    newChildAges[index] = age;
    setBookingData({
      ...bookingData,
      childAges: newChildAges
    });
  };

  // Funciones de cálculo de precios
  const getPriceForAge = (age: number) => {
    if (!tour) return 0;
    if (age <= 4) return 0; // Gratis
    if (age <= 8) return Math.round(tour.price * 0.5); // 50%
    return Math.round(tour.price); // 100%
  };



  const getPriceText = (age: number) => {
    if (age <= 4) return 'Gratis';
    if (age <= 8) return '50%';
    return '100%';
  };

  const getTotalParticipants = () => {
    return bookingData.adults + bookingData.children;
  };

  const calculateTotal = () => {
    if (!tour) return 0;
    const adultTotal = bookingData.adults * Math.round(tour.price);
    const childrenTotal = bookingData.childAges.reduce((total, age) => {
      return total + getPriceForAge(age);
    }, 0);
    return Math.round(adultTotal + childrenTotal);
  };

  const calculateDeposit = () => {
    return Math.round(calculateTotal() / 2);
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
        <div className="container-custom py-6 flex flex-row items-center justify-between">
          <div className="flex items-center mb-0 flex-1 min-w-0">
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
          <div className="text-right flex-shrink-0">
            <div className="text-sm text-blue-100">Precio por persona</div>
            <div className="text-2xl font-bold">${tour.price}</div>
          </div>
        </div>
      </div>
      
      {/* Progress Steps */}
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
              {/* Step 1: Tour Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Detalles del Tour</h3>
                    <p className="text-gray-500 text-sm mt-1">Selecciona la fecha y hora de tu reserva</p>
                  </div>
                  {stepError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{stepError}</div>
                  )}
                  
                  {/* Date Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        Fecha del Tour *
                      </span>
                    </label>
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="w-full px-4 py-3 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition"
                      >
                        <span className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {bookingData.date ? formatDate(bookingData.date) : 'Selecciona una fecha'}
                          </span>
                          <span className="text-gray-400">▾</span>
                        </span>
                      </button>
                      
                      {showCalendar && (
                        <div ref={calendarRef} className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded" aria-label="Mes anterior" title="Mes anterior">
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <h3 className="font-semibold text-gray-800">{getMonthName(currentMonth)}</h3>
                              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded" aria-label="Mes siguiente" title="Mes siguiente">
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                  {day}
                                </div>
                              ))}
                              {getDaysInMonth(currentMonth).map((day, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleDateSelect(day.date)}
                                  disabled={day.isPast}
                                  className={`p-2 text-sm rounded ${
                                    day.isPast 
                                      ? 'text-gray-300 cursor-not-allowed' 
                                      : day.isSelected
                                      ? 'bg-blue-600 text-white' 
                                      : day.isToday
                                      ? 'bg-blue-100 text-blue-600' 
                                      : day.isCurrentMonth
                                      ? 'hover:bg-gray-100' 
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {day.date.getDate()}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      <span className="inline-flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        Hora de Inicio *
                      </span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {availableTimes.map((time: string) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setBookingData({...bookingData, time})}
                          className={`px-3 py-2 rounded-full text-center text-sm transition-all border ${
                            bookingData.time === time
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Summary */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {bookingData.date && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {formatDate(bookingData.date)}
                      </span>
                    )}
                    {bookingData.time && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        {bookingData.time}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Participants */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Participantes</h3>
                    <p className="text-gray-500 text-sm mt-1">Selecciona la cantidad de adultos y niños</p>
                  </div>
                  {stepError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{stepError}</div>
                  )}
                  
                  {/* Adults */}
                  <div className="space-y-4 p-5 border border-gray-200 rounded-xl bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-semibold text-gray-900">Adultos</h4>
                        <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">18+ años</span>
                      </div>
                      <span className="text-sm text-gray-600">${tour.price} por persona</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={removeAdult}
                          disabled={bookingData.adults <= 1}
                          aria-label="Disminuir adultos"
                          className="w-11 h-11 rounded-full border border-gray-300 bg-white text-gray-700 flex items-center justify-center disabled:opacity-40 hover:border-gray-400 transition"
                        >
                          −
                        </button>
                        <span className="text-2xl font-bold w-12 text-center">{bookingData.adults}</span>
                        <button
                          onClick={addAdult}
                          aria-label="Aumentar adultos"
                          className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm hover:from-blue-700 hover:to-indigo-700 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="space-y-4 p-5 border border-gray-200 rounded-xl bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-semibold text-gray-900">Niños</h4>
                        <span className="ml-2 inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">0–17 años</span>
                      </div>
                      <span className="text-sm text-gray-600">Descuentos según edad</span>
                    </div>

                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
                      <div className="flex items-center gap-2 font-medium">
                        <Shield className="w-4 h-4" />
                        Políticas de precios para niños
                      </div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        <li>0–4 años: Gratis</li>
                        <li>5–8 años: 50% del precio</li>
                        <li>9+ años: 100% del precio</li>
                      </ul>
                      <p className="mt-1 text-[12px] text-blue-700/80">Se calcula automáticamente según la edad seleccionada.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={removeChild}
                        disabled={bookingData.children <= 0}
                        aria-label="Disminuir niños"
                        className="w-11 h-11 rounded-full border border-gray-300 bg-white text-gray-700 flex items-center justify-center disabled:opacity-40 hover:border-gray-400 transition"
                      >
                        −
                      </button>
                      <span className="text-2xl font-bold w-12 text-center">{bookingData.children}</span>
                      <button
                        onClick={addChild}
                        aria-label="Aumentar niños"
                        className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm hover:from-blue-700 hover:to-indigo-700 transition"
                      >
                        +
                      </button>
                    </div>

                    {bookingData.children > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-900">Edades de los niños</h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {bookingData.childAges.map((age, index) => (
                            <div key={index} className="p-3 border border-gray-200 rounded-lg bg-white">
                              <label htmlFor={`child-age-${index}`} className="text-sm text-gray-700 block mb-1">Niño {index + 1}</label>
                              <select
                                id={`child-age-${index}`}
                                aria-label={`Edad del niño ${index + 1}`}
                                title={`Edad del niño ${index + 1}`}
                                value={age}
                                onChange={(e) => updateChildAge(index, parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {Array.from({ length: 18 }, (_, i) => (
                                  <option key={i} value={i}>{i} años</option>
                                ))}
                              </select>
                              <div className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                                {getPriceText(age)} • ${getPriceForAge(age)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Customer Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">Información de Contacto</h3>
                    <p className="text-gray-500 text-sm mt-1">Proporciona tus datos para la confirmación</p>
                  </div>
                  {stepError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{stepError}</div>
                  )}

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-indigo-600 mt-0.5" />
                    <p>Usaremos esta información para enviarte la confirmación y detalles de tu reserva. Tus datos están protegidos.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={bookingData.customerInfo.firstName}
                          onChange={(e) => setBookingData({
                            ...bookingData,
                            customerInfo: {...bookingData.customerInfo, firstName: e.target.value}
                          })}
                          className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${contactErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Tu nombre"
                        />
                      </div>
                      {contactErrors.firstName && (<p className="text-xs text-red-600">{contactErrors.firstName}</p>)}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Apellido *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={bookingData.customerInfo.lastName}
                          onChange={(e) => setBookingData({
                            ...bookingData,
                            customerInfo: {...bookingData.customerInfo, lastName: e.target.value}
                          })}
                          className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${contactErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Tu apellido"
                        />
                      </div>
                      {contactErrors.lastName && (<p className="text-xs text-red-600">{contactErrors.lastName}</p>)}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Email *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={bookingData.customerInfo.email}
                          onChange={(e) => setBookingData({
                            ...bookingData,
                            customerInfo: {...bookingData.customerInfo, email: e.target.value}
                          })}
                          className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${contactErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="tu@email.com"
                        />
                      </div>
                      {contactErrors.email && (<p className="text-xs text-red-600">{contactErrors.email}</p>)}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Teléfono *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={bookingData.customerInfo.phone}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 15);
                            setBookingData({
                              ...bookingData,
                              customerInfo: { ...bookingData.customerInfo, phone: digits }
                            });
                          }}
                          inputMode="numeric"
                          autoComplete="tel"
                          name="contact-phone"
                          maxLength={15}
                          pattern="\d{7,15}"
                          autoCorrect="off"
                          autoCapitalize="none"
                          spellCheck={false}
                          className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${contactErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="+1 234 567 890"
                        />
                      </div>
                      {contactErrors.phone && (<p className="text-xs text-red-600">{contactErrors.phone}</p>)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Solicitudes Especiales</label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Cualquier solicitud especial o información adicional..."
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Payment Information */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Información de Pago</h3>
                    <p className="text-gray-500 mt-1">Completa los datos de pago para confirmar tu reserva</p>
                  </div>
                  {!isEducational() && (
                    <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                      Modo Stripe: Nunca almacenamos datos de tu tarjeta. Se procesará el pago de forma segura y solo se guardará el token de Stripe.
                    </div>
                  )}
                  
                  {/* Tarjeta de Pago */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-gray-800">Método de Pago</h4>
                      <div className="flex items-center space-x-4">
                        {/* Visa */}
                        <div className="flex items-center justify-center w-16 h-10 bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                            alt="Visa" 
                            className="h-5 w-auto object-contain"
                          />
                        </div>
                        
                        {/* Mastercard */}
                        <div className="flex items-center justify-center w-16 h-10 bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                            alt="Mastercard" 
                            className="h-5 w-auto object-contain"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-5">
                      {/* Número de Tarjeta */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Número de Tarjeta *</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={cardData.cardNumber.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s/g, '');
                              if (value === '' || /^\d+$/.test(value)) {
                                setCardData({...cardData, cardNumber: value});
                              }
                            }}
                            maxLength={19}
                            autoComplete="off"
                            inputMode="numeric"
                            name="card-number-nofill"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Fecha de Vencimiento */}
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">Fecha de vencimiento *</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                              type="tel"
                              value={cardData.expiryDate}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                                let formatted = digits;
                                if (digits.length > 2) {
                                  formatted = `${digits.slice(0,2)}/${digits.slice(2)}`;
                                }
                                setCardData({ ...cardData, expiryDate: formatted });
                              }}
                              maxLength={5}
                              autoComplete="off"
                              inputMode="numeric"
                              name="card-exp-nofill"
                              autoCorrect="off"
                              autoCapitalize="none"
                              spellCheck={false}
                              pattern="^(0[1-9]|1[0-2])\/[0-9]{2}$"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Fecha expiración"
                            />
                          </div>
                        </div>
                        
                        {/* CVV */}
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">CVV *</label>
                          <div className="relative">
                            <Shield className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              value={cardData.cvv}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                                setCardData({ ...cardData, cvv: digits });
                              }}
                              maxLength={4}
                              autoComplete="off"
                              inputMode="numeric"
                              name="card-cvc-nofill"
                              autoCorrect="off"
                              autoCapitalize="none"
                              spellCheck={false}
                              pattern="\d{3,4}"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="CVV"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Nombre del Titular */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Nombre del Titular *</label>
                        <input
                          type="text"
                          value={cardData.cardholderName}
                          onChange={(e) => setCardData({...cardData, cardholderName: e.target.value})}
                          autoComplete="off"
                          name="card-name-nofill"
                          autoCorrect="off"
                          autoCapitalize="none"
                          spellCheck={false}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Nombre en la tarjeta"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sección de Dirección de Facturación */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-gray-800">Dirección de Facturación</h4>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="sameAsCustomerInfo"
                          checked={billingAddress.useCustomerInfo}
                          onChange={(e) => {
                            const useCustomerInfo = e.target.checked;
                            setBillingAddress({
                              ...billingAddress,
                              useCustomerInfo,
                              ...(useCustomerInfo ? {
                                street: `${bookingData.customerInfo.hotel || ''} ${bookingData.customerInfo.roomNumber ? `Habitación ${bookingData.customerInfo.roomNumber}` : ''}`.trim(),
                                city: 'Punta Cana',
                                state: 'La Altagracia',
                                country: 'República Dominicana',
                                phone: bookingData.customerInfo.phone || ''
                                // No copiamos la fecha de nacimiento ya que no está en customerInfo
                              } : {})
                            });
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sameAsCustomerInfo" className="ml-2 block text-sm text-gray-700">
                          Usar información de contacto
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Calle */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Calle y Número *</label>
                        <input
                          type="text"
                          value={billingAddress.street}
                          onChange={(e) => setBillingAddress({...billingAddress, street: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Calle, número, apartamento, etc."
                          disabled={billingAddress.useCustomerInfo}
                        />
                      </div>

                      {/* Fila para Ciudad y Código Postal */}
                      <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        {/* Ciudad */}
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">Ciudad *</label>
                          <input
                            type="text"
                            value={billingAddress.city}
                            onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Ciudad"
                            disabled={billingAddress.useCustomerInfo}
                          />
                        </div>

                        {/* Código Postal */}
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">Código Postal *</label>
                          <input
                            type="text"
                            value={billingAddress.postalCode}
                            onChange={(e) => setBillingAddress({...billingAddress, postalCode: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Código postal"
                          />
                        </div>
                      </div>

                      {/* Estado/Provincia */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Estado/Provincia *</label>
                        <input
                          type="text"
                          value={billingAddress.state}
                          onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Estado/Provincia"
                          disabled={billingAddress.useCustomerInfo}
                        />
                      </div>

                      {/* Teléfono */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Teléfono *</label>
                        <input
                          type="tel"
                          value={billingAddress.phone}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 15);
                            setBillingAddress({ ...billingAddress, phone: digits });
                          }}
                          inputMode="numeric"
                          autoComplete="tel"
                          name="billing-phone"
                          maxLength={15}
                          pattern="\d{7,15}"
                          autoCorrect="off"
                          autoCapitalize="none"
                          spellCheck={false}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="+1 (123) 456-7890"
                        />
                      </div>

                      {/* Fecha de Nacimiento - UI moderna con 3 selects */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento *</label>
                        <div className="grid grid-cols-3 gap-3">
                          {/* Día */}
                          <div className="relative">
                            <select
                              id="birthday-day"
                              aria-label="Día"
                              title="Día"
                              value={(billingAddress.birthday || '').split('-')[2] || ''}
                              onChange={(e) => {
                                const [yy = '', mm = ''] = (billingAddress.birthday || '').split('-');
                                const newDay = e.target.value.padStart(2, '0');
                                const newBirthday = `${yy || ''}-${(mm || '').padStart(2,'0')}-${newDay}`;
                                setBillingAddress({ ...billingAddress, birthday: newBirthday });
                              }}
                              className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="" disabled>Día</option>
                              {Array.from({ length: 31 }, (_, i) => {
                                const v = String(i + 1).padStart(2, '0');
                                return <option key={v} value={v}>{i + 1}</option>;
                              })}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">▾</span>
                          </div>

                          {/* Mes */}
                          <div className="relative">
                            <select
                              id="birthday-month"
                              aria-label="Mes"
                              title="Mes"
                              value={(billingAddress.birthday || '').split('-')[1] || ''}
                              onChange={(e) => {
                                const [yy = '', _mm = '', dd = ''] = (billingAddress.birthday || '').split('-');
                                const newMonth = e.target.value;
                                const newBirthday = `${yy || ''}-${newMonth}-${(dd || '').padStart(2,'0')}`;
                                setBillingAddress({ ...billingAddress, birthday: newBirthday });
                              }}
                              className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="" disabled>Mes</option>
                              {[
                                '01','02','03','04','05','06','07','08','09','10','11','12'
                              ].map((m) => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">▾</span>
                          </div>

                          {/* Año */}
                          <div className="relative">
                            <select
                              id="birthday-year"
                              aria-label="Año"
                              title="Año"
                              value={(billingAddress.birthday || '').split('-')[0] || ''}
                              onChange={(e) => {
                                const [_yy = '', mm = '', dd = ''] = (billingAddress.birthday || '').split('-');
                                const newYear = e.target.value;
                                const newBirthday = `${newYear}-${(mm || '').padStart(2,'0')}-${(dd || '').padStart(2,'0')}`;
                                setBillingAddress({ ...billingAddress, birthday: newBirthday });
                              }}
                              className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="" disabled>Año</option>
                              {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                <option key={y} value={y}>{y}</option>
                              ))}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">▾</span>
                          </div>
                        </div>
                      </div>

                      {/* País */}
                      <div className="space-y-1">
                        <label htmlFor="billing-country" className="block text-sm font-medium text-gray-700">País *</label>
                        <select
                          id="billing-country"
                          value={billingAddress.country}
                          onChange={(e) => setBillingAddress({...billingAddress, country: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          disabled={billingAddress.useCustomerInfo}
                          aria-label="País"
                          title="País"
                        >
                          {COUNTRIES.map((name) => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-xl p-5">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          id="agreeTerms"
                          checked={bookingData.agreeToTerms}
                          onChange={(e) => setBookingData({...bookingData, agreeToTerms: e.target.checked})}
                          className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="agreeTerms" className="text-sm text-amber-800">
                          Al hacer clic en "Confirmar Reserva", acepto los{' '}
                          <a href="/terminos" className="text-blue-600 hover:text-blue-800 font-medium underline">
                            Términos y Condiciones
                          </a>{' '}
                          y la{' '}
                          <a href="/privacidad" className="text-blue-600 hover:text-blue-800 font-medium underline">
                            Política de Privacidad
                          </a>{' '}
                          de Punta Cana Excursiones. Entiendo que mi tarjeta será cargada según los términos de la reserva.
                        </label>
                        <div className="mt-3 flex items-center text-amber-700">
                          <Shield className="h-5 w-5 mr-2 flex-shrink-0" />
                          <span className="text-xs">Pago seguro con encriptación SSL de 256-bit</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Anterior
                  </button>
                )}
                <div className="ml-auto">
                  {currentStep < 4 ? (
                    <button
                      onClick={handleNextStep}
                      className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirmBooking}
                      disabled={submitLoading || !isCardFormValid() || !bookingData.agreeToTerms}
                      className={`flex items-center px-8 py-3 rounded-lg transition-colors ${
                        !submitLoading && isCardFormValid() && bookingData.agreeToTerms
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {submitLoading ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" /> Procesando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Confirmar Reserva
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Submit feedback banner */}
              {submitBanner && (
                <div
                  className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  role="alert"
                  aria-live="assertive"
                >
                  {submitBanner}
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-4 px-6">
                  <h3 className="text-lg font-semibold">Resumen de Reserva</h3>
                </div>
                
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

                  <div className="border-t border-dashed my-4"></div>

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
                          {getTotalParticipants()} {getTotalParticipants() === 1 ? 'persona' : 'personas'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed my-4"></div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">Resumen de Precio</h5>
                    
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-gray-600">Precio por persona</span>
                      <span className="font-medium">${tour.price}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Participantes</span>
                      <span className="font-medium">x {getTotalParticipants()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm font-medium pt-2 border-t">
                      <span>Subtotal</span>
                      <span>${calculateTotal()}</span>
                    </div>
                    
                    {currentStep === 4 && (
                      <div className="flex justify-between items-center text-sm text-indigo-700 bg-indigo-50 p-2 rounded">
                        <span className="font-medium">Depósito (50%)</span>
                        <span className="font-medium">${calculateDeposit()}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total a pagar</span>
                      <span className="text-xl font-bold text-indigo-600">
                        ${currentStep === 4 ? calculateDeposit() : calculateTotal()}
                      </span>
                    </div>
                    {currentStep === 4 && (
                      <p className="text-xs text-gray-500 mt-1">
                        * El resto del pago se realizará el día del tour
                      </p>
                    )}
                  </div>

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
