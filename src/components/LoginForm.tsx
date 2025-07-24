import React, { useState, useEffect } from 'react';
import { get } from '../services/api';
import { Input } from './Input';
import { Button } from './Button';

interface LoginFormProps {
  onSubmit: (username: string, password: string, empresa: string, sucursal: string) => void;
  loading?: boolean;
  error?: string;
  showEmpresaSucursal?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error, showEmpresaSucursal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [sucursal, setSucursal] = useState('');
  const [empresas, setEmpresas] = useState<{ id: string; nombre: string }[]>([]);
  const [sucursales, setSucursales] = useState<{ id: string; nombre: string }[]>([]);

  useEffect(() => {
    if (showEmpresaSucursal) {
      get<{ id: string; nombre: string }[]>('/core/empresas/')
        .then(data => {
          console.log('Empresas response:', data);
          setEmpresas(data);
        })
        .catch(() => setEmpresas([]));
    }
  }, [showEmpresaSucursal]);

  useEffect(() => {
    if (showEmpresaSucursal && empresa) {
      get<{ id: string; nombre: string }[]>(`/core/sucursales/?empresa=${empresa}`)
        .then(setSucursales)
        .catch(() => setSucursales([]));
    } else {
      setSucursales([]);
    }
  }, [empresa, showEmpresaSucursal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showEmpresaSucursal) {
      onSubmit(username, password, empresa, sucursal);
    } else {
      onSubmit(username, password, '', '');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 350, margin: '0 auto' }}>
      <Input
        label="Usuario"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        required
      />
      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        required
      />
      {showEmpresaSucursal && (
        <>
          <label style={{ marginBottom: 4 }}>Empresa</label>
          <select
            value={empresa}
            onChange={e => setEmpresa(e.target.value)}
            required
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginBottom: 12 }}
          >
            <option value="">Seleccione una empresa</option>
            {empresas.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nombre}</option>
            ))}
          </select>
          <label style={{ marginBottom: 4 }}>Sucursal</label>
          <select
            value={sucursal}
            onChange={e => setSucursal(e.target.value)}
            required
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginBottom: 12 }}
            disabled={!empresa}
          >
            <option value="">Seleccione una sucursal</option>
            {sucursales.map(suc => (
              <option key={suc.id} value={suc.id}>{suc.nombre}</option>
            ))}
          </select>
        </>
      )}
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  );
};

export default LoginForm;
