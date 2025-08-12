import React from 'react';
import { PenSquare, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

export const Blog: React.FC = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow overflow-hidden">
              {post.image && (
                <div className="h-48 w-full overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
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
                <h2 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
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
