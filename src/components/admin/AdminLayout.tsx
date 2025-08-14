import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  User,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const { bookings: ctxBookings, activities } = useData();

  // Bloquear scroll del body cuando el sidebar móvil está abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prev || '';
    }
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, [sidebarOpen]);

  // --- Notificaciones basadas en reservas reales ---
  const [lastSeenTs, setLastSeenTs] = useState<number>(() => {
    const v = localStorage.getItem('admin.notifications.lastSeen');
    return v ? Number(v) : 0;
  });

  const getBookingDate = (b: any): any => b?.date || b?.bookingDate || b?.booking_date || b?.createdAt || b?.created_at;
  const getBookingAmount = (b: any): number => Number(b?.amount ?? b?.totalPrice ?? b?.total ?? 0) || 0;
  const parseDate = (d: any): number => {
    const t = new Date(d as any).getTime();
    return isNaN(t) ? 0 : t;
  };
  const timeAgo = (iso: any) => {
    const t = parseDate(iso);
    if (!t) return '';
    const diff = Date.now() - t;
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'ahora';
    if (m < 60) return `hace ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `hace ${h} h`;
    const d = Math.floor(h / 24);
    return `hace ${d} d`;
  };

  // Ordenar reservas recientes y construir notificaciones
  const recentNotifications = useMemo(() => {
    const arr = Array.isArray(ctxBookings) ? [...ctxBookings] : [];
    arr.sort((a, b) => parseDate(getBookingDate(b)) - parseDate(getBookingDate(a)));
    return arr.slice(0, 10).map((b: any) => ({
      title: 'Nueva reserva',
      message: `${b?.customer?.name || 'Cliente'} reservó ${b?.activity?.name || 'actividad'}`,
      time: timeAgo(getBookingDate(b)),
      ts: parseDate(getBookingDate(b)),
      booking: b,
    }));
  }, [ctxBookings]);

  const unreadCount = useMemo(() => recentNotifications.filter(n => n.ts > lastSeenTs).length, [recentNotifications, lastSeenTs]);

  // Ingresos del mes actual basados en reservas
  const { startOfMonthTs } = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    return { startOfMonthTs: start.getTime() };
  }, []);

  const monthlyRevenue = useMemo(() => {
    if (!Array.isArray(ctxBookings) || !ctxBookings.length) return 0;
    return ctxBookings.reduce((sum, b) => {
      const ts = parseDate(getBookingDate(b));
      if (!ts || ts < startOfMonthTs) return sum;
      return sum + getBookingAmount(b);
    }, 0);
  }, [ctxBookings, startOfMonthTs]);

  const currency = useMemo(() => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), []);

  // Al abrir el dropdown, marcar como visto
  const toggleNotifications = () => {
    setShowNotifications(prev => {
      const next = !prev;
      if (!prev && next) {
        const now = Date.now();
        setLastSeenTs(now);
        localStorage.setItem('admin.notifications.lastSeen', String(now));
      }
      return next;
    });
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Actividades', href: '/admin/activities', icon: MapPin },
    { name: 'Reservas', href: '/admin/bookings', icon: Calendar },
    { name: 'Clientes', href: '/admin/customers', icon: Users },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
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
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Ahora es flex-shrink-0 para mantener su ancho en pantallas grandes */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
        aria-modal={sidebarOpen ? 'true' : undefined}
        role="dialog"
      >
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
            aria-label="Cerrar menú lateral"
            title="Cerrar menú lateral"
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
                className={`flex items-center gap-3 px-3 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between h-14 lg:h-16 px-4 sm:px-6 gap-2 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 text-gray-400 hover:text-gray-600"
              aria-label="Abrir menú lateral"
              title="Abrir menú lateral"
            >
              <Menu className="w-6 h-6" />
            </button>


            {/* Header actions */}
            <div className="flex items-center gap-4 w-auto ml-auto">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  aria-label="Abrir notificaciones"
                  title="Abrir notificaciones"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 bg-red-500 text-white text-[10px] leading-4 rounded-full text-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Dropdown de notificaciones */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-[90vw] sm:w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount} nuevas</span>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {recentNotifications.length === 0 && (
                        <div className="px-4 py-6 text-center text-sm text-gray-500">Sin notificaciones</div>
                      )}
                      {recentNotifications.map((n, index) => (
                        <div 
                          key={index} 
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${n.ts > lastSeenTs ? 'bg-blue-50' : ''}`}
                          onClick={() => {
                            setSelectedBooking(n.booking);
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900">{n.title}</p>
                            <span className="text-xs text-gray-500">{n.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{n.message}</p>
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

              {/* Quick stats (icon first, then stats) */}
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{Array.isArray(activities) ? activities.length : 0}</p>
                  <p className="text-gray-500">Actividades</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-600">{Array.isArray(ctxBookings) ? ctxBookings.length : 0}</p>
                  <p className="text-gray-500">Reservas</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-blue-600">{currency.format(monthlyRevenue)}</p>
                  <p className="text-gray-500">Este mes</p>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedBooking(null)} aria-hidden="true" />
            <div className="relative bg-white w-full max-w-lg mx-4 rounded-lg shadow-xl border border-gray-200" role="dialog" aria-modal="true" aria-label="Detalle de Reserva">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Detalle de Reserva</h3>
                <button className="p-1 text-gray-400 hover:text-gray-600" onClick={() => setSelectedBooking(null)} aria-label="Cerrar">
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-3 text-sm text-gray-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-gray-500">ID</div>
                    <div className="font-medium break-all">{selectedBooking?.id || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Fecha</div>
                    <div className="font-medium">{(() => { const d = getBookingDate(selectedBooking); return d ? new Date(d).toLocaleString() : '—'; })()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Cliente</div>
                    <div className="font-medium">{selectedBooking?.customer?.name || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Email</div>
                    <div className="font-medium break-all">{selectedBooking?.customer?.email || '—'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500">Actividad</div>
                    <div className="font-medium">{selectedBooking?.activity?.name || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Participantes</div>
                    <div className="font-medium">{selectedBooking?.participants ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Importe</div>
                    <div className="font-medium">{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'USD' }).format(getBookingAmount(selectedBooking))}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Estado</div>
                    <div className="font-medium capitalize">{selectedBooking?.status || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Pago</div>
                    <div className="font-medium">{selectedBooking?.paymentMethod || '—'}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500">Ubicación</div>
                    <div className="font-medium">{selectedBooking?.activity?.location || selectedBooking?.activity?.place || '—'}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
                <button
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                  onClick={() => setSelectedBooking(null)}
                >
                  Cerrar
                </button>
                <button
                  className="px-3 py-2 text-sm rounded-md bg-sky-600 text-white hover:bg-sky-700"
                  onClick={() => {
                    setSelectedBooking(null);
                    navigate('/admin/bookings');
                  }}
                >
                  Ver en Reservas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};