import React from 'react';
import { Shield, Eye, Lock, Info } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <div className="container-custom py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-caribbean-100 text-caribbean-700 mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Política de Privacidad</h1>
          <p className="mt-2 text-gray-600">Tu confianza es lo más importante. Conoce cómo cuidamos tus datos.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-caribbean-600" />
                Principios Clave
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <Eye className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                  Transparencia en el uso de datos.
                </li>
                <li className="flex items-start">
                  <Lock className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  Seguridad y confidencialidad garantizadas.
                </li>
                <li className="flex items-start">
                  <Shield className="w-4 h-4 text-purple-600 mr-2 mt-0.5" />
                  Solo lo necesario para brindarte el servicio.
                </li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs flex">
                <Info className="w-4 h-4 mr-2 mt-0.5" />
                Puedes ejercer tus derechos de acceso, rectificación y eliminación.
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow p-6 lg:p-8 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">1. Información que Recopilamos</h2>
                <p className="text-gray-700">Recopilamos datos que nos proporcionas al reservar o contactarnos (nombre, correo, teléfono), así como información técnica básica (IP, navegador) para mejorar la experiencia.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">2. Uso de la Información</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Gestionar reservas y atención al cliente.</li>
                  <li>Enviar confirmaciones, recordatorios y novedades (si lo autorizas).</li>
                  <li>Mejorar nuestros servicios y seguridad del sitio.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">3. Compartición de Datos</h2>
                <p className="text-gray-700">Podemos compartir información mínima con proveedores (operadores de tours) solo para ejecutar el servicio. No vendemos tus datos.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">4. Seguridad</h2>
                <p className="text-gray-700">Aplicamos medidas técnicas y organizativas para proteger tus datos. Aun así, ningún método es 100% infalible en internet.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-2">5. Tus Derechos</h2>
                <p className="text-gray-700">Puedes solicitar acceso, rectificación o eliminación de tus datos, así como retirar el consentimiento para comunicaciones comerciales.</p>
              </section>

              <div className="text-sm text-gray-500 pt-4 border-t">Última actualización: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
