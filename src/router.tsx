
import TasaCambioListPage from './pages/Finanzas/TasasCambio/TasaCambioListPage';
import TasaCambioDetailPage from './pages/Finanzas/TasasCambio/TasaCambioDetailPage';
import TasaCambioCreatePage from './pages/Finanzas/TasasCambio/TasaCambioCreatePage';
import MetodoPagoListPage from './pages/Finanzas/MetodoPago/MetodoPagoListPage';
import MetodoPagoDetailPage from './pages/Finanzas/MetodoPago/MetodoPagoDetailPage';
import MetodoPagoCreatePage from './pages/Finanzas/MetodoPago/MetodoPagoCreatePage';
import MonedaListPage from './pages/Finanzas/Monedas/MonedaListPage';
import MonedaDetailPage from './pages/Finanzas/Monedas/MonedaDetailPage';
import MonedaFormPage from './pages/Finanzas/Monedas/MonedaFormPage';
import TransaccionFinancieraListPage from './pages/Finanzas/TransaccionFinanciera/TransaccionFinancieraListPage';
import TransaccionFinancieraDetailPage from './pages/Finanzas/TransaccionFinanciera/TransaccionFinancieraDetailPage';
import TransaccionFinancieraFormPage from './pages/Finanzas/TransaccionFinanciera/TransaccionFinancieraFormPage';
// import RegistroIngresoPage from './pages/Finanzas/TransaccionFinanciera/RegistroIngresoPage';
// import RegistroEgresoPage from './pages/Finanzas/TransaccionFinanciera/RegistroEgresoPage';
// import RegistroTransferenciaPage from './pages/Finanzas/TransaccionFinanciera/RegistroTransferenciaPage';
// ...existing code...
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import DepartmentListPage from './pages/Core/Departamentos/DepartmentListPage';
import DepartmentDetailPage from './pages/Core/Departamentos/DepartmentDetailPage';


import SidebarMenu from './components/SidebarMenu';

// Layout para rutas protegidas usando Outlet
function ProtectedLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <SidebarMenu />
      <div style={{ marginLeft: 200, width: '100%' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default function AppRouter() {
  const isAuth = !!localStorage.getItem('token');
  if (!isAuth) {
    localStorage.removeItem('usuario');
    localStorage.removeItem('empresa');
    localStorage.removeItem('sucursal');
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* Página de login como inicio por defecto */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        {/* Rutas protegidas solo si autenticado */}
        {isAuth && (
          <Route element={<ProtectedLayout />}>

            <Route path="/finanzas/monedas" element={<MonedaListPage />} />
            <Route path="/finanzas/monedas/new" element={<MonedaFormPage />} />
            {/* Métodos de Pago */}
            <Route path="/empresas/:id_empresa/metodos-pago" element={<MetodoPagoListPage />} />
            <Route path="/empresas/:id_empresa/metodos-pago/new" element={<MetodoPagoCreatePage />} />
            <Route path="/metodos-pago/:id_metodo_pago" element={<MetodoPagoDetailPage />} />
            <Route path="/finanzas/monedas/:id_moneda" element={<MonedaDetailPage />} />
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
            <Route path="/empresas/:id_empresa/tasas-cambio" element={<TasaCambioListPage />} />
            <Route path="/empresas/:id_empresa/tasas-cambio/new" element={<TasaCambioCreatePage />} />
            <Route path="/tasas-cambio/:id_tasa_cambio" element={<TasaCambioDetailPage />} />
            <Route path="/departamentos/:id_departamento" element={<DepartmentDetailPage />} />
            <Route path="/departamentos/:id_departamento/edit" element={<DepartmentDetailPage />} />
            <Route path="/auditoria" element={<AuditLogListPage />} />
            <Route path="/departamentos" element={(() => {
              const empresaId = localStorage.getItem('id_empresa');
              return empresaId
                ? <Navigate to={`/empresas/${empresaId}/departamentos`} replace />
                : <div style={{textAlign:'center',marginTop:64,fontSize:20}}>Seleccione una empresa para ver sus departamentos.</div>;
            })()} />
            {/* Transacciones Financieras */}
            <Route path="/empresas/:id_empresa/transacciones-financieras" element={<TransaccionFinancieraListPage />} />
            <Route path="/empresas/:id_empresa/transacciones-financieras/new" element={<TransaccionFinancieraFormPage />} />
            <Route path="/transacciones-financieras/:id_transaccion" element={<TransaccionFinancieraDetailPage />} />
            {/* <Route path="/empresas/:id_empresa/transacciones-financieras/transferencia/new" element={<RegistroTransferenciaPage />} /> */}
            <Route path="/dashboard" element={(() => {
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
              const actividades = [{ id: 1, descripcion: 'Inicio de sesión', fecha: '2025-07-24' }];
              if (user && user.id) {
                return <DashboardUserPage user={user} empresa={empresa || { nombre: '' }} sucursal={sucursal || { nombre: '' }} actividades={actividades} />;
              } else {
                return <div style={{textAlign:'center',marginTop:64,fontSize:20}}>No se encontró información de usuario.</div>;
              }
            })()} />
          </Route>
        )}
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
