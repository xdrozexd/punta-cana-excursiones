import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBooking, type BookingDetail } from '../api';

export const Receipt: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [data, setData] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!bookingId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getBooking(bookingId);
        setData(res.data as any);
      } catch (e: any) {
        setError(e?.message || 'No se pudo cargar el recibo');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse h-6 bg-gray-200 rounded w-40 mb-4" />
        <div className="animate-pulse h-4 bg-gray-200 rounded w-72" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
        <p className="text-gray-600 mb-4">{error || 'No se encontraron datos de la reserva.'}</p>
        <Link to="/" className="text-sky-600 hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  const paid = (data.payments || []).some(p => p.status === 'succeeded' || p.status === 'paid');
  const deposit = (data.payments || [])[0]?.amount || Math.round((data.totalPrice || 0) / 2);
  const currency = (data.payments || [])[0]?.currency || 'USD';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Recibo de Reserva</h1>
          <p className="text-gray-500">ID: {data.id}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {paid ? 'Pago completado' : 'Pago pendiente'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-lg font-semibold mb-3">Actividad</h2>
          <div className="text-gray-800 font-medium">{data.activity?.name || data.activity?.title || 'Actividad'}</div>
          <div className="text-gray-600 text-sm">Ubicación: {data.activity?.location || 'Punta Cana'}</div>
          <div className="text-gray-600 text-sm">Duración: {String(data.activity?.duration || '')}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-lg font-semibold mb-3">Cliente</h2>
          <div className="text-gray-800 font-medium">{data.customer?.name}</div>
          <div className="text-gray-600 text-sm">{data.customer?.email}</div>
          {data.customer?.phone && <div className="text-gray-600 text-sm">{data.customer.phone}</div>}
          {data.customer?.country && <div className="text-gray-600 text-sm">{data.customer.country}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-lg font-semibold mb-3">Detalles</h2>
          <div className="text-gray-700 text-sm">Fecha: {new Date(data.date).toLocaleDateString()}</div>
          <div className="text-gray-700 text-sm">Hora: {new Date(data.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-gray-700 text-sm">Participantes: {data.participants}</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-lg font-semibold mb-3">Pago</h2>
          <div className="text-gray-800 font-semibold">Total: {currency} ${data.totalPrice}</div>
          <div className="text-gray-700 text-sm">Depósito: {currency} ${deposit}</div>
          <div className="mt-3 space-y-2">
            {(data.payments || []).map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span>{p.provider} — {p.currency} ${p.amount}</span>
                <span className={`px-2 py-0.5 rounded-full ${p.status === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span>
              </div>
            ))}
            {(!data.payments || data.payments.length === 0) && (
              <div className="text-sm text-gray-500">Sin pagos registrados todavía.</div>
            )}
          </div>
        </div>
      </div>

      {data.sensitive && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="font-semibold text-red-800 mb-2">Modo educativo: datos sensibles visibles</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-red-700 font-medium mb-1">Cliente</div>
              <pre className="bg-white border rounded p-2 overflow-auto text-xs">{JSON.stringify(data.sensitive.customerJson, null, 2)}</pre>
            </div>
            <div>
              <div className="text-red-700 font-medium mb-1">Facturación</div>
              <pre className="bg-white border rounded p-2 overflow-auto text-xs">{JSON.stringify(data.sensitive.billingJson, null, 2)}</pre>
            </div>
            <div>
              <div className="text-red-700 font-medium mb-1">Tarjeta</div>
              <pre className="bg-white border rounded p-2 overflow-auto text-xs">{JSON.stringify(data.sensitive.cardJson, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link to="/tours" className="text-sky-600 hover:underline">Seguir explorando tours</Link>
        <Link to="/" className="text-gray-600 hover:underline">Ir al inicio</Link>
      </div>
    </div>
  );
};
