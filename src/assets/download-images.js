// Este script es para descargar imágenes de placeholder para el proyecto
// Se puede ejecutar con node src/assets/download-images.js

import fs from 'fs';
import path from 'path';
import https from 'https';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

const CATEGORIES = [
  'tours-islas',
  'aventura',
  'acuaticos',
  'cultural',
  'gastronomia',
  'relax',
  'nocturna'
];

// Palabras clave para búsqueda por categoría
const CATEGORY_KEYWORDS = {
  'tours-islas': ['island', 'beach', 'tropical', 'paradise'],
  'aventura': ['adventure', 'hiking', 'zipline', 'jungle'],
  'acuaticos': ['snorkeling', 'diving', 'sailing', 'boat'],
  'cultural': ['culture', 'museum', 'history', 'architecture'],
  'gastronomia': ['food', 'restaurant', 'cuisine', 'culinary'],
  'relax': ['spa', 'wellness', 'massage', 'relaxation'],
  'nocturna': ['nightlife', 'party', 'concert', 'club']
};

// Función para descargar una imagen desde una URL
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', reject);
  });
}

// Función para crear directorios si no existen
async function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    await mkdirAsync(dir, { recursive: true });
  }
}

// Función principal para descargar todas las imágenes
async function downloadAllImages() {
  const imagesDir = path.join(__dirname, 'images');
  
  // Crear directorio de imágenes si no existe
  await ensureDirectoryExists(imagesDir);

  // Descargar imágenes genéricas
  const genericImagePromises = [
    downloadImage(
      'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path.join(imagesDir, 'tour-generic.jpg')
    ),
    downloadImage(
      'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path.join(imagesDir, 'hero-background.jpg')
    ),
    downloadImage(
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path.join(imagesDir, 'profile-generic.jpg')
    ),
  ];
  
  await Promise.all(genericImagePromises);

  // Descargar imágenes por categoría
  for (const category of CATEGORIES) {
    // Obtener palabras clave para esta categoría
    const keywords = CATEGORY_KEYWORDS[category] || [];
    
    // Descargar 3 imágenes para cada categoría
    for (let i = 1; i <= 3; i++) {
      const keyword = keywords[(i - 1) % keywords.length];
      const randomId = Math.floor(Math.random() * 1000);
      const url = `https://picsum.photos/seed/${category}-${keyword}-${randomId}/800/600`;
      const filepath = path.join(imagesDir, `${category}-${i}.jpg`);
      
      try {
        await downloadImage(url, filepath);
      } catch (error) {
        console.error(`Error downloading image for ${category}-${i}:`, error.message);
        
        // Intentar con una URL alternativa
        try {
          const fallbackUrl = `https://source.unsplash.com/800x600/?${keyword}`;
          await downloadImage(fallbackUrl, filepath);
        } catch (fallbackError) {
          console.error(`Fallback image download also failed for ${category}-${i}:`, fallbackError.message);
        }
      }
    }
  }

  console.log('All images have been downloaded successfully!');
}

// Ejecutar la función principal
downloadAllImages().catch((error) => {
  console.error('Error:', error.message);
});
