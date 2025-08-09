import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search,
  MapPin
} from 'lucide-react';
import { ActivityForm } from '../../components/admin/ActivityForm';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { ActivityCard } from '../../components/admin/ActivityCard';
import { useData } from '../../contexts/DataContext';
import { Activity } from '../../types/activity';

// La interfaz Activity ya está importada desde types/activity

const Activities = () => {
  const { activities, addActivity, updateActivity, deleteActivity, isLoading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'tours-islas', label: 'Tours a Islas' },
    { value: 'aventura', label: 'Aventura' },
    { value: 'acuaticos', label: 'Deportes Acuáticos' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'gastronomia', label: 'Gastronomía' }
  ];

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

  const confirmDelete = () => {
    if (deletingActivity) {
      deleteActivity(deletingActivity.id);
      setShowDeleteDialog(false);
      setDeletingActivity(null);
    }
  };

  const handleSaveActivity = (activityData: any) => {
    if (editingActivity) {
      // Actualizar actividad existente
      const updatedActivity = { 
        ...editingActivity, 
        ...activityData,
        maxGroupSize: activityData.maxPeople || editingActivity.maxGroupSize, // Compatibilidad
        updatedAt: new Date().toISOString().split('T')[0] 
      } as Activity;
      
      updateActivity(editingActivity.id, updatedActivity);
    } else {
      // Crear nueva actividad
      const newActivity = {
        ...activityData,
        rating: 0,
        reviewCount: 0,
        maxGroupSize: activityData.maxPeople || 10, // Compatibilidad entre maxPeople y maxGroupSize
        images: activityData.images || [],
        included: activityData.included || [],
        notIncluded: activityData.notIncluded || [],
        requirements: activityData.requirements || [],
        tags: activityData.tags || [],
        featured: activityData.featured || false,
        active: activityData.active !== undefined ? activityData.active : true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      } as Activity;
      
      addActivity(newActivity);
    }
    setShowForm(false);
  };

  const filteredActivities = activities
    .filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || activity.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
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
          message={`¿Estás seguro de que quieres eliminar "${deletingActivity.title}"? Esta acción no se puede deshacer.`}
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
