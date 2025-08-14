import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usa el proxy de Vite para '/api'
  const API_BASE = ''

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/blog-posts/slug/${slug}`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || 'No se pudo cargar el artículo');
        }
        const data = await res.json();
        setPost(data);
      } catch (e: any) {
        setError(e?.message || 'Error al cargar el artículo');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) {
    return (
      <div className="container-custom py-12 lg:py-16 text-center text-gray-600">Cargando...</div>
    );
  }

  if (error || !post) {
    return (
      <div className="container-custom py-12 lg:py-16">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Artículo no encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'El contenido que buscas no está disponible.'}</p>
          <Link to="/blog" className="btn-primary inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container-custom py-8 lg:py-12">
          <Link to="/blog" className="inline-flex items-center text-caribbean-700 font-semibold hover:text-caribbean-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver al Blog
          </Link>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">{post.title}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            {post.tag && (
              <span className="px-2 py-0.5 rounded-full bg-caribbean-50 text-caribbean-700 border border-caribbean-200 text-xs">
                {post.tag}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom py-10 lg:py-14">
        <article className="bg-white rounded-2xl shadow overflow-hidden">
          {post.imageUrl && (
            <div className="h-72 w-full overflow-hidden">
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="prose max-w-none p-6 lg:p-10">
            {post.content ? (
              <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.excerpt}</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
