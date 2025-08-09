import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

export const Tours: React.FC = () => {
  const [activeFilter, setActiveFilter] = React.useState('Todos');
  const { activities, isLoading } = useData();
  
  // Mapear las categorías de actividades a categorías para el filtro
  const categoryMapping: Record<string, string> = {
    'tours-islas': 'Aventura',
    'aventura': 'Aventura',
    'acuaticos': 'Acuático',
    'cultural': 'Cultural',
    'gastronomia': 'Gastronomía',
    'relax': 'Relax',
    'nocturna': 'Fiesta'
  };
  
  // Obtener categorías únicas para los filtros
  const categories = ['Todos', ...new Set(activities.map(activity => 
    categoryMapping[activity.category] || 'Otros'
  ))];
  
  // Filtrar actividades según la categoría seleccionada
  const filteredActivities = activeFilter === 'Todos' 
    ? activities 
    : activities.filter(activity => categoryMapping[activity.category] === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-sky-600 to-blue-600 text-white py-16">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="heading-primary mb-4">Nuestros Tours</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Descubre experiencias únicas en el paraíso caribeño. Desde aventuras extremas hasta relajantes días de playa.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  category === activeFilter
                    ? 'bg-sky-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-sky-100 hover:text-sky-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Cargando actividades...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="card card-hover overflow-hidden p-0 group">
                  <div className="relative overflow-hidden">
                    <ImageWithFallback 
                      src={activity.imageUrl || activity.images[0]} 
                      alt={activity.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      width={400}
                      height={200}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        categoryMapping[activity.category] === 'Aventura' ? 'bg-green-100 text-green-800' :
                        categoryMapping[activity.category] === 'Acuático' ? 'bg-blue-100 text-blue-800' :
                        categoryMapping[activity.category] === 'Cultural' ? 'bg-orange-100 text-orange-800' :
                        categoryMapping[activity.category] === 'Gastronomía' ? 'bg-red-100 text-red-800' :
                        categoryMapping[activity.category] === 'Relax' ? 'bg-indigo-100 text-indigo-800' :
                        categoryMapping[activity.category] === 'Fiesta' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {categoryMapping[activity.category] || 'Otros'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{activity.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-sky-600 transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {activity.description}
                    </p>

                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Máx. {activity.maxGroupSize}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{activity.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-sky-600">${activity.price}</span>
                        <span className="text-sm text-gray-500">/persona</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.reviewCount} reseñas
                      </div>
                    </div>

                    <Link to={`/tours/${activity.id}`} className="w-full btn-primary text-center block">
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              ))}
              
              {filteredActivities.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No se encontraron actividades en esta categoría.</p>
                </div>
              )}
            </div>
          )}
          </div>

          {/* Load More */}
          <div className="text-center mt-12 mb-20">
            <button className="btn-secondary py-3 px-6" onClick={() => {
              // Aquí se implementaría la lógica para cargar más tours
              console.log('Cargando más tours...');
            }}>
              Cargar Más Tours
            </button>
          </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-sky-600 to-blue-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-4">¿No Encuentras lo que Buscas?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Contacta con nuestros expertos y diseñaremos un tour personalizado perfecto para ti.
          </p>
          <Link to="/contact" className="btn-accent text-lg px-8 py-4">
            Tour Personalizado
          </Link>
        </div>
      </section>
    </div>
  );
};
