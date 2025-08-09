import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Activity } from '../types/activity';

interface DataContextType {
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, activity: Activity) => void;
  deleteActivity: (id: string) => void;
  bookings: any[];
  addBooking: (booking: any) => void;
  customers: any[];
  addCustomer: (customer: any) => void;
  isLoading: boolean;
}

// Datos iniciales de ejemplo para las actividades
const initialActivities: Activity[] = [
  {
    id: '1',
    title: 'Isla Saona - Tour Completo',
    description: 'Descubre el paraíso en la Isla Saona con playas de arena blanca y aguas cristalinas. Incluye transporte, comida y bebidas.',
    price: 89,
    duration: '10 horas',
    location: 'Isla Saona',
    rating: 4.8,
    reviewCount: 245,
    category: 'tours-islas',
    included: ['Transporte', 'Comida', 'Bebidas', 'Guía turístico'],
    notIncluded: ['Propinas'],
    requirements: ['Traer protector solar', 'Llevar ropa cómoda'],
    tags: ['playa', 'snorkel', 'naturaleza'],
    shortDescription: 'Descubre el paraíso en la Isla Saona con playas de arena blanca y aguas cristalinas.',
    meetingPoint: 'Lobby del hotel',
    maxPeople: 20,
    imageUrl: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    images: [
      'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
    ],
    featured: true,
    maxGroupSize: 20,
    minAge: 0,
    languages: ['Español', 'Inglés'],
    pickupIncluded: true,
    availableDates: ['2023-12-15', '2023-12-16', '2023-12-17', '2023-12-18', '2023-12-19']
  },
  {
    id: '2',
    title: 'Hoyo Azul y Scape Park',
    description: 'Aventura en el parque ecológico Scape Park con visita al impresionante Hoyo Azul, una cenote natural de agua cristalina.',
    price: 125,
    duration: '8 horas',
    location: 'Cap Cana',
    rating: 4.9,
    reviewCount: 189,
    category: 'aventura',
    included: ['Entrada al parque', 'Acceso a atracciones', 'Almuerzo', 'Transporte'],
    notIncluded: ['Bebidas alcohólicas', 'Fotos profesionales'],
    requirements: ['Edad mínima 8 años', 'Saber nadar'],
    tags: ['aventura', 'naturaleza', 'cenote'],
    shortDescription: 'Aventura en el parque ecológico Scape Park con visita al impresionante Hoyo Azul.',
    meetingPoint: 'Recepción del hotel',
    maxPeople: 15,
    imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    images: [
      'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/2041556/pexels-photo-2041556.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
    ],
    featured: true,
    maxGroupSize: 15,
    minAge: 8,
    languages: ['Español', 'Inglés', 'Francés'],
    pickupIncluded: true,
    availableDates: ['2023-12-15', '2023-12-16', '2023-12-17', '2023-12-18', '2023-12-19']
  },
  {
    id: '3',
    title: 'Catamarán Party',
    description: 'Disfruta de un día en el mar a bordo de un catamarán con música, bebidas y paradas para snorkel en arrecifes de coral.',
    price: 95,
    duration: '6 horas',
    location: 'Playa Bávaro',
    rating: 4.7,
    reviewCount: 215,
    category: 'acuaticos',
    included: ['Bebidas', 'Snacks', 'Equipo de snorkel', 'Fiesta a bordo'],
    notIncluded: ['Toallas', 'Protector solar'],
    requirements: ['Edad mínima 18 años', 'Documento de identidad'],
    tags: ['fiesta', 'snorkel', 'catamarán'],
    shortDescription: 'Disfruta de un día en el mar a bordo de un catamarán con música, bebidas y snorkel.',
    meetingPoint: 'Marina Cap Cana',
    maxPeople: 30,
    imageUrl: 'https://images.pexels.com/photos/1430672/pexels-photo-1430672.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    images: [
      'https://images.pexels.com/photos/1430672/pexels-photo-1430672.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/1645028/pexels-photo-1645028.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/2765872/pexels-photo-2765872.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
    ],
    featured: true,
    maxGroupSize: 30,
    minAge: 18,
    languages: ['Español', 'Inglés'],
    pickupIncluded: true,
    availableDates: ['2023-12-15', '2023-12-16', '2023-12-17', '2023-12-18', '2023-12-19']
  },
  {
    id: '4',
    title: 'Safari Buggy',
    description: 'Aventura en buggy por caminos rurales, visitando plantaciones de café, cacao y una auténtica casa dominicana.',
    price: 65,
    duration: '4 horas',
    location: 'Selva Tropical',
    rating: 4.6,
    reviewCount: 178,
    category: 'aventura',
    included: ['Buggy', 'Guía', 'Bebidas', 'Visitas'],
    notIncluded: ['Comida', 'Souvenirs'],
    requirements: ['Licencia de conducir', 'Edad mínima 16 años'],
    tags: ['aventura', 'rural', 'cultura'],
    shortDescription: 'Aventura en buggy por caminos rurales, visitando plantaciones y casas dominicanas.',
    meetingPoint: 'Base de buggies',
    maxPeople: 12,
    imageUrl: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    images: [
      'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/2041556/pexels-photo-2041556.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
    ],
    featured: false,
    maxGroupSize: 12,
    minAge: 16,
    languages: ['Español', 'Inglés'],
    pickupIncluded: true,
    availableDates: ['2023-12-15', '2023-12-16', '2023-12-17', '2023-12-18', '2023-12-19']
  },
  {
    id: '5',
    title: 'Zip Line Adventure',
    description: 'Experimenta la adrenalina de volar entre los árboles con 12 líneas de tirolesa en la selva tropical.',
    price: 90,
    duration: '5 horas',
    location: 'Anamuya Mountains',
    rating: 4.8,
    reviewCount: 156,
    category: 'aventura',
    included: ['Equipo de seguridad', 'Guías profesionales', 'Transporte', 'Bebidas'],
    notIncluded: ['Comida', 'Fotos'],
    requirements: ['Edad mínima 10 años', 'Peso máximo 120kg'],
    tags: ['adrenalina', 'tirolesa', 'altura'],
    shortDescription: 'Experimenta la adrenalina de volar entre los árboles con 12 líneas de tirolesa.',
    meetingPoint: 'Centro de aventuras',
    maxPeople: 15,
    imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    images: [
      'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/2041556/pexels-photo-2041556.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
    ],
    featured: false,
    maxGroupSize: 15,
    minAge: 10,
    languages: ['Español', 'Inglés'],
    pickupIncluded: true,
    availableDates: ['2023-12-15', '2023-12-16', '2023-12-17', '2023-12-18', '2023-12-19']
  },
  {
    id: '6',
    title: 'Dolphin Encounter',
    description: 'Interactúa con delfines en un entorno natural y aprende sobre estos fascinantes mamíferos marinos.',
    price: 120,
    duration: '3 horas',
    location: 'Ocean World',
    rating: 4.9,
    reviewCount: 210,
    category: 'acuaticos',
    included: ['Entrada al parque', 'Sesión con delfines', 'Fotos digitales', 'Transporte'],
    notIncluded: ['Fotos físicas', 'Comida extra'],
    requirements: ['Edad mínima 5 años', 'Saber nadar básico'],
    tags: ['delfines', 'familia', 'educativo'],
    shortDescription: 'Interactúa con delfines en un entorno natural y aprende sobre estos mamíferos marinos.',
    meetingPoint: 'Entrada Ocean World',
    maxPeople: 10,
    imageUrl: 'https://images.pexels.com/photos/2765872/pexels-photo-2765872.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    images: [
      'https://images.pexels.com/photos/2765872/pexels-photo-2765872.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/1430672/pexels-photo-1430672.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      'https://images.pexels.com/photos/1645028/pexels-photo-1645028.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
    ],
    featured: true,
    maxGroupSize: 10,
    minAge: 5,
    languages: ['Español', 'Inglés', 'Francés', 'Alemán'],
    pickupIncluded: true,
    availableDates: ['2023-12-15', '2023-12-16', '2023-12-17', '2023-12-18', '2023-12-19']
  }
];

// Datos iniciales de ejemplo para las reservas
const initialBookings = [
  {
    id: 'BK-2023-001',
    customerName: 'María García',
    customerEmail: 'maria.garcia@email.com',
    activityName: 'Isla Saona - Tour Completo',
    date: '2023-12-15',
    time: '08:00',
    participants: 2,
    amount: 178,
    status: 'confirmed',
    paymentMethod: 'Tarjeta de crédito',
    location: 'Isla Saona'
  },
  {
    id: 'BK-2023-002',
    customerName: 'Carlos Rodríguez',
    customerEmail: 'carlos.rodriguez@email.com',
    activityName: 'Hoyo Azul y Scape Park',
    date: '2023-12-18',
    time: '09:30',
    participants: 4,
    amount: 500,
    status: 'pending',
    paymentMethod: 'PayPal',
    location: 'Cap Cana'
  },
  {
    id: 'BK-2023-003',
    customerName: 'Ana López',
    customerEmail: 'ana.lopez@email.com',
    activityName: 'Catamarán Party',
    date: '2023-12-20',
    time: '10:00',
    participants: 6,
    amount: 570,
    status: 'confirmed',
    paymentMethod: 'Tarjeta de crédito',
    location: 'Playa Bávaro'
  }
];

// Datos iniciales de ejemplo para los clientes
const initialCustomers = [
  {
    id: 'CUS-001',
    name: 'María García',
    email: 'maria.garcia@email.com',
    phone: '+1 809-555-1234',
    country: 'España',
    bookingsCount: 3,
    totalSpent: 450,
    lastBooking: '2023-12-10',
    status: 'active',
    createdAt: '2023-01-15'
  },
  {
    id: 'CUS-002',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+1 809-555-5678',
    country: 'República Dominicana',
    bookingsCount: 2,
    totalSpent: 320,
    lastBooking: '2023-11-25',
    status: 'active',
    createdAt: '2023-02-20'
  },
  {
    id: 'CUS-003',
    name: 'Ana López',
    email: 'ana.lopez@email.com',
    phone: '+1 809-555-9012',
    country: 'México',
    bookingsCount: 5,
    totalSpent: 780,
    lastBooking: '2023-12-05',
    status: 'active',
    createdAt: '2023-03-10'
  }
];

// Crear el contexto
const DataContext = createContext<DataContextType | undefined>(undefined);

// Proveedor del contexto
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos al iniciar
  useEffect(() => {
    // Intentar cargar desde localStorage
    const savedActivities = localStorage.getItem('activities');
    const savedBookings = localStorage.getItem('bookings');
    const savedCustomers = localStorage.getItem('customers');

    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch (error) {
        console.error('Error parsing activities from localStorage', error);
        setActivities(initialActivities);
      }
    } else {
      setActivities(initialActivities);
    }

    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (error) {
        console.error('Error parsing bookings from localStorage', error);
        setBookings(initialBookings);
      }
    } else {
      setBookings(initialBookings);
    }

    if (savedCustomers) {
      try {
        setCustomers(JSON.parse(savedCustomers));
      } catch (error) {
        console.error('Error parsing customers from localStorage', error);
        setCustomers(initialCustomers);
      }
    } else {
      setCustomers(initialCustomers);
    }

    setIsLoading(false);
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('activities', JSON.stringify(activities));
      localStorage.setItem('bookings', JSON.stringify(bookings));
      localStorage.setItem('customers', JSON.stringify(customers));
    }
  }, [activities, bookings, customers, isLoading]);

  // Función para agregar una nueva actividad
  const addActivity = (activity: Activity) => {
    // Generar un ID único
    const newActivity = {
      ...activity,
      id: `${activities.length + 1}`,
      // Asegurar que todos los campos requeridos estén presentes
      images: activity.images || [],
      included: activity.included || [],
      notIncluded: activity.notIncluded || [],
      requirements: activity.requirements || [],
      tags: activity.tags || [],
      featured: activity.featured || false,
      active: activity.active !== undefined ? activity.active : true,
      rating: activity.rating || 0,
      reviewCount: activity.reviewCount || 0,
      maxGroupSize: activity.maxPeople || activity.maxGroupSize || 10
    };
    setActivities([...activities, newActivity]);
  };

  // Función para actualizar una actividad existente
  const updateActivity = (id: string, updatedActivity: Activity) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...updatedActivity, id } : activity
    ));
  };

  // Función para eliminar una actividad
  const deleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  // Función para agregar una nueva reserva
  const addBooking = (booking: any) => {
    // Generar un ID único para la reserva
    const newId = `BK-${new Date().getFullYear()}-${String(bookings.length + 1).padStart(3, '0')}`;
    const newBooking = {
      ...booking,
      id: newId
    };
    setBookings([...bookings, newBooking]);
  };

  // Función para agregar un nuevo cliente
  const addCustomer = (customer: any) => {
    // Generar un ID único para el cliente
    const newId = `CUS-${String(customers.length + 1).padStart(3, '0')}`;
    const newCustomer = {
      ...customer,
      id: newId
    };
    setCustomers([...customers, newCustomer]);
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
      isLoading 
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
