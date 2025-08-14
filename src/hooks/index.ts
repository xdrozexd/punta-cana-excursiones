import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTours, 
  getTourById, 
  createBooking, 
  sendContactForm,
  checkAvailability,
  getTourReviews 
} from '../api';
import type { TourFilters, ContactForm, BookingForm } from '../types';
import { useData } from '../contexts/DataContext';

// ==================== TOURS HOOKS ====================

/**
 * Hook para obtener lista de tours
 */
export const useTours = (filters?: TourFilters) => {
  return useQuery({
    queryKey: ['tours', filters],
    queryFn: () => getTours(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para obtener un tour específico
 */
export const useTour = (id: string) => {
  return useQuery({
    queryKey: ['tour', id],
    queryFn: () => getTourById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
};

/**
 * Hook para obtener reseñas de un tour
 */
export const useTourReviews = (tourId: string, page: number = 1) => {
  return useQuery({
    queryKey: ['tourReviews', tourId, page],
    queryFn: () => getTourReviews(tourId, page),
    enabled: !!tourId,
  });
};

// ==================== BOOKING HOOKS ====================

/**
 * Hook para crear una reserva
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingData: BookingForm) => createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

/**
 * Hook para verificar disponibilidad
 */
export const useAvailability = (tourId: string, date: string) => {
  return useQuery({
    queryKey: ['availability', tourId, date],
    queryFn: () => checkAvailability(tourId, date),
    enabled: !!tourId && !!date,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

// ==================== CONTACT HOOKS ====================

/**
 * Hook para enviar formulario de contacto
 */
export const useContactForm = () => {
  return useMutation({
    mutationFn: (formData: ContactForm) => sendContactForm(formData),
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook para manejar almacenamiento local
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((_val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

/**
 * Hook para detectar cambios en el tamaño de pantalla
 */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

/**
 * Hook para detectar clics fuera de un elemento
 */
export const useClickOutside = <T extends HTMLElement>(
  callback: () => void
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
};

/**
 * Hook para debouncing
 */
export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para manejar estado de carga
 */
export const useAsync = <T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setData(result);
    } catch (error) {
      setError(error as E);
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute };
};

/**
 * Hook para scroll infinito
 */
export const useInfiniteScroll = (callback: () => void, hasMore: boolean) => {
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 &&
        hasMore
      ) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, hasMore]);
};

/**
 * Hook para manejar favoritos
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<string[]>('tour-favorites', []);

  const addFavorite = useCallback((tourId: string) => {
    setFavorites(prev => [...prev.filter(id => id !== tourId), tourId]);
  }, [setFavorites]);

  const removeFavorite = useCallback((tourId: string) => {
    setFavorites(prev => prev.filter(id => id !== tourId));
  }, [setFavorites]);

  const isFavorite = useCallback((tourId: string) => {
    return favorites.includes(tourId);
  }, [favorites]);

  const toggleFavorite = useCallback((tourId: string) => {
    if (isFavorite(tourId)) {
      removeFavorite(tourId);
    } else {
      addFavorite(tourId);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };
};

/**
 * Hook para copiar al portapapeles
 */
export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setCopied(false);
      return false;
    }
  }, []);

  return { copied, copy };
};

/**
 * Hook para manejar formularios
 */
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules?: Partial<Record<keyof T, (_value: any) => string | null>>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(() => {
    if (!validationRules) return true;

    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.entries(validationRules).forEach(([field, validator]) => {
      if (validator) {
        const error = validator(values[field as keyof T]);
        if (error) {
          newErrors[field as keyof T] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched: setFieldTouched,
    validate,
    reset
  };
};

/**
 * Hook para geolocalización
 */
export const useGeolocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
  }, []);

  return { location, error, loading, getCurrentLocation };
};

// Hook para sincronizar datos de actividades
export const useActivitySync = () => {
  const { activities, refreshData } = useData();
  const lastUpdateRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Limpiar intervalo anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Configurar actualización automática cada 30 segundos
    intervalRef.current = setInterval(async () => {
      try {
        const now = Date.now();
        // Solo actualizar si han pasado al menos 25 segundos desde la última actualización
        if (now - lastUpdateRef.current > 25000) {
          console.log('useActivitySync: Actualización automática...');
          await refreshData();
          lastUpdateRef.current = now;
        }
      } catch (error) {
        console.error('useActivitySync: Error en actualización automática:', error);
      }
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshData]);

  // Función para forzar actualización manual
  const forceRefresh = async () => {
    try {
      console.log('useActivitySync: Forzando actualización manual...');
      await refreshData();
      lastUpdateRef.current = Date.now();
    } catch (error) {
      console.error('useActivitySync: Error en actualización manual:', error);
    }
  };

  // Obtener actividad específica si se proporciona ID
  const getActivity = (id: string) => {
    return activities.find(activity => activity.id === id);
  };

  return {
    activities,
    getActivity,
    forceRefresh,
    lastUpdate: lastUpdateRef.current
  };
};
