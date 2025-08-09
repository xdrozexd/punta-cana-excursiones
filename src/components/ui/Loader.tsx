import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  fullScreen = false,
  text
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };
  
  // Color classes
  const colorClasses = {
    primary: 'border-t-caribbean-600',
    white: 'border-t-white',
    gray: 'border-t-gray-600',
  };
  
  // Border base color
  const borderBaseColor = {
    primary: 'border-caribbean-200/30',
    white: 'border-white/30',
    gray: 'border-gray-200',
  };
  
  // Text color
  const textColor = {
    primary: 'text-caribbean-600',
    white: 'text-white',
    gray: 'text-gray-600',
  };
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div 
          className={`
            ${sizeClasses[size]} 
            ${colorClasses[color]} 
            ${borderBaseColor[color]} 
            rounded-full border-solid animate-spin
          `}
        />
        {text && (
          <p className={`mt-4 font-medium ${textColor[color]}`}>
            {text}
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          ${borderBaseColor[color]} 
          rounded-full border-solid animate-spin
        `}
      />
      {text && (
        <p className={`mt-2 text-sm font-medium ${textColor[color]}`}>
          {text}
        </p>
      )}
    </div>
  );
};
