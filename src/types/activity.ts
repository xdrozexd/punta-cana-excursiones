export interface Activity {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration: number;
  location: string;
  imageUrl: string;
  featured: boolean;
  active: boolean;
  capacity: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  rating: number;
  reviews: number;
  originalPrice?: number;
  excluded?: string[];
  
  // Campos adicionales para compatibilidad con el frontend existente
  title?: string;
  shortDescription?: string;
  maxPeople?: number;
  maxGroupSize?: number;
  meetingPoint?: string;
  reviewCount?: number;
  images?: string[];
  included?: string[];
  notIncluded?: string[];
  requirements?: string[];
  tags?: string[];
  availability?: string[];
  startTime?: string[];
  highlights?: string[];
  itinerary?: ItineraryItem[];
  faqs?: FAQ[];
  minAge?: number;
  languages?: string[];
  pickupIncluded?: boolean;
  availableDates?: string[];
}

export type ActivityCategory = 
  | 'tours-islas'
  | 'aventura'
  | 'acuaticos'
  | 'cultural'
  | 'gastronomia'
  | 'nocturna'
  | 'relax';

export interface CreateActivityData {
  name: string;
  slug: string;
  description: string;
  price: number;
  duration: number;
  location: string;
  imageUrl: string;
  featured?: boolean;
  active?: boolean;
  capacity?: number;
  category?: string;
}

export interface UpdateActivityData extends Partial<CreateActivityData> {
  id: string;
}

export interface ActivityFilters {
  search?: string;
  category?: string | 'all';
  featured?: boolean;
  active?: boolean;
  sortBy?: 'newest' | 'oldest' | 'price-high' | 'price-low' | 'rating';
}

export interface ActivityStats {
  totalActivities: number;
  activeActivities: number;
  featuredActivities: number;
  averageRating: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface ItineraryItem {
  title: string;
  description: string;
  time?: string;
  image?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}