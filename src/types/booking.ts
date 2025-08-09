export interface Booking {
  id: string;
  activityId: string;
  activityTitle: string;
  activityLocation: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  people: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface CreateBookingData {
  activityId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  people: number;
  notes?: string;
}

export interface UpdateBookingData extends Partial<CreateBookingData> {
  id: string;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
}

export interface BookingFilters {
  search?: string;
  status?: BookingStatus | 'all';
  paymentStatus?: PaymentStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
  activityId?: string;
  sortBy?: 'newest' | 'oldest' | 'date-asc' | 'date-desc' | 'amount-high' | 'amount-low';
}

export interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
}
