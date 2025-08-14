import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
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
  const { activities } = useData();

  type BookingApi = {
    id: string;
    date?: string;
    participants?: number;
    totalPrice?: number;
    status?: string;
    activity?: { id?: string; name?: string; location?: string };
    customer?: { name?: string; email?: string };
    paymentMethod?: string;
  };

  const isDev = (import.meta as any).env?.DEV === true || (import.meta as any).env?.MODE === 'development';
  const API_BASE = isDev ? '/api' : (((import.meta as any).env?.VITE_API_URL) || '/api');

  const [bookings, setBookings] = useState<BookingApi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJsonWithDetails = async (url: string, init?: RequestInit) => {
    const res = await fetch(url, init);
    let data: any = null;
    let text = '';
    try { data = await res.json(); } catch { try { text = await res.text(); } catch {} }
    return { ok: res.ok, status: res.status, statusText: res.statusText, data, text };
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let { ok, data, text, status, statusText } = await fetchJsonWithDetails(`${API_BASE}/bookings`);
        if (!ok) {
          await new Promise(r => setTimeout(r, 500));
          ({ ok, data, text, status, statusText } = await fetchJsonWithDetails(`${API_BASE}/bookings`));
        }
        if (!ok) {
          const msg = (data?.message || data?.error || text || '').toString().trim();
          const statusInfo = `${status || ''} ${statusText || ''}`.trim();
          throw new Error([msg, statusInfo].filter(Boolean).join(' | ') || 'No se pudieron cargar las reservas');
        }
        setBookings(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || 'Error al cargar reservas');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute stats
  const totalActivities = activities?.length || 0;
  const totalBookings = bookings.length;
  const now = new Date();
  const monthlyRevenue = useMemo(() => {
    return bookings.reduce((sum, b) => {
      if (!b?.date) return sum;
      const d = new Date(b.date);
      const sameMonth = d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      return sameMonth ? sum + Number(b.totalPrice || 0) : sum;
    }, 0);
  }, [bookings]);

  // Average rating not available from current API; keep placeholder or compute if later provided
  const averageRating = 4.8;

  // Top activities by bookings and revenue (current month)
  const topActivities = useMemo(() => {
    const map = new Map<string, { title: string; bookings: number; revenue: number }>();
    for (const b of bookings) {
      const d = b?.date ? new Date(b.date) : null;
      const sameMonth = d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (!sameMonth) continue;
      const key = b?.activity?.name || '—';
      const entry = map.get(key) || { title: key, bookings: 0, revenue: 0 };
      entry.bookings += 1;
      entry.revenue += Number(b.totalPrice || 0);
      map.set(key, entry);
    }
    return Array.from(map.values()).sort((a, b) => b.bookings - a.bookings).slice(0, 5);
  }, [bookings]);

  // Recent activity from latest bookings
  const recent = useMemo(() => {
    return [...bookings]
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, 8)
      .map(b => ({
        action: 'Nueva reserva',
        detail: `${b.activity?.name || 'Actividad'} - ${b.participants || 1} ${Number(b.participants) === 1 ? 'persona' : 'personas'}`,
        time: new Date(b.date || Date.now()).toLocaleString(),
        type: 'booking' as const
      }));
  }, [bookings]);

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

      {/* Loader / Error */}
      {loading && (
        <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">Cargando datos...</div>
      )}
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert" aria-live="assertive">{error}</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Actividades */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Actividades</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{totalActivities}</p>
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
              <p className="text-2xl font-bold text-gray-900 mb-2">{totalBookings}</p>
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
              <p className="text-2xl font-bold text-gray-900 mb-2">${monthlyRevenue.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900 mb-2">{averageRating}</p>
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
              <select
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                aria-label="Rango de fechas"
                title="Rango de fechas"
              >
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
              {bookings.map((booking, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{booking.customer?.name || '—'}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{booking.activity?.name || '—'}</p>
                      
                      <div className="flex gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{booking.participants || 1} {Number(booking.participants) === 1 ? 'persona' : 'personas'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span className="font-medium">${booking.totalPrice || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(booking.date || Date.now()).toLocaleString()}</span>
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
              {topActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-caribbean-100 text-caribbean-800 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate text-sm">{activity.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">{/* Placeholder de rating hasta que API lo provea */}
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>—</span>
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
              {recent.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'booking' ? 'bg-green-500' : 'bg-purple-500'
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