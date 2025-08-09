import React, { useState, useEffect, useRef } from 'react';
import { fallbackImages } from '../../utils/images';

interface ImageWithFallbackProps {
  src: string | string[];
  alt: string;
  className?: string;
  fallbackText?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;

}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackText,
  fallbackSrc,
  width = 800,
  height = 600,
  style
}) => {
  // Usar ref para evitar problemas con useEffect y eventos
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  
  // URLs de imágenes directas (no dependan de estados para evitar re-renders)
  const mainSrc = Array.isArray(src) ? src[0] : src;
  const additionalSrcs = Array.isArray(src) ? src.slice(1) : [];
  
  // Fallbacks estáticos (garantizados que funcionan)
  const guaranteedFallbacks = [
    // Un fallback local muy básico que debería funcionar siempre
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%230ea5e9'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='32' fill='white' text-anchor='middle'%3E" + 
    encodeURIComponent(fallbackText || alt) + 
    "%3C/text%3E%3C/svg%3E"
  ];
  
  // Lista completa de fallbacks en orden
  const fallbacks = [
    mainSrc,
    ...additionalSrcs,
    fallbackSrc,
    fallbackImages.tour,
    `https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=${width}`,
    `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
    ...guaranteedFallbacks
  ].filter(Boolean) as string[];

  // Función para cargar la siguiente imagen fallback
  const tryNextFallback = () => {
    if (fallbackIndex < fallbacks.length - 1) {
      setFallbackIndex(prevIndex => prevIndex + 1);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };

  // Efecto para manejar cada cambio de índice de fallback
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Crear una nueva imagen para verificar si carga
    const img = new Image();
    img.src = fallbacks[fallbackIndex];
    
    img.onload = () => {
      setIsLoading(false);
    };
    
    img.onerror = () => {
      tryNextFallback();
    };
    
    // Limpiar
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [fallbackIndex]);

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ ...style, width, height, minWidth: 100, minHeight: 100 }}
      >
        <div className="flex flex-col items-center p-4">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <div className="text-sky-600 text-sm font-medium text-center">
            Cargando...
            {fallbackIndex > 0 && (
              <span className="block text-xs text-gray-500 mt-1">
                Probando fuente alternativa ({fallbackIndex + 1}/{fallbacks.length})
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Si hubo error con todas las imágenes, mostrar placeholder final
  if (hasError) {
    return (
      <div 
        className={`bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white ${className}`}
        style={{ ...style, width, height }}
      >
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-lg font-semibold">{fallbackText || alt}</div>
          <div className="text-sm opacity-80 mt-1">Imagen no disponible</div>
        </div>
      </div>
    );
  }

  // Renderizar la imagen con el fallback actual
  return (
    <img
      ref={imgRef}
      src={fallbacks[fallbackIndex]}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      loading="eager"
    />
  );
};