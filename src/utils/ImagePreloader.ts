import { CATEGORY_IMAGE_URLS, FALLBACK_IMAGE_URLS } from '../assets/images';

// Clase para precargar imágenes en segundo plano
export class ImagePreloader {
  private static instance: ImagePreloader;
  private loadedImages: Set<string> = new Set();
  private loadingPromises: Map<string, Promise<boolean>> = new Map();
  
  // Singleton
  private constructor() {}
  
  public static getInstance(): ImagePreloader {
    if (!ImagePreloader.instance) {
      ImagePreloader.instance = new ImagePreloader();
    }
    return ImagePreloader.instance;
  }
  
  // Precarga una imagen individual
  public preloadImage(src: string): Promise<boolean> {
    // Si ya está cargada, devolver inmediatamente
    if (this.loadedImages.has(src)) {
      return Promise.resolve(true);
    }
    
    // Si ya está en proceso de carga, devolver la promesa existente
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }
    
    // Crear nueva promesa para cargar la imagen
    const promise = new Promise<boolean>((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        this.loadedImages.add(src);
        this.loadingPromises.delete(src);
        resolve(true);
      };
      
      img.onerror = () => {
        this.loadingPromises.delete(src);
        resolve(false);
      };
      
      // Iniciar carga
      img.src = src;
    });
    
    this.loadingPromises.set(src, promise);
    return promise;
  }
  
  // Precargar todas las imágenes de categorías
  public preloadAllCategoryImages(): void {
    Object.values(CATEGORY_IMAGE_URLS).forEach(categoryUrls => {
      categoryUrls.forEach(url => this.preloadImage(url));
    });
  }
  
  // Precargar imágenes de fallback
  public preloadFallbackImages(): void {
    Object.values(FALLBACK_IMAGE_URLS).forEach(url => this.preloadImage(url));
  }
  
  // Precargar imágenes comunes (como las de la página principal)
  public preloadCommonImages(urls: string[]): void {
    urls.forEach(url => this.preloadImage(url));
  }
}

// Exportar una instancia global para uso en toda la app
export const imagePreloader = ImagePreloader.getInstance();

// Función para iniciar precarga en segundo plano
export const initImagePreloading = () => {
  // Primero cargamos fallbacks (son prioritarios)
  imagePreloader.preloadFallbackImages();
  
  // Después, en segundo plano, cargamos las imágenes de categorías
  setTimeout(() => {
    imagePreloader.preloadAllCategoryImages();
  }, 2000);
};
