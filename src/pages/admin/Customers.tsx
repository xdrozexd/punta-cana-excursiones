import React, { useEffect, useState } from 'react';
import { Search, Mail, Phone, MapPin, Calendar, User, Eye, Edit, Trash2, X, Save, UserPlus } from 'lucide-react';

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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCustomer, setNewCustomer] = useState<{
    name: string;
    email: string;
    phone: string;
    country: string;
  }>({ name: '', email: '', phone: '', country: 'España' });
  const [showEditCustomerModal, setShowEditCustomerModal] = useState<boolean>(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; email: string; phone: string; country: string }>({
    name: '', email: '', phone: '', country: 'España'
  });

  // Usa el proxy de Vite (vite.config.ts) -> '/api' hacia el backend
  const API_BASE = '';

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/customers`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'No se pudieron cargar los clientes');
      }
      const data = await res.json();
      const mapped: Customer[] = (Array.isArray(data) ? data : []).map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || '',
        country: c.country || '',
        bookingsCount: c.bookings?.length ?? 0,
        totalSpent: 0, // Placeholder
        lastBooking: c.bookings?.[0]?.date ? new Date(c.bookings[0].date).toISOString().split('T')[0] : '',
        status: 'active', // Placeholder
        createdAt: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : ''
      }));
      setCustomers(mapped);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openCustomerDetails = (customer: Customer) => setSelectedCustomer(customer);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'No se pudo crear el cliente');
      }
      setShowNewCustomerModal(false);
      setNewCustomer({ name: '', email: '', phone: '', country: 'España' });
      loadCustomers();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleStartEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setEditForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      country: customer.country || 'España'
    });
    setShowEditCustomerModal(true);
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomer) return;
    try {
      const res = await fetch(`${API_BASE}/api/customers/${editCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'No se pudo actualizar el cliente');
      }
      setShowEditCustomerModal(false);
      setEditCustomer(null);
      loadCustomers();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    const ok = window.confirm('¿Seguro que deseas eliminar este cliente? Esta acción no se puede deshacer.');
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/api/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'No se pudo eliminar el cliente');
      }
      loadCustomers();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">Visualiza, busca y gestiona la información de tus clientes.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 flex-wrap">
            <div className="w-full sm:w-1/2 lg:w-1/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email, país o ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <div className="relative w-full sm:w-48">
                <label htmlFor="status-filter" className="sr-only">Filtrar por estado</label>
                <select 
                  id="status-filter"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
              <button 
                onClick={() => setShowNewCustomerModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Nuevo Cliente</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12"><p className="text-gray-500">Cargando clientes...</p></div>
            ) : error ? (
              <div className="text-center py-12 text-red-500"><p>Error: {error}</p></div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservas</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Reserva</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map(customer => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-sky-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-sky-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.country}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.bookingsCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.lastBooking)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openCustomerDetails(customer)} className="text-gray-400 hover:text-sky-600" title="Ver Detalles"><Eye className="w-5 h-5" /></button>
                          <button onClick={() => handleStartEdit(customer)} className="text-gray-400 hover:text-green-600" title="Editar Cliente"><Edit className="w-5 h-5" /></button>
                          <button onClick={() => handleDeleteCustomer(customer.id)} className="text-gray-400 hover:text-red-600" title="Eliminar Cliente"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3"><User className="w-6 h-6 text-sky-600"/>Detalles del Cliente</h3>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600" title="Cerrar"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-1 sm:col-span-2">
                <h4 className="text-lg font-semibold text-gray-800">{selectedCustomer.name}</h4>
                <p className="text-sm text-gray-500">ID: {selectedCustomer.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base text-gray-900 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400"/> {selectedCustomer.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="text-base text-gray-900 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/> {selectedCustomer.phone || 'No disponible'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">País</p>
                <p className="text-base text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400"/> {selectedCustomer.country}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cliente desde</p>
                <p className="text-base text-gray-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400"/> {formatDate(selectedCustomer.createdAt)}</p>
              </div>
              <div className="col-span-1 sm:col-span-2 border-t pt-4">
                <p className="text-sm font-medium text-gray-500">Actividad</p>
                <div className="flex items-center gap-6 mt-2">
                  <div className="text-center">
                    <p className="text-xl font-bold text-sky-600">{selectedCustomer.bookingsCount}</p>
                    <p className="text-sm text-gray-500">Reservas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600">${selectedCustomer.totalSpent.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Gasto Total</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex justify-end">
              <button onClick={() => setSelectedCustomer(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">Cerrar</button>
            </div>
          </div>
        </div>
      )}
      {showEditCustomerModal && editCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Editar Cliente</h3>
                <button onClick={() => { setShowEditCustomerModal(false); setEditCustomer(null); }} className="text-gray-400 hover:text-gray-600" title="Cerrar" aria-label="Cerrar"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <form onSubmit={handleUpdateCustomer} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo <span className="text-red-500">*</span></label>
                  <input type="text" id="edit-name" name="name" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent" required />
                </div>
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" id="edit-email" name="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent" required />
                </div>
                <div>
                  <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" id="edit-phone" name="phone" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="edit-country" className="block text-sm font-medium text-gray-700 mb-1">País</label>
                  <select id="edit-country" name="country" value={editForm.country} onChange={(e) => setEditForm({...editForm, country: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
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
                <button type="button" onClick={() => { setShowEditCustomerModal(false); setEditCustomer(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 flex items-center gap-2"><Save className="w-4 h-4" />Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><UserPlus className="w-5 h-5" />Nuevo Cliente</h3>
                <button onClick={() => setShowNewCustomerModal(false)} className="text-gray-400 hover:text-gray-600" title="Cerrar" aria-label="Cerrar"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <form onSubmit={handleCreateCustomer} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="new-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo <span className="text-red-500">*</span></label>
                  <input type="text" id="new-name" name="name" value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="Nombre y apellidos" required />
                </div>
                <div>
                  <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" id="new-email" name="email" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="correo@ejemplo.com" required />
                </div>
                <div>
                  <label htmlFor="new-phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" id="new-phone" name="phone" value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="+1 809-555-0000" />
                </div>
                <div>
                  <label htmlFor="new-country" className="block text-sm font-medium text-gray-700 mb-1">País</label>
                  <select id="new-country" name="country" value={newCustomer.country} onChange={(e) => setNewCustomer({...newCustomer, country: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
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
                <button type="button" onClick={() => setShowNewCustomerModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 flex items-center gap-2"><Save className="w-4 h-4" />Guardar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
