import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Mail, Phone, MapPin, Calendar, DollarSign, User, Eye, Edit, Trash2, X, Save, UserPlus } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  bookingsCount: number;
  totalSpent: number;
  lastBooking: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState<boolean>(false);
  const [newCustomer, setNewCustomer] = useState<{
    name: string;
    email: string;
    phone: string;
    country: string;
  }>({
    name: '',
    email: '',
    phone: '',
    country: 'España'
  });
  
  // Datos de ejemplo
  const customers: Customer[] = [
    {
      id: 'CUS-001',
      name: 'María García',
      email: 'maria.garcia@email.com',
      phone: '+1 809-555-1234',
      country: 'España',
      bookingsCount: 3,
      totalSpent: 450,
      lastBooking: '2023-12-10',
      status: 'active',
      createdAt: '2023-01-15'
    },
    {
      id: 'CUS-002',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      phone: '+1 809-555-5678',
      country: 'República Dominicana',
      bookingsCount: 2,
      totalSpent: 320,
      lastBooking: '2023-11-25',
      status: 'active',
      createdAt: '2023-02-20'
    },
    {
      id: 'CUS-003',
      name: 'Ana López',
      email: 'ana.lopez@email.com',
      phone: '+1 809-555-9012',
      country: 'México',
      bookingsCount: 5,
      totalSpent: 780,
      lastBooking: '2023-12-05',
      status: 'active',
      createdAt: '2023-03-10'
    },
    {
      id: 'CUS-004',
      name: 'Roberto Silva',
      email: 'roberto.silva@email.com',
      phone: '+1 809-555-3456',
      country: 'Argentina',
      bookingsCount: 1,
      totalSpent: 150,
      lastBooking: '2023-10-18',
      status: 'inactive',
      createdAt: '2023-04-05'
    },
    {
      id: 'CUS-005',
      name: 'Laura Martínez',
      email: 'laura.martinez@email.com',
      phone: '+1 809-555-7890',
      country: 'Colombia',
      bookingsCount: 4,
      totalSpent: 620,
      lastBooking: '2023-12-01',
      status: 'active',
      createdAt: '2023-05-12'
    },
    {
      id: 'CUS-006',
      name: 'Pedro Sánchez',
      email: 'pedro.sanchez@email.com',
      phone: '+1 809-555-2345',
      country: 'España',
      bookingsCount: 2,
      totalSpent: 290,
      lastBooking: '2023-11-15',
      status: 'active',
      createdAt: '2023-06-20'
    }
  ];

  // Filtrar clientes por estado y término de búsqueda
  const filteredCustomers = customers.filter(customer => {
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Función para mostrar el modal de detalles del cliente
  const openCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Función para manejar la creación de un nuevo cliente
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!newCustomer.name || !newCustomer.email) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    
    // En una aplicación real, aquí se enviaría la información al servidor
    // Para esta demo, simplemente mostramos un mensaje de éxito
    alert(`Cliente ${newCustomer.name} creado con éxito`);
    
    // Cerramos el modal y limpiamos el formulario
    setShowNewCustomerModal(false);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      country: 'España'
    });
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Clientes
          </h1>
          <p className="text-gray-600">
            Administra y visualiza todos los clientes registrados
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => setShowNewCustomerModal(true)}
          >
            <UserPlus className="w-4 h-4" />
            Nuevo Cliente
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
              placeholder="Buscar por nombre, email, país o ID..."
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
                Estado: {selectedStatus === 'all' ? 'Todos' : selectedStatus === 'active' ? 'Activos' : 'Inactivos'}
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
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedStatus === 'active' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedStatus('active')}
                  >
                    Activos
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedStatus === 'inactive' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedStatus('inactive')}
                  >
                    Inactivos
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
                País
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                <option value="">Todos los países</option>
                <option>España</option>
                <option>República Dominicana</option>
                <option>México</option>
                <option>Argentina</option>
                <option>Colombia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reservas mínimas
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Ej: 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gasto mínimo
              </label>
              <input
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Ej: 200"
              />
            </div>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  País
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reservas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gasto Total
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
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.bookingsCount} reservas</div>
                    <div className="text-xs text-gray-500">Última: {formatDate(customer.lastBooking)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${customer.totalSpent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => openCustomerDetails(customer)}
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
            Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredCustomers.length}</span> de <span className="font-medium">{customers.length}</span> resultados
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

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Detalles del Cliente
                </h3>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selectedCustomer.name}
                  </h4>
                  <p className="text-gray-600">{selectedCustomer.id}</p>
                  <span className={`mt-1 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedCustomer.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedCustomer.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Información de Contacto</h5>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Teléfono</p>
                        <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">País</p>
                        <p className="text-sm text-gray-600">{selectedCustomer.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Estadísticas</h5>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Fecha de Registro</p>
                        <p className="text-sm text-gray-600">{formatDate(selectedCustomer.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Reservas Totales</p>
                        <p className="text-sm text-gray-600">{selectedCustomer.bookingsCount} reservas</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Gasto Total</p>
                        <p className="text-sm text-gray-600">${selectedCustomer.totalSpent}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h5 className="text-sm font-medium text-gray-500 mb-4">Últimas Reservas</h5>
                <div className="space-y-3">
                  {[
                    { id: 'BK-2023-001', activity: 'Isla Saona - Tour Completo', date: '2023-12-10', amount: 178 },
                    { id: 'BK-2023-002', activity: 'Hoyo Azul y Scape Park', date: '2023-11-15', amount: 125 },
                    { id: 'BK-2023-003', activity: 'Catamarán Party', date: '2023-10-20', amount: 147 }
                  ].map((booking, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booking.activity}</p>
                          <p className="text-xs text-gray-500">{booking.id} • {formatDate(booking.date)}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">${booking.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-6">
                <h5 className="text-sm font-medium text-gray-500 mb-2">Acciones</h5>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1">
                    <Edit className="w-4 h-4" />
                    Editar Cliente
                  </button>
                  <button className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Nueva Reserva
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                    Enviar Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Customer Modal */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Nuevo Cliente
                </h3>
                <button 
                  onClick={() => setShowNewCustomerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateCustomer} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="+1 809-555-0000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <select
                    value={newCustomer.country}
                    onChange={(e) => setNewCustomer({...newCustomer, country: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="España">España</option>
                    <option value="República Dominicana">República Dominicana</option>
                    <option value="México">México</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Canadá">Canadá</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewCustomerModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
