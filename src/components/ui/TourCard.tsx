import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, MapPin, ChevronRight, Heart, Eye } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { Activity } from '../../types/activity';

interface TourCardProps {
  tour: Activity;
  featured?: boolean;
  className?: string;
}

export const TourCard: React.FC<TourCardProps> = ({
  tour,
  featured = false,
  className = '',
}) => {
  const [isLiked, setIsLiked] = React.useState(false);
  
  // Adaptación para manejar tanto el formato antiguo como el nuevo de la base de datos
  const {
    id,
    title,
    name,
    description,
    price,
    duration,
    rating,
    reviewCount,
    reviews,
    maxPeople,
    capacity,
    location,
    imageUrl,
    images,
    tags,
  } = tour;

  // Format price to show decimals only if needed
  const formattedPrice = price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;

  // Adaptación para usar los campos correctos según el formato de datos
  const displayTitle = name || title || 'Tour sin nombre';
  const displayImage = images && images.length > 0 ? images[0] : imageUrl || '';
  const displayReviews = reviews || reviewCount || 0;
  const displayCapacity = capacity || maxPeople || 10;
  
  // Usar descripción corta si está disponible, sino usar la descripción completa
  const displayDescription = tour.shortDescription || description || 'Descubre esta increíble experiencia en el paraíso caribeño.';
  
  // Mejorar el manejo de la duración para tours creados desde el dashboard
  let displayDuration = 'Consultar';
  if (duration) {
    if (typeof duration === 'number') {
      // Si es un número (minutos), convertirlo a formato legible
      if (duration >= 60) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        displayDuration = minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
      } else {
        displayDuration = `${duration} min`;
      }
    } else if (typeof duration === 'string') {
      // Si es un string, usarlo directamente
      displayDuration = duration;
    }
  }

  // Asegurar que el rating tenga un valor válido
  const displayRating = rating && !isNaN(rating) ? rating : 4.5;
  
  // Asegurar que la ubicación tenga un valor
  const displayLocation = location || 'Punta Cana, República Dominicana';

  if (featured) {
    return (
      <div className={`group relative overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${className}`}>
        {/* Image Container */}
        <div className="relative h-96 w-full overflow-hidden">
          <ImageWithFallback
            src={displayImage}
            fallbackSrc="https://images.unsplash.com/photo-1517760444937-f6397edcbbcd"
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            {tags && tags.length > 0 && (
              <span className="rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-semibold text-white shadow-lg border border-white/30">
                {tags[0]}
              </span>
            )}
            
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className={`rounded-full p-2 transition-all duration-300 ${
                isLiked 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
              }`}
              aria-label={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
              title={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <div className="rounded-2xl bg-white/95 backdrop-blur-md px-4 py-2 shadow-lg">
              <span className="text-2xl font-bold text-gray-900">{formattedPrice}</span>
              <span className="text-sm text-gray-600">/ persona</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="mb-3 flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-caribbean-300" />
            <span className="text-sm font-medium text-gray-200">{displayLocation}</span>
          </div>
          
          <h3 className="mb-3 text-3xl font-bold leading-tight transition-colors group-hover:text-caribbean-300">
            {displayTitle}
          </h3>
          
          <p className="mb-6 line-clamp-2 text-base text-gray-200 leading-relaxed">
            {displayDescription}
          </p>
          
          {/* Stats */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-400" />
              <div>
                <div className="font-bold">{displayRating}</div>
                <div className="text-xs text-gray-300">({displayReviews} reviews)</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-300" />
              <div>
                <div className="font-bold">{displayDuration}</div>
                <div className="text-xs text-gray-300">Duración</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-gray-300" />
              <div>
                <div className="font-bold">Hasta {displayCapacity}</div>
                <div className="text-xs text-gray-300">Personas</div>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <Link
            to={`/tours/${id}`}
            className="group inline-flex items-center justify-center w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-gray-900 hover:shadow-xl"
          >
            <Eye className="mr-2 h-5 w-5" />
            Ver detalles completos
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${className}`}>
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <ImageWithFallback
          src={displayImage}
          fallbackSrc="https://images.unsplash.com/photo-1517760444937-f6397edcbbcd"
          alt={displayTitle}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {tags && tags.length > 0 && (
            <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm">
              {tags[0]}
            </span>
          )}
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className={`rounded-full p-2 transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white'
            }`}
            aria-label={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
            title={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {/* Price Badge */}
        <div className="absolute bottom-4 right-4">
          <div className="rounded-xl bg-white/95 backdrop-blur-sm px-3 py-2 shadow-lg">
            <span className="text-lg font-bold text-gray-900">{formattedPrice}</span>
            <span className="text-xs text-gray-600">/ persona</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="mb-2 flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-500">{displayLocation}</span>
        </div>
        
        <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-caribbean-600 leading-tight">
          {displayTitle}
        </h3>
        
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 leading-relaxed">
          {displayDescription}
        </p>
        
        {/* Stats */}
        <div className="mb-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400" />
            <span className="font-semibold text-gray-900">{displayRating}</span>
            <span className="ml-1 text-xs text-gray-500">({displayReviews})</span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              <span>{displayDuration}</span>
            </div>
            
            <div className="flex items-center">
              <Users className="mr-1 h-3 w-3" />
              <span>Hasta {displayCapacity}</span>
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <Link
          to={`/tours/${id}`}
          className="group inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-caribbean-500 to-caribbean-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:from-caribbean-600 hover:to-caribbean-700 hover:shadow-lg"
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver detalles
          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
