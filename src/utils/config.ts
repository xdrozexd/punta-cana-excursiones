// Utilidad de configuración para alternar flujos de reserva
// Usa VITE_BOOKING_MODE=educational|stripe

export type BookingMode = 'educational' | 'stripe';

const rawMode = (import.meta as any)?.env?.VITE_BOOKING_MODE as string | undefined;

export const getBookingMode = (): BookingMode => {
  const mode = (rawMode || 'educational').toLowerCase();
  return mode === 'stripe' ? 'stripe' : 'educational';
};

export const isEducational = () => getBookingMode() === 'educational';
export const isStripe = () => getBookingMode() === 'stripe';

export const getCurrency = () => (import.meta as any)?.env?.VITE_CURRENCY || 'USD';
