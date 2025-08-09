export interface Activity {
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
  category: ActivityCategory;
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
  itinerary?: ItineraryItem[];
  faqs?: FAQ[];
  createdAt?: string;
  updatedAt?: string;
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
  | 'relax'
  | 'nocturna';

export interface CreateActivityData {
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: string;
  maxPeople: number;
  location: string;
  meetingPoint: string;
  category: ActivityCategory;
  included: string[];
  notIncluded: string[];
  requirements: string[];
  tags: string[];
  featured: boolean;
  active: boolean;
  images: string[];
}

export interface UpdateActivityData extends Partial<CreateActivityData> {
  id: string;
}

export interface ActivityFilters {
  search?: string;
  category?: ActivityCategory | 'all';
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
