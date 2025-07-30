import MonedaListPage from './pages/Finanzas/Monedas/MonedaListPage';
import MonedaDetailPage from './pages/Finanzas/Monedas/MonedaDetailPage';
import MonedaFormPage from './pages/Finanzas/Monedas/MonedaFormPage';
// ...existing code...
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardUserPage from './pages/Core/Login/DashboardUserPage';
import RoleListPage from './pages/Core/Usuarios/RoleListPage';
import AuditLogListPage from './pages/Core/Auditoria';
import RoleDetailPage from './pages/Core/Usuarios/RoleDetailPage';
import RoleCreatePage from './pages/Core/Usuarios/RoleCreatePage';
import PermissionListPage from './pages/Core/Usuarios/PermissionListPage';
import UserListPage from './pages/Core/Usuarios/UserListPage';
import UserCreatePage from './pages/Core/Usuarios/UserCreatePage';
import UserDetailPage from './pages/Core/Usuarios/UserDetailPage';
import LoginPage from './pages/Core/Login/LoginPage';
import CompanyListPage from './pages/Core/Empresas/CompanyListPage';
import CompanyDetailPage from './pages/Core/Empresas/CompanyDetailPage';
import CompanyCreatePage from './pages/Core/Empresas/CompanyCreatePage';
import BranchListPage from './pages/Core/Sucursales/BranchListPage';
import BranchDetailPage from './pages/Core/Sucursales/BranchDetailPage';
import BranchCreatePage from './pages/Core/Sucursales/BranchCreatePage';
import SidebarMenu from './components/SidebarMenu';
import DepartmentListPage from './pages/Core/Departamentos/DepartmentListPage';
import DepartmentDetailPage from './pages/Core/Departamentos/DepartmentDetailPage';
import DepartmentCreatePage from './pages/Core/Departamentos/DepartmentCreatePage';

export default function AppRouter() {
  const isAuth = !!localStorage.getItem('token');
  if (!isAuth) {
    localStorage.removeItem('usuario');
    localStorage.removeItem('empresa');
    localStorage.removeItem('sucursal');
  }
  return (
    <BrowserRouter>
      {isAuth && (
        <div style={{ display: 'flex' }}>
          <SidebarMenu />
          <div style={{ marginLeft: 200, width: '100%' }}>
            <Routes>
              {/* Finanzas - Monedas */}
              <Route path="/finanzas/monedas" element={<MonedaListPage />} />
              <Route path="/finanzas/monedas/new" element={<MonedaFormPage />} />
              <Route path="/finanzas/monedas/:id_moneda" element={<MonedaDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={(() => {
                // Obtener usuario real desde localStorage
                const userStr = localStorage.getItem('usuario');
                let user = null;
                try {
                  user = userStr ? JSON.parse(userStr) : null;
                } catch {
                  user = null;
                }
                const empresaStr = localStorage.getItem('empresa');
                let empresa = null;
                try {
                  empresa = empresaStr ? JSON.parse(empresaStr) : null;
                } catch {
                  empresa = null;
                }
                const sucursalStr = localStorage.getItem('sucursal');
                let sucursal = null;
                try {
                  sucursal = sucursalStr ? JSON.parse(sucursalStr) : null;
                } catch {
                  sucursal = null;
                }
                // Actividades de ejemplo
                const actividades = [{ id: 1, descripcion: 'Inicio de sesión', fecha: '2025-07-24' }];
                if (user && user.id) {
                  return <DashboardUserPage user={user} empresa={empresa || { nombre: '' }} sucursal={sucursal || { nombre: '' }} actividades={actividades} />;
                } else {
                  return <div style={{textAlign:'center',marginTop:64,fontSize:20}}>No se encontró información de usuario.</div>;
                }
              })()} />
              <Route path="/empresas/:id_empresa/usuarios" element={<UserListPage />} />
              <Route path="/empresas/:id_empresa/usuarios/new" element={<UserCreatePage />} />
              <Route path="/empresas/:id_empresa/usuarios/:id" element={<UserDetailPage />} />
              <Route path="/roles" element={<RoleListPage />} />
              <Route path="/roles/new" element={<RoleCreatePage />} />
              <Route path="/roles/:id_rol" element={<RoleDetailPage />} />
              <Route path="/permisos" element={<PermissionListPage />} />
              <Route path="/empresas" element={<CompanyListPage />} />
              <Route path="/empresas/new" element={<CompanyCreatePage />} />
              <Route path="/empresas/:id_empresa" element={<CompanyDetailPage />} />
              <Route path="/empresas/:id_empresa/sucursales" element={<BranchListPage />} />
              <Route path="/empresas/:id_empresa/sucursales/new" element={<BranchCreatePage />} />
              <Route path="/sucursales/:id_sucursal" element={<BranchDetailPage />} />
              <Route path="/sucursales/:id_sucursal/edit" element={<BranchDetailPage />} />
              <Route path="/empresas/:id_empresa/departamentos" element={<DepartmentListPage />} />
              <Route path="/empresas/:id_empresa/departamentos/new" element={<DepartmentCreatePage />} />
              <Route path="/departamentos/:id_departamento" element={<DepartmentDetailPage />} />
              <Route path="/departamentos/:id_departamento/edit" element={<DepartmentDetailPage />} />
              <Route path="/auditoria" element={<AuditLogListPage />} />
              <Route path="/departamentos" element={(() => {
                const empresaId = localStorage.getItem('id_empresa');
                return empresaId
                  ? <Navigate to={`/empresas/${empresaId}/departamentos`} replace />
                  : <div style={{textAlign:'center',marginTop:64,fontSize:20}}>Seleccione una empresa para ver sus departamentos.</div>;
              })()} />
            </Routes>
          </div>
        </div>
      )}
      {!isAuth && (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
