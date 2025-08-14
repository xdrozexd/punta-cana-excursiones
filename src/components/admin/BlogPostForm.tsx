import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Image as ImageIcon,
  Type,
  FileText,
  Calendar
} from 'lucide-react';

// Importación dinámica para ReactQuill
const ReactQuill = lazy(() => import('react-quill'));

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  published: boolean;
  authorId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BlogPostFormProps {
  post?: BlogPost | null;
  onSave: (postData: BlogPost) => void;
  onClose: () => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ post, onSave, onClose }) => {
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    published: false,
    authorId: 'admin', // Por ahora hardcodeado, después se puede obtener del contexto de usuario
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

  // Configuración de ReactQuill
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image', 'video', 'blockquote', 'code-block'
  ];

  // Cargar datos del post si estamos editando
  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        authorId: post.authorId || 'admin'
      });
    }
  }, [post]);

  // Generar slug automáticamente desde el título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Remover guiones múltiples
      .trim();
  };

  const handleInputChange = (field: keyof BlogPost, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generar slug cuando cambia el título
    if (field === 'title' && !post) {
      setIsGeneratingSlug(true);
      const newSlug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        slug: newSlug
      }));
      setTimeout(() => setIsGeneratingSlug(false), 300);
    }

    // Limpiar errores cuando el usuario corrige
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Generar excerpt automáticamente desde el contenido
  const generateExcerpt = () => {
    if (formData.content) {
      // Remover HTML tags y obtener los primeros 150 caracteres
      const textContent = formData.content.replace(/<[^>]*>/g, '');
      const excerpt = textContent.substring(0, 150).trim();
      const finalExcerpt = excerpt + (textContent.length > 150 ? '...' : '');
      
      handleInputChange('excerpt', finalExcerpt);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'El slug es obligatorio';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es obligatorio';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'El extracto es obligatorio';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'La imagen destacada es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleSaveAsDraft = () => {
    const draftData = {
      ...formData,
      published: false
    };
    
    if (validateForm()) {
      onSave(draftData);
    }
  };

  const handlePublish = () => {
    const publishData = {
      ...formData,
      published: true
    };
    
    if (validateForm()) {
      onSave(publishData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {post ? 'Editar Post' : 'Nuevo Post'}
            </h1>
            <p className="text-gray-600">
              {post ? 'Modifica los detalles del post' : 'Crea un nuevo post para tu blog'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveAsDraft}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Guardar Borrador
          </button>
          <button
            onClick={handlePublish}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-caribbean-600 hover:bg-caribbean-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            Publicar
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Type className="h-5 w-5 text-caribbean-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del Post *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-caribbean-500 focus:border-caribbean-500 ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Las mejores playas de Punta Cana"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL) *
                    {isGeneratingSlug && (
                      <span className="ml-2 text-xs text-caribbean-600">Generando...</span>
                    )}
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /blog/
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-r-md shadow-sm focus:ring-caribbean-500 focus:border-caribbean-500 ${
                        errors.slug ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="las-mejores-playas-de-punta-cana"
                    />
                  </div>
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Extracto *
                    </label>
                    <button
                      type="button"
                      onClick={generateExcerpt}
                      className="text-xs text-caribbean-600 hover:text-caribbean-800"
                    >
                      Generar desde contenido
                    </button>
                  </div>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-caribbean-500 focus:border-caribbean-500 ${
                      errors.excerpt ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Breve descripción del post que aparecerá en las listas..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.excerpt.length}/150 caracteres recomendados
                  </p>
                  {errors.excerpt && (
                    <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-caribbean-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Contenido del Post</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido *
                </label>
                <div className={`border rounded-md ${errors.content ? 'border-red-300' : 'border-gray-300'}`}>
                  <Suspense fallback={
                    <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Cargando editor...</p>
                    </div>
                  }>
                    <ReactQuill
                      value={formData.content}
                      onChange={(value) => handleInputChange('content', value)}
                      modules={modules}
                      formats={formats}
                      theme="snow"
                      className="bg-white"
                      style={{ minHeight: '300px' }}
                      placeholder="Escribe el contenido de tu post aquí..."
                    />
                  </Suspense>
                </div>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estado de publicación */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-caribbean-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Publicación</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => handleInputChange('published', e.target.checked)}
                    className="h-4 w-4 text-caribbean-600 focus:ring-caribbean-500 border-gray-300 rounded"
                  />
                  <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                    Publicar inmediatamente
                  </label>
                </div>
                
                <div className="text-sm text-gray-500">
                  {formData.published ? (
                    <div className="flex items-center text-green-600">
                      <Eye className="h-4 w-4 mr-1" />
                      Este post será visible públicamente
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600">
                      <EyeOff className="h-4 w-4 mr-1" />
                      Este post se guardará como borrador
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Imagen destacada */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <ImageIcon className="h-5 w-5 text-caribbean-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Imagen Destacada</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de la imagen *
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-caribbean-500 focus:border-caribbean-500 ${
                      errors.imageUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {errors.imageUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
                  )}
                </div>
                
                {formData.imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                    <img
                      src={formData.imageUrl}
                      alt="Vista previa"
                      className="w-full h-32 object-cover rounded-md border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Información adicional */}
            {post && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Creado:</span>{' '}
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Actualizado:</span>{' '}
                    {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString('es-ES') : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Autor:</span> {post.authorId}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
