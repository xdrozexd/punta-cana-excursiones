import React from 'react';

export const Faq: React.FC = () => {
  const faqs = [
    {
      q: '¿Cómo reservo un tour?',
      a: 'Puedes reservar directamente desde nuestra página de tours. Selecciona el tour, fecha y número de personas, y completa el proceso de pago seguro.'
    },
    {
      q: '¿Puedo cancelar o cambiar mi reserva?',
      a: 'Sí. Aceptamos cancelaciones y cambios según nuestra política. Generalmente, sin cargo con 48 horas de anticipación.'
    },
    {
      q: '¿Qué incluye cada tour?',
      a: 'Cada tour incluye guía profesional, transporte y los elementos especificados en la descripción del tour. Revisa cada detalle en la página del tour.'
    },
    {
      q: '¿Es seguro participar en los tours?',
      a: 'Sí. Cumplimos con altos estándares de seguridad y trabajamos con operadores certificados. Tu bienestar es nuestra prioridad.'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="heading-primary mb-4">Preguntas Frecuentes</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Encuentra respuestas a las dudas más comunes sobre nuestras excursiones y el proceso de reserva.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((item, idx) => (
              <details key={idx} className="group bg-gray-50 rounded-lg p-5 border border-gray-200">
                <summary className="flex cursor-pointer list-none items-center justify-between">
                  <span className="font-medium text-gray-900">{item.q}</span>
                  <span className="ml-4 text-sky-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
