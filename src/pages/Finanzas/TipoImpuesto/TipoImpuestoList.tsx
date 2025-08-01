

import { useEffect, useState } from 'react';
import { getTiposImpuestoEmpresaActivas, activateTipoImpuestoEmpresa, deactivateTipoImpuestoEmpresa } from '../../../services/tipoImpuestoService';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '../../../components/PageLayout';
import { Button } from '../../../components/Button';

interface TipoImpuestoEmpresaActiva {
  id: string;
  tipo_impuesto: string;
  tipo_impuesto_nombre: string;
  tipo_impuesto_codigo: string;
  empresa_nombre: string;
  activa: boolean;
}


export default function TipoImpuestoListPage() {
  const [tipos, setTipos] = useState<TipoImpuestoEmpresaActiva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTipos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTiposImpuestoEmpresaActivas();
      setTipos(data);
    } catch {
      setError('Error al cargar tipos de impuesto');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleToggle = async (tipo: TipoImpuestoEmpresaActiva) => {
    setLoading(true);
    setError('');
    try {
      if (tipo.activa) {
        await deactivateTipoImpuestoEmpresa(tipo.id);
      } else {
        await activateTipoImpuestoEmpresa(tipo.id);
      }
      await fetchTipos();
    } catch {
      setError('Error al cambiar estado');
    }
    setLoading(false);
  };

  return (
    <PageLayout>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Tipos de Impuesto</h2>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, gap: 16, justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={() => navigate('/finanzas/tipos-impuesto/nuevo')}>
          + Nuevo tipo de impuesto
        </Button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>Cargando...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: '#d32f2f', padding: 32, fontWeight: 500 }}>{error}</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f6fafd', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <thead>
              <tr style={{ background: '#e3f0ff' }}>
                <th style={{ padding: '12px 8px', color: '#1976d2', fontWeight: 600 }}>Nombre</th>
                <th style={{ padding: '12px 8px', color: '#1976d2', fontWeight: 600 }}>Código</th>
                <th style={{ padding: '12px 8px', color: '#1976d2', fontWeight: 600 }}>Empresa</th>
                <th style={{ padding: '12px 8px', color: '#1976d2', fontWeight: 600 }}>Activa</th>
                <th style={{ padding: '12px 8px', color: '#1976d2', fontWeight: 600 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tipos.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#888' }}>No hay tipos de impuesto</td>
                </tr>
              ) : (
                tipos.map(tipo => (
                  <tr key={tipo.id} style={{ background: '#fff', borderBottom: '1px solid #e3f0ff' }}>
                    <td style={{ padding: '10px 8px' }}>{tipo.tipo_impuesto_nombre}</td>
                    <td style={{ padding: '10px 8px' }}>{tipo.tipo_impuesto_codigo}</td>
                    <td style={{ padding: '10px 8px' }}>{tipo.empresa_nombre}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={tipo.activa}
                        onChange={() => handleToggle(tipo)}
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <Link to={`/finanzas/tipos-impuesto/${tipo.tipo_impuesto}/editar`}>Editar</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  );
}
