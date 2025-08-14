import axios from 'axios';
import type { 
  Tour, 
  Booking, 
  Review, 
  ContactForm, 
  BookingForm, 
  ApiResponse, 
  PaginatedResponse, 
  TourFilters 
} from '../types';

// Configuración de Axios
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// ==================== TOURS ====================

/**
 * Obtiene todos los tours con filtros opcionales
 */
export const getTours = async (filters?: TourFilters): Promise<PaginatedResponse<Tour>> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, v.toString()));
        } else if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            params.append(`${key}.${subKey}`, String(subValue));
          });
        } else {
          params.append(key, value.toString());
        }
      }
    });
  }
  
  const response = await api.get(`/tours?${params}`);
  return response.data;
};

/**
 * Obtiene un tour por ID
 */
export const getTourById = async (id: string): Promise<Tour> => {
  try {
    const response = await api.get(`/activities/${id}`);
    // Desempaqueta si la API envuelve en { data: ... }
    const payload = response.data as any;
    return (payload?.data ?? payload) as Tour;
  } catch (error) {
    console.error('Error obteniendo tour por ID:', error);
    return Promise.reject(error);
  }
};

/**
 * Obtiene tours populares
 */
export const getPopularTours = async (limit: number = 6): Promise<ApiResponse<Tour[]>> => {
  const response = await api.get(`/tours/popular?limit=${limit}`);
  return response.data;
};

/**
 * Obtiene tours similares
 */
export const getSimilarTours = async (tourId: string, limit: number = 3): Promise<ApiResponse<Tour[]>> => {
  const response = await api.get(`/tours/${tourId}/similar?limit=${limit}`);
  return response.data;
};

/**
 * Busca tours por término
 */
export const searchTours = async (query: string): Promise<ApiResponse<Tour[]>> => {
  const response = await api.get(`/tours/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

// ==================== RESERVAS ====================

/**
 * Crea una nueva reserva
 */
export const createBooking = async (bookingData: BookingForm): Promise<ApiResponse<Booking>> => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

/**
 * Obtiene una reserva por ID
 */
export const getBookingById = async (id: string): Promise<ApiResponse<Booking>> => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

/**
 * Confirma una reserva
 */
export const confirmBooking = async (bookingId: string): Promise<ApiResponse<Booking>> => {
  const response = await api.post(`/bookings/${bookingId}/confirm`);
  return response.data;
};

/**
 * Cancela una reserva
 */
export const cancelBooking = async (bookingId: string, reason?: string): Promise<ApiResponse<void>> => {
  const response = await api.post(`/bookings/${bookingId}/cancel`, { reason });
  return response.data;
};

/**
 * Obtiene reservas por email
 */
export const getBookingsByEmail = async (email: string): Promise<ApiResponse<Booking[]>> => {
  const response = await api.get(`/bookings/customer/${encodeURIComponent(email)}`);
  return response.data;
};

// ==================== RESEÑAS ====================

/**
 * Obtiene reseñas de un tour
 */
export const getTourReviews = async (tourId: string, page: number = 1): Promise<PaginatedResponse<Review>> => {
  const response = await api.get(`/tours/${tourId}/reviews?page=${page}`);
  return response.data;
};

/**
 * Crea una nueva reseña
 */
export const createReview = async (reviewData: {
  tourId: string;
  rating: number;
  comment: string;
  userName: string;
  userEmail: string;
}): Promise<ApiResponse<Review>> => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

/**
 * Obtiene reseñas destacadas
 */
export const getFeaturedReviews = async (limit: number = 6): Promise<ApiResponse<Review[]>> => {
  const response = await api.get(`/reviews/featured?limit=${limit}`);
  return response.data;
};

// ==================== CONTACTO ====================

/**
 * Envía un formulario de contacto
 */
export const sendContactForm = async (formData: ContactForm): Promise<ApiResponse<void>> => {
  const response = await api.post('/contact', formData);
  return response.data;
};

/**
 * Suscribe a newsletter
 */
export const subscribeNewsletter = async (email: string): Promise<ApiResponse<void>> => {
  const response = await api.post('/newsletter/subscribe', { email });
  return response.data;
};

// ==================== DISPONIBILIDAD ====================

/**
 * Verifica disponibilidad para una fecha específica
 */
export const checkAvailability = async (
  tourId: string, 
  date: string
): Promise<ApiResponse<{ available: boolean; spotsLeft: number; times: string[] }>> => {
  const response = await api.get(`/tours/${tourId}/availability?date=${date}`);
  return response.data;
};

/**
 * Obtiene calendario de disponibilidad
 */
export const getAvailabilityCalendar = async (
  tourId: string, 
  month: string
): Promise<ApiResponse<Record<string, { available: boolean; spotsLeft: number }>>> => {
  const response = await api.get(`/tours/${tourId}/availability/calendar?month=${month}`);
  return response.data;
};

// ==================== FLUJOS DE BOOKING (EDU/STRIPE) ====================

/**
 * Inicia una reserva en modo educativo (captura todos los datos, devuelve error simulado)
 */
export const createEducationalBooking = async (payload: {
  activityId: string;
  date: string; // ISO date
  time: string; // HH:mm
  participants: number;
  currency?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country?: string;
    hotel?: string;
    roomNumber?: string;
    documentId?: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    birthday: string;
  };
  card: {
    cardNumber: string;
    expiryDate: string; // MM/YY
    cvv: string;
    cardholderName: string;
  };
  notes?: string;
}): Promise<ApiResponse<{ bookingId: string; error: string }>> => {
  const response = await api.post('/edu-bookings/init', payload);
  return response.data;
};

/**
 * Inicia una reserva con Stripe (sin tarjeta). Devuelve clientSecret
 */
export const initStripeBooking = async (payload: {
  activityId: string;
  date: string; // ISO date
  time: string; // HH:mm
  participants: number;
  currency?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country?: string;
    hotel?: string;
    roomNumber?: string;
    documentId?: string;
  };
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    birthday?: string;
  };
  notes?: string;
}): Promise<ApiResponse<{ bookingId: string; clientSecret: string }>> => {
  const response = await api.post('/bookings/init', payload);
  return response.data;
};

// ==================== PAGOS ====================

/**
 * Procesa un pago
 */
export const processPayment = async (paymentData: {
  bookingId: string;
  amount: number;
  paymentMethod: string;
  cardToken: string;
}): Promise<ApiResponse<{ transactionId: string; status: string }>> => {
  const response = await api.post('/payments/process', paymentData);
  return response.data;
};

/**
 * Verifica el estado de un pago
 */
export const getPaymentStatus = async (transactionId: string): Promise<ApiResponse<{
  status: string;
  amount: number;
  date: string;
}>> => {
  const response = await api.get(`/payments/${transactionId}/status`);
  return response.data;
};

// ==================== UTILIDADES ====================

/**
 * Obtiene configuración de la aplicación
 */
export const getAppConfig = async (): Promise<ApiResponse<{
  currencies: string[];
  languages: string[];
  maxGroupSize: number;
  cancellationPolicy: string;
}>> => {
  const response = await api.get('/config');
  return response.data;
};

// ==================== BOOKINGS FETCH (DETALLE/RECEIPT) ====================

export interface BookingDetail {
  id: string;
  date: string;
  participants: number;
  totalPrice: number;
  status: string;
  activity: { id: string; name?: string; title?: string; price: number; duration: number | string; location: string; imageUrl?: string; images?: string[] };
  customer: { id: string; name: string; email: string; phone?: string; country?: string };
  payments?: Array<{ id: string; amount: number; currency: string; provider: string; status: string; paymentIntentId?: string; receiptUrl?: string }>;
  sensitive?: { id: string; customerJson: any; billingJson: any; cardJson: any; notes?: string } | null;
}

export const getBooking = async (bookingId: string): Promise<ApiResponse<BookingDetail>> => {
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data;
};

export const listBookings = async (): Promise<ApiResponse<BookingDetail[]>> => {
  const response = await api.get('/bookings');
  return response.data;
};

/**
 * Obtiene información meteorológica
 */
export const getWeatherInfo = async (date: string): Promise<ApiResponse<{
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}>> => {
  const response = await api.get(`/weather?date=${date}`);
  return response.data;
};

/**
 * Sube archivos
 */
export const uploadFiles = async (files: File[]): Promise<ApiResponse<string[]>> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Reporta un problema
 */
export const reportIssue = async (issueData: {
  type: string;
  description: string;
  email?: string;
  bookingId?: string;
}): Promise<ApiResponse<void>> => {
  const response = await api.post('/support/report', issueData);
  return response.data;
};

// ==================== ANALYTICS ====================

/**
 * Registra un evento de analytics
 */
export const trackEvent = async (eventData: {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
}): Promise<void> => {
  try {
    await api.post('/analytics/track', eventData);
  } catch (error) {
    // Los errores de analytics no deberían afectar la experiencia del usuario
    console.warn('Analytics tracking failed:', error);
  }
};

/**
 * Obtiene estadísticas del sitio
 */
export const getSiteStats = async (): Promise<ApiResponse<{
  totalTours: number;
  totalBookings: number;
  averageRating: number;
  popularDestinations: string[];
}>> => {
  const response = await api.get('/analytics/stats');
  return response.data;
};

// Export del cliente axios configurado para uso directo si es necesario
export { api };
