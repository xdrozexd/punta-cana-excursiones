import React from 'react';
import { ShieldCheck, FileText, CheckCircle, Info } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <div className="container-custom py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-caribbean-100 text-caribbean-700 mb-4">
            <FileText className="w-7 h-7" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Términos y Condiciones</h1>
          <p className="mt-2 text-gray-600">Lee atentamente estos términos antes de utilizar nuestros servicios.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-caribbean-600" />
                Resumen Rápido
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  Reservas sujetas a confirmación y disponibilidad.
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  Políticas de cancelación aplican según cada tour.
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  Precios en USD (o moneda indicada) con impuestos donde aplique.
                </li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs flex">
                <Info className="w-4 h-4 mr-2 mt-0.5" />
                La versión completa de los términos prevalece sobre este resumen.
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow p-6 lg:p-8 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">1. Aceptación de los Términos</h2>
                <p className="text-gray-700">Al acceder y utilizar nuestro sitio web y servicios de excursiones, aceptas cumplir con estos Términos y Condiciones. Si no estás de acuerdo, por favor no utilices nuestros servicios.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">2. Reservas y Pagos</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Las reservas están sujetas a confirmación por parte de nuestro equipo.</li>
                  <li>Podemos requerir pago total o parcial para garantizar tu reserva.</li>
                  <li>Te enviaremos confirmación y detalles por correo electrónico.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">3. Cancelaciones y Cambios</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Las políticas de cancelación pueden variar según la excursión.</li>
                  <li>En la mayoría de los casos, cancelaciones con 48–72 horas de antelación son reembolsables.</li>
                  <li>No presentarse el día del tour puede implicar cargo total.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">4. Responsabilidad</h2>
                <p className="text-gray-700">Hacemos todo lo posible por ofrecer experiencias seguras y de calidad. No obstante, algunas actividades conllevan riesgos inherentes. Al participar, declaras estar en condiciones aptas y aceptas seguir las indicaciones del personal.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">5. Propiedad Intelectual</h2>
                <p className="text-gray-700">El contenido del sitio (textos, imágenes, marcas) pertenece a sus respectivos propietarios y está protegido por leyes de propiedad intelectual. No está permitida su reproducción sin autorización.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">6. Modificaciones</h2>
                <p className="text-gray-700">Podemos actualizar estos términos en cualquier momento. La fecha de la última actualización aparecerá al final de esta página.</p>
              </section>

              <div className="text-sm text-gray-500 pt-4 border-t">Última actualización: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
