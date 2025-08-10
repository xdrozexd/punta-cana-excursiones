import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Activity } from '../types/activity';
import axios from 'axios';

interface DataContextType {
  activities: Activity[];
  addActivity: (activity: Activity) => Promise<Activity>;
  updateActivity: (id: string, activity: Activity) => Promise<Activity>;
  deleteActivity: (id: string) => Promise<void>;
  bookings: any[];
  addBooking: (booking: any) => Promise<any>;
  customers: any[];
  addCustomer: (customer: any) => Promise<any>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear el contexto
const DataContext = createContext<DataContextType | undefined>(undefined);

// Proveedor del contexto
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para cargar datos desde la API
  const fetchData = async () => {
    console.log('DataContext: Iniciando fetchData()');
    setIsLoading(true);
    try {
      // Cargar actividades
      console.log('DataContext: Obteniendo actividades...');
      const activitiesResponse = await axios.get(`${API_URL}/activities`);
      console.log('DataContext: Actividades obtenidas:', activitiesResponse.data.length);
      setActivities(activitiesResponse.data);
      
      try {
        // Cargar reservas
        console.log('DataContext: Obteniendo reservas...');
        const bookingsResponse = await axios.get(`${API_URL}/bookings`);
        console.log('DataContext: Reservas obtenidas:', bookingsResponse.data.length);
        setBookings(bookingsResponse.data);
      } catch (bookingError) {
        console.error('Error al cargar reservas:', bookingError);
        // No interrumpir el flujo si falla la carga de reservas
      }
      
      try {
        // Cargar clientes
        console.log('DataContext: Obteniendo clientes...');
        const customersResponse = await axios.get(`${API_URL}/customers`);
        console.log('DataContext: Clientes obtenidos:', customersResponse.data.length);
        setCustomers(customersResponse.data);
      } catch (customerError) {
        console.error('Error al cargar clientes:', customerError);
        // No interrumpir el flujo si falla la carga de clientes
      }
      
      console.log('DataContext: Todos los datos cargados correctamente');
    } catch (error) {
      console.error('Error al cargar datos desde la API:', error);
      // Si hay error, intentar cargar desde localStorage como fallback
      console.log('DataContext: Intentando cargar desde localStorage como fallback');
      loadFromLocalStorage();
      throw error; // Re-lanzar el error para que se maneje en refreshData
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar desde localStorage (fallback)
  const loadFromLocalStorage = () => {
    // Intentar cargar desde localStorage
    const savedActivities = localStorage.getItem('activities');
    const savedBookings = localStorage.getItem('bookings');
    const savedCustomers = localStorage.getItem('customers');

    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch (error) {
        console.error('Error parsing activities from localStorage', error);
        setActivities([]);
      }
    }

    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (error) {
        console.error('Error parsing bookings from localStorage', error);
        setBookings([]);
      }
    }

    if (savedCustomers) {
      try {
        setCustomers(JSON.parse(savedCustomers));
      } catch (error) {
        console.error('Error parsing customers from localStorage', error);
        setCustomers([]);
      }
    }
  };

  // Cargar datos al iniciar
  useEffect(() => {
    fetchData();
  }, []);

  // Función para agregar una nueva actividad
  const addActivity = async (activity: Activity): Promise<Activity> => {
    try {
      console.log('Enviando datos de actividad a la API:', activity);
      
      // Asegurarse de que los datos son compatibles con el esquema de Prisma
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
        reviews: Number(activity.reviews || 0)
      };
      
      console.log('Datos compatibles con Prisma:', prismaCompatibleData);
      
      try {
        const response = await axios.post(`${API_URL}/activities`, prismaCompatibleData);
        const newActivity = response.data;
        console.log('Actividad creada correctamente:', newActivity);
        
        // Agregar los campos adicionales para el frontend
        const fullActivity = {
          ...newActivity,
          shortDescription: activity.shortDescription,
          meetingPoint: activity.meetingPoint,
          included: activity.included,
          notIncluded: activity.notIncluded,
          requirements: activity.requirements,
          tags: activity.tags,
          images: activity.images
        };
        
        setActivities(prev => [...prev, fullActivity]);
        return fullActivity;
      } catch (apiError) {
        console.error('Error en la llamada a la API:', apiError);
        
        // Si hay un error con la API, crear un ID temporal y guardar en localStorage
        const tempId = 'temp_' + Date.now();
        const tempActivity = {
      ...activity,
          id: tempId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log('Guardando actividad temporal en localStorage:', tempActivity);
        setActivities(prev => [...prev, tempActivity]);
        
        // Actualizar localStorage
        const savedActivities = localStorage.getItem('activities');
        const activitiesArray = savedActivities ? JSON.parse(savedActivities) : [];
        activitiesArray.push(tempActivity);
        localStorage.setItem('activities', JSON.stringify(activitiesArray));
        
        return tempActivity;
      }
    } catch (error) {
      console.error('Error general al crear actividad:', error);
      throw error;
    }
  };

  // Función para actualizar una actividad existente
  const updateActivity = async (id: string, updatedActivity: Activity): Promise<Activity> => {
    try {
      console.log('Actualizando actividad con ID:', id, 'Datos:', updatedActivity);
      
      // Asegurarse de que los datos son compatibles con el esquema de Prisma
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
        reviews: Number(updatedActivity.reviews || 0)
      };
      
      try {
        const response = await axios.put(`${API_URL}/activities/${id}`, prismaCompatibleData);
        const updated = response.data;
        console.log('Actividad actualizada correctamente:', updated);
        
        // Agregar los campos adicionales para el frontend
        const fullActivity = {
          ...updated,
          shortDescription: updatedActivity.shortDescription,
          meetingPoint: updatedActivity.meetingPoint,
          included: updatedActivity.included,
          notIncluded: updatedActivity.notIncluded,
          requirements: updatedActivity.requirements,
          tags: updatedActivity.tags,
          images: updatedActivity.images
        };
        
        setActivities(prev => prev.map(activity => 
          activity.id === id ? fullActivity : activity
        ));
        return fullActivity;
      } catch (apiError) {
        console.error('Error en la llamada a la API:', apiError);
        
        // Si hay un error con la API, actualizar en localStorage
        const updatedWithTimestamp = {
          ...updatedActivity,
          updatedAt: new Date().toISOString()
        };
        
        setActivities(prev => prev.map(activity => 
          activity.id === id ? updatedWithTimestamp : activity
        ));
        
        // Actualizar localStorage
        const savedActivities = localStorage.getItem('activities');
        if (savedActivities) {
          const activitiesArray = JSON.parse(savedActivities);
          const updatedArray = activitiesArray.map((activity: Activity) => 
            activity.id === id ? updatedWithTimestamp : activity
          );
          localStorage.setItem('activities', JSON.stringify(updatedArray));
        }
        
        return updatedWithTimestamp;
      }
    } catch (error) {
      console.error('Error general al actualizar actividad:', error);
      throw error;
    }
  };

  // Función para eliminar una actividad
  const deleteActivity = async (id: string): Promise<void> => {
    try {
      console.log('Eliminando actividad con ID:', id);
      
      try {
        await axios.delete(`${API_URL}/activities/${id}`);
        console.log('Actividad eliminada correctamente de la API');
      } catch (apiError) {
        console.error('Error al eliminar de la API, eliminando localmente:', apiError);
        
        // Actualizar localStorage si hay error en la API
        const savedActivities = localStorage.getItem('activities');
        if (savedActivities) {
          const activitiesArray = JSON.parse(savedActivities);
          const filteredArray = activitiesArray.filter((activity: Activity) => activity.id !== id);
          localStorage.setItem('activities', JSON.stringify(filteredArray));
        }
      }
      
      // Siempre actualizar el estado local
      setActivities(prev => prev.filter(activity => activity.id !== id));
    } catch (error) {
      console.error('Error general al eliminar actividad:', error);
      throw error;
    }
  };

  // Función para agregar una nueva reserva
  const addBooking = async (booking: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_URL}/bookings`, booking);
      const newBooking = response.data;
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (error) {
      console.error('Error al crear reserva:', error);
      throw error;
    }
  };

  // Función para agregar un nuevo cliente
  const addCustomer = async (customer: any): Promise<any> => {
    try {
      const response = await axios.post(`${API_URL}/customers`, customer);
      const newCustomer = response.data;
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  };

  // Función para refrescar todos los datos
  const refreshData = async (): Promise<void> => {
    console.log('DataContext: Iniciando fetchData() desde refreshData()');
    try {
      await fetchData();
      console.log('DataContext: fetchData() completado correctamente');
    } catch (error) {
      console.error('DataContext: Error en fetchData():', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{ 
      activities, 
      addActivity, 
      updateActivity, 
      deleteActivity,
      bookings,
      addBooking,
      customers,
      addCustomer,
      isLoading,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
