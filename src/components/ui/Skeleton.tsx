import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  rounded = 'md' 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const roundedClasses = {
    none: '',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };
  
  const style = {
    width: width,
    height: height
  };
  
  return (
    <div 
      className={`${baseClasses} ${roundedClasses[rounded]} ${className}`}
      style={style}
    />
  );
};

// Componentes predefinidos para casos comunes
export const TourCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  </div>
);

export const GallerySkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-96 w-full rounded-lg" />
    <div className="flex gap-2 overflow-x-auto">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-20 w-20 flex-shrink-0 rounded-lg" />
      ))}
    </div>
  </div>
);

export const FormSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-32 w-full" />
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-10 w-32" />
  </div>
);

export default Skeleton;
