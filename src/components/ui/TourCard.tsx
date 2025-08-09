import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, MapPin, ChevronRight } from 'lucide-react';
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
  const {
    id,
    title,
    description,
    price,
    duration,
    rating,
    reviewCount,
    maxPeople,
    location,
    imageUrl,
    tags,
  } = tour;

  // Format price to show decimals only if needed
  const formattedPrice = price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;

  if (featured) {
    return (
      <div className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}>
        <div className="relative h-80 w-full overflow-hidden">
          <ImageWithFallback
            src={imageUrl || ''}
            fallbackSrc="https://images.unsplash.com/photo-1517760444937-f6397edcbbcd"
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          {tags && tags.length > 0 && (
            <div className="absolute left-4 top-4 z-10">
              <span className="rounded-full bg-caribbean-600 px-3 py-1 text-xs font-medium text-white shadow-md">
                {tags[0]}
              </span>
            </div>
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mb-2 flex items-center">
            <MapPin className="mr-1 h-4 w-4 text-caribbean-300" />
            <span className="text-sm text-gray-200">{location}</span>
          </div>
          
          <h3 className="mb-2 text-2xl font-bold transition-colors group-hover:text-caribbean-300">
            {title}
          </h3>
          
          <p className="mb-4 line-clamp-2 text-sm text-gray-200">{description}</p>
          
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-400" />
                <span className="mr-1 font-medium">{rating}</span>
                <span className="text-sm text-gray-300">({reviewCount})</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4 text-gray-300" />
                <span className="text-sm">{duration}</span>
              </div>
              
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4 text-gray-300" />
                <span className="text-sm">Hasta {maxPeople}</span>
              </div>
            </div>
            
            <div className="mt-2 flex items-center">
              <span className="mr-2 text-xl font-bold">{formattedPrice}</span>
              <span className="text-sm text-gray-300">/ persona</span>
            </div>
          </div>
          
          <Link
            to={`/tours/${id}`}
            className="mt-4 inline-flex items-center font-medium text-caribbean-300 hover:text-caribbean-200"
          >
            Ver detalles
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl ${className}`}>
      <div className="relative h-48 w-full overflow-hidden">
        <ImageWithFallback
          src={imageUrl || ''}
          fallbackSrc="https://images.unsplash.com/photo-1517760444937-f6397edcbbcd"
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {tags && tags.length > 0 && (
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-caribbean-600 px-2 py-1 text-xs font-medium text-white shadow-sm">
              {tags[0]}
            </span>
          </div>
        )}
        
        <div className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-2 py-1 text-lg font-bold text-gray-900 shadow-sm backdrop-blur-sm">
          {formattedPrice}
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-1 flex items-center">
          <MapPin className="mr-1 h-3 w-3 text-gray-500" />
          <span className="text-xs text-gray-500">{location}</span>
        </div>
        
        <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-caribbean-600">
          {title}
        </h3>
        
        <p className="mb-3 line-clamp-2 text-sm text-gray-600">{description}</p>
        
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400" />
            <span className="mr-1 font-medium">{rating}</span>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>
          
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              <span>{duration}</span>
            </div>
            
            <div className="flex items-center">
              <Users className="mr-1 h-3 w-3" />
              <span>{maxPeople}</span>
            </div>
          </div>
        </div>
        
        <Link
          to={`/tours/${id}`}
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-caribbean-50 hover:text-caribbean-600"
        >
          Ver detalles
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
