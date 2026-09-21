import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import PublicNavbar from './components/layout/PublicNavbar';
import PublicFooter from './components/layout/PublicFooter';
import AdminSidebar from './components/layout/AdminSidebar';
import { ToastProvider } from './components/common/Toast';
import { isAuthenticated } from './utils/auth';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import SpecialistsPage from './pages/public/SpecialistsPage';
import SpecialistDetailPage from './pages/public/SpecialistDetailPage';
import ProductsPage from './pages/public/ProductsPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import GalleryPage from './pages/public/GalleryPage';
import BlogsPage from './pages/public/BlogsPage';
import BlogDetailPage from './pages/public/BlogDetailPage';
import TreatmentsPage from './pages/public/TreatmentsPage';
import TreatmentDetailPage from './pages/public/TreatmentDetailPage';
import ContactPage from './pages/public/ContactPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPage from './pages/public/PrivacyPage';
import RequestErasurePage from './pages/public/RequestErasurePage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PatientsPage from './pages/admin/PatientsPage';
import PatientDetailPage from './pages/admin/PatientDetailPage';
import ClinicalLogsPage from './pages/admin/ClinicalLogsPage';
import AdmissionsPage from './pages/admin/AdmissionsPage';
import InventoryPage from './pages/admin/InventoryPage';
import AppointmentsPage from './pages/admin/AppointmentsPage';
import ServicesAdminPage from './pages/admin/ServicesAdminPage';
import BlogsAdminPage from './pages/admin/BlogsAdminPage';
import SpecialistsAdminPage from './pages/admin/SpecialistsAdminPage';
import TreatmentsAdminPage from './pages/admin/TreatmentsAdminPage';
import ProductsAdminPage from './pages/admin/ProductsAdminPage';
import ProductInquiriesPage from './pages/admin/ProductInquiriesPage';
import GalleryAdminPage from './pages/admin/GalleryAdminPage';
import MediaLibraryPage from './pages/admin/MediaLibraryPage';
import CredentialsPage from './pages/admin/CredentialsPage';
import StaffPage from './pages/admin/StaffPage';
import FinancePage from './pages/admin/FinancePage';
import ErasureRequestsAdminPage from './pages/admin/ErasureRequestsAdminPage';
import SettingsPage from './pages/admin/SettingsPage';
import { useDynamicSEO } from './utils/useSEO';
import FloatingContactButtons from './components/common/FloatingContactButtons';

// Layout wrappers
function PublicLayout() {
  return (
    <div className="public-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <main className="public-main-content" style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <PublicFooter />
      <FloatingContactButtons />
    </div>
  );
}

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="admin-main">
        <Outlet context={{ toggleSidebar: () => setSidebarOpen((prev) => !prev) }} />
      </div>
    </div>
  );
}

export default function App() {
  useDynamicSEO();
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/treatments" element={<TreatmentsPage />} />
            <Route path="/treatments/:slug" element={<TreatmentDetailPage />} />
            <Route path="/doctors" element={<SpecialistsPage />} />
            <Route path="/doctors/:slug" element={<SpecialistDetailPage />} />
            <Route path="/specialists" element={<SpecialistsPage />} />
            <Route path="/specialists/:slug" element={<SpecialistDetailPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/packages" element={<ProductsPage />} />
            <Route path="/packages/:slug" element={<ProductDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/facility-tour" element={<GalleryPage />} />
            <Route path="/insights" element={<BlogsPage />} />
            <Route path="/insights/:slug" element={<BlogDetailPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/request-erasure" element={<RequestErasurePage />} />
          </Route>

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin ERP Portal Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/:id" element={<PatientDetailPage />} />
            <Route path="clinical" element={<ClinicalLogsPage />} />
            <Route path="admissions" element={<AdmissionsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="services" element={<ServicesAdminPage />} />
            <Route path="treatments" element={<TreatmentsAdminPage />} />
            <Route path="blogs" element={<BlogsAdminPage />} />
            <Route path="specialists" element={<SpecialistsAdminPage />} />
            <Route path="products" element={<ProductsAdminPage />} />
            <Route path="packages" element={<ProductsAdminPage />} />
            <Route path="orders" element={<ProductInquiriesPage />} />
            <Route path="product-inquiries" element={<ProductInquiriesPage />} />
            <Route path="gallery" element={<GalleryAdminPage />} />
            <Route path="media" element={<MediaLibraryPage />} />
            <Route path="credentials" element={<CredentialsPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="erasure-requests" element={<ErasureRequestsAdminPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
