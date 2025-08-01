
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTipoImpuesto, getTiposImpuestoEmpresaActivas } from '../../../services/tipoImpuestoService';
import type { TipoImpuestoData } from '../../../services/tipoImpuestoService';
import PageLayout from '../../../components/PageLayout';


export default function NuevoTipoImpuesto() {
  const navigate = useNavigate();
  // loading eliminado, solo se usa saving
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tiposExistentes, setTiposExistentes] = useState<TipoImpuestoData[]>([]);
  const [tipo, setTipo] = useState<TipoImpuestoData>({ nombre_impuesto: '', codigo_impuesto: '', es_retencion: false });

  useEffect(() => {
    // Cargar todos los tipos existentes para validación fuzzy
    getTiposImpuestoEmpresaActivas().then((res) => {
      // Extraer solo nombre y código únicos
      const arr = Array.isArray(res) ? res : [];
      setTiposExistentes(arr.map(t => ({ nombre_impuesto: t.tipo_impuesto_nombre, codigo_impuesto: t.tipo_impuesto_codigo, es_retencion: false })));
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTipo({
      ...tipo,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Fuzzy duplicate validation (igual que monedas/metodopago)
  function isSimilar(a: string, b: string, threshold = 65): boolean {
    if (!a || !b) return false;
    a = a.trim().toLowerCase();
    b = b.trim().toLowerCase();
    if (a === b) return true;
    // Simple ratio: porcentaje de coincidencia de caracteres
    let matches = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] === b[i]) matches++;
    }
    const similarity = Math.round((matches / Math.max(a.length, b.length)) * 100);
    return similarity >= threshold;
  }
  function findSimilarTipoImpuesto(tipo: Partial<TipoImpuestoData>, lista: TipoImpuestoData[], threshold = 65): TipoImpuestoData | undefined {
    return lista.find(t =>
      (tipo.nombre_impuesto && isSimilar(tipo.nombre_impuesto, t.nombre_impuesto, threshold)) ||
      (tipo.codigo_impuesto && isSimilar(tipo.codigo_impuesto, t.codigo_impuesto, threshold))
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Validación fuzzy de duplicados
    const similar = findSimilarTipoImpuesto(tipo, tiposExistentes, 65);
    if (similar) {
      setError(`Ya existe un tipo de impuesto similar: "${similar.nombre_impuesto}" (${similar.codigo_impuesto})`);
      return;
    }
    setSaving(true);
    try {
      await createTipoImpuesto(tipo);
      navigate('/finanzas/tipos-impuesto');
    } catch {
      setError('Error al crear tipo de impuesto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout maxWidth={420}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Nuevo Tipo de Impuesto</h2>
      <form onSubmit={handleSubmit} style={{ background: '#f6fafd', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 32, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, margin: '0 auto' }}>
        <label>Nombre
          <input name="nombre_impuesto" value={tipo.nombre_impuesto} onChange={handleChange} required />
        </label>
        <label>Código
          <input name="codigo_impuesto" value={tipo.codigo_impuesto} onChange={handleChange} required />
        </label>
        <label>
          <input name="es_retencion" type="checkbox" checked={!!tipo.es_retencion} onChange={handleChange} /> ¿Es retención?
        </label>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'flex-end' }}>
          <button type="submit" disabled={saving} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: 15 }}>{saving ? 'Guardando...' : 'Crear'}</button>
          <button type="button" style={{ background: '#eee', color: '#1976d2', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: 15 }} onClick={() => navigate('/finanzas/tipos-impuesto')}>Cancelar</button>
        </div>
        {error && <div style={{ color: '#d32f2f', marginTop: 8, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      </form>
    </PageLayout>
  );
}
