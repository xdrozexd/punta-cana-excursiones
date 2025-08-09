import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export const PerformanceChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7days');
  
  // Mock data - en producción vendría de la API
  const chartData = {
    '7days': [
      { label: 'Lun', reservas: 12, ingresos: 1200 },
      { label: 'Mar', reservas: 18, ingresos: 1800 },
      { label: 'Mié', reservas: 15, ingresos: 1650 },
      { label: 'Jue', reservas: 22, ingresos: 2200 },
      { label: 'Vie', reservas: 28, ingresos: 2800 },
      { label: 'Sáb', reservas: 35, ingresos: 3500 },
      { label: 'Dom', reservas: 30, ingresos: 3200 }
    ],
    '30days': [
      { label: 'Sem 1', reservas: 85, ingresos: 8500 },
      { label: 'Sem 2', reservas: 92, ingresos: 9200 },
      { label: 'Sem 3', reservas: 78, ingresos: 7800 },
      { label: 'Sem 4', reservas: 105, ingresos: 10500 }
    ],
    '90days': [
      { label: 'Mes 1', reservas: 320, ingresos: 32000 },
      { label: 'Mes 2', reservas: 280, ingresos: 28000 },
      { label: 'Mes 3', reservas: 360, ingresos: 36000 }
    ]
  };

  const data = chartData[timeRange as keyof typeof chartData];
  const maxReservas = Math.max(...data.map(d => d.reservas));
  const maxIngresos = Math.max(...data.map(d => d.ingresos));

  const totalReservas = data.reduce((sum, d) => sum + d.reservas, 0);
  const totalIngresos = data.reduce((sum, d) => sum + d.ingresos, 0);
  const promReservas = Math.round(totalReservas / data.length);
  const promIngresos = Math.round(totalIngresos / data.length);

  const timeRanges = [
    { value: '7days', label: 'Últimos 7 días' },
    { value: '30days', label: 'Últimos 30 días' },
    { value: '90days', label: 'Últimos 90 días' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Rendimiento
        </h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
        >
          {timeRanges.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{totalReservas}</p>
          <p className="text-sm text-gray-600">Total Reservas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">${totalIngresos.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Ingresos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{promReservas}</p>
          <p className="text-sm text-gray-600">Promedio Reservas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">${promIngresos.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Promedio Ingresos</p>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-caribbean-500 rounded"></div>
            <span className="text-gray-600">Reservas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-sunset-500 rounded"></div>
            <span className="text-gray-600">Ingresos</span>
          </div>
        </div>

        <div className="relative h-64">
          <div className="flex items-end justify-between h-full gap-2">
            {data.map((item, index) => {
              const reservasHeight = (item.reservas / maxReservas) * 100;
              const ingresosHeight = (item.ingresos / maxIngresos) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex items-end gap-1 w-full h-48">
                    {/* Reservas Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${reservasHeight}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex-1 bg-caribbean-500 rounded-t-sm relative group"
                      title={`${item.reservas} reservas`}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {item.reservas} reservas
                      </div>
                    </motion.div>
                    
                    {/* Ingresos Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${ingresosHeight}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
                      className="flex-1 bg-sunset-500 rounded-t-sm relative group"
                      title={`$${item.ingresos.toLocaleString()}`}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        ${item.ingresos.toLocaleString()}
                      </div>
                    </motion.div>
                  </div>
                  
                  <span className="text-xs text-gray-600 font-medium">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trend Indicators */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Reservas</p>
            <p className="text-xs text-green-600">+12% vs período anterior</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Ingresos</p>
            <p className="text-xs text-green-600">+8% vs período anterior</p>
          </div>
        </div>
      </div>
    </div>
  );
};
