// React import removed as not needed
import { NavLink } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Star,
  BarChart3,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const stats = {
    totalActivities: 24,
    totalBookings: 156,
    monthlyRevenue: 45680,
    averageRating: 4.8
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard de Administración
        </h1>
        <p className="text-gray-600">
          Gestiona tus excursiones y monitorea el rendimiento de tu negocio
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Actividades */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Actividades</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stats.totalActivities}</p>
              <div className="flex items-center gap-1 text-sm text-blue-600">
                <TrendingUp className="w-4 h-4" />
                <span>+3 este mes</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Reservas Totales */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Reservas Totales</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stats.totalBookings}</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+12% vs mes anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-green-50">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Ingresos Mensuales */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ingresos Mensuales</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">${stats.monthlyRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm text-purple-600">
                <TrendingUp className="w-4 h-4" />
                <span>+8.2% vs mes anterior</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-purple-50">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Rating Promedio */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Rating Promedio</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stats.averageRating}</p>
              <div className="flex items-center gap-1 text-sm text-yellow-600">
                <Star className="w-4 h-4" />
                <span>Excelente</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-yellow-50">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Rendimiento
              </h3>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>Últimos 7 días</option>
                <option>Últimos 30 días</option>
                <option>Últimos 90 días</option>
              </select>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de rendimiento</p>
                <p className="text-sm text-gray-400">Reservas e ingresos por día</p>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Reservas Recientes
              </h3>
              <NavLink to="/admin/bookings" className="text-sky-600 hover:text-sky-700 text-sm font-medium hover:underline">
                Ver todas
              </NavLink>
            </div>

            <div className="space-y-4">
              {[
                { name: 'María García', activity: 'Isla Saona - Tour Completo', amount: 178, people: 2, status: 'confirmed' },
                { name: 'Carlos Rodríguez', activity: 'Hoyo Azul y Scape Park', amount: 500, people: 4, status: 'pending' },
                { name: 'Ana López', activity: 'Catamarán Party', amount: 570, people: 6, status: 'confirmed' },
                { name: 'Roberto Silva', activity: 'Zip Line Adventure', amount: 300, people: 3, status: 'confirmed' }
              ].map((booking, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{booking.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{booking.activity}</p>
                      
                      <div className="flex gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{booking.people} personas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span className="font-medium">${booking.amount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Hoy, 2:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <NavLink 
                to="/admin/activities"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Nueva Actividad
              </NavLink>
              <NavLink 
                to="/admin/reports"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Ver Reportes
              </NavLink>
              <NavLink 
                to="/admin/customers"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Gestionar Usuarios
              </NavLink>
            </div>
          </div>

          {/* Top Activities */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Actividades
              </h3>
              <span className="text-sm text-gray-500">Este mes</span>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Isla Saona - Tour Completo', bookings: 45, revenue: 4005, rating: 4.8, trend: 15 },
                { title: 'Hoyo Azul y Scape Park', bookings: 32, revenue: 4000, rating: 4.9, trend: 8 },
                { title: 'Catamarán Party', bookings: 28, revenue: 2660, rating: 4.7, trend: -3 },
                { title: 'Zip Line Adventure', bookings: 22, revenue: 1980, rating: 4.6, trend: 12 }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-caribbean-100 text-caribbean-800 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate text-sm">{activity.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{activity.rating}</span>
                      <span className={`ml-2 ${activity.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {activity.trend > 0 ? '+' : ''}{activity.trend}%
                      </span>
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              {[
                { action: "Nueva reserva", detail: "Isla Saona - 2 personas", time: "hace 5 min", type: "booking" },
                { action: "Actividad actualizada", detail: "Hoyo Azul - Precio modificado", time: "hace 15 min", type: "update" },
                { action: "Nueva reseña", detail: "5 estrellas - Catamaran", time: "hace 30 min", type: "review" },
                { action: "Usuario registrado", detail: "maria.garcia@email.com", time: "hace 1 hora", type: "user" }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'booking' ? 'bg-green-500' :
                    activity.type === 'update' ? 'bg-blue-500' :
                    activity.type === 'review' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.detail}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;