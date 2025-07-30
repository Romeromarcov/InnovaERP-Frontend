import React, { useState, useEffect } from 'react';
import LoginForm from '../../../components/LoginForm';
import { Button } from '../../../components/Button';
import { get } from '../../../services/api';
import { loginAndFetchUser } from '../../../services/auth';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [empresa, setEmpresa] = useState<string>('');
  const [sucursal, setSucursal] = useState('');
  const [empresas, setEmpresas] = useState<Array<{ id_empresa: string; nombre_legal: string; nombre_comercial?: string }>>([]);
  const [sucursales, setSucursales] = useState<Array<{ id_sucursal: string; nombre: string; id_empresa: string }>>([]);
  const [step, setStep] = useState<'login' | 'select'>('login');

  useEffect(() => {
    if (step === 'select') {
      get('/core/empresas/')
        .then(res => {
          if (Array.isArray(res)) setEmpresas(res);
          else if (
            res &&
            typeof res === 'object' &&
            res !== null &&
            'results' in res &&
            Array.isArray((res as { results?: unknown }).results)
          ) {
            setEmpresas((res as { results: typeof empresas }).results);
          } else setEmpresas([]);
        })
        .catch(() => setEmpresas([]));
      get('/core/sucursales/')
        .then(res => {
          if (Array.isArray(res)) setSucursales(res);
          else if (
            res &&
            typeof res === 'object' &&
            res !== null &&
            'results' in res &&
            Array.isArray((res as { results?: unknown }).results)
          ) {
            setSucursales((res as { results: typeof sucursales }).results);
          } else setSucursales([]);
        })
        .catch(() => setSucursales([]));
    }
  }, [step]);

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      await loginAndFetchUser(username, password);
      setStep('select');
    } catch (err: unknown) {
      console.error('Login error:', err);
      let errorMsg = 'Credenciales inválidas';
      try {
        const parsed = JSON.parse((err as Error).message);
        if (parsed && parsed.error) errorMsg = parsed.error;
      } catch { /* no-op */ }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 380,
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    padding: '32px 24px',
    margin: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  };



  return (
    <div className="vertical-center">
      <div className="centered-container" style={{ background: 'linear-gradient(135deg, #e3f0ff 0%, #f6fafd 100%)' }}>
        <div style={cardStyle}>
          {step === 'login' && (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#1976d2' }}>Iniciar sesión</h2>
              <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
            </>
          )}
          {step === 'select' && (
            <form
              onSubmit={e => {
                e.preventDefault();
                // Permitir continuar aunque no se seleccione empresa ni sucursal
                let empresaObj = null;
                let sucursalObj = null;
                if (empresa) {
                  empresaObj = empresas.find(emp => String(emp.id_empresa) === String(empresa));
                  if (empresaObj) {
                    localStorage.setItem('empresa', JSON.stringify(empresaObj));
                    localStorage.setItem('id_empresa', empresaObj.id_empresa);
                  }
                }
                if (sucursal) {
                  sucursalObj = sucursales.find(suc => String(suc.id_sucursal) === String(sucursal));
                  if (sucursalObj) {
                    localStorage.setItem('sucursal', JSON.stringify(sucursalObj));
                  }
                }
                window.location.href = '/';
              }}
              style={{ maxWidth: 350, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <h3 style={{ textAlign: 'center', color: '#1976d2' }}>Selecciona empresa y sucursal (opcional)</h3>
              <label>Empresa</label>
              <select value={empresa} onChange={e => { setEmpresa(e.target.value); }}>
                <option value="">Seleccione una empresa</option>
                {(Array.isArray(empresas) ? empresas : []).map(emp => (
                  <option key={emp.id_empresa} value={String(emp.id_empresa)}>{emp.nombre_legal}</option>
                ))}
              </select>
              <label>Sucursal</label>
              <select value={sucursal} onChange={e => setSucursal(e.target.value)} disabled={!empresa}>
                <option value="">Seleccione una sucursal</option>
                {(() => {
                  const lista = Array.isArray(sucursales) ? sucursales : [];
                  const filtradas = lista.filter(suc => suc && String(suc.id_empresa) === String(empresa));
                  return filtradas.map(suc => (
                    <option key={`${suc.id_sucursal}-${suc.nombre}`} value={suc.id_sucursal}>{suc.nombre}</option>
                  ));
                })()}
              </select>
              <Button type="submit">Continuar</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;