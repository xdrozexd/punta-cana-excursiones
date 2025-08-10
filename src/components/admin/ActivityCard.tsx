import React from 'react';
import { motion } from 'framer-motion';
import { 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Star,
  Calendar
} from 'lucide-react';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Activity } from '../../types/activity';

interface ActivityCardProps {
  activity: Activity;
  onEdit: () => void;
  onDelete: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onEdit,
  onDelete
}) => {
  const categoryLabels: Record<string, string> = {
    'tours-islas': 'Tours a Islas',
    'aventura': 'Aventura',
    'acuaticos': 'Deportes Acuáticos',
    'cultural': 'Cultural',
    'gastronomia': 'Gastronomía',
    'relax': 'Relax y Spa',
    'nocturna': 'Vida Nocturna'
  };

  const categoryColors: Record<string, string> = {
    'tours-islas': 'bg-blue-100 text-blue-800',
    'aventura': 'bg-red-100 text-red-800',
    'acuaticos': 'bg-cyan-100 text-cyan-800',
    'cultural': 'bg-purple-100 text-purple-800',
    'gastronomia': 'bg-orange-100 text-orange-800',
    'relax': 'bg-green-100 text-green-800',
    'nocturna': 'bg-indigo-100 text-indigo-800'
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100 hover:shadow-medium transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={activity.images?.[0] || activity.imageUrl || ''}
          fallbackSrc={`https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800`}
          alt={activity.title || activity.name || ''}
          className="w-full h-full object-cover"
        />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {activity.featured && (
            <span className="bg-sunset-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              Destacada
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            activity.active 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {activity.active ? 'Activa' : 'Inactiva'}
          </span>
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            onClick={onEdit}
            className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg transition-all duration-200 hover:scale-105"
            title="Editar"
          >
            <Edit className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg transition-all duration-200 hover:scale-105"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-white bg-opacity-95 px-3 py-1 rounded-lg">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-caribbean-600" />
            <span className="font-bold text-caribbean-900">{activity.price}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
            categoryColors[activity.category] || 'bg-gray-100 text-gray-800'
          }`}>
            {categoryLabels[activity.category] || activity.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {activity.title || activity.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {activity.description}
        </p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate">{activity.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{activity.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            <span>Hasta {activity.maxPeople || activity.maxGroupSize || 10}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{activity.rating.toFixed(1)} ({activity.reviewCount || activity.reviews || 0})</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Actualizado: {activity.updatedAt ? new Date(activity.updatedAt).toLocaleDateString('es-ES') : 'N/A'}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="p-2 text-gray-600 hover:text-caribbean-600 hover:bg-caribbean-50 rounded-lg transition-all duration-200"
              title="Editar actividad"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="Ver detalles"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Eliminar actividad"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
