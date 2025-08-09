import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { initImagePreloading } from './utils/ImagePreloader';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/admin/AdminLayout';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Import main website pages
import { Home } from './pages/Home';
import { Tours } from './pages/Tours';
import { TourDetail } from './pages/TourDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Booking } from './pages/Booking';
import { NotFound } from './pages/NotFound';

// Import admin pages
import Dashboard from './pages/admin/Dashboard';
import Activities from './pages/admin/Activities';
import Login from './pages/admin/Login';

// Import admin pages
import Bookings from './pages/admin/Bookings';
import Customers from './pages/admin/Customers';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

function App() {
  // Iniciar precarga de imágenes al cargar la aplicación
  useEffect(() => {
    initImagePreloading();
    console.log('🖼️ Iniciando precarga de imágenes en segundo plano...');
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          {/* Main Website Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/tours" element={<Layout><Tours /></Layout>} />
          <Route path="/tours/:id" element={<Layout><TourDetail /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/booking" element={<Layout><Booking /></Layout>} />
          <Route path="/booking/:tourId" element={<Layout><Booking /></Layout>} />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="activities" element={<Activities />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="customers" element={<Customers />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;