import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import dei componenti
import HomePage from './components/HomePage';
import AllPropertiesPage from './components/AllPropertiesPage';
import ListingDetailPage from './components/ListingDetailPage';
import UnifiedLogin from './components/UnifiedLogin';
import AdvancedAdminPanel from './components/AdvancedAdminPanel';
import AboutPage from './components/AboutPage';
import AdminRegistration from './components/AdminRegistration';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/immobili" element={<AllPropertiesPage />} />
      <Route path="/listing/:id" element={<ListingDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/admin" element={<UnifiedLogin />} />
      <Route path="/admin/register" element={<AdminRegistration />} />
      <Route path="/dashboard" element={<AdvancedAdminPanel />} />
    </Routes>
  );
}

export default App;
