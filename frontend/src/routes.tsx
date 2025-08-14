import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './context/AuthContext';

export default function AppRoutes() {
  const { token, role } = useAuth();

  return (
    <Routes>
      {/* Ana sayfa */}
      <Route 
        path="/" 
        element={
          !token ? (
            <LoginPage />
          ) : role === 'doctor' ? (
            <Navigate to="/doctor" />
          ) : (
            <Navigate to="/patient" />
          )
        } 
      />

      {/* Doktor dashboard */}
      <Route 
        path="/doctor" 
        element={token && role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/" />} 
      />

      {/* Hasta dashboard */}
      <Route 
        path="/patient" 
        element={token && role === 'patient' ? <PatientDashboard /> : <Navigate to="/" />} 
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
