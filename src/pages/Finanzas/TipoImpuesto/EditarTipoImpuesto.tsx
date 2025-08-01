
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTipoImpuestoById, updateTipoImpuesto } from '../../../services/tipoImpuestoService';
import type { TipoImpuestoData } from '../../../services/tipoImpuestoService';
import PageLayout from '../../../components/PageLayout';

export default function EditarTipoImpuesto() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tipo, setTipo] = useState<TipoImpuestoData | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getTipoImpuestoById(id)
        .then((data) => setTipo(data as TipoImpuestoData))
        .catch(() => setError('Error al cargar tipo de impuesto'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!tipo) return;
    const { name, value, type, checked } = e.target;
    setTipo({
      ...tipo,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo || !id) return;
    setSaving(true);
    setError('');
    try {
      await updateTipoImpuesto(id, tipo);
      navigate('/finanzas/tipos-impuesto');
    } catch {
      setError('Error al actualizar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLayout><div style={{ textAlign: 'center', color: '#888', padding: 32 }}>Cargando...</div></PageLayout>;
  if (!tipo) return <PageLayout><div style={{ textAlign: 'center', color: '#888', padding: 32 }}>No encontrado</div></PageLayout>;

  return (
    <PageLayout maxWidth={420}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Editar Tipo de Impuesto</h2>
      <form onSubmit={handleSubmit} style={{ background: '#f6fafd', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 32, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, margin: '0 auto' }}>
        <label>Nombre
          <input name="nombre_impuesto" value={tipo.nombre_impuesto || ''} onChange={handleChange} required />
        </label>
        <label>Código
          <input name="codigo_impuesto" value={tipo.codigo_impuesto || ''} onChange={handleChange} required />
        </label>
        <label>
          <input name="es_retencion" type="checkbox" checked={!!tipo.es_retencion} onChange={handleChange} /> ¿Es retención?
        </label>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'flex-end' }}>
          <button type="submit" disabled={saving} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: 15 }}>{saving ? 'Guardando...' : 'Guardar'}</button>
          <button type="button" style={{ background: '#eee', color: '#1976d2', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: 15 }} onClick={() => navigate('/finanzas/tipos-impuesto')}>Cancelar</button>
        </div>
        {error && <div style={{ color: '#d32f2f', marginTop: 8, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      </form>
    </PageLayout>
  );
}
