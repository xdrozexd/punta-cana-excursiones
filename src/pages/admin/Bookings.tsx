import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../../contexts/DataContext';
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
  Trash2, 
  Save
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
  // Datos educativos (sensibles) enmascarados para UI
  hasSensitive?: boolean;
  sensitiveMasked?: {
    customer?: any;
    billing?: any;
    card?: { brand?: string; last4?: string; exp?: string } | any;
    notes?: string | null;
  };
}

const Bookings: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showSensitive, setShowSensitive] = useState<boolean>(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState<boolean>(false);
  const statusMenuRef = useRef<HTMLDivElement | null>(null);
  const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
  const [newForm, setNewForm] = useState<{ activityId: string; customerId: string; date: string; time: string; participants: number; status: 'pending' | 'confirmed' | 'cancelled' }>(
    { activityId: '', customerId: '', date: '', time: '', participants: 1, status: 'pending' }
  );
  const [showEditBookingModal, setShowEditBookingModal] = useState<boolean>(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState<{ date: string; time: string; participants: number; status: 'confirmed' | 'pending' | 'cancelled' }>(
    { date: '', time: '', participants: 1, status: 'pending' }
  );

  // API base URL aligned with DataContext: use relative '/api' so Vite proxy works in dev and same-domain in prod
  const isDev = (import.meta as any).env?.DEV === true || (import.meta as any).env?.MODE === 'development';
  const API_BASE = isDev ? '/api' : (((import.meta as any).env?.VITE_API_URL) || '/api');
  const { activities, customers } = useData();
  
  // Helpers para enmascarar datos sensibles (educativo)
  const maskCard = (card: any) => {
    if (!card || typeof card !== 'object') return undefined;
    const num = String(card.number || card.cardNumber || '');
    const last4 = num && num.length >= 4 ? num.slice(-4) : undefined;
    const brand = card.brand || card.type || undefined;
    const exp = card.exp || (card.expMonth && card.expYear ? `${card.expMonth}/${card.expYear}` : undefined);
    return { brand, last4, exp };
  };

  const maskSensitive = (s: any) => {
    if (!s) return undefined;
    return {
      customer: s.customerJson,
      billing: s.billingJson,
      card: maskCard(s.cardJson),
      notes: s.notes ?? null
    };
  };

  // Utilidad para obtener JSON con detalles de error
  const fetchJsonWithDetails = async (url: string, init?: RequestInit) => {
    const res = await fetch(url, init);
    let data: any = null;
    let text = '';
    try { data = await res.json(); }
    catch {
      try { text = await res.text(); } catch {}
    }
    return { ok: res.ok, status: res.status, statusText: res.statusText, data, text };
  };

  // Cargar reservas reales desde la API
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Primer intento
        let { ok, status, statusText, data, text } = await fetchJsonWithDetails(`${API_BASE}/bookings`);
        // Reintento simple ante fallo transitorio
        if (!ok) {
          await new Promise(r => setTimeout(r, 600));
          ({ ok, status, statusText, data, text } = await fetchJsonWithDetails(`${API_BASE}/bookings`));
        }
        if (!ok) {
          const serverMessage = (data?.message || data?.error || text || '').toString().trim();
          const statusInfo = `${status || ''} ${statusText || ''}`.trim();
          throw new Error([serverMessage, statusInfo].filter(Boolean).join(' | ') || 'No se pudieron cargar las reservas');
        }
        const mapped: Booking[] = (Array.isArray(data) ? data : []).map((b: any) => ({
          id: b.id,
          customerName: b?.customer?.name || '—',
          customerEmail: b?.customer?.email || '—',
          activityName: b?.activity?.name || '—',
          date: b?.date ? new Date(b.date).toISOString().split('T')[0] : '—',
          time: b?.date ? new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          participants: b?.participants ?? 0,
          amount: b?.totalPrice ?? 0,
          status: (b?.status || 'pending'),
          paymentMethod: b?.paymentMethod || '—',
          location: b?.activity?.location || b?.activity?.place || 'Punta Cana',
          hasSensitive: !!b?.sensitive,
          sensitiveMasked: maskSensitive(b?.sensitive)
        }));
        setBookings(mapped);
      } catch (e: any) {
        setError(e?.message || 'Error al cargar reservas');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Al abrir el modal, autoseleccionar primer activity/customer si existen
  useEffect(() => {
    if (showNewBookingModal) {
      setNewForm(prev => ({
        ...prev,
        activityId: prev.activityId || (activities?.[0]?.id || ''),
        customerId: prev.customerId || (customers?.[0]?.id || ''),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNewBookingModal, activities, customers]);

  // Crear nueva reserva
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      // Validaciones básicas
      if (!newForm.activityId || !newForm.customerId) {
        throw new Error('Selecciona una actividad y un cliente');
      }
      if (!newForm.date || !newForm.time) {
        throw new Error('Ingresa fecha y hora');
      }
      if (!newForm.participants || newForm.participants < 1) {
        throw new Error('El número de participantes debe ser al menos 1');
      }
      const isoDate = new Date(`${newForm.date}T${newForm.time}:00`).toISOString();
      const selectedActivity: any = activities?.find((a: any) => a.id === newForm.activityId);
      const unitPrice = selectedActivity ? Number(selectedActivity.price || 0) : 0;
      const totalPrice = Number((unitPrice * Number(newForm.participants)).toFixed(2));
      const payload = {
        activityId: newForm.activityId,
        customerId: newForm.customerId,
        date: isoDate,
        participants: newForm.participants,
        status: newForm.status,
        // opcional: enviar totalPrice si el backend lo admite
        totalPrice,
      };
      // Log payload for debugging
      console.log('Bookings: creando reserva con payload', payload);
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        // Try to extract meaningful server error
        let serverMessage = '';
        const raw = await res.text().catch(() => '');
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            serverMessage = parsed?.message || parsed?.error || JSON.stringify(parsed);
          } catch {
            serverMessage = raw;
          }
        }
        const statusInfo = `${res.status || ''} ${res.statusText || ''}`.trim();
        throw new Error([serverMessage, statusInfo].filter(Boolean).join(' | ') || `Error al crear la reserva (HTTP ${res.status || ''})`);
      }
      setShowNewBookingModal(false);
      setNewForm({ activityId: '', customerId: '', date: '', time: '', participants: 1, status: 'pending' });
      await refresh();
    } catch (e: any) {
      setError(`Error al crear la reserva${e?.message ? `: ${e.message}` : ''}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Cambiar estado desde la tabla (ciclo pending -> confirmed -> cancelled -> pending)
  const cycleStatus = async (booking: Booking) => {
    const next = booking.status === 'pending' ? 'confirmed' : booking.status === 'confirmed' ? 'cancelled' : 'pending';
    // Reutilizamos updateStatus (acepta confirmed y cancelled). Para volver a pending hacemos un PUT directo.
    if (next === 'pending') {
      try {
        setActionLoading(true);
        const res = await fetch(`${API_BASE}/bookings/${booking.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'pending' })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || 'No se pudo actualizar la reserva');
        }
        await refresh();
      } catch (e: any) {
        setError(e?.message || 'Error al actualizar la reserva');
      } finally {
        setActionLoading(false);
      }
    } else {
      await updateStatus(booking.id, next);
    }
  };

  const handleStartEdit = (booking: Booking) => {
    setEditBooking(booking);
    setEditForm({
      date: booking.date || '',
      time: booking.time || '',
      participants: booking.participants ?? 1,
      status: booking.status
    });
    setShowEditBookingModal(true);
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBooking) return;
    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE}/bookings/${editBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'No se pudo actualizar la reserva');
      }
      setShowEditBookingModal(false);
      setEditBooking(null);
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Error al actualizar la reserva');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    const ok = window.confirm('¿Seguro que deseas eliminar esta reserva? Esta acción no se puede deshacer.');
    if (!ok) return;
    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'No se pudo eliminar la reserva');
      }
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Error al eliminar la reserva');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (showStatusMenu && statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [showStatusMenu]);

  const refresh = async () => {
    try {
      let { ok, status, statusText, data, text } = await fetchJsonWithDetails(`${API_BASE}/bookings`);
      if (!ok) {
        await new Promise(r => setTimeout(r, 600));
        ({ ok, status, statusText, data, text } = await fetchJsonWithDetails(`${API_BASE}/bookings`));
      }
      if (ok) {
        const mapped: Booking[] = (Array.isArray(data) ? data : []).map((b: any) => ({
          id: b.id,
          customerName: b?.customer?.name || '—',
          customerEmail: b?.customer?.email || '—',
          activityName: b?.activity?.name || '—',
          date: b?.date ? new Date(b.date).toISOString().split('T')[0] : '—',
          time: b?.date ? new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          participants: b?.participants ?? 0,
          amount: b?.totalPrice ?? 0,
          status: (b?.status || 'pending'),
          paymentMethod: b?.paymentMethod || '—',
          location: b?.activity?.location || b?.activity?.place || 'Punta Cana',
          hasSensitive: !!b?.sensitive,
          sensitiveMasked: maskSensitive(b?.sensitive)
        }));
        setBookings(mapped);
      } else {
        const serverMessage = (data?.message || data?.error || text || '').toString().trim();
        const statusInfo = `${status || ''} ${statusText || ''}`.trim();
        setError([serverMessage, statusInfo].filter(Boolean).join(' | ') || 'No se pudieron cargar las reservas');
      }
    } catch {}
  };

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
    setShowSensitive(false);
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Cambiar estado de reserva (confirmar/cancelar)
  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      setError(null);
      setActionLoading(true);
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'No se pudo actualizar la reserva');
      }
      await refresh();
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(null);
      }
    } catch (e: any) {
      setError(e?.message || 'Error al actualizar la reserva');
    } finally {
      setActionLoading(false);
    }
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
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowNewBookingModal(true)}>
            <Calendar className="w-4 h-4" />
            Nueva Reserva
          </button>
        </div>
      </div>

      {/* Loading banner */}
      {loading && (
        <div className="mb-4 bg-sky-50 border border-sky-200 text-sky-700 px-4 py-2 rounded-lg" role="status">
          Cargando reservas...
        </div>
      )}

      {showNewBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Nueva Reserva</h3>
                <button onClick={() => setShowNewBookingModal(false)} className="text-gray-400 hover:text-gray-600" title="Cerrar" aria-label="Cerrar"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <form onSubmit={handleCreateBooking} className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="new-activity" className="block text-sm font-medium text-gray-700 mb-1">Actividad</label>
                  <select
                    id="new-activity"
                    value={newForm.activityId}
                    onChange={(e) => setNewForm({ ...newForm, activityId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                    aria-label="Seleccionar actividad"
                  >
                    <option value="" disabled>Selecciona una actividad</option>
                    {activities?.map((a: any) => (
                      <option key={a.id} value={a.id}>{a.name || a.title || a.slug || a.id}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="new-customer" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <select
                    id="new-customer"
                    value={newForm.customerId}
                    onChange={(e) => setNewForm({ ...newForm, customerId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                    aria-label="Seleccionar cliente"
                  >
                    <option value="" disabled>Selecciona un cliente</option>
                    {customers?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name || c.fullName || c.email || c.id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="new-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input id="new-date" type="date" value={newForm.date} onChange={(e) => setNewForm({ ...newForm, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent" required />
                </div>
                <div>
                  <label htmlFor="new-time" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input id="new-time" type="time" value={newForm.time} onChange={(e) => setNewForm({ ...newForm, time: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent" required />
                </div>
                <div>
                  <label htmlFor="new-participants" className="block text-sm font-medium text-gray-700 mb-1">Participantes</label>
                  <input id="new-participants" type="number" min={1} value={newForm.participants} onChange={(e) => setNewForm({ ...newForm, participants: Number(e.target.value) || 1 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent" required />
                </div>
                <div>
                  <label htmlFor="new-status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select id="new-status" value={newForm.status} onChange={(e) => setNewForm({ ...newForm, status: e.target.value as any })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowNewBookingModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 flex items-center gap-2"><Save className="w-4 h-4" />{actionLoading ? 'Creando...' : 'Crear Reserva'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditBookingModal && editBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Editar Reserva</h3>
                <button onClick={() => { setShowEditBookingModal(false); setEditBooking(null); }} className="text-gray-400 hover:text-gray-600" title="Cerrar" aria-label="Cerrar"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <form onSubmit={handleUpdateBooking} className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input id="edit-date" type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="edit-time" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input id="edit-time" type="time" value={editForm.time} onChange={(e) => setEditForm({ ...editForm, time: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="edit-participants" className="block text-sm font-medium text-gray-700 mb-1">Participantes</label>
                  <input id="edit-participants" type="number" min={1} value={editForm.participants} onChange={(e) => setEditForm({ ...editForm, participants: Number(e.target.value) || 1 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select id="edit-status" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowEditBookingModal(false); setEditBooking(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 flex items-center gap-2"><Save className="w-4 h-4" />{actionLoading ? 'Guardando...' : 'Guardar Cambios'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg" role="alert">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, email, actividad o ID..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative w-full sm:w-auto">
              <button
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between sm:justify-center gap-2 hover:bg-gray-50"
                onClick={() => setShowStatusMenu(!showStatusMenu)}
              >
                Estado: {selectedStatus === 'all' ? 'Todos' : getStatusText(selectedStatus)}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showStatusMenu && (
                <div
                  ref={statusMenuRef}
                  className="absolute sm:right-0 mt-2 sm:w-48 w-[calc(100vw-2rem)] left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 bg-white rounded-lg shadow-lg z-20 border border-gray-200 overflow-hidden mx-4 sm:mx-0"
                >
                  <div className="p-2">
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedStatus === 'all' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                      onClick={() => { setSelectedStatus('all'); setShowStatusMenu(false); }}
                    >
                      Todos
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedStatus === 'confirmed' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                      onClick={() => { setSelectedStatus('confirmed'); setShowStatusMenu(false); }}
                    >
                      Confirmadas
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedStatus === 'pending' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                      onClick={() => { setSelectedStatus('pending'); setShowStatusMenu(false); }}
                    >
                      Pendientes
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedStatus === 'cancelled' ? 'bg-sky-100 text-sky-800' : 'hover:bg-gray-100'}`}
                      onClick={() => { setSelectedStatus('cancelled'); setShowStatusMenu(false); }}
                    >
                      Canceladas
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label htmlFor="fecha-desde" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha desde
              </label>
              <input
                id="fecha-desde"
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="fecha-hasta" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha hasta
              </label>
              <input
                id="fecha-hasta"
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="actividad-filtro" className="block text-sm font-medium text-gray-700 mb-1">
                Actividad
              </label>
              <select 
                id="actividad-filtro"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
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
              {filteredBookings.filter(booking => booking).map((booking) => (
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
                    <button
                      onClick={() => cycleStatus(booking)}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)} hover:opacity-80`}
                      title="Cambiar estado"
                      aria-label="Cambiar estado de la reserva"
                      disabled={actionLoading}
                    >
                      {getStatusText(booking.status)}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => openBookingDetails(booking)}
                        className="text-sky-600 hover:text-sky-900 p-1 rounded-full hover:bg-sky-50"
                        title="Ver detalles"
                        aria-label="Ver detalles de la reserva"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleStartEdit(booking)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                        title="Editar"
                        aria-label="Editar reserva"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                        title="Eliminar"
                        aria-label="Eliminar reserva"
                      >
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
                  title="Cerrar"
                  aria-label="Cerrar modal de detalles"
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
                
                {selectedBooking.hasSensitive && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-500">Datos educativos (sensibles)</h5>
                      <button
                        type="button"
                        onClick={() => setShowSensitive(v => !v)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                        aria-expanded={showSensitive}
                        aria-controls="educational-sensitive-panel"
                      >
                        {showSensitive ? 'Ocultar' : 'Ver'}
                      </button>
                    </div>
                    {showSensitive && (
                      <div id="educational-sensitive-panel" className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-2 space-y-3">
                        {selectedBooking.sensitiveMasked?.card && (
                          <div>
                            <p className="text-sm font-medium text-gray-900">Tarjeta</p>
                            <p className="text-sm text-gray-700">
                              {selectedBooking.sensitiveMasked.card.brand ? `${selectedBooking.sensitiveMasked.card.brand} ` : ''}
                              **** **** **** {selectedBooking.sensitiveMasked.card.last4 || '****'}
                              {selectedBooking.sensitiveMasked.card.exp ? ` · Exp: ${selectedBooking.sensitiveMasked.card.exp}` : ''}
                            </p>
                          </div>
                        )}
                        {selectedBooking.sensitiveMasked?.billing && (
                          <div>
                            <p className="text-sm font-medium text-gray-900">Facturación</p>
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">{JSON.stringify(selectedBooking.sensitiveMasked.billing, null, 2)}</pre>
                          </div>
                        )}
                        {selectedBooking.sensitiveMasked?.customer && (
                          <div>
                            <p className="text-sm font-medium text-gray-900">Cliente (educativo)</p>
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">{JSON.stringify(selectedBooking.sensitiveMasked.customer, null, 2)}</pre>
                          </div>
                        )}
                        {typeof selectedBooking.sensitiveMasked?.notes === 'string' && (
                          <div>
                            <p className="text-sm font-medium text-gray-900">Notas</p>
                            <p className="text-sm text-gray-700">{selectedBooking.sensitiveMasked?.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h5 className="text-sm font-medium text-gray-500 mb-2">Acciones</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(selectedBooking.id, 'confirmed')}
                      disabled={actionLoading}
                      title="Confirmar reserva"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      {actionLoading ? 'Confirmando...' : 'Confirmar'}
                    </button>
                  )}
                  {selectedBooking.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(selectedBooking.id, 'cancelled')}
                      disabled={actionLoading}
                      title="Cancelar reserva"
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      {actionLoading ? 'Cancelando...' : 'Cancelar'}
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
