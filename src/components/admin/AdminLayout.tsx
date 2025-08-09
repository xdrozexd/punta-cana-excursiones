import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const { auth, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Actividades', href: '/admin/activities', icon: MapPin },
    { name: 'Reservas', href: '/admin/bookings', icon: Calendar },
    { name: 'Clientes', href: '/admin/customers', icon: Users },
    { name: 'Reportes', href: '/admin/reports', icon: BarChart3 },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Ahora es flex-shrink-0 para mantener su ancho en pantallas grandes */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex-shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-caribbean-500 to-caribbean-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  active
                    ? 'bg-caribbean-100 text-caribbean-900 border-r-2 border-caribbean-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
                          <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {auth.user?.name || 'Administrador'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {auth.user?.email || 'admin@puntacanaexcursiones.com'}
                </p>
              </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main content - Ahora usa flex-1 para ocupar el espacio restante */}
      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar actividades, reservas, clientes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // En una aplicación real, esto podría filtrar resultados o navegar a una página de búsqueda
                      console.log('Búsqueda: ', e.currentTarget.value);
                      alert('Búsqueda: ' + e.currentTarget.value);
                    }
                  }}
                />
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center gap-6">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Dropdown de notificaciones */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3 nuevas</span>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {[
                        { title: 'Nueva reserva', message: 'María García ha reservado Isla Saona', time: 'hace 5 min', isNew: true },
                        { title: 'Reseña recibida', message: '5 estrellas para Catamarán Party', time: 'hace 30 min', isNew: true },
                        { title: 'Pago recibido', message: 'Pago de $178 confirmado', time: 'hace 1 hora', isNew: true },
                        { title: 'Reserva cancelada', message: 'Carlos Rodríguez canceló su reserva', time: 'hace 3 horas', isNew: false },
                      ].map((notification, index) => (
                        <div 
                          key={index} 
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${notification.isNew ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button 
                        onClick={() => {
                          setShowNotifications(false);
                          // En una aplicación real, esto podría navegar a una página de notificaciones
                          console.log('Ver todas las notificaciones');
                        }}
                        className="text-sm text-sky-600 hover:text-sky-800 w-full text-center">
                        Ver todas las notificaciones
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick stats */}
              <div className="hidden lg:flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-gray-900">24</p>
                  <p className="text-gray-500">Actividades</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-600">156</p>
                  <p className="text-gray-500">Reservas</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-blue-600">$45.6K</p>
                  <p className="text-gray-500">Este mes</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};