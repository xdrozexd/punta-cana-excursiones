// Exportación de todas las imágenes locales para un fácil acceso
import { Activity, ActivityCategory } from '../../types/activity';

// URL de imágenes genéricas por categoría usando URLs externas confiables con parámetros de tamaño y calidad
export const CATEGORY_IMAGE_URLS: Record<ActivityCategory, string[]> = {
  'tours-islas': [
    'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  ],
  'aventura': [
    'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/2041556/pexels-photo-2041556.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  ],
  'acuaticos': [
    'https://images.pexels.com/photos/1430672/pexels-photo-1430672.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/1645028/pexels-photo-1645028.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/2765872/pexels-photo-2765872.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  ],
  'cultural': [
    'https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/3934003/pexels-photo-3934003.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  ],
  'gastronomia': [
    'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  ],
  'relax': [
    'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/161502/spa-massage-relax-relaxing-161502.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  ],
  'nocturna': [
    'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  ]
};

// Fallbacks en caso de que no haya imágenes disponibles
export const FALLBACK_IMAGE_URLS = {
  // Usa imágenes estáticas garantizadas como fallbacks finales
  tour: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect width="800" height="600" fill="%230ea5e9"/%3E%3Ctext x="400" y="300" font-family="Arial" font-size="32" fill="white" text-anchor="middle"%3ETour%3C/text%3E%3C/svg%3E',
  hero: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"%3E%3Crect width="1920" height="1080" fill="%230ea5e9"/%3E%3Ctext x="960" y="540" font-family="Arial" font-size="48" fill="white" text-anchor="middle"%3EPunta Cana Tours%3C/text%3E%3C/svg%3E',
  profile: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect width="300" height="300" fill="%230ea5e9"/%3E%3Ccircle cx="150" cy="120" r="60" fill="white"/%3E%3Ccircle cx="150" cy="300" r="120" fill="white"/%3E%3C/svg%3E',
};

// Obtener imagen aleatoria para una categoría
export const getRandomImageForCategory = (category: ActivityCategory): string => {
  const images = CATEGORY_IMAGE_URLS[category] || [];
  if (images.length === 0) return FALLBACK_IMAGE_URLS.tour;
  
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

// Obtener imágenes para una actividad basada en su categoría
export const getImagesForActivity = (activity: Activity): string[] => {
  if (activity.images && activity.images.length > 0) {
    return activity.images;
  }
  
  const categoryImg = CATEGORY_IMAGE_URLS[activity.category as ActivityCategory] || [];
  if (categoryImg.length === 0) {
    return [FALLBACK_IMAGE_URLS.tour];
  }
  
  // Devuelve 2 imágenes aleatorias de la categoría
  return categoryImg.sort(() => 0.5 - Math.random()).slice(0, 2);
};