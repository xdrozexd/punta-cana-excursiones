import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  Save,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';

// Eliminamos la validación con zod que está causando problemas
const ActivityForm: React.FC<ActivityFormProps> = ({ activity, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: activity?.title || activity?.name || '',
    description: activity?.description || '',
    shortDescription: activity?.shortDescription || '',
    price: activity?.price || 0,
    duration: activity?.duration || '',
    maxPeople: activity?.maxPeople || activity?.capacity || 10,
    location: activity?.location || '',
    category: activity?.category || '',
    meetingPoint: activity?.meetingPoint || '',
    featured: activity?.featured || false,
    active: activity?.active !== undefined ? activity.active : true,
  });
  
  const [images, setImages] = useState<string[]>(activity?.images || []);
  const [dragOver, setDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [includedItems, setIncludedItems] = useState<string[]>(activity?.included || ['']);
  const [notIncludedItems, setNotIncludedItems] = useState<string[]>(activity?.notIncluded || ['']);
  const [requirements, setRequirements] = useState<string[]>(activity?.requirements || ['']);
  const [tags, setTags] = useState<string[]>(activity?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const categories = [
    { value: 'tours-islas', label: 'Tours a Islas' },
    { value: 'aventura', label: 'Aventura' },
    { value: 'acuaticos', label: 'Deportes Acuáticos' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'gastronomia', label: 'Gastronomía' },
    { value: 'relax', label: 'Relax y Spa' },
    { value: 'nocturna', label: 'Vida Nocturna' }
  ];

  const durations = [
    '2 horas',
    '4 horas',
    '6 horas',
    '8 horas',
    'Día completo',
    '2 días',
    '3 días'
  ];

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImages(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addListItem = (type: 'included' | 'notIncluded' | 'requirements') => {
    switch (type) {
      case 'included':
        setIncludedItems([...includedItems, '']);
        break;
      case 'notIncluded':
        setNotIncludedItems([...notIncludedItems, '']);
        break;
      case 'requirements':
        setRequirements([...requirements, '']);
        break;
    }
  };

  const removeListItem = (type: 'included' | 'notIncluded' | 'requirements', index: number) => {
    switch (type) {
      case 'included':
        setIncludedItems(includedItems.filter((_, i) => i !== index));
        break;
      case 'notIncluded':
        setNotIncludedItems(notIncludedItems.filter((_, i) => i !== index));
        break;
      case 'requirements':
        setRequirements(requirements.filter((_, i) => i !== index));
        break;
    }
  };

  const updateListItem = (type: 'included' | 'notIncluded' | 'requirements', index: number, value: string) => {
    switch (type) {
      case 'included':
        const newIncluded = [...includedItems];
        newIncluded[index] = value;
        setIncludedItems(newIncluded);
        break;
      case 'notIncluded':
        const newNotIncluded = [...notIncludedItems];
        newNotIncluded[index] = value;
        setNotIncludedItems(newNotIncluded);
        break;
      case 'requirements':
        const newRequirements = [...requirements];
        newRequirements[index] = value;
        setRequirements(newRequirements);
        break;
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData({
      ...formData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title) newErrors.title = 'El título es obligatorio';
    if (!formData.description) newErrors.description = 'La descripción es obligatoria';
    if (!formData.shortDescription) newErrors.shortDescription = 'La descripción corta es obligatoria';
    if (!formData.price) newErrors.price = 'El precio es obligatorio';
    if (!formData.duration) newErrors.duration = 'La duración es obligatoria';
    if (!formData.location) newErrors.location = 'La ubicación es obligatoria';
    if (!formData.category) newErrors.category = 'La categoría es obligatoria';
    if (!formData.meetingPoint) newErrors.meetingPoint = 'El punto de encuentro es obligatorio';
    if (includedItems.filter(item => item.trim()).length === 0) {
      newErrors.included = 'Debe incluir al menos un elemento';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const activityData = {
        ...formData,
        images,
        included: includedItems.filter(item => item.trim() !== ''),
        notIncluded: notIncludedItems.filter(item => item.trim() !== ''),
        requirements: requirements.filter(item => item.trim() !== ''),
        tags
      };
      onSave(activityData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-strong w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            {activity ? 'Editar Actividad' : 'Nueva Actividad'}
          </h2>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {showPreview ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Actividad *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                  placeholder="Ej: Isla Saona - Tour Completo"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio (USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    step="0.01"
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Seleccionar duración</option>
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Personas *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="maxPeople"
                    value={formData.maxPeople}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>
                {errors.maxPeople && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxPeople}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                    placeholder="Ej: Isla Saona, Punta Cana"
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Punto de Encuentro *
                </label>
                <input
                  name="meetingPoint"
                  value={formData.meetingPoint}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                  placeholder="Ej: Lobby del hotel, Puerto de Bayahibe"
                />
                {errors.meetingPoint && (
                  <p className="text-red-500 text-sm mt-1">{errors.meetingPoint}</p>
                )}
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Corta * (máximo 150 caracteres)
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
                maxLength={150}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent resize-none"
                placeholder="Descripción breve que aparecerá en las tarjetas de actividades"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.shortDescription && (
                  <p className="text-red-500 text-sm">{errors.shortDescription}</p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {formData.shortDescription?.length || 0}/150
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Completa *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent resize-none"
                placeholder="Descripción detallada de la actividad, qué incluye, qué pueden esperar los turistas..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes de la Actividad
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  dragOver ? 'border-caribbean-500 bg-caribbean-50' : 'border-gray-300'
                }`}
              >
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Arrastra las imágenes aquí o
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-caribbean-600 hover:bg-caribbean-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center gap-2 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Seleccionar Archivos
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Included Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qué Incluye *
              </label>
              {includedItems.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem('included', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                    placeholder="Ej: Transporte desde el hotel"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('included', index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('included')}
                className="text-caribbean-600 hover:text-caribbean-700 text-sm font-medium"
              >
                + Agregar elemento
              </button>
              {errors.included && (
                <p className="text-red-500 text-sm mt-1">{errors.included}</p>
              )}
            </div>

            {/* Not Included Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qué NO Incluye
              </label>
              {notIncludedItems.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem('notIncluded', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                    placeholder="Ej: Bebidas alcohólicas"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('notIncluded', index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('notIncluded')}
                className="text-caribbean-600 hover:text-caribbean-700 text-sm font-medium"
              >
                + Agregar elemento
              </button>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requisitos y Recomendaciones
              </label>
              {requirements.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem('requirements', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                    placeholder="Ej: Traer protector solar"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('requirements', index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('requirements')}
                className="text-caribbean-600 hover:text-caribbean-700 text-sm font-medium"
              >
                + Agregar requisito
              </button>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-500 focus:border-transparent"
                  placeholder="Ej: romántico, aventura, familia"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-caribbean-600 text-white rounded-lg hover:bg-caribbean-700"
                >
                  Agregar
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-caribbean-100 text-caribbean-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-caribbean-600 hover:text-caribbean-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <input
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  type="checkbox"
                  className="w-4 h-4 text-caribbean-600 border-gray-300 rounded focus:ring-caribbean-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Actividad Destacada
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  name="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  type="checkbox"
                  className="w-4 h-4 text-caribbean-600 border-gray-300 rounded focus:ring-caribbean-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Actividad Activa
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-caribbean-600 hover:bg-caribbean-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                {activity ? 'Actualizar' : 'Crear'} Actividad
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

interface ActivityFormProps {
  activity?: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

export { ActivityForm };