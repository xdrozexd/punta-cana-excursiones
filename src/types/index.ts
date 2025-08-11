// Re-export all types
export * from './activity';
export * from './booking';

// Common types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalActivities: number;
  totalBookings: number;
  monthlyRevenue: number;
  averageRating: number;
  activeUsers: number;
  growthRate: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ChartData {
  label: string;
  value: number;
  trend?: number;
}

export interface TimeSeriesData {
  label: string;
  reservas: number;
  ingresos: number;
}

// Form types
export interface FormError {
  field: string;
  message: string;
}

export interface FormState {
  isLoading: boolean;
  errors: FormError[];
  isDirty: boolean;
  isValid: boolean;
}

// API Error types
export interface ApiError {
  message: string;
  code: string;
  field?: string;
}

// File upload types
export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

// App notification types (renamed to avoid conflict with built-in Notification)
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Settings types
export interface AppSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  timezone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

// Tour types (for API compatibility)
export interface Tour {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  duration: string;
  maxPeople?: number;
  maxGroupSize?: number;
  location: string;
  meetingPoint?: string;
  category: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  images: string[];
  included: string[];
  notIncluded?: string[];
  requirements?: string[];
  tags?: string[];
  featured: boolean;
  active?: boolean;
  availability?: string[];
  startTime?: string[];
  highlights?: string[];
  createdAt?: string;
  updatedAt?: string;
  minAge?: number;
  languages?: string[];
  pickupIncluded?: boolean;
  availableDates?: string[];
}

// Review types
export interface Review {
  id: string;
  tourId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Contact form types
export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  tourId?: string;
  preferredContactMethod?: 'email' | 'phone' | 'whatsapp';
}

// Booking form types
export interface BookingForm {
  tourId: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    nationality?: string;
    passportNumber?: string;
  };
  bookingDetails: {
    date: string;
    time?: string;
    adults: number;
    children: number;
    infants: number;
    specialRequests?: string;
  };
  preferences: {
    dietaryRestrictions?: string[];
    accessibilityNeeds?: string[];
    pickupLocation?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  payment: {
    method: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
    amount: number;
    currency: string;
  };
}

// Tour filters types
export interface TourFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
  rating?: number;
  availability?: string;
  maxGroupSize?: number;
  features?: string[];
  sortBy?: 'price' | 'rating' | 'duration' | 'popularity' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}