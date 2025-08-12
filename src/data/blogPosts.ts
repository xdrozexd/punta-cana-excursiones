export interface PostPreview {
  id: string; // slug
  title: string;
  excerpt: string;
  date: string; // ISO
  image?: string;
  tag?: string;
  content?: string; // simple HTML/markdown string for demo
}

export const blogPosts: PostPreview[] = [
  {
    id: 'mejores-playas-punta-cana',
    title: 'Las 7 Mejores Playas de Punta Cana para Visitar',
    excerpt:
      'Descubre arenas blancas, aguas turquesas y tips locales para aprovechar al máximo tu visita a estas playas imperdibles.',
    date: '2025-08-01',
    image:
      'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
    tag: 'Guías',
    content:
      'Explora Bávaro, Macao, Juanillo y más. Consejos de acceso, mejor horario y qué llevar para disfrutar al máximo. '
  },
  {
    id: 'que-llevar-excursion',
    title: 'Qué Llevar a una Excursión en Punta Cana: Lista Esencial',
    excerpt:
      'Protector solar, hidratación, calzado adecuado y otros imprescindibles para un día perfecto de aventura.',
    date: '2025-07-20',
    image:
      'https://images.pexels.com/photos/3791466/pexels-photo-3791466.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
    tag: 'Consejos',
    content:
      'Prepara tu mochila con lo básico: agua, snack, gorra, toalla de microfibra y funda impermeable para el móvil.'
  },
  {
    id: 'mejor-epoca-viajar',
    title: '¿Cuál es la Mejor Época para Viajar a Punta Cana?',
    excerpt:
      'Clima, temporadas, eventos y recomendaciones para elegir el momento ideal de tu viaje.',
    date: '2025-07-05',
    image:
      'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
    tag: 'Planificación',
    content:
      'Temporada alta vs baja, lluvias y huracanes, feriados y cómo aprovechar mejores tarifas.'
  }
];

export function getPostById(id: string): PostPreview | undefined {
  return blogPosts.find((p) => p.id === id);
}
