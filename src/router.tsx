// ...existing code...
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

export default function AppRouter() {
  const isAuth = !!localStorage.getItem('token');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={isAuth ? <DashboardPage 
          user={{ first_name: 'Demo', last_name: 'User', roles: [{ id: 1, name: 'Admin' }] }}
          empresa={{ nombre: 'Empresa Demo' }}
          sucursal={{ nombre: 'Sucursal Central' }}
          actividades={[{ id: 1, descripcion: 'Inicio de sesión', fecha: '2025-07-24' }]}
        /> : <Navigate to="/login" />} />
        <Route path="/profile/:userId" element={isAuth ? <ProfilePage 
          user={{ id: 1, first_name: '', last_name: '', email: '', id_sucursal_predeterminada: '', roles: [] }}
          onUpdate={async (values) => {
            // Aquí se conecta el backend para actualizar el perfil
            try {
              const { put } = await import('./services/api');
              await put(`/usuarios/1/`, { ...values });
              alert('Perfil actualizado');
            } catch {
              alert('Error al actualizar el perfil');
            }
          }}
        /> : <Navigate to="/login" />} />
        {/* Agrega aquí más rutas según crezcas */}
      </Routes>
    </BrowserRouter>
  );
}
