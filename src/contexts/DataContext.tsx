import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Activity } from '../types/activity';
import axios from 'axios';

interface DataContextType {
  activities: Activity[];
  addActivity: (_activity: Activity) => Promise<Activity>;
  updateActivity: (_id: string, _activity: Activity) => Promise<Activity>;
  deleteActivity: (_id: string) => Promise<void>;
  bookings: any[];
  addBooking: (_booking: any) => Promise<any>;
  customers: any[];
  addCustomer: (_customer: any) => Promise<any>;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

// API base URL
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// Crear el contexto
const DataContext = createContext<DataContextType | undefined>(undefined);

// Proveedor del contexto
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar datos desde la API con early returns
  const fetchData = useCallback(async () => {
    console.log('DataContext: Iniciando fetchData()');
    setIsLoading(true);
    setError(null);

    try {
      // Cargar actividades
      console.log('DataContext: Obteniendo actividades...');
      const activitiesResponse = await axios.get(`${API_URL}/activities`);
      console.log('DataContext: Actividades obtenidas:', activitiesResponse.data.length);
      setActivities(activitiesResponse.data);
      
      // Cargar reservas y clientes en paralelo para mejor performance
      const [bookingsResponse, customersResponse] = await Promise.allSettled([
        axios.get(`${API_URL}/bookings`),
        axios.get(`${API_URL}/customers`)
      ]);
      
      if (bookingsResponse.status === 'fulfilled') {
        console.log('DataContext: Reservas obtenidas:', bookingsResponse.value.data.length);
        setBookings(bookingsResponse.value.data);
      }
      
      if (customersResponse.status === 'fulfilled') {
        console.log('DataContext: Clientes obtenidos:', customersResponse.value.data.length);
        setCustomers(customersResponse.value.data);
      }
      
      console.log('DataContext: Todos los datos cargados correctamente');
    } catch (error) {
      console.error('DataContext: Error al cargar datos desde la API:', error);
      setError('Error al cargar los datos');
      // Fallback a localStorage
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para cargar desde localStorage (fallback)
  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedActivities = localStorage.getItem('activities');
      const savedBookings = localStorage.getItem('bookings');
      const savedCustomers = localStorage.getItem('customers');

      if (savedActivities) {
        setActivities(JSON.parse(savedActivities));
      }

      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      }

      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers));
      }
    } catch (error) {
      console.error('DataContext: Error parsing localStorage data', error);
      setError('Error al cargar datos locales');
    }
  }, []);

  // Función para guardar en localStorage
  const saveToLocalStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`DataContext: Error saving to localStorage (${key})`, error);
    }
  }, []);

  // Función para agregar una nueva actividad
  const addActivity = useCallback(async (activity: Activity): Promise<Activity> => {
    console.log('DataContext: Agregando nueva actividad:', activity);
    
    // Early return si no hay datos válidos
    if (!activity.name || !activity.description) {
      throw new Error('Datos de actividad incompletos');
    }
    
    const prismaCompatibleData = {
      name: activity.name,
      slug: activity.slug,
      description: activity.description,
      price: Number(activity.price),
      duration: Number(activity.duration),
      location: activity.location,
      imageUrl: activity.imageUrl,
      featured: Boolean(activity.featured),
      active: Boolean(activity.active),
      capacity: Number(activity.capacity),
      category: activity.category,
      rating: Number(activity.rating || 4.5),
      reviews: Number(activity.reviews || 0),
      // Campos adicionales del frontend
      shortDescription: activity.shortDescription,
      meetingPoint: activity.meetingPoint,
      included: activity.included || [],
      notIncluded: activity.notIncluded || [],
      requirements: activity.requirements || [],
      highlights: activity.highlights || [],
      tags: activity.tags || [],
      images: activity.images || [],
      languages: activity.languages || ['Español'],
      availability: activity.availability || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      startTime: activity.startTime || ['9:00 AM'],
      originalPrice: activity.originalPrice ? Number(activity.originalPrice) : null,
      minAge: Number(activity.minAge || 0),
      pickupIncluded: Boolean(activity.pickupIncluded),
      itinerary: activity.itinerary ? JSON.stringify(activity.itinerary) : null
    };
    
    try {
      console.log('DataContext: Enviando datos a la API:', prismaCompatibleData);
      const response = await axios.post(`${API_URL}/activities`, prismaCompatibleData);
      const newActivity = response.data;
      console.log('DataContext: Actividad creada correctamente en API:', newActivity);
      
      // Crear objeto completo con todos los campos del frontend
      const fullActivity = {
        ...newActivity,
        // Campos específicos del frontend que deben preservarse
        shortDescription: activity.shortDescription || '',
        meetingPoint: activity.meetingPoint || '',
        included: activity.included || [],
        notIncluded: activity.notIncluded || [],
        excluded: activity.notIncluded || activity.excluded || [],
        requirements: activity.requirements || [],
        highlights: activity.highlights || [],
        tags: activity.tags || [],
        images: activity.images || [],
        languages: activity.languages || ['Español'],
        availability: activity.availability || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        startTime: activity.startTime || ['9:00 AM'],
        originalPrice: activity.originalPrice || 0,
        minAge: activity.minAge || 0,
        pickupIncluded: activity.pickupIncluded || false,
        title: activity.name,
        maxPeople: activity.capacity,
        reviewCount: activity.reviews,
        itinerary: activity.itinerary || [
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
      
      console.log('DataContext: Objeto completo para agregar al estado:', fullActivity);
      
      setActivities(prev => {
        const updatedActivities = [...prev, fullActivity];
        console.log('DataContext: Estado actualizado con', updatedActivities.length, 'actividades');
        saveToLocalStorage('activities', updatedActivities);
        return updatedActivities;
      });
      
      return fullActivity;
    } catch (apiError) {
      console.error('DataContext: Error en la llamada a la API:', apiError);
      
      // Fallback: crear temporalmente en localStorage
      const tempActivity = {
        ...activity,
        id: activity.id || `temp_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setActivities(prev => {
        const updatedActivities = [...prev, tempActivity];
        saveToLocalStorage('activities', updatedActivities);
        return updatedActivities;
      });
      
      return tempActivity;
    }
  }, [saveToLocalStorage]);

  // Función para actualizar una actividad existente
  const updateActivity = useCallback(async (id: string, updatedActivity: Activity): Promise<Activity> => {
    console.log('DataContext: Actualizando actividad con ID:', id, 'Datos:', updatedActivity);
    
    // Early return si no hay ID válido
    if (!id) {
      throw new Error('ID de actividad requerido');
    }
    
    const prismaCompatibleData = {
      name: updatedActivity.name,
      slug: updatedActivity.slug,
      description: updatedActivity.description,
      price: Number(updatedActivity.price),
      duration: Number(updatedActivity.duration),
      location: updatedActivity.location,
      imageUrl: updatedActivity.imageUrl,
      featured: Boolean(updatedActivity.featured),
      active: Boolean(updatedActivity.active),
      capacity: Number(updatedActivity.capacity),
      category: updatedActivity.category,
      rating: Number(updatedActivity.rating || 4.5),
      reviews: Number(updatedActivity.reviews || 0),
      // Campos adicionales del frontend
      shortDescription: updatedActivity.shortDescription,
      meetingPoint: updatedActivity.meetingPoint,
      included: updatedActivity.included || [],
      notIncluded: updatedActivity.notIncluded || [],
      requirements: updatedActivity.requirements || [],
      highlights: updatedActivity.highlights || [],
      tags: updatedActivity.tags || [],
      images: updatedActivity.images || [],
      languages: updatedActivity.languages || ['Español'],
      availability: updatedActivity.availability || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      startTime: updatedActivity.startTime || ['9:00 AM'],
      originalPrice: updatedActivity.originalPrice ? Number(updatedActivity.originalPrice) : null,
      minAge: Number(updatedActivity.minAge || 0),
      pickupIncluded: Boolean(updatedActivity.pickupIncluded),
      itinerary: updatedActivity.itinerary ? JSON.stringify(updatedActivity.itinerary) : null
    };
    
    try {
      const response = await axios.put(`${API_URL}/activities/${id}`, prismaCompatibleData);
      const updated = response.data;
      console.log('DataContext: Actividad actualizada correctamente en API:', updated);
      
      // Crear objeto completo con todos los campos del frontend
      const fullActivity = {
        ...updated,
        // Campos específicos del frontend que deben preservarse
        shortDescription: updatedActivity.shortDescription || '',
        meetingPoint: updatedActivity.meetingPoint || '',
        included: updatedActivity.included || [],
        notIncluded: updatedActivity.notIncluded || [],
        excluded: updatedActivity.notIncluded || updatedActivity.excluded || [],
        requirements: updatedActivity.requirements || [],
        highlights: updatedActivity.highlights || [],
        tags: updatedActivity.tags || [],
        images: updatedActivity.images || [],
        languages: updatedActivity.languages || ['Español'],
        availability: updatedActivity.availability || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        startTime: updatedActivity.startTime || ['9:00 AM'],
        originalPrice: updatedActivity.originalPrice || 0,
        minAge: updatedActivity.minAge || 0,
        pickupIncluded: updatedActivity.pickupIncluded || false,
        title: updatedActivity.name,
        maxPeople: updatedActivity.capacity,
        reviewCount: updatedActivity.reviews,
        itinerary: updatedActivity.itinerary || [
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
      
      console.log('DataContext: Objeto completo para actualizar en estado:', fullActivity);
      
      setActivities(prev => {
        const updatedActivities = prev.map(activity => 
          activity.id === id ? { ...fullActivity, updatedAt: new Date().toISOString() } : activity
        );
        console.log('DataContext: Estado actualizado con', updatedActivities.length, 'actividades');
        saveToLocalStorage('activities', updatedActivities);
        return updatedActivities;
      });
      
      // Forzar una actualización completa de los datos para asegurar sincronización
      setTimeout(async () => {
        try {
          console.log('DataContext: Forzando actualización completa de datos...');
          await fetchData();
        } catch (error) {
          console.error('DataContext: Error en actualización forzada:', error);
        }
      }, 100);
      
      return fullActivity;
    } catch (apiError) {
      console.error('DataContext: Error en la llamada a la API:', apiError);
      
      // Fallback: actualizar en localStorage
      const updatedWithTimestamp = {
        ...updatedActivity,
        updatedAt: new Date().toISOString()
      };
      
      setActivities(prev => {
        const updatedActivities = prev.map(activity => 
          activity.id === id ? updatedWithTimestamp : activity
        );
        saveToLocalStorage('activities', updatedActivities);
        return updatedActivities;
      });
      
      return updatedWithTimestamp;
    }
  }, [saveToLocalStorage, fetchData]);

  // Función para eliminar una actividad
  const deleteActivity = useCallback(async (id: string): Promise<void> => {
    if (!id) {
      throw new Error('ID de actividad requerido');
    }
    
    try {
      await axios.delete(`${API_URL}/activities/${id}`);
      
      setActivities(prev => {
        const updatedActivities = prev.filter(activity => activity.id !== id);
        saveToLocalStorage('activities', updatedActivities);
        return updatedActivities;
      });
    } catch (error) {
      console.error('DataContext: Error al eliminar actividad:', error);
      throw error;
    }
  }, [saveToLocalStorage]);

  // Funciones para reservas y clientes
  const addBooking = useCallback(async (booking: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_URL}/bookings`, booking);
      const newBooking = response.data;
      
      setBookings(prev => {
        const updatedBookings = [...prev, newBooking];
        saveToLocalStorage('bookings', updatedBookings);
        return updatedBookings;
      });
      
      return newBooking;
    } catch (error) {
      console.error('DataContext: Error al crear reserva:', error);
      throw error;
    }
  }, [saveToLocalStorage]);

  const addCustomer = useCallback(async (customer: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_URL}/customers`, customer);
      const newCustomer = response.data;
      
      setCustomers(prev => {
        const updatedCustomers = [...prev, newCustomer];
        saveToLocalStorage('customers', updatedCustomers);
        return updatedCustomers;
      });
      
      return newCustomer;
    } catch (error) {
      console.error('DataContext: Error al crear cliente:', error);
      throw error;
    }
  }, [saveToLocalStorage]);

  // Función para refrescar datos
  const refreshData = useCallback(async (): Promise<void> => {
    await fetchData();
  }, [fetchData]);

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(() => ({
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    bookings,
    addBooking,
    customers,
    addCustomer,
    isLoading,
    error,
    refreshData
  }), [
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    bookings,
    addBooking,
    customers,
    addCustomer,
    isLoading,
    error,
    refreshData
  ]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData debe ser usado dentro de un DataProvider');
  }
  return context;
};
