import React, { useState, useMemo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  DollarSign,
  Save,
  Eye,
  Shield,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  Star,
  Clock,
  ListOrdered
} from 'lucide-react';

// Importación dinámica para ReactQuill
const ReactQuill = lazy(() => import('react-quill'));

// Estilos para el editor
import 'react-quill/dist/quill.snow.css';

// Eliminamos la validación con zod que está causando problemas
const ActivityForm: React.FC<ActivityFormProps> = ({ activity, onSave, onClose }) => {
  // Log para depurar qué datos llegan al formulario
  console.log('=== DATOS DE ACTIVIDAD RECIBIDOS EN EL FORMULARIO ===');
  console.log('Activity completa:', activity);
  console.log('Itinerario de la actividad:', activity?.itinerary);
  console.log('Tipo del itinerario:', typeof activity?.itinerary);
  
  const [formData, setFormData] = useState({
    title: activity?.title || activity?.name || '',
    description: activity?.description || '',
    shortDescription: activity?.shortDescription || '',
    price: activity?.price || 0,
    originalPrice: activity?.originalPrice || 0,
    duration: activity?.duration || '',
    maxPeople: activity?.maxPeople || activity?.capacity || 10,
    location: activity?.location || '',
    category: activity?.category || '',
    meetingPoint: activity?.meetingPoint || '',
    featured: activity?.featured || false,
    active: activity?.active !== undefined ? activity.active : true,
    minAge: activity?.minAge || 0,
    pickupIncluded: activity?.pickupIncluded || false,
    itinerary: (() => {
      // Procesar el itinerario correctamente al inicializar
      if (activity?.itinerary) {
        try {
          let parsedItinerary;
          
          // Si es string JSON, parsearlo
          if (typeof activity.itinerary === 'string') {
            parsedItinerary = JSON.parse(activity.itinerary);
          } else {
            parsedItinerary = activity.itinerary;
          }
          
          // Verificar si tiene el formato correcto con días
          if (parsedItinerary && parsedItinerary.days && Array.isArray(parsedItinerary.days)) {
            console.log('Itinerario cargado correctamente:', parsedItinerary);
            return parsedItinerary;
          }
          
          // Si es array simple (formato antiguo), convertir al nuevo formato
          if (Array.isArray(parsedItinerary)) {
            console.log('Convirtiendo formato antiguo de itinerario');
            return {
              days: [
                {
                  title: 'Día 1',
                  description: 'Actividades del tour',
                  activities: parsedItinerary.map(item => ({
                    time: item.time || 'TBD',
                    title: item.title || 'Actividad',
                    description: item.description || ''
                  }))
                }
              ]
            };
          }
        } catch (error) {
          console.error('Error al procesar itinerario en inicialización:', error);
        }
      }
      
      // Valor por defecto si no hay itinerario o hay error
      return {
        days: [
          {
            title: 'Día 1',
            description: 'Descripción detallada del primer día',
            activities: [
              { time: '09:00 AM', title: 'Recogida en el hotel', description: 'Recogida en el lobby del hotel' },
              { time: '10:00 AM', title: 'Llegada al destino', description: 'Bienvenida y orientación' },
              { time: '01:00 PM', title: 'Almuerzo', description: 'Almuerzo incluido en restaurante local' },
              { time: '04:00 PM', title: 'Regreso', description: 'Regreso al hotel' }
            ]
          }
        ]
      };
    })(),
  });
  
  const [images, setImages] = useState<string[]>(activity?.images || []);
  const [dragOver, setDragOver] = useState(false);
  const [includedItems, setIncludedItems] = useState<string[]>(activity?.included || ['']);
  const [notIncludedItems, setNotIncludedItems] = useState<string[]>(activity?.notIncluded || activity?.excluded || ['']);
  const [requirements, setRequirements] = useState<string[]>(activity?.requirements || ['']);
  const [highlights, setHighlights] = useState<string[]>(activity?.highlights || ['']);
  const [tags, setTags] = useState<string[]>(activity?.tags || []);
  const [languages, setLanguages] = useState<string[]>(activity?.languages || ['Español']);
  const [availability, setAvailability] = useState<string[]>(activity?.availability || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']);
  const [startTime, setStartTime] = useState<string[]>(activity?.startTime || ['9:00 AM']);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [newTimeHour, setNewTimeHour] = useState('00');
  const [newTimeMinute, setNewTimeMinute] = useState('00');
  const [newTimePeriod, setNewTimePeriod] = useState('AM');

  const categories = [
    { value: 'islas-playas', label: 'Islas y Playas' },
    { value: 'aventura-adrenalina', label: 'Aventura y Adrenalina' },
    { value: 'naturaleza-ecoturismo', label: 'Naturaleza y Ecoturismo' },
    { value: 'experiencias-acuaticas', label: 'Experiencias Acuáticas' },
    { value: 'cultura-gastronomia', label: 'Cultura y Gastronomía' },
    { value: 'tours-privados-vip', label: 'Tours Privados y VIP' },
    { value: 'excursiones-1-dia', label: 'Excursiones de 1 Día Fuera de Punta Cana' },
    { value: 'ofertas-promociones', label: 'Ofertas y Promociones' },
    { value: 'top-excursiones', label: 'Top Excursiones Más Vendidas' }
  ];

  const durations = [
    '15 minutos',
    '1 hora',
    '2 horas',
    '3 horas',
    '4 horas',
    '12 horas'
  ];

  const languageOptions = [
    'Español',
    'Inglés',
    'Francés',
    'Alemán',
    'Italiano',
    'Portugués'
  ];

  const dayOptions = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ];





  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImages(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addListItem = (type: 'included' | 'notIncluded' | 'requirements' | 'highlights') => {
    switch (type) {
      case 'included':
        setIncludedItems([...includedItems, '']);
        break;
      case 'notIncluded':
        setNotIncludedItems([...notIncludedItems, '']);
        break;
      case 'requirements':
        setRequirements([...requirements, '']);
        break;
      case 'highlights':
        setHighlights([...highlights, '']);
        break;
    }
  };

  const removeListItem = (type: 'included' | 'notIncluded' | 'requirements' | 'highlights', index: number) => {
    switch (type) {
      case 'included':
        setIncludedItems(includedItems.filter((_, i) => i !== index));
        break;
      case 'notIncluded':
        setNotIncludedItems(notIncludedItems.filter((_, i) => i !== index));
        break;
      case 'requirements':
        setRequirements(requirements.filter((_, i) => i !== index));
        break;
      case 'highlights':
        setHighlights(highlights.filter((_, i) => i !== index));
        break;
    }
  };

  const updateListItem = (type: 'included' | 'notIncluded' | 'requirements' | 'highlights', index: number, value: string) => {
    switch (type) {
      case 'included':
        setIncludedItems(includedItems.map((item, i) => i === index ? value : item));
        break;
      case 'notIncluded':
        setNotIncludedItems(notIncludedItems.map((item, i) => i === index ? value : item));
        break;
      case 'requirements':
        setRequirements(requirements.map((item, i) => i === index ? value : item));
        break;
      case 'highlights':
        setHighlights(highlights.map((item, i) => i === index ? value : item));
        break;
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addTime = () => {
    const newTime = `${newTimeHour}:${newTimeMinute} ${newTimePeriod}`;
    if (!startTime.includes(newTime)) {
      setStartTime([...startTime, newTime]);
      // Reset form
      setNewTimeHour('00');
      setNewTimeMinute('00');
      setNewTimePeriod('AM');
    }
  };

  const removeTime = (timeToRemove: string) => {
    setStartTime(startTime.filter(time => time !== timeToRemove));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (!formData.duration) newErrors.duration = 'La duración es requerida';
    if (!formData.location.trim()) newErrors.location = 'La ubicación es requerida';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (startTime.length === 0) newErrors.startTime = 'Debe agregar al menos un horario';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Módulos y configuraciones para ReactQuill
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  // Agregar un nuevo día al itinerario
  const addDay = () => {
    console.log('Agregando nuevo día...', formData.itinerary);
    
    // Asegurar que itinerary y days existen
    const currentItinerary = formData.itinerary || { days: [] };
    const currentDays = currentItinerary.days || [];
    
    const newDay = {
      title: `Día ${currentDays.length + 1}`,
      description: '',
      activities: [
        { time: '09:00 AM', title: 'Nueva Actividad', description: 'Descripción de la nueva actividad' }
      ]
    };
    
    console.log('Nuevo día creado:', newDay);
    
    setFormData(prev => {
      const updatedData = {
        ...prev,
        itinerary: {
          ...currentItinerary,
          days: [...currentDays, newDay]
        }
      };
      console.log('Estado actualizado:', updatedData.itinerary);
      return updatedData;
    });
  };

  // Agregar una nueva actividad a un día
  const addActivity = (dayIndex: number) => {
    const updatedItinerary = { ...formData.itinerary };
    updatedItinerary.days[dayIndex].activities.push({
      time: '12:00 PM',
      title: 'Nueva Actividad',
      description: 'Descripción de la nueva actividad'
    });
    
    setFormData(prev => ({
      ...prev,
      itinerary: updatedItinerary
    }));
  };

  // Eliminar un día del itinerario
  const removeDay = (dayIndex: number) => {
    if (formData.itinerary.days.length <= 1) return;
    
    const updatedItinerary = { ...formData.itinerary };
    updatedItinerary.days.splice(dayIndex, 1);
    
    // Renumerar los días restantes
    updatedItinerary.days = updatedItinerary.days.map((day: any, idx: number) => ({
      ...day,
      title: `Día ${idx + 1}`
    }));
    
    setFormData(prev => ({
      ...prev,
      itinerary: updatedItinerary
    }));
  };

  // Eliminar una actividad de un día
  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updatedItinerary = { ...formData.itinerary };
    updatedItinerary.days[dayIndex].activities.splice(activityIndex, 1);
    
    // Si no quedan actividades, agregar una por defecto
    if (updatedItinerary.days[dayIndex].activities.length === 0) {
      updatedItinerary.days[dayIndex].activities.push({
        time: '09:00 AM',
        title: 'Actividad',
        description: 'Descripción de la actividad'
      });
    }
    
    setFormData(prev => ({
      ...prev,
      itinerary: updatedItinerary
    }));
  };

  // Manejadores para el itinerario
  const handleItineraryChange = (value: any, dayIndex: number, field: string, activityIndex?: number, subField?: string) => {
    const updatedItinerary = { ...formData.itinerary };
    
    if (typeof activityIndex === 'number' && subField) {
      // Actualizar una actividad específica
      updatedItinerary.days[dayIndex].activities[activityIndex][subField] = value;
    } else if (field === 'activities') {
      // Actualizar la lista de actividades de un día
      updatedItinerary.days[dayIndex].activities = value;
    } else {
      // Actualizar un campo del día (título o descripción)
      updatedItinerary.days[dayIndex][field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      itinerary: updatedItinerary
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== DATOS DEL FORMULARIO AL ENVIAR ===');
    console.log('FormData completo:', formData);
    console.log('Itinerario del formulario:', JSON.stringify(formData.itinerary, null, 2));
    
    if (!validateForm()) return;
    
    // Filtrar elementos vacíos de las listas
    const filteredIncluded = includedItems.filter(item => item.trim());
    const filteredNotIncluded = notIncludedItems.filter(item => item.trim());
    const filteredRequirements = requirements.filter(item => item.trim());
    const filteredHighlights = highlights.filter(item => item.trim());
    
    const activityData = {
      ...formData,
      name: formData.title, // Para compatibilidad con la base de datos
      images: images,
      included: filteredIncluded,
      notIncluded: filteredNotIncluded,
      excluded: filteredNotIncluded, // Para compatibilidad
      requirements: filteredRequirements,
      highlights: filteredHighlights,
      tags: tags,
      languages: languages,
      availability: availability,
      startTime: startTime,
      capacity: formData.maxPeople, // Para compatibilidad
      maxPeople: formData.maxPeople,
      slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };
    
    onSave(activityData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {activity ? 'Editar Actividad' : 'Crear Nueva Actividad'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar formulario"
            title="Cerrar formulario"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Información Básica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                Información Básica
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Actividad *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Isla Saona - Tour Completo"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Corta
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                  placeholder="Descripción breve para las tarjetas..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Completa *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descripción detallada de la actividad..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Precios y Configuración
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Actual *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Original
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración *
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent ${
                      errors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-label="Seleccionar duración de la actividad"
                    title="Seleccionar duración de la actividad"
                  >
                    <option value="">Seleccionar duración</option>
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                  {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad Máxima
                  </label>
                  <input
                    type="number"
                    name="maxPeople"
                    value={formData.maxPeople}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad Mínima
                  </label>
                  <input
                    type="number"
                    name="minAge"
                    value={formData.minAge}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-6">
                  <input
                    type="checkbox"
                    name="pickupIncluded"
                    id="pickupIncluded"
                    checked={formData.pickupIncluded}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-caribbean-600 focus:ring-caribbean-500 border-gray-300 rounded"
                    aria-label="Incluye recogida en hotel"
                  />
                  <label htmlFor="pickupIncluded" className="text-sm font-medium text-gray-700">
                    Incluye recogida en hotel
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Ubicación y Categoría */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Isla Saona, Punta Cana"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-label="Seleccionar categoría de la actividad"
                title="Seleccionar categoría de la actividad"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Punto de Encuentro
            </label>
            <input
              type="text"
              name="meetingPoint"
              value={formData.meetingPoint}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
              placeholder="Ej: Lobby del hotel o punto específico"
            />
          </div>

          {/* Imágenes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" />
              Imágenes de la Actividad
            </h3>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-caribbean-500 bg-caribbean-50' : 'border-gray-300'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                Arrastra y suelta imágenes aquí, o{' '}
                <label className="text-caribbean-600 hover:text-caribbean-500 cursor-pointer">
                  selecciona archivos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, GIF hasta 10MB cada una</p>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Eliminar imagen ${index + 1}`}
                      title={`Eliminar imagen ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Listas de Incluido/No Incluido/Requisitos/Destacados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incluido */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                Lo que está Incluido
              </h3>
              {includedItems.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem('included', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                    placeholder="Ej: Transporte de ida y vuelta"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('included', index)}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    aria-label={`Eliminar elemento incluido ${index + 1}`}
                    title={`Eliminar elemento incluido ${index + 1}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('included')}
                className="mt-2 flex items-center text-caribbean-600 hover:text-caribbean-500"
              >
                <Plus className="mr-1 h-4 w-4" />
                Agregar elemento
              </button>
            </div>

            {/* No Incluido */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="mr-2 h-5 w-5 text-red-600" />
                Lo que NO está Incluido
              </h3>
              {notIncludedItems.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem('notIncluded', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                    placeholder="Ej: Propinas"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('notIncluded', index)}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    aria-label={`Eliminar elemento no incluido ${index + 1}`}
                    title={`Eliminar elemento no incluido ${index + 1}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('notIncluded')}
                className="mt-2 flex items-center text-caribbean-600 hover:text-caribbean-500"
              >
                <Plus className="mr-1 h-4 w-4" />
                Agregar elemento
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Requisitos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-600" />
                Requisitos
              </h3>
              {requirements.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem('requirements', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                    placeholder="Ej: Ropa cómoda"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('requirements', index)}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    aria-label={`Eliminar requisito ${index + 1}`}
                    title={`Eliminar requisito ${index + 1}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('requirements')}
                className="mt-2 flex items-center text-caribbean-600 hover:text-caribbean-500"
              >
                <Plus className="mr-1 h-4 w-4" />
                Agregar requisito
              </button>
            </div>

            {/* Destacados */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-600" />
                Puntos Destacados
              </h3>
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem('highlights', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                    placeholder="Ej: Experiencia única"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('highlights', index)}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    aria-label={`Eliminar destacado ${index + 1}`}
                    title={`Eliminar destacado ${index + 1}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('highlights')}
                className="mt-2 flex items-center text-caribbean-600 hover:text-caribbean-500"
              >
                <Plus className="mr-1 h-4 w-4" />
                Agregar destacado
              </button>
            </div>
          </div>

          {/* Configuración Adicional */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiquetas</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-caribbean-100 text-caribbean-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-caribbean-600 hover:text-caribbean-800"
                      aria-label={`Eliminar etiqueta ${tag}`}
                      title={`Eliminar etiqueta ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                  placeholder="Nueva etiqueta"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-caribbean-600 text-white rounded-r-lg hover:bg-caribbean-700"
                  aria-label="Agregar nueva etiqueta"
                  title="Agregar nueva etiqueta"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Idiomas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Idiomas Disponibles</h3>
              <div className="space-y-2">
                {languageOptions.map(lang => (
                  <label key={lang} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={languages.includes(lang)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setLanguages([...languages, lang]);
                        } else {
                          setLanguages(languages.filter(l => l !== lang));
                        }
                      }}
                      className="h-4 w-4 text-caribbean-600 focus:ring-caribbean-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Disponibilidad */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Días Disponibles</h3>
              <div className="space-y-2">
                {dayOptions.map(day => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={availability.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAvailability([...availability, day]);
                        } else {
                          setAvailability(availability.filter(d => d !== day));
                        }
                      }}
                      className="h-4 w-4 text-caribbean-600 focus:ring-caribbean-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Horarios de Inicio */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Horarios de la Actividad</h3>
            
            {/* Agregar nuevo horario */}
            <div className="flex items-center space-x-2 mb-4 p-4 bg-gray-50 rounded-lg">
              <select
                value={newTimeHour}
                onChange={(e) => setNewTimeHour(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                aria-label="Seleccionar hora"
                title="Seleccionar hora"
              >
                {Array.from({length: 13}, (_, i) => i).map(hour => (
                  <option key={hour} value={hour.toString().padStart(2, '0')}>
                    {hour.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              
              <span className="text-gray-500">:</span>
              
              <select
                value={newTimeMinute}
                onChange={(e) => setNewTimeMinute(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                aria-label="Seleccionar minutos"
                title="Seleccionar minutos"
              >
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
              </select>
              
              <select
                value={newTimePeriod}
                onChange={(e) => setNewTimePeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                aria-label="Seleccionar período AM/PM"
                title="Seleccionar período AM/PM"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
              
              <button
                type="button"
                onClick={addTime}
                className="px-4 py-2 bg-caribbean-600 text-white rounded-lg hover:bg-caribbean-700 transition-colors flex items-center"
              >
                <Plus className="mr-1 h-4 w-4" />
                Agregar Horario
              </button>
            </div>

            {/* Lista de horarios configurados */}
            {startTime.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Horarios configurados:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {startTime.map((time, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{time}</span>
                      <button
                        type="button"
                        onClick={() => removeTime(time)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        aria-label={`Eliminar horario ${time}`}
                        title={`Eliminar horario ${time}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {startTime.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="mx-auto h-12 w-12 mb-2" />
                <p>No hay horarios configurados</p>
                <p className="text-sm">Agrega al menos un horario para esta actividad</p>
              </div>
            )}
            
            {errors.startTime && (
              <p className="mt-2 text-sm text-red-600">{errors.startTime}</p>
            )}
          </div>

          {/* Itinerario del Tour */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ListOrdered className="mr-2 h-5 w-5 text-caribbean-600" />
              Itinerario del Tour
            </h3>
            
            {formData.itinerary?.days?.map((day: any, dayIndex: number) => (
              <div key={dayIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">{day.title}</h4>
                  {formData.itinerary.days.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(dayIndex)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Eliminar día
                    </button>
                  )}
                </div>
                
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título del día
                    </label>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => handleItineraryChange(e.target.value, dayIndex, 'title')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-caribbean-500 focus:border-caribbean-500"
                      placeholder="Ej: Día 1 - Llegada y City Tour"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción del día
                    </label>
                    <div className="mb-4">
                      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>}>
                        <ReactQuill
                          value={day.description}
                          onChange={(value) => handleItineraryChange(value, dayIndex, 'description')}
                          modules={modules}
                          theme="snow"
                          className="bg-white rounded-lg"
                          placeholder="Describe las actividades generales de este día..."
                        />
                      </Suspense>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-700">Actividades del día</h5>
                      <button
                        type="button"
                        onClick={() => addActivity(dayIndex)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-caribbean-600 hover:bg-caribbean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-caribbean-500"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar Actividad
                      </button>
                    </div>
                    
                    {day.activities.map((activity: any, activityIndex: number) => (
                      <div key={activityIndex} className="border border-gray-200 rounded-lg p-4 relative">
                        <button
                          type="button"
                          onClick={() => removeActivity(dayIndex, activityIndex)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                          title="Eliminar actividad"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Hora</label>
                            <input
                              type="text"
                              value={activity.time}
                              onChange={(e) => handleItineraryChange(e.target.value, dayIndex, 'activities', activityIndex, 'time')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-caribbean-500 focus:border-caribbean-500 text-sm"
                              placeholder="09:00 AM"
                            />
                          </div>
                          
                          <div className="md:col-span-3">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
                            <input
                              type="text"
                              value={activity.title}
                              onChange={(e) => handleItineraryChange(e.target.value, dayIndex, 'activities', activityIndex, 'title')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-caribbean-500 focus:border-caribbean-500 text-sm"
                              placeholder="Título de la actividad"
                            />
                          </div>
                          
                          <div className="md:col-span-7">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
                            <input
                              type="text"
                              value={activity.description}
                              onChange={(e) => handleItineraryChange(e.target.value, dayIndex, 'activities', activityIndex, 'description')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-caribbean-500 focus:border-caribbean-500 text-sm"
                              placeholder="Descripción detallada de la actividad"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={addDay}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-caribbean-600 hover:bg-caribbean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-caribbean-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Día al Itinerario
              </button>
            </div>
          </div>
          
          {/* Configuración de Estado */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-caribbean-600 focus:ring-caribbean-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Destacado</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-caribbean-600 focus:ring-caribbean-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Activo</span>
              </label>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-caribbean-600 text-white rounded-lg hover:bg-caribbean-700 transition-colors flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              {activity ? 'Actualizar' : 'Crear'} Actividad
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

interface ActivityFormProps {
  activity?: any;
  onSave: (_data: any) => void;
  onClose: () => void;
}

export default ActivityForm;