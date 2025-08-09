import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, ArrowRight, Send, Heart } from 'lucide-react';
// Removed unused Button import

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-caribbean-600">
        <div className="container-custom py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold mb-2">Suscríbete a Nuestro Newsletter</h3>
              <p className="text-caribbean-100">
                Recibe ofertas exclusivas, consejos de viaje y novedades directamente en tu correo.
              </p>
            </div>
            <div className="w-full max-w-md">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none text-gray-900"
                />
                <button className="bg-sunset-600 hover:bg-sunset-700 text-white px-4 py-3 rounded-r-lg transition-colors flex items-center">
                  <span className="hidden sm:inline mr-2">Suscribirse</span>
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs mt-2 text-caribbean-100">
                Al suscribirte, aceptas nuestra <Link to="/privacy" className="underline hover:text-white">política de privacidad</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-caribbean-gradient flex items-center justify-center">
                <span className="text-white font-bold text-xl">PC</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Punta Cana</h3>
                <p className="text-caribbean-400 text-sm font-medium -mt-1">Excursiones</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Descubre las mejores excursiones en Punta Cana con tours exclusivos y experiencias únicas en el paraíso caribeño.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-caribbean-600 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-caribbean-600 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-caribbean-600 hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-8 h-1 bg-caribbean-500 rounded-full mr-3"></span>
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Inicio', path: '/' },
                { label: 'Nuestros Tours', path: '/tours' },
                { label: 'Acerca de Nosotros', path: '/about' },
                { label: 'Contacto', path: '/contact' },
                { label: 'Términos y Condiciones', path: '/terms' },
                { label: 'Política de Privacidad', path: '/privacy' }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="text-gray-300 hover:text-caribbean-400 transition-colors text-sm flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tours Populares */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-8 h-1 bg-sunset-500 rounded-full mr-3"></span>
              Tours Populares
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Isla Saona', path: '/tours/isla-saona' },
                { label: 'Hoyo Azul', path: '/tours/hoyo-azul' },
                { label: 'Catamarán Party', path: '/tours/catamaran-party' },
                { label: 'Safari Buggy', path: '/tours/safari-buggy' },
                { label: 'Zip Line Adventure', path: '/tours/zip-line' },
                { label: 'Dolphin Encounter', path: '/tours/dolphin-encounter' }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="text-gray-300 hover:text-sunset-400 transition-colors text-sm flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-8 h-1 bg-blue-500 rounded-full mr-3"></span>
              Información de Contacto
            </h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-caribbean-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">
                    Av. España, Bávaro<br />
                    Punta Cana, República Dominicana
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-4 flex-shrink-0">
                  <Phone className="w-5 h-5 text-caribbean-400" />
                </div>
                <p className="text-gray-300 text-sm">+1 (809) 555-0123</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-4 flex-shrink-0">
                  <Mail className="w-5 h-5 text-caribbean-400" />
                </div>
                <p className="text-gray-300 text-sm">info@puntacanaexcursiones.com</p>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-4 flex-shrink-0">
                  <Clock className="w-5 h-5 text-caribbean-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">
                    Lun - Dom: 7:00 AM - 10:00 PM<br />
                    <span className="text-caribbean-400 font-medium">Disponible 24/7</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Punta Cana Excursiones. Todos los derechos reservados.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              <div className="flex items-center space-x-6 text-sm">
                <Link to="/privacy" className="text-gray-400 hover:text-caribbean-400 transition-colors">
                  Privacidad
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-caribbean-400 transition-colors">
                  Términos
                </Link>
                <Link to="/cookies" className="text-gray-400 hover:text-caribbean-400 transition-colors">
                  Cookies
                </Link>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <span>Hecho con</span>
                <Heart className="w-4 h-4 mx-1 text-red-500" fill="currentColor" />
                <span>en República Dominicana</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};