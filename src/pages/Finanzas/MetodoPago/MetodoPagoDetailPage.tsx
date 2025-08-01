import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, put } from '../../../services/api';
import { findSimilarMetodoPago } from '../../../utils/fuzzyDuplicate';
import { Button } from '../../../components/Button';
import PageLayout from '../../../components/PageLayout';

interface MetodoPagoDetail {
  id_metodo_pago: string;
  nombre_metodo: string;
  tipo_metodo: string;
  activo: boolean;
  referencia_externa?: string;
  documento_json?: string;
  es_generico?: boolean;
  es_publico?: boolean;
  empresa?: string | null;
}

const TIPO_METODO = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'ELECTRONICO', label: 'Electrónico' },
  { value: 'TARJETA', label: 'Tarjeta' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'CREDITO', label: 'Crédito' },
  { value: 'OTRO', label: 'Otro' },
];

const MetodoPagoDetailPage: React.FC = () => {
  const { id_metodo_pago } = useParams();
  const navigate = useNavigate();
  // Simulación de usuario y empresas (ajusta según tu contexto real)
  type User = { es_superusuario_innova: boolean };
  type Empresa = { id: string; nombre_comercial: string };
  const user: User = (window as unknown as { user?: User }).user || { es_superusuario_innova: false };
  const empresas: Empresa[] = (window as unknown as { empresas?: Empresa[] }).empresas || [];
  const [metodo, setMetodo] = useState<MetodoPagoDetail | null>(null);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [metodosExistentes, setMetodosExistentes] = useState<MetodoPagoDetail[]>([]);
  // Cargar todos los métodos de pago para validación fuzzy (excepto el actual)
  useEffect(() => {
    get('/finanzas/metodos-pago/?limit=1000').then((res: unknown) => {
      if (Array.isArray(res)) setMetodosExistentes(res);
      else if (res && typeof res === 'object' && 'results' in res && Array.isArray((res as { results: unknown }).results)) {
        setMetodosExistentes((res as { results: MetodoPagoDetail[] }).results);
      } else setMetodosExistentes([]);
    }).catch(() => setMetodosExistentes([]));
  }, []);

  useEffect(() => {
    get(`/finanzas/metodos-pago/${id_metodo_pago}/`)
      .then((data) => setMetodo(data as MetodoPagoDetail))
      .catch(() => setError('Error al cargar método de pago'))
      .finally(() => setLoading(false));
  }, [id_metodo_pago]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metodo) return;
    setError('');
    // Validación fuzzy de duplicados antes de enviar (excluyendo el actual)
    const otros = metodosExistentes.filter(m => m.id_metodo_pago !== metodo.id_metodo_pago);
    const similar = findSimilarMetodoPago(metodo, otros, 65);
    if (similar) {
      setError(`Ya existe un método de pago similar: "${similar.nombre_metodo}" (${similar.tipo_metodo})`);
      return;
    }
    setLoading(true);
    try {
      await put(`/finanzas/metodos-pago/${id_metodo_pago}/`, metodo as unknown as Record<string, unknown>);
      setEdit(false);
    } catch {
      setError('Error al actualizar método de pago');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLayout><div style={{ textAlign: 'center', color: '#888', padding: 32 }}>Cargando...</div></PageLayout>;
  if (error) return <PageLayout><div style={{ textAlign: 'center', color: 'red', padding: 32 }}>{error}</div></PageLayout>;
  if (!metodo) return <PageLayout><div style={{ textAlign: 'center', color: '#888', padding: 32 }}>No encontrado</div></PageLayout>;

  return (
    <PageLayout maxWidth={500}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Detalle de Método de Pago</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>
      {/* Si es genérico, no permitir edición */}
      {!edit ? (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div><b>Nombre:</b> {metodo.nombre_metodo}
            {metodo.es_generico && <span style={{ marginLeft: 6, color: '#1976d2', fontWeight: 600, fontSize: 12 }}>[Genérico]</span>}
            {metodo.es_publico && <span style={{ marginLeft: 6, color: '#43a047', fontWeight: 600, fontSize: 12 }}>[Público]</span>}
          </div>
          <div><b>Tipo:</b> {metodo.tipo_metodo}</div>
          <div><b>Visibilidad:</b> {metodo.es_generico ? 'Genérico' : metodo.es_publico ? 'Público' : 'Empresa'}
            {user.es_superusuario_innova && metodo.empresa && (
              <span style={{ marginLeft: 6, color: '#888', fontSize: 12 }}>
                ({empresas.find(e => e.id === metodo.empresa)?.nombre_comercial || metodo.empresa})
              </span>
            )}
          </div>
          <div><b>Activo:</b> {metodo.activo ? 'Sí' : 'No'}</div>
          <div><b>Referencia externa:</b> {metodo.referencia_externa || '-'}</div>
          <div><b>Documento JSON:</b> <pre style={{ background: '#f6fafd', borderRadius: 8, padding: 8, fontSize: 13 }}>{metodo.documento_json || '-'}</pre></div>
          {!metodo.es_generico && (
            <Button variant="primary" onClick={() => setEdit(true)} style={{ marginTop: 8, alignSelf: 'flex-end' }}>Editar</Button>
          )}
        </div>
      ) : (
        metodo.es_generico ? (
          <div style={{ color: '#d32f2f', fontWeight: 500, textAlign: 'center', marginTop: 24 }}>
            No es posible editar los métodos de pago genéricos del sistema.
          </div>
        ) : (
        <form onSubmit={handleUpdate} style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {user.es_superusuario_innova && (
            <>
              <label>
                <input
                  type="checkbox"
                  checked={!!metodo.es_generico}
                  onChange={e => setMetodo({ ...metodo, es_generico: e.target.checked })}
                /> Método genérico (global)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={!!metodo.es_publico}
                  onChange={e => setMetodo({ ...metodo, es_publico: e.target.checked })}
                /> Método público (visible para todas las empresas)
              </label>
              <label>
                Empresa:
                <select
                  value={metodo.empresa || ''}
                  onChange={e => setMetodo({ ...metodo, empresa: e.target.value })}
                >
                  <option value="">Seleccione empresa</option>
                  {empresas.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.nombre_comercial}</option>
                  ))}
                </select>
              </label>
            </>
          )}
          <label style={{ fontWeight: 500 }}>Nombre
            <input required value={metodo.nombre_metodo} onChange={e => setMetodo({ ...metodo, nombre_metodo: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #cfd8dc', background: '#f6fafd', marginTop: 4 }} />
          </label>
          <label style={{ fontWeight: 500 }}>Tipo
            <select required value={metodo.tipo_metodo} onChange={e => setMetodo({ ...metodo, tipo_metodo: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #cfd8dc', background: '#f6fafd', marginTop: 4 }}>
              <option value="">Seleccione tipo</option>
              {TIPO_METODO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>
          <label style={{ fontWeight: 500 }}>Activo
            <select value={metodo.activo ? '1' : '0'} onChange={e => setMetodo({ ...metodo, activo: e.target.value === '1' })} style={{ padding: 10, borderRadius: 8, border: '1px solid #cfd8dc', background: '#f6fafd', marginTop: 4 }}>
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </label>
          <label style={{ fontWeight: 500 }}>Referencia externa
            <input value={metodo.referencia_externa || ''} onChange={e => setMetodo({ ...metodo, referencia_externa: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #cfd8dc', background: '#f6fafd', marginTop: 4 }} />
          </label>
          <label style={{ fontWeight: 500 }}>Documento JSON
            <textarea value={metodo.documento_json || ''} onChange={e => setMetodo({ ...metodo, documento_json: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #cfd8dc', background: '#f6fafd', marginTop: 4, minHeight: 60, fontFamily: 'monospace' }} />
          </label>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Actualizando...' : 'Actualizar'}</Button>
            <Button type="button" variant="secondary" onClick={() => setEdit(false)}>Cancelar</Button>
          </div>
        </form>
        )
      )}
    </PageLayout>
  );
};

export default MetodoPagoDetailPage;
