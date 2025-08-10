import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, MapPin, Search, Filter } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { TourCard } from '../components/ui/TourCard';

export const Tours: React.FC = () => {
  const [activeFilter, setActiveFilter] = React.useState('Todos');
  const [searchTerm, setSearchTerm] = React.useState('');
  const { activities, isLoading } = useData();
  
  // Mapear las categorías de actividades a categorías para el filtro
  const categoryMapping: Record<string, string> = {
    'tours-islas': 'Aventura',
    'aventura': 'Aventura',
    'acuaticos': 'Acuático',
    'acuatico': 'Acuático',
    'cultural': 'Cultural',
    'gastronomia': 'Gastronomía',
    'relax': 'Relax',
    'nocturna': 'Fiesta',
    'fiesta': 'Fiesta',
    'tour': 'Aventura',
    'islas': 'Aventura',
    'playa': 'Relax',
    'snorkel': 'Acuático',
    'buceo': 'Acuático',
    'catamaran': 'Acuático',
    'excursion': 'Aventura'
  };
  
  // Obtener categorías únicas para los filtros
  const categories = ['Todos', ...new Set(activities.map(activity => 
    categoryMapping[activity.category] || 'Otros'
  ))];
  
  // Filtrar actividades según la categoría seleccionada y término de búsqueda
  const filteredActivities = activities.filter(activity => {
    const matchesCategory = activeFilter === 'Todos' || categoryMapping[activity.category] === activeFilter;
    const matchesSearch = searchTerm === '' || 
      (activity.name || activity.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-caribbean-600 via-caribbean-500 to-caribbean-400 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Descubre Experiencias
              <span className="block text-caribbean-200">Únicas</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-95 leading-relaxed">
              Explora el paraíso caribeño con nuestros tours exclusivos. Desde aventuras extremas hasta momentos de relajación total.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tours, destinos, actividades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 border-0 shadow-xl focus:ring-2 focus:ring-caribbean-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Filtrar por:</span>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    category === activeFilter
                      ? 'bg-caribbean-600 text-white shadow-lg shadow-caribbean-600/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-caribbean-50 hover:text-caribbean-700 hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-caribbean-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-gray-600 text-lg font-medium">Cargando experiencias únicas...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-8 text-center">
                <p className="text-gray-600">
                  {filteredActivities.length === 0 
                    ? 'No se encontraron tours' 
                    : `${filteredActivities.length} ${filteredActivities.length === 1 ? 'tour encontrado' : 'tours encontrados'}`
                  }
                </p>
              </div>
              
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredActivities.map((activity, index) => (
                  <TourCard 
                    key={activity.id} 
                    tour={activity}
                    featured={index === 0} // Primera actividad como destacada
                    className="h-full"
                  />
                ))}
              </div>
              
              {filteredActivities.length === 0 && (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No se encontraron tours</h3>
                    <p className="text-gray-600 mb-6">
                      Intenta ajustar tus filtros o términos de búsqueda para encontrar más opciones.
                    </p>
                    <button 
                      onClick={() => {
                        setActiveFilter('Todos');
                        setSearchTerm('');
                      }}
                      className="bg-caribbean-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-caribbean-700 transition-colors"
                    >
                      Ver todos los tours
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-caribbean-600 to-caribbean-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="container-custom text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿No Encuentras lo que Buscas?
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-95 leading-relaxed">
            Nuestros expertos en viajes están aquí para crear la experiencia perfecta para ti. 
            Diseñamos tours personalizados que se adaptan a tus sueños y expectativas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="bg-white text-caribbean-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Tour Personalizado
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-caribbean-600 transition-colors"
            >
              Contactar Expertos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
