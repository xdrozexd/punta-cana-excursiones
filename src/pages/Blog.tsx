import React, { useEffect, useState } from 'react';
import { PenSquare, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = (typeof window !== 'undefined' && window.location.port && window.location.port !== '10000')
    ? 'http://localhost:10000'
    : '';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/blog-posts/public/published`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || 'No se pudieron cargar los posts');
        }
        const data = await res.json();
        const items = Array.isArray(data) ? data : (Array.isArray(data?.posts) ? data.posts : []);
        setPosts(items);
      } catch (e: any) {
        setError(e?.message || 'Error al cargar posts');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-custom py-10 lg:py-14">
          <div className="flex items-center gap-3 mb-3 text-caribbean-600">
            <PenSquare className="w-6 h-6" />
            <span className="font-semibold">Blog</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            Inspiración y Consejos para tu Viaje a Punta Cana
          </h1>
          <p className="mt-2 text-gray-600 max-w-3xl">
            Guías, recomendaciones y novedades para ayudarte a planificar experiencias inolvidables en el Caribe.
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container-custom py-10 lg:py-14">
        {loading && (
          <div className="text-center text-gray-600">Cargando posts...</div>
        )}
        {error && (
          <div className="text-center text-red-600">{error}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow overflow-hidden">
              {post.imageUrl && (
                <div className="h-48 w-full overflow-hidden">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-caribbean-600 font-semibold hover:text-caribbean-700"
                >
                  Leer más
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
