import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Star, 
  MapPin 
} from 'lucide-react';

const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('month');
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState<boolean>(false);
  const { bookings: ctxBookings, isLoading: ctxLoading, error: ctxError } = useData();

  type BookingApi = {
    id: string;
    date?: string;
    participants?: number;
    totalPrice?: number;
    status?: string;
    activity?: { id?: string; name?: string; location?: string };
    customer?: { id?: string; name?: string; email?: string; country?: string };
    paymentMethod?: string;
  };

  // Usar bookings del DataContext para mantener consistencia con otras secciones
  const bookings: BookingApi[] = useMemo(() => Array.isArray(ctxBookings) ? ctxBookings as BookingApi[] : [], [ctxBookings]);
  const loading = ctxLoading;
  const error = ctxError;

  // Rangos de tiempo
  // Normalizadores para campos variables del backend
  const getBookingDate = (b: BookingApi): any => (b as any)?.date || (b as any)?.bookingDate || (b as any)?.booking_date || (b as any)?.createdAt || (b as any)?.created_at;
  const getBookingAmount = (b: BookingApi): number => Number((b as any)?.totalPrice ?? (b as any)?.total ?? (b as any)?.amount ?? 0);
  const getRangeDates = (range: string) => {
    const end = new Date();
    end.setHours(23,59,59,999);
    let start = new Date(end);
    if (range === 'week') {
      // Últimos 7 días incluyendo hoy
      start = new Date(end);
      start.setDate(end.getDate() - 6);
    } else if (range === 'month') {
      // Desde el primer día del mes actual
      start = new Date(end.getFullYear(), end.getMonth(), 1, 0, 0, 0, 0);
    } else if (range === 'quarter') {
      // Desde el primer día del trimestre actual
      const qStartMonth = Math.floor(end.getMonth() / 3) * 3; // 0,3,6,9
      start = new Date(end.getFullYear(), qStartMonth, 1, 0, 0, 0, 0);
    } else if (range === 'year') {
      // Desde el 1 de enero del año actual
      start = new Date(end.getFullYear(), 0, 1, 0, 0, 0, 0);
    }
    return { start, end };
  };

  const inRange = (d?: any, start?: Date, end?: Date) => {
    if (!d || !start || !end) return false;
    const t = new Date(d as any).getTime();
    return t >= start.getTime() && t <= end.getTime();
  };

  const { start, end } = useMemo(() => getRangeDates(timeRange), [timeRange]);
  const { start: prevStart, end: prevEnd } = useMemo(() => {
    const dur = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - dur);
    return { start: prevStart, end: prevEnd };
  }, [start, end]);

  // KPIs actuales y previos
  const revenueCurrent = useMemo(() => bookings.reduce((sum, b) => sum + (inRange(getBookingDate(b), start, end) ? getBookingAmount(b) : 0), 0), [bookings, start, end]);
  const revenuePrev = useMemo(() => bookings.reduce((sum, b) => sum + (inRange(getBookingDate(b), prevStart, prevEnd) ? getBookingAmount(b) : 0), 0), [bookings, prevStart, prevEnd]);
  const bookingsCurrent = useMemo(() => bookings.filter(b => inRange(getBookingDate(b), start, end)).length, [bookings, start, end]);
  const bookingsPrev = useMemo(() => bookings.filter(b => inRange(getBookingDate(b), prevStart, prevEnd)).length, [bookings, prevStart, prevEnd]);
  const customersCurrent = useMemo(() => new Set(bookings.filter(b => inRange(getBookingDate(b), start, end)).map(b => b.customer?.email || b.customer?.id || b.customer?.name)).size, [bookings, start, end]);
  const customersPrev = useMemo(() => new Set(bookings.filter(b => inRange(getBookingDate(b), prevStart, prevEnd)).map(b => b.customer?.email || b.customer?.id || b.customer?.name)).size, [bookings, prevStart, prevEnd]);

  // Si el rango actual no tiene datos, cambiar automáticamente a 'year' para mostrar información
  useEffect(() => {
    if (loading || error) return;
    if (!bookings.length) return;
    const hasInRange = bookings.some(b => inRange(getBookingDate(b), start, end));
    if (!hasInRange && (timeRange === 'week' || timeRange === 'month')) {
      setTimeRange('year');
    }
  }, [loading, error, bookings, start, end, timeRange]);

  const pct = (curr: number, prev: number) => {
    if (!prev && !curr) return 0;
    if (!prev) return 100;
    return Number((((curr - prev) / prev) * 100).toFixed(1));
  };

  const revenueData = { current: revenueCurrent, previous: revenuePrev, percentageChange: pct(revenueCurrent, revenuePrev) };
  const bookingsData = { current: bookingsCurrent, previous: bookingsPrev, percentageChange: pct(bookingsCurrent, bookingsPrev) };
  const customersData = { current: customersCurrent, previous: customersPrev, percentageChange: pct(customersCurrent, customersPrev) };
  const satisfactionData = { current: 4.8, previous: 4.7, percentageChange: 2.1 }; // placeholder hasta tener fuente real

  // Serie para el gráfico según rango seleccionado
  const revenueSeries = useMemo(() => {
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const series: { label: string; amount: number }[] = [];
    if (!start || !end) return series;
    const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
    const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    if (timeRange === 'week' || timeRange === 'month') {
      // Barras diarias dentro del rango
      for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
        const key = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
        const dayTotal = bookings.reduce((sum, b) => {
          const bd = getBookingDate(b); if (!bd) return sum;
          const dd = new Date(bd); dd.setHours(0,0,0,0);
          return sum + (sameDay(d, dd) ? getBookingAmount(b) : 0);
        }, 0);
        series.push({ label: key, amount: dayTotal });
      }
    } else {
      // Barras mensuales dentro del rango (quarter/year)
      const acc = new Map<string, number>();
      for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
        const mStart = y === start.getFullYear() ? start.getMonth() : 0;
        const mEnd = y === end.getFullYear() ? end.getMonth() : 11;
        for (let m = mStart; m <= mEnd; m++) {
          const key = `${months[m]} ${String(y).slice(-2)}`;
          acc.set(key, 0);
        }
      }
      for (const b of bookings) {
        const bd = getBookingDate(b); if (!bd) continue;
        const d = new Date(bd);
        if (!inRange(bd, start, end)) continue;
        const key = `${months[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
        acc.set(key, (acc.get(key) || 0) + getBookingAmount(b));
      }
      for (const [label, amount] of acc.entries()) series.push({ label, amount });
    }
    return series;
  }, [bookings, start, end, timeRange]);

  const revenueMax = useMemo(() => Math.max(1, ...revenueSeries.map(s => s.amount)), [revenueSeries]);

  // Top actividades del rango
  const topActivitiesData = useMemo(() => {
    const map = new Map<string, { name: string; bookings: number; revenue: number }>();
    for (const b of bookings) {
      if (!inRange(getBookingDate(b), start, end)) continue;
      const name = b.activity?.name || '—';
      const entry = map.get(name) || { name, bookings: 0, revenue: 0 };
      entry.bookings += 1;
      entry.revenue += getBookingAmount(b);
      map.set(name, entry);
    }
    return Array.from(map.values()).sort((a, b) => b.bookings - a.bookings).slice(0, 5);
  }, [bookings, start, end]);

  // Rendimiento reciente (últimos 7 días)
  const recentDays = useMemo(() => {
    const dayNames = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const arr: { date: string; day: string; bookings: number; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const key = `${yyyy}-${mm}-${dd}`;
      const bookingsOfDay = bookings.filter(b => {
        const bd = getBookingDate(b); if (!bd) return false;
        const d2 = new Date(bd); d2.setHours(0,0,0,0);
        const k2 = `${d2.getFullYear()}-${String(d2.getMonth()+1).padStart(2,'0')}-${String(d2.getDate()).padStart(2,'0')}`;
        return k2 === key;
      });
      const revenue = bookingsOfDay.reduce((s, b) => s + getBookingAmount(b), 0);
      arr.push({ date: key, day: dayNames[d.getDay()], bookings: bookingsOfDay.length, revenue });
    }
    return arr;
  }, [bookings]);

  // Máximo para barra de actividades (evita división por cero)
  const topActivitiesMax = useMemo(() => {
    const vals = topActivitiesData.map(a => a.bookings);
    return Math.max(1, ...(vals.length ? vals : [1]));
  }, [topActivitiesData]);

  // Distribución por país
  const customersByCountryData = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of bookings) {
      if (!inRange(getBookingDate(b), start, end)) continue;
      const country = (b.customer?.country || 'Otros').trim();
      map.set(country, (map.get(country) || 0) + 1);
    }
    const total = Array.from(map.values()).reduce((a, c) => a + c, 0) || 1;
    return Array.from(map.entries()).map(([country, count]) => ({ country, count, percentage: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [bookings, start, end]);

  // Función para cambiar el rango de tiempo
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    setShowTimeRangeDropdown(false);
  };

  // Función para obtener el texto del rango de tiempo
  const getTimeRangeText = () => {
    switch (timeRange) {
      case 'week':
        return 'Esta Semana';
      case 'month':
        return 'Este Mes';
      case 'quarter':
        return 'Este Trimestre';
      case 'year':
        return 'Este Año';
      default:
        return 'Este Mes';
    }
  };

  // Función para renderizar la flecha de tendencia
  const renderTrend = (percentageChange: number) => {
    if (percentageChange > 0) {
      return (
        <div className="flex items-center text-green-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>+{percentageChange}%</span>
        </div>
      );
    } else if (percentageChange < 0) {
      return (
        <div className="flex items-center text-red-600">
          <TrendingDown className="w-4 h-4 mr-1" />
          <span>{percentageChange}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-600">
          <span>0%</span>
        </div>
      );
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reportes y Analytics
          </h1>
          <p className="text-gray-600">
            Visualiza el rendimiento de tu negocio con datos detallados
          </p>
          <p className="text-xs text-gray-500 mt-1">{!loading ? `Registros cargados: ${bookings.length}` : 'Cargando…'}</p>
        </div>
        {loading && (
          <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800" role="status" aria-live="polite">
            Cargando datos de reportes…
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800" role="alert" aria-live="assertive">
            {error}
          </div>
        )}
        <div className="mt-4 md:mt-0 flex gap-3">
          <div className="relative">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
              onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
              aria-haspopup="listbox"
              aria-expanded={showTimeRangeDropdown}
            >
              <Calendar className="w-4 h-4" />
              {getTimeRangeText()}
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showTimeRangeDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200 overflow-hidden">
                <div className="p-2">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${timeRange === 'week' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleTimeRangeChange('week')}
                  >
                    Esta Semana
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${timeRange === 'month' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleTimeRangeChange('month')}
                  >
                    Este Mes
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${timeRange === 'quarter' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleTimeRangeChange('quarter')}
                  >
                    Este Trimestre
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${timeRange === 'year' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleTimeRangeChange('year')}
                  >
                    Este Año
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 mr-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Ingresos</h3>
            </div>
            {renderTrend(revenueData.percentageChange)}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ${revenueData.current.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">
            vs ${revenueData.previous.toLocaleString()} periodo anterior
          </p>
        </div>
        
        {/* Bookings Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 mr-3">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Reservas</h3>
            </div>
            {renderTrend(bookingsData.percentageChange)}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {bookingsData.current}
          </div>
          <p className="text-sm text-gray-600">
            vs {bookingsData.previous} periodo anterior
          </p>
        </div>
        
        {/* Customers Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100 mr-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Clientes</h3>
            </div>
            {renderTrend(customersData.percentageChange)}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {customersData.current}
          </div>
          <p className="text-sm text-gray-600">
            vs {customersData.previous} periodo anterior
          </p>
        </div>
        
        {/* Satisfaction Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100 mr-3">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Satisfacción</h3>
            </div>
            {renderTrend(satisfactionData.percentageChange)}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {satisfactionData.current}
          </div>
          <p className="text-sm text-gray-600">
            vs {satisfactionData.previous} periodo anterior
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {!loading && bookings.filter(b => inRange(getBookingDate(b), start, end)).length === 0 && !error && (
          <div className="lg:col-span-2">
            <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800" role="status" aria-live="polite">
              No hay datos para el rango seleccionado. Prueba otro rango (ej. "Este Año").
            </div>
          </div>
        )}
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Ingresos Mensuales
            </h3>
            <button className="text-sm text-sky-600 hover:text-sky-800">
              Ver Detalle
            </button>
          </div>
          
          {/* Chart Placeholder */
          }
          <div className="h-64 bg-gray-50 rounded-lg flex flex-col justify-center items-center">
            <div className="w-full px-4">
              <div className="flex justify-between mb-2 text-xs text-gray-500">
                <span>${revenueMax.toLocaleString()}</span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="flex h-40 items-end space-x-2">
                {revenueSeries.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full bg-sky-500 rounded-t-sm ${
                        index === revenueSeries.length - 1 ? 'bg-sky-600' : ''
                      }`} 
                      style={{ height: `${(item.amount / revenueMax) * 100}%` }}
                    ></div>
                    <span className="text-xs mt-1 text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Activities Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Actividades Más Populares
            </h3>
            <button className="text-sm text-sky-600 hover:text-sky-800">
              Ver Todas
            </button>
          </div>
          
          <div className="space-y-4">
            {topActivitiesData.map((activity, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-sky-100 text-sky-800 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{activity.name}</span>
                    <span className="text-sm font-semibold text-gray-900">${activity.revenue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sky-500 h-2 rounded-full" 
                      style={{ width: `${(activity.bookings / topActivitiesMax) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{activity.bookings} reservas</span>
                    <span className="text-xs text-gray-500">
                      {Math.round((activity.bookings / bookingsData.current) * 100)}% del total
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customers by Country */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Clientes por País
            </h3>
            <button className="text-sm text-sky-600 hover:text-sky-800">
              Ver Detalle
            </button>
          </div>
          
          <div className="space-y-4">
            {customersByCountryData.map((country, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 text-right mr-4">
                  <span className="text-sm font-medium text-gray-900">{country.percentage}%</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{country.country}</span>
                    <span className="text-sm text-gray-500">{country.count} clientes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-sky-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-green-500' :
                        index === 4 ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Rendimiento Reciente
            </h3>
            <button className="text-sm text-sky-600 hover:text-sky-800">
              Ver Calendario
            </button>
          </div>
          
          <div className="space-y-4">
            {recentDays.map((day, index) => (
              <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                <div className="w-16 text-center mr-4">
                  <div className="text-sm font-medium text-gray-900">{day.date.split('-')[2]}</div>
                  <div className="text-xs text-gray-500">{day.day}</div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{day.bookings} reservas</div>
                      <div className="text-xs text-gray-500">
                        {day.bookings > 10 ? 'Por encima del promedio' : day.bookings < 10 ? 'Por debajo del promedio' : 'Promedio'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">${day.revenue}</div>
                      <div className={`text-xs ${
                        day.revenue > 1200 ? 'text-green-600' : day.revenue < 1000 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {day.revenue > 1200 ? '↑' : day.revenue < 1000 ? '↓' : '−'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
