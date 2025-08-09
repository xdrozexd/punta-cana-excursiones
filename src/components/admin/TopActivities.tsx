import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, MapPin, DollarSign } from 'lucide-react';

interface TopActivity {
  id: string;
  title: string;
  location: string;
  bookings: number;
  revenue: number;
  rating: number;
  trend: number;
  image: string;
}

export const TopActivities: React.FC = () => {
  // Mock data - en producción vendría de la API
  const topActivities: TopActivity[] = [
    {
      id: '1',
      title: 'Isla Saona - Tour Completo',
      location: 'Isla Saona',
      bookings: 45,
      revenue: 4005,
      rating: 4.8,
      trend: 15,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
    },
    {
      id: '2',
      title: 'Hoyo Azul y Scape Park',
      location: 'Cap Cana',
      bookings: 32,
      revenue: 4000,
      rating: 4.9,
      trend: 8,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop'
    },
    {
      id: '3',
      title: 'Catamarán Party',
      location: 'Costa de Punta Cana',
      bookings: 28,
      revenue: 2660,
      rating: 4.7,
      trend: -3,
      image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=300&h=200&fit=crop'
    },
    {
      id: '4',
      title: 'Zip Line Adventure',
      location: 'Anamuya Mountains',
      bookings: 22,
      revenue: 1980,
      rating: 4.6,
      trend: 12,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Top Actividades
        </h3>
        <span className="text-sm text-gray-500">Este mes</span>
      </div>

      <div className="space-y-4">
        {topActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            {/* Position */}
            <div className="flex-shrink-0 w-8 h-8 bg-caribbean-100 text-caribbean-800 rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>

            {/* Image */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate text-sm">
                {activity.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>{activity.rating}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-shrink-0 text-right">
              <div className="text-sm font-semibold text-gray-900">
                {activity.bookings} reservas
              </div>
              <div className="flex items-center gap-1 text-xs">
                <DollarSign className="w-3 h-3 text-green-600" />
                <span className="text-green-600 font-medium">
                  ${activity.revenue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Trend */}
            <div className="flex-shrink-0">
              <div className={`flex items-center gap-1 text-xs ${
                activity.trend > 0 
                  ? 'text-green-600' 
                  : activity.trend < 0 
                  ? 'text-red-600' 
                  : 'text-gray-500'
              }`}>
                <TrendingUp className={`w-3 h-3 ${
                  activity.trend < 0 ? 'rotate-180' : ''
                }`} />
                <span>{Math.abs(activity.trend)}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {topActivities.reduce((sum, a) => sum + a.bookings, 0)}
            </p>
            <p className="text-xs text-gray-600">Total Reservas</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">
              ${topActivities.reduce((sum, a) => sum + a.revenue, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Total Ingresos</p>
          </div>
        </div>
      </div>
    </div>
  );
};
