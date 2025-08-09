import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin,
  Clock,
  Phone,
  Mail,
  Eye,
  MoreVertical
} from 'lucide-react';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  activityTitle: string;
  activityLocation: string;
  date: string;
  time: string;
  people: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export const RecentBookings: React.FC = () => {
  // Mock data - en producción vendría de la API
  const bookings: Booking[] = [
    {
      id: '1',
      customerName: 'María García',
      customerEmail: 'maria.garcia@email.com',
      customerPhone: '+1 809 555 0123',
      activityTitle: 'Isla Saona - Tour Completo',
      activityLocation: 'Isla Saona',
      date: '2024-02-15',
      time: '08:00',
      people: 2,
      totalAmount: 178,
      status: 'confirmed',
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      customerName: 'Carlos Rodríguez',
      customerEmail: 'carlos.rodriguez@email.com',
      customerPhone: '+1 809 555 0456',
      activityTitle: 'Hoyo Azul y Scape Park',
      activityLocation: 'Cap Cana',
      date: '2024-02-16',
      time: '09:30',
      people: 4,
      totalAmount: 500,
      status: 'pending',
      createdAt: '2024-01-20T14:15:00Z'
    },
    {
      id: '3',
      customerName: 'Ana López',
      customerEmail: 'ana.lopez@email.com',
      customerPhone: '+1 809 555 0789',
      activityTitle: 'Catamarán Party',
      activityLocation: 'Costa de Punta Cana',
      date: '2024-02-17',
      time: '14:00',
      people: 6,
      totalAmount: 570,
      status: 'confirmed',
      createdAt: '2024-01-20T16:45:00Z'
    },
    {
      id: '4',
      customerName: 'Roberto Silva',
      customerEmail: 'roberto.silva@email.com',
      customerPhone: '+1 809 555 0321',
      activityTitle: 'Isla Saona - Tour Completo',
      activityLocation: 'Isla Saona',
      date: '2024-02-18',
      time: '08:00',
      people: 3,
      totalAmount: 267,
      status: 'cancelled',
      createdAt: '2024-01-19T20:10:00Z'
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmada',
          className: 'bg-green-100 text-green-800'
        };
      case 'pending':
        return {
          label: 'Pendiente',
          className: 'bg-yellow-100 text-yellow-800'
        };
      case 'cancelled':
        return {
          label: 'Cancelada',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Reservas Recientes
        </h3>
        <button className="text-caribbean-600 hover:text-caribbean-700 text-sm font-medium">
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {bookings.map((booking, index) => {
          const statusConfig = getStatusConfig(booking.status);
          
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-soft transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{booking.customerName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{booking.activityTitle}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(booking.time)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{booking.people} personas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span className="font-medium">${booking.totalAmount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-4">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Más opciones"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>{booking.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{booking.customerPhone}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{booking.activityLocation}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay reservas recientes</p>
        </div>
      )}
    </div>
  );
};
