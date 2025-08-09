import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  CreditCard, 
  Shield, 
  Save, 
  Check, 
  X, 
  ChevronRight 
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<boolean>(false);
  
  // Estados para los formularios
  const [profileForm, setProfileForm] = useState({
    name: 'Administrador',
    email: 'admin@puntacanaexcursiones.com',
    phone: '+1 809-555-1234',
    role: 'Administrador',
    bio: 'Gestor principal de la plataforma de excursiones en Punta Cana.'
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    bookingAlerts: true,
    marketingEmails: false,
    systemUpdates: true
  });
  
  const [companySettings, setCompanySettings] = useState({
    companyName: 'Punta Cana Excursiones',
    address: 'Av. Barceló, Punta Cana, República Dominicana',
    phone: '+1 809-555-0000',
    email: 'info@puntacanaexcursiones.com',
    website: 'www.puntacanaexcursiones.com',
    taxId: '123456789'
  });

  // Función para manejar el envío del formulario de perfil
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos una actualización exitosa
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Función para manejar el envío del formulario de contraseña
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple de contraseña
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSaveError(true);
      setTimeout(() => {
        setSaveError(false);
      }, 3000);
      return;
    }
    
    // Simulamos una actualización exitosa
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 3000);
  };

  // Función para manejar el cambio en los ajustes de notificaciones
  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  // Función para manejar el envío del formulario de la empresa
  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos una actualización exitosa
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Renderiza el contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <input
                  type="text"
                  value={profileForm.role}
                  onChange={(e) => setProfileForm({...profileForm, role: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-gray-100"
                  readOnly
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biografía
              </label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                rows={4}
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </form>
        );
      
      case 'security':
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña Actual
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Recomendaciones de seguridad</h3>
                  <ul className="mt-1 text-sm text-blue-700 list-disc list-inside">
                    <li>Usa al menos 8 caracteres</li>
                    <li>Incluye letras mayúsculas y minúsculas</li>
                    <li>Incluye al menos un número y un símbolo</li>
                    <li>No uses información personal fácil de adivinar</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Cambiar Contraseña
              </button>
            </div>
          </form>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
              <div className="flex">
                <Bell className="w-5 h-5 text-blue-500 mr-2" />
                <p className="text-sm text-blue-700">
                  Configura cómo y cuándo quieres recibir notificaciones sobre la actividad en tu plataforma.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h4 className="font-medium text-gray-900">Notificaciones por Email</h4>
                  <p className="text-sm text-gray-600">Recibe actualizaciones importantes por correo electrónico</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={() => handleNotificationChange('emailNotifications')}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  />
                  <label
                    htmlFor="emailNotifications"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notificationSettings.emailNotifications ? 'bg-sky-500' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h4 className="font-medium text-gray-900">Alertas de Reservas</h4>
                  <p className="text-sm text-gray-600">Recibe notificaciones cuando se realicen nuevas reservas</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="bookingAlerts"
                    checked={notificationSettings.bookingAlerts}
                    onChange={() => handleNotificationChange('bookingAlerts')}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  />
                  <label
                    htmlFor="bookingAlerts"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notificationSettings.bookingAlerts ? 'bg-sky-500' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h4 className="font-medium text-gray-900">Emails de Marketing</h4>
                  <p className="text-sm text-gray-600">Recibe consejos, ofertas y actualizaciones de marketing</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="marketingEmails"
                    checked={notificationSettings.marketingEmails}
                    onChange={() => handleNotificationChange('marketingEmails')}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  />
                  <label
                    htmlFor="marketingEmails"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notificationSettings.marketingEmails ? 'bg-sky-500' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h4 className="font-medium text-gray-900">Actualizaciones del Sistema</h4>
                  <p className="text-sm text-gray-600">Recibe notificaciones sobre actualizaciones y mantenimiento</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="systemUpdates"
                    checked={notificationSettings.systemUpdates}
                    onChange={() => handleNotificationChange('systemUpdates')}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  />
                  <label
                    htmlFor="systemUpdates"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notificationSettings.systemUpdates ? 'bg-sky-500' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Preferencias
              </button>
            </div>
          </div>
        );
      
      case 'company':
        return (
          <form onSubmit={handleCompanySubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings({...companySettings, companyName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Identificación Fiscal
                </label>
                <input
                  type="text"
                  value={companySettings.taxId}
                  onChange={(e) => setCompanySettings({...companySettings, taxId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={companySettings.address}
                onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={companySettings.phone}
                  onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitio Web
              </label>
              <input
                type="url"
                value={companySettings.website}
                onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Información
              </button>
            </div>
          </form>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configuración
        </h1>
        <p className="text-gray-600">
          Administra tu cuenta y configura las preferencias del sistema
        </p>
      </div>

      {/* Alert Messages */}
      {saveSuccess && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <div className="flex">
            <Check className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700">
              Los cambios se han guardado correctamente.
            </p>
          </div>
        </div>
      )}
      
      {saveError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <X className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">
              Error al guardar los cambios. Las contraseñas no coinciden.
            </p>
          </div>
        </div>
      )}

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-sky-100 rounded-full flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {profileForm.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {profileForm.role}
                  </p>
                </div>
              </div>
            </div>
            
            <nav className="p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-sky-50 text-sky-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3" />
                  Perfil
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                  activeTab === 'security' 
                    ? 'bg-sky-50 text-sky-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <Lock className="w-5 h-5 mr-3" />
                  Seguridad
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                  activeTab === 'notifications' 
                    ? 'bg-sky-50 text-sky-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-3" />
                  Notificaciones
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setActiveTab('company')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                  activeTab === 'company' 
                    ? 'bg-sky-50 text-sky-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-3" />
                  Información de la Empresa
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
            
            <div className="p-4 mt-2">
              <button 
                onClick={() => {
                  alert('Funcionalidad de gestión de facturación en desarrollo');
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <CreditCard className="w-4 h-4 mr-2" />
                Gestionar Facturación
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className={`p-2 rounded-lg ${
                activeTab === 'profile' ? 'bg-blue-100 text-blue-600' :
                activeTab === 'security' ? 'bg-green-100 text-green-600' :
                activeTab === 'notifications' ? 'bg-yellow-100 text-yellow-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {activeTab === 'profile' && <User className="w-5 h-5" />}
                {activeTab === 'security' && <Lock className="w-5 h-5" />}
                {activeTab === 'notifications' && <Bell className="w-5 h-5" />}
                {activeTab === 'company' && <Globe className="w-5 h-5" />}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-3">
                {activeTab === 'profile' && 'Información de Perfil'}
                {activeTab === 'security' && 'Configuración de Seguridad'}
                {activeTab === 'notifications' && 'Preferencias de Notificaciones'}
                {activeTab === 'company' && 'Información de la Empresa'}
              </h2>
            </div>
            
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
