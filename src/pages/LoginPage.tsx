import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { Button } from '../components/Button';
import { post } from '../services/api';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  type Empresa = { id_empresa: string; nombre_legal: string; nombre_comercial?: string };
  type Sucursal = { id_sucursal: string; nombre: string; id_empresa: string };
  type UserData = {
    empresas: Empresa[];
    sucursales: Sucursal[];
    id?: string;
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    // Agrega aquí otros campos esperados del usuario si es necesario
  };
  const [userData, setUserData] = useState<UserData | null>(null);
  const [empresa, setEmpresa] = useState('');
  const [sucursal, setSucursal] = useState('');

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await post<{ access: string; refresh: string; user: UserData }>(
        '/auth/login/',
        { username, password }
      );
      console.log('Login response:', result);
      if (result.access && result.user) {
        localStorage.setItem('token', result.access);
        setUserData(result.user);
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Error de autenticación');
      } else {
        setError('Error de autenticación');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e3f0ff 0%, #f6fafd 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '32px 24px',
        margin: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#1976d2' }}>Iniciar sesión</h2>
        {!userData ? (
          <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              if (empresa && sucursal) {
                // Guardar selección en localStorage y redirigir
                localStorage.setItem('empresa', empresa);
                localStorage.setItem('sucursal', sucursal);
                window.location.href = '/';
              }
            }}
            style={{ maxWidth: 350, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <h3 style={{ textAlign: 'center', color: '#1976d2' }}>Selecciona empresa y sucursal</h3>
            <label>Empresa</label>
            <select value={empresa} onChange={e => setEmpresa(e.target.value)} required>
              <option value="">Seleccione una empresa</option>
              {userData.empresas?.map((emp) => (
                <option key={emp.id_empresa} value={emp.id_empresa}>
                  {emp.nombre_comercial ? emp.nombre_comercial : emp.nombre_legal}
                </option>
              ))}
            </select>
            <label>Sucursal</label>
            <select value={sucursal} onChange={e => setSucursal(e.target.value)} required disabled={!empresa}>
              <option value="">Seleccione una sucursal</option>
              {userData.sucursales?.filter((suc) => suc.id_empresa === empresa).map((suc) => (
                <option key={suc.id_sucursal} value={suc.id_sucursal}>{suc.nombre}</option>
              ))}
            </select>
            <Button type="submit" disabled={!empresa || !sucursal}>Continuar</Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
