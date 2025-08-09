import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container-custom">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-sky-200 mb-4">404</div>
            <div className="relative">
              <img 
                src="https://picsum.photos/640/400?random=404"
                alt="Página no encontrada"
                className="w-64 h-40 object-cover rounded-lg mx-auto opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¡Oops! Página No Encontrada
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Parece que la página que buscas se fue de aventura sin nosotros. 
              No te preocupes, tenemos muchas otras experiencias increíbles esperándote.
            </p>
            <p className="text-gray-500">
              La URL que ingresaste no existe o fue movida a otra ubicación.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to="/" 
              className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Volver al Inicio</span>
            </Link>
            <Link 
              to="/tours" 
              className="btn-secondary text-lg px-8 py-4 inline-flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Explorar Tours</span>
            </Link>
          </div>

          {/* Popular Links */}
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Enlaces Populares
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/tours" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                  <Search className="w-5 h-5 text-sky-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Todos los Tours</div>
                  <div className="text-sm text-gray-500">Explora nuestras excursiones</div>
                </div>
              </Link>

              <Link 
                to="/about" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <span className="text-green-600 font-bold">?</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Acerca de Nosotros</div>
                  <div className="text-sm text-gray-500">Conoce nuestra historia</div>
                </div>
              </Link>

              <Link 
                to="/contact" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <span className="text-orange-600 font-bold">@</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Contacto</div>
                  <div className="text-sm text-gray-500">Habla con nuestro equipo</div>
                </div>
              </Link>

              <a 
                href="tel:+18095550123" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 font-bold">📞</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Llamar Ahora</div>
                  <div className="text-sm text-gray-500">+1 (809) 555-0123</div>
                </div>
              </a>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <button 
              onClick={() => window.history.back()}
              className="text-sky-600 hover:text-sky-700 inline-flex items-center space-x-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la página anterior</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
