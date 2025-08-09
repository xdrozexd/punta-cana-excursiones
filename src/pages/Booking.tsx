import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Users, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';

export const Booking: React.FC = () => {
  const { tourId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    participants: [
      { firstName: '', lastName: '', age: 25, type: 'adult' }
    ],
    customerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      hotel: '',
      roomNumber: ''
    },
    specialRequests: '',
    agreeToTerms: false
  });

  // Mock data - en una aplicación real vendría de una API
  const tour = {
    id: tourId,
    title: 'Isla Saona Completa',
    duration: 'Todo el día (8 horas)',
    price: 85,
    image: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
  };

  const availableTimes = ['8:00 AM', '9:00 AM', '10:00 AM'];
  const steps = ['Detalles', 'Participantes', 'Información', 'Pago'];

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addParticipant = () => {
    setBookingData({
      ...bookingData,
      participants: [
        ...bookingData.participants,
        { firstName: '', lastName: '', age: 25, type: 'adult' }
      ]
    });
  };

  const removeParticipant = (index: number) => {
    if (bookingData.participants.length > 1) {
      setBookingData({
        ...bookingData,
        participants: bookingData.participants.filter((_, i) => i !== index)
      });
    }
  };

  const calculateTotal = () => {
    return bookingData.participants.length * tour.price;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-6 px-2">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-md transition-all duration-300 ${
                  currentStep > index + 1 
                    ? 'bg-green-500 text-white scale-105 ring-4 ring-green-100' 
                    : currentStep === index + 1
                    ? 'bg-sky-600 text-white scale-110 ring-4 ring-sky-100'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > index + 1 ? (
                    <CheckCircle className="w-6 h-6 animate-pulse" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-1">
                    <div className="relative">
                      <div className="h-1 bg-gray-200 rounded">
                        <div className={`absolute top-0 left-0 h-1 rounded transition-all duration-500 ${
                          currentStep > index + 1 ? 'bg-green-500 w-full' : 'bg-sky-600 w-0'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-2 ${
              currentStep === 1 ? 'bg-blue-50 text-blue-700' :
              currentStep === 2 ? 'bg-purple-50 text-purple-700' :
              currentStep === 3 ? 'bg-amber-50 text-amber-700' :
              'bg-green-50 text-green-700'
            }`}>
              Paso {currentStep} de {steps.length}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              {steps[currentStep - 1]}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Step 1: Tour Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Selecciona Fecha y Hora</h3>
                  
                  <div>
                    <label className="form-label">Fecha del Tour *</label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Hora de Inicio *</label>
                    <div className="grid grid-cols-3 gap-4">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setBookingData({...bookingData, time})}
                          className={`p-3 rounded-lg border-2 font-medium transition-all ${
                            bookingData.time === time
                              ? 'border-sky-500 bg-sky-50 text-sky-700'
                              : 'border-gray-200 hover:border-sky-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Participants */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900">Información de Participantes</h3>
                    <button
                      onClick={addParticipant}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      Agregar Participante
                    </button>
                  </div>

                  {bookingData.participants.map((participant, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">Participante {index + 1}</h4>
                        {bookingData.participants.length > 1 && (
                          <button
                            onClick={() => removeParticipant(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="form-label">Nombre *</label>
                          <input
                            type="text"
                            value={participant.firstName}
                            onChange={(e) => {
                              const updatedParticipants = [...bookingData.participants];
                              updatedParticipants[index].firstName = e.target.value;
                              setBookingData({...bookingData, participants: updatedParticipants});
                            }}
                            className="form-input"
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Apellido *</label>
                          <input
                            type="text"
                            value={participant.lastName}
                            onChange={(e) => {
                              const updatedParticipants = [...bookingData.participants];
                              updatedParticipants[index].lastName = e.target.value;
                              setBookingData({...bookingData, participants: updatedParticipants});
                            }}
                            className="form-input"
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Edad *</label>
                          <input
                            type="number"
                            value={participant.age}
                            onChange={(e) => {
                              const updatedParticipants = [...bookingData.participants];
                              updatedParticipants[index].age = parseInt(e.target.value);
                              setBookingData({...bookingData, participants: updatedParticipants});
                            }}
                            className="form-input"
                            min="1"
                            max="99"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3: Customer Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        value={bookingData.customerInfo.firstName}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerInfo: {...bookingData.customerInfo, firstName: e.target.value}
                        })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Apellido *</label>
                      <input
                        type="text"
                        value={bookingData.customerInfo.lastName}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerInfo: {...bookingData.customerInfo, lastName: e.target.value}
                        })}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        value={bookingData.customerInfo.email}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerInfo: {...bookingData.customerInfo, email: e.target.value}
                        })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Teléfono *</label>
                      <input
                        type="tel"
                        value={bookingData.customerInfo.phone}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerInfo: {...bookingData.customerInfo, phone: e.target.value}
                        })}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">País *</label>
                      <input
                        type="text"
                        value={bookingData.customerInfo.country}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerInfo: {...bookingData.customerInfo, country: e.target.value}
                        })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Hotel</label>
                      <input
                        type="text"
                        value={bookingData.customerInfo.hotel}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          customerInfo: {...bookingData.customerInfo, hotel: e.target.value}
                        })}
                        className="form-input"
                        placeholder="Nombre del hotel"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Solicitudes Especiales</label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                      className="form-input resize-none"
                      rows={4}
                      placeholder="Menciona cualquier necesidad especial, alergias alimentarias, etc."
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Información de Pago</h3>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800">
                      <strong>Nota:</strong> El pago se procesa de forma segura. Solo se requiere un depósito del 50% para confirmar tu reserva. El resto se paga el día del tour.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Número de Tarjeta *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Fecha de Vencimiento *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">CVV *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Nombre en la Tarjeta *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Como aparece en la tarjeta"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={bookingData.agreeToTerms}
                      onChange={(e) => setBookingData({...bookingData, agreeToTerms: e.target.checked})}
                      className="mt-1"
                      required
                    />
                    <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                      Acepto los <a href="#" className="text-sky-600 hover:underline">términos y condiciones</a> y la <a href="#" className="text-sky-600 hover:underline">política de privacidad</a> de Punta Cana Excursiones.
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="btn-secondary px-6 py-3 group"
                  >
                    <span className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>Anterior</span>
                    </span>
                  </button>
                )}
                <div className="ml-auto">
                  {currentStep < 4 ? (
                    <button
                      onClick={handleNextStep}
                      className="btn-primary px-6 py-3 group"
                    >
                      <span className="flex items-center space-x-2">
                        <span>Siguiente</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    <button
                      className="btn-success px-8 py-3 flex items-center space-x-2 relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 w-0 bg-green-700 transition-all duration-500 ease-out group-hover:w-full"></span>
                      <CreditCard className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Confirmar Reserva</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Resumen de Reserva</h3>
                
                {/* Tour Info */}
                <div className="border-b pb-4 mb-4">
                  <ImageWithFallback 
                    src={tour.image} 
                    fallbackSrc="https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=800&h=600"
                    alt={tour.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    width={800}
                    height={600}
                  />
                  <h4 className="font-semibold">{tour.title}</h4>
                  <p className="text-sm text-gray-600">{tour.duration}</p>
                </div>

                {/* Booking Details */}
                <div className="space-y-3 border-b pb-4 mb-4">
                  {bookingData.date && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{bookingData.date}</span>
                    </div>
                  )}
                  {bookingData.time && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{bookingData.time}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{bookingData.participants.length} participante(s)</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 border-b pb-4 mb-4">
                  <div className="flex justify-between">
                    <span>Precio por persona:</span>
                    <span>${tour.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participantes:</span>
                    <span>{bookingData.participants.length}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  {currentStep === 4 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Depósito (50%):</span>
                      <span>${calculateTotal() / 2}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-xl font-bold text-sky-600">
                  <span>Total:</span>
                  <span>${currentStep === 4 ? calculateTotal() / 2 : calculateTotal()}</span>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Pago 100% seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
