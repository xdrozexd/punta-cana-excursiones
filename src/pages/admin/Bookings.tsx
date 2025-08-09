import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  ChevronDown, 
  Check, 
  X, 
  Users, 
  MapPin, 
  Eye, 
  Edit, 
  Trash2 
} from 'lucide-react';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  activityName: string;
  date: string;
  time: string;
  participants: number;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentMethod: string;
  location: string;
}

const Bookings: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Datos de ejemplo
  const bookings: Booking[] = [
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
    },
    {
      id: 'BK-2023-004',
      customerName: 'Roberto Silva',
      customerEmail: 'roberto.silva@email.com',
      activityName: 'Zip Line Adventure',
      date: '2023-12-22',
      time: '14:00',
      participants: 3,
      amount: 300,
      status: 'cancelled',
      paymentMethod: 'Efectivo',
      location: 'Anamuya Mountains'
    },
    {
      id: 'BK-2023-005',
      customerName: 'Laura Martínez',
      customerEmail: 'laura.martinez@email.com',
      activityName: 'Safari Buggy',
      date: '2023-12-25',
      time: '09:00',
      participants: 2,
      amount: 130,
      status: 'confirmed',
      paymentMethod: 'Tarjeta de crédito',
      location: 'Selva Tropical'
    },
    {
      id: 'BK-2023-006',
      customerName: 'Pedro Sánchez',
      customerEmail: 'pedro.sanchez@email.com',
      activityName: 'Dolphin Encounter',
      date: '2023-12-28',
      time: '11:30',
      participants: 5,
      amount: 600,
      status: 'pending',
      paymentMethod: 'Transferencia bancaria',
      location: 'Ocean World'
    }
  ];

  // Filtrar reservas por estado y término de búsqueda
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Función para mostrar el modal de detalles de reserva
  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Reservas
          </h1>
          <p className="text-gray-600">
            Administra y visualiza todas las reservas de actividades
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Exportar
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Nueva Reserva
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, email, actividad o ID..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
                onClick={() => setSelectedStatus('all')}
              >
                Estado: {selectedStatus === 'all' ? 'Todos' : getStatusText(selectedStatus)}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200 overflow-hidden">
                <div className="p-2">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedStatus === 'all' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedStatus('all')}
                  >
                    Todos
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedStatus === 'confirmed' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedStatus('confirmed')}
                  >
                    Confirmadas
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedStatus === 'pending' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedStatus('pending')}
                  >
                    Pendientes
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedStatus === 'cancelled' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedStatus('cancelled')}
                  >
                    Canceladas
                  </button>
                </div>
              </div>
            </div>
            
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha desde
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha hasta
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actividad
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                <option value="">Todas las actividades</option>
                <option>Isla Saona - Tour Completo</option>
                <option>Hoyo Azul y Scape Park</option>
                <option>Catamarán Party</option>
                <option>Safari Buggy</option>
                <option>Zip Line Adventure</option>
                <option>Dolphin Encounter</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actividad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                    <div className="text-sm text-gray-500">{booking.customerName}</div>
                    <div className="text-xs text-gray-400">{booking.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.activityName}</div>
                    <div className="text-xs text-gray-500">{booking.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                    <div className="text-xs text-gray-500">{booking.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.participants}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${booking.amount}</div>
                    <div className="text-xs text-gray-500">{booking.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => openBookingDetails(booking)}
                        className="text-sky-600 hover:text-sky-900 p-1 rounded-full hover:bg-sky-50"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredBookings.length}</span> de <span className="font-medium">{bookings.length}</span> resultados
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-50">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Detalles de Reserva
                </h3>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selectedBooking.activityName}
                  </h4>
                  <p className="text-gray-600">{selectedBooking.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedBooking.status)}`}>
                  {getStatusText(selectedBooking.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Información del Cliente</h5>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{selectedBooking.customerName}</p>
                    <p className="text-sm text-gray-600">{selectedBooking.customerEmail}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Detalles de Pago</h5>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">${selectedBooking.amount}</p>
                    <p className="text-sm text-gray-600">{selectedBooking.paymentMethod}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fecha y Hora</p>
                    <p className="text-sm text-gray-600">{formatDate(selectedBooking.date)} - {selectedBooking.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Ubicación</p>
                    <p className="text-sm text-gray-600">{selectedBooking.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Participantes</p>
                    <p className="text-sm text-gray-600">{selectedBooking.participants} personas</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h5 className="text-sm font-medium text-gray-500 mb-2">Acciones</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.status === 'pending' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Confirmar
                    </button>
                  )}
                  {selectedBooking.status !== 'cancelled' && (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  )}
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1">
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                    Enviar Confirmación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
