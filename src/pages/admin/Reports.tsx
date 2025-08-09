import React, { useState } from 'react';
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
  
  // Datos de ejemplo para los reportes
  const revenueData = {
    current: 45680,
    previous: 42340,
    percentageChange: 7.9
  };
  
  const bookingsData = {
    current: 156,
    previous: 143,
    percentageChange: 9.1
  };
  
  const customersData = {
    current: 98,
    previous: 82,
    percentageChange: 19.5
  };
  
  const satisfactionData = {
    current: 4.8,
    previous: 4.7,
    percentageChange: 2.1
  };

  // Datos para los gráficos
  const monthlyRevenueData = [
    { month: 'Ene', amount: 32500 },
    { month: 'Feb', amount: 28700 },
    { month: 'Mar', amount: 35600 },
    { month: 'Abr', amount: 42300 },
    { month: 'May', amount: 38900 },
    { month: 'Jun', amount: 47200 },
    { month: 'Jul', amount: 53800 },
    { month: 'Ago', amount: 58700 },
    { month: 'Sep', amount: 51200 },
    { month: 'Oct', amount: 47800 },
    { month: 'Nov', amount: 42340 },
    { month: 'Dic', amount: 45680 }
  ];
  
  // Datos para el gráfico de actividades más populares
  const topActivitiesData = [
    { name: 'Isla Saona - Tour Completo', bookings: 45, revenue: 4005 },
    { name: 'Hoyo Azul y Scape Park', bookings: 32, revenue: 4000 },
    { name: 'Catamarán Party', bookings: 28, revenue: 2660 },
    { name: 'Safari Buggy', bookings: 22, revenue: 1430 },
    { name: 'Zip Line Adventure', bookings: 18, revenue: 1620 }
  ];
  
  // Datos para el gráfico de distribución de clientes por país
  const customersByCountryData = [
    { country: 'España', count: 42, percentage: 35 },
    { country: 'Estados Unidos', count: 28, percentage: 23 },
    { country: 'Canadá', count: 18, percentage: 15 },
    { country: 'Reino Unido', count: 12, percentage: 10 },
    { country: 'Alemania', count: 10, percentage: 8 },
    { country: 'Otros', count: 11, percentage: 9 }
  ];

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
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <div className="relative">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
              onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
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
          
          {/* Chart Placeholder */}
          <div className="h-64 bg-gray-50 rounded-lg flex flex-col justify-center items-center">
            <div className="w-full px-4">
              <div className="flex justify-between mb-2 text-xs text-gray-500">
                <span>$60,000</span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="flex h-40 items-end space-x-2">
                {monthlyRevenueData.map((month, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full bg-sky-500 rounded-t-sm ${
                        index === monthlyRevenueData.length - 1 ? 'bg-sky-600' : ''
                      }`} 
                      style={{ height: `${(month.amount / 60000) * 100}%` }}
                    ></div>
                    <span className="text-xs mt-1 text-gray-600">{month.month}</span>
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
                      style={{ width: `${(activity.bookings / topActivitiesData[0].bookings) * 100}%` }}
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
            {[
              { date: '2023-12-15', day: 'Viernes', bookings: 12, revenue: 1450 },
              { date: '2023-12-16', day: 'Sábado', bookings: 18, revenue: 2100 },
              { date: '2023-12-17', day: 'Domingo', bookings: 15, revenue: 1850 },
              { date: '2023-12-18', day: 'Lunes', bookings: 8, revenue: 950 },
              { date: '2023-12-19', day: 'Martes', bookings: 10, revenue: 1200 },
              { date: '2023-12-20', day: 'Miércoles', bookings: 11, revenue: 1350 },
              { date: '2023-12-21', day: 'Jueves', bookings: 9, revenue: 1100 }
            ].map((day, index) => (
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
