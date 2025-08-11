import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search,
  MapPin,
  RefreshCw
} from 'lucide-react';
import ActivityForm from '../../components/admin/ActivityForm';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { ActivityCard } from '../../components/admin/ActivityCard';
import { useData } from '../../contexts/DataContext';
import { Activity } from '../../types/activity';
import toast from 'react-hot-toast';

const Activities = () => {
  const { activities, addActivity, updateActivity, deleteActivity, isLoading, refreshData } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'tour', label: 'Tours' },
    { value: 'aventura', label: 'Aventura' },
    { value: 'acuatico', label: 'Deportes Acuáticos' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'gastronomia', label: 'Gastronomía' },
    { value: 'fiesta', label: 'Fiesta' }
  ];

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      console.log('Iniciando actualización de datos...');
      await refreshData();
      console.log('Datos actualizados correctamente');
      toast.success('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al refrescar datos:', error);
      toast.error('Error al actualizar los datos');
    } finally {
      setRefreshing(false);
    }
  };
  
  // Efecto para registrar cuando el componente se monta
  useEffect(() => {
    console.log('Componente Activities montado');
    return () => {
      console.log('Componente Activities desmontado');
    };
  }, []);

  const handleAddActivity = () => {
    setEditingActivity(null);
    setShowForm(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDeleteActivity = (activity: Activity) => {
    setDeletingActivity(activity);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deletingActivity) {
      try {
        await deleteActivity(deletingActivity.id);
        toast.success(`Actividad "${deletingActivity.name}" eliminada correctamente`);
      setShowDeleteDialog(false);
      setDeletingActivity(null);
      } catch (error) {
        toast.error('Error al eliminar la actividad');
        console.error('Error al eliminar actividad:', error);
      }
    }
  };

  const handleSaveActivity = async (activityData: any) => {
    try {
      // Convertir la duración a minutos para que coincida con el modelo de Prisma
      let durationInMinutes = 60; // Valor predeterminado
      const durationStr = activityData.duration.toString();
      
      if (durationStr.includes('hora')) {
        // Convertir horas a minutos
        const hours = parseInt(durationStr);
        durationInMinutes = hours * 60;
      } else if (durationStr.includes('día')) {
        // Convertir días a minutos (asumiendo 8 horas por día)
        if (durationStr.includes('completo')) {
          durationInMinutes = 8 * 60; // Día completo = 8 horas
        } else {
          const days = parseInt(durationStr);
          durationInMinutes = days * 8 * 60; // Días * 8 horas * 60 minutos
        }
      }
      
      // Adaptar datos para que coincidan con el modelo de Prisma
      const adaptedData = {
        name: activityData.title || activityData.name,
        slug: (activityData.title || activityData.name)?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
        description: activityData.description,
        price: Number(activityData.price),
        duration: durationInMinutes,
        location: activityData.location,
        imageUrl: activityData.imageUrl || activityData.images?.[0] || 'https://via.placeholder.com/800x600?text=Sin+imagen',
        featured: activityData.featured || false,
        active: activityData.active !== undefined ? activityData.active : true,
        capacity: Number(activityData.maxPeople) || Number(activityData.capacity) || 10,
        category: activityData.category || 'tour',
        rating: activityData.rating || 4.5,
        reviews: activityData.reviews || activityData.reviewCount || 0,
        // Campos adicionales para el frontend
        shortDescription: activityData.shortDescription,
        meetingPoint: activityData.meetingPoint,
        included: activityData.included || [],
        notIncluded: activityData.notIncluded || [],
        requirements: activityData.requirements || [],
        tags: activityData.tags || [],
        images: activityData.images || [],
        highlights: activityData.highlights || [],
        languages: activityData.languages || ['Español'],
        availability: activityData.availability || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        startTime: activityData.startTime || ['9:00 AM'],
        originalPrice: activityData.originalPrice,
        minAge: activityData.minAge || 0,
        pickupIncluded: activityData.pickupIncluded || false,
        itinerary: activityData.itinerary || [
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
      
      console.log('Datos adaptados para enviar a la API:', adaptedData);
      
    if (editingActivity) {
      // Actualizar actividad existente
        const updatedActivity = await updateActivity(editingActivity.id, {
          ...adaptedData,
          id: editingActivity.id,
          createdAt: editingActivity.createdAt,
          updatedAt: new Date().toISOString()
        });
        toast.success(`Actividad "${updatedActivity.name}" actualizada correctamente`);
        
        // Forzar actualización de datos para sincronizar con la página de detalles
        setTimeout(async () => {
          try {
            await refreshData();
            console.log('Datos refrescados después de actualizar actividad');
          } catch (error) {
            console.error('Error al refrescar datos después de actualizar:', error);
          }
        }, 500);
    } else {
      // Crear nueva actividad
        const newActivity = await addActivity({
          ...adaptedData,
          id: 'temp_' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        toast.success(`Actividad "${newActivity.name}" creada correctamente`);
    }
    setShowForm(false);
    } catch (error) {
      toast.error('Error al guardar la actividad');
      console.error('Error al guardar actividad:', error);
    }
  };

  const filteredActivities = activities
    .filter(activity => {
      const matchesSearch = 
        (activity.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (activity.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      const matchesCategory = filterCategory === 'all' || activity.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        case 'oldest':
          return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestión de Actividades
            </h1>
            <p className="text-gray-600">
              Administra todas las excursiones y actividades disponibles
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 disabled:opacity-70"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddActivity}
            className="bg-caribbean-600 hover:bg-caribbean-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            Nueva Actividad
          </motion.button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar actividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
              aria-label="Filtrar por categoría"
              title="Filtrar por categoría"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
              aria-label="Ordenar actividades"
              title="Ordenar actividades"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="price-high">Precio: Mayor a menor</option>
              <option value="price-low">Precio: Menor a mayor</option>
              <option value="rating">Mejor valoradas</option>
            </select>

            {/* Stats */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
              <span className="text-sm text-gray-600">
                {filteredActivities.length} de {activities.length} actividades
              </span>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-caribbean-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Cargando actividades...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ActivityCard
                  activity={activity}
                  onEdit={() => handleEditActivity(activity)}
                  onDelete={() => handleDeleteActivity(activity)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron actividades
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primera actividad'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <button
                onClick={handleAddActivity}
                className="bg-caribbean-600 hover:bg-caribbean-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                Agregar Primera Actividad
              </button>
            )}
          </div>
        )}
      </div>

      {/* Activity Form Modal */}
      {showForm && (
        <ActivityForm
          activity={editingActivity}
          onSave={handleSaveActivity}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && deletingActivity && (
        <ConfirmDialog
          title="Eliminar Actividad"
          message={`¿Estás seguro de que quieres eliminar "${deletingActivity.name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteDialog(false)}
          type="danger"
        />
      )}
    </div>
  );
};

export default Activities;
