import React, { useState, useRef, useMemo, useCallback } from 'react';
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
  onLoad?: () => void;
  currentIndex?: number; // Nuevo prop para el índice actual
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackText,
  fallbackSrc,
  width = 800,
  height = 600,
  style,
  onLoad,
  currentIndex = 0
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  
  // Procesar las fuentes de imagen
  const mainSrc = Array.isArray(src) ? src[currentIndex] || src[0] : src;
  const additionalSrcs = Array.isArray(src) ? src.slice(currentIndex + 1) : [];
  
  const fallbacks = useMemo(() => [
    mainSrc,
    ...additionalSrcs,
    fallbackSrc,
    fallbackImages.tour,
    `https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=${width}`,
    `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%230ea5e9'/%3E%3Ctext x='${width/2}' y='${height/2}' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${encodeURIComponent(fallbackText || alt)}%3C/text%3E%3C/svg%3E`
  ].filter(Boolean) as string[], [mainSrc, additionalSrcs, fallbackSrc, width, height, fallbackText, alt]);

  // Función para manejar el error de carga
  const handleError = useCallback(() => {
    const fallbackIndex = fallbacks.indexOf(currentSrc);
    const nextIndex = fallbackIndex + 1;
    
    if (nextIndex < fallbacks.length) {
      setCurrentSrc(fallbacks[nextIndex]);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  }, [fallbacks, currentSrc]);

  // Función para manejar la carga exitosa
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  // Establecer la primera imagen al montar el componente o cambiar el índice
  React.useEffect(() => {
    if (fallbacks.length > 0) {
      setCurrentSrc(fallbacks[0]);
      setIsLoading(true);
      setHasError(false);
    }
  }, [fallbacks]);

  // Estado de carga
  if (isLoading && !currentSrc) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
        style={{ ...style, width, height, minWidth: 100, minHeight: 100 }}
      >
        <div className="flex flex-col items-center p-4">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <div className="text-sky-600 text-xs text-center">
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (hasError) {
    return (
      <div 
        className={`bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white ${className}`}
        style={{ ...style, width, height }}
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Icono de imagen">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-sm font-medium">{fallbackText || alt}</div>
        </div>
      </div>
    );
  }

  // Imagen cargada correctamente
  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      loading="eager"
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};