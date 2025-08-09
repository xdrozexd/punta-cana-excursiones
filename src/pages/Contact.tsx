import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    tourInterest: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se manejaría el envío del formulario
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      details: ['+1 (809) 555-0123', '+1 (809) 555-0124'],
      description: 'Disponible 24/7 para emergencias'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@puntacanaexcursiones.com', 'reservas@puntacanaexcursiones.com'],
      description: 'Respuesta en menos de 2 horas'
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      details: ['Av. España, Bávaro', 'Punta Cana, República Dominicana'],
      description: 'Visítanos en nuestra oficina'
    },
    {
      icon: Clock,
      title: 'Horarios',
      details: ['Lun - Dom: 7:00 AM - 10:00 PM', 'Soporte 24/7 disponible'],
      description: 'Siempre listos para ayudarte'
    }
  ];

  const faqs = [
    {
      question: '¿Cuál es la política de cancelación?',
      answer: 'Ofrecemos cancelación gratuita hasta 24 horas antes del tour. Para cancelaciones con menos de 24 horas, se aplica una tarifa del 50%.'
    },
    {
      question: '¿Qué debo llevar en los tours?',
      answer: 'Recomendamos llevar protector solar, sombrero, ropa cómoda, traje de baño, toalla y cámara. Proporcionamos agua y equipo de snorkel cuando es necesario.'
    },
    {
      question: '¿Los tours incluyen transporte?',
      answer: 'Sí, todos nuestros tours incluyen transporte gratuito de ida y vuelta desde tu hotel en la zona de Punta Cana y Bávaro.'
    },
    {
      question: '¿Hay descuentos para grupos grandes?',
      answer: 'Ofrecemos descuentos especiales para grupos de 8 personas o más. Contacta con nosotros para obtener una cotización personalizada.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky-600 to-blue-600 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="heading-primary mb-4">Contáctanos</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Estamos aquí para ayudarte a planificar la aventura perfecta. Escríbenos y te responderemos lo antes posible.
          </p>
        </div>
      </section>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Envíanos un Mensaje</h2>
                <p className="text-gray-600">
                  Completa el formulario y nos pondremos en contacto contigo en las próximas 2 horas.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label htmlFor="name" className="form-label">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input pl-10"
                      placeholder="Tu nombre completo"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pt-6 pl-3 pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="email" className="form-label">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input pl-10"
                      placeholder="tu@email.com"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pt-6 pl-3 pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label htmlFor="phone" className="form-label">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input pl-10"
                      placeholder="+1 (234) 567-8900"
                    />
                    <div className="absolute inset-y-0 left-0 pt-6 pl-3 pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="tourInterest" className="form-label">
                      Tour de Interés
                    </label>
                    <select
                      id="tourInterest"
                      name="tourInterest"
                      value={formData.tourInterest}
                      onChange={handleChange}
                      className="form-input pl-10"
                    >
                      <option value="">Selecciona un tour</option>
                      <option value="isla-saona">Isla Saona Completa</option>
                      <option value="hoyo-azul">Hoyo Azul Adventure</option>
                      <option value="safari-buggy">Safari Buggy</option>
                      <option value="catamaran">Catamaran Party</option>
                      <option value="zip-line">Zip Line Extreme</option>
                      <option value="dolphins">Dolphin Encounter</option>
                      <option value="personalizado">Tour Personalizado</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pt-6 pl-3 pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="subject" className="form-label">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="¿En qué podemos ayudarte?"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pt-6 pl-3 pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="message" className="form-label">
                    Mensaje *
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="form-input resize-none pl-10 pt-10"
                      placeholder="Cuéntanos sobre tu viaje ideal, fechas preferidas, número de personas, necesidades especiales, etc."
                      required
                    ></textarea>
                    <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-right mt-2">
                    <span className="text-xs text-gray-500">{formData.message.length} caracteres</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-0 bg-sky-700 transition-all duration-500 ease-out group-hover:w-full"></span>
                  <Send className="w-5 h-5 relative z-10 transform group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Enviar Mensaje</span>
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Contact Cards */}
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-700 mb-1">{detail}</p>
                      ))}
                      <p className="text-sm text-gray-500 mt-2">{info.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* WhatsApp Card */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
                  <p className="text-gray-700 mb-2">+1 (809) 555-0123</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Chatea con nosotros directamente para respuestas inmediatas
                  </p>
                  <a 
                    href="https://wa.me/18095550123" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.643 16.955l-.003.003c-.283.433-.573.817-.936 1.173-1.1 1.093-2.597 1.757-4.227 1.862-1.112.07-2.235-.066-3.304-.43-1.118-.382-2.135-.945-3.038-1.683-1.9-1.543-3.16-3.67-3.584-6.04-.466-2.587.464-5.272 2.392-7.175 2.44-2.409 6.008-3.345 9.33-2.618 1.96.428 3.746 1.494 5.095 3.027 1.347 1.533 2.172 3.437 2.332 5.434.183 2.278-.574 4.514-2.129 6.347l.072.098z" />
                    </svg>
                    <span>Abrir WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">Preguntas Frecuentes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encuentra respuestas rápidas a las preguntas más comunes sobre nuestros tours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h2 className="heading-secondary mb-4">Nuestra Ubicación</h2>
            <p className="text-lg text-gray-600">
              Visítanos en nuestra oficina en el corazón de Bávaro, Punta Cana.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-96 relative overflow-hidden rounded-t-xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242.5181963192026!2d-68.41151715106191!3d18.668297878582728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea8909bc4ef968b%3A0xf89945c96f787b60!2sPlaza%20Brisas%2C%20Punta%20Cana%2023000%2C%20Dominikanische%20Republik!5e0!3m2!1sen!2sus!4v1659714050923!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-lg">
                <p className="text-sm font-medium">Punta Cana Excursiones</p>
                <p className="text-xs text-gray-600">Av. España, Bávaro, Punta Cana</p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Dirección</h4>
                  <p className="text-gray-600">Av. España, Bávaro<br />Punta Cana, República Dominicana</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Horarios</h4>
                  <p className="text-gray-600">Lun - Dom<br />7:00 AM - 10:00 PM</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Parking</h4>
                  <p className="text-gray-600">Estacionamiento gratuito<br />disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
