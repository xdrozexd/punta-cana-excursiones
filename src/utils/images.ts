// Removed unused imports
import { CATEGORY_IMAGE_URLS, FALLBACK_IMAGE_URLS, getRandomImageForCategory as getRandomImage, getImagesForActivity as getImages } from '../assets/images';

// Exportamos las imágenes de categorías para uso en la aplicación
export const categoryImages = CATEGORY_IMAGE_URLS;

// Exportamos las imágenes de fallback
export const fallbackImages = FALLBACK_IMAGE_URLS;

// Obtener imagen aleatoria para una categoría
export const getRandomImageForCategory = getRandomImage;

// Obtener imágenes para una actividad basada en su categoría
export const getImagesForActivity = getImages;

// Obtener URLs de imágenes para avatares de testimonios
export const getTestimonialAvatars = (count: number): string[] => {
  const avatars: string[] = [];
  
  for (let i = 1; i <= count; i++) {
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const id = Math.floor(Math.random() * 100);
    avatars.push(`https://randomuser.me/api/portraits/${gender}/${id}.jpg`);
  }
  
  return avatars;
};