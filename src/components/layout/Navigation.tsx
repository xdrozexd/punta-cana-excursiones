import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface NavigationProps {
  mobile?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const Navigation: React.FC<NavigationProps> = ({ mobile = false }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { label: 'Inicio', href: '/' },
    { 
      label: 'Tours', 
      href: '/tours',
      children: [
        { label: 'Playas', href: '/tours?category=playas' },
        { label: 'Aventuras', href: '/tours?category=aventuras' },
        { label: 'Cultural', href: '/tours?category=cultural' },
        { label: 'Acuáticos', href: '/tours?category=acuaticos' },
      ]
    },
    { label: 'Contacto', href: '/contact' },
    { 
      label: 'Sobre Nosotros', 
      href: '/about',
      children: [
        { label: 'Quiénes Somos', href: '/about' },
        { label: 'Términos y Condiciones', href: '/terms' },
        { label: 'Política de Privacidad', href: '/privacy' },
        { label: 'Preguntas Frecuentes (FAQ)', href: '/faq' },
      ]
    },
    { label: 'Blog', href: '/blog' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  if (mobile) {
    return (
      <nav className="space-y-1">
        {navItems.map((item) => (
          <div key={item.href} className="relative">
            {item.children ? (
              <div className="space-y-1">
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-sky-50 text-sky-600 border-l-4 border-sky-600'
                      : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'transform rotate-180' : ''}`} />
                </button>
                
                {openDropdown === item.label && (
                  <div className="ml-4 pl-2 border-l-2 border-gray-200 space-y-1 animate-fade-in">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-sky-600 rounded-md"
                      >
                        <ChevronRight className="w-3 h-3 mr-2" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-sky-50 text-sky-600 border-l-4 border-sky-600'
                    : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-8">
      {navItems.map((item) => (
        <div key={item.href} className="relative group">
          {item.children ? (
            <>
              <button
                onClick={() => toggleDropdown(item.label)}
                className={`flex items-center text-sm font-medium transition-colors relative ${
                  isActive(item.href)
                    ? 'text-sky-600'
                    : 'text-gray-700 hover:text-sky-600'
                }`}
              >
                <span>{item.label}</span>
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${openDropdown === item.label ? 'transform rotate-180' : ''}`} />
              </button>
              
              {isActive(item.href) && (
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-sky-600 rounded-full"></span>
              )}
              
              {/* Desktop dropdown */}
              <div 
                className={`absolute left-0 mt-6 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 z-50 ${
                  openDropdown === item.label 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 pointer-events-none -translate-y-2'
                }`}
              >
                <div className="py-1 animate-fade-in">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Link
              to={item.href}
              className={`text-sm font-medium transition-colors relative ${
                isActive(item.href)
                  ? 'text-sky-600'
                  : 'text-gray-700 hover:text-sky-600'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-sky-600 rounded-full"></span>
              )}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};