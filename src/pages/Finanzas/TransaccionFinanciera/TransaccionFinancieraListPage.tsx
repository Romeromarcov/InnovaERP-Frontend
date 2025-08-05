import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { getTransaccionesFinancieras, exportTransaccionesFinancieras } from '../../../services/transaccionFinancieraService';
import PageLayout from '../../../components/PageLayout';

const tipoTransaccionOptions = [
  { value: '', label: 'Todos' },
  { value: 'ingreso', label: 'Ingreso' },
  { value: 'egreso', label: 'Egreso' },
];

type TransaccionFinanciera = {
  id: string;
  fecha_hora_transaccion: string;
  tipo_transaccion: string;
  monto_transaccion: number;
  id_moneda_transaccion__codigo_iso: string;
  id_moneda_base__codigo_iso?: string;
  monto_base_empresa: number;
  id_moneda_pais_empresa__codigo_iso?: string;
  monto_moneda_pais?: number;
  id_metodo_pago__nombre_metodo: string;
  referencia_pago: string;
  descripcion: string;
  id_usuario_registro__username: string;
  empresa_id?: string;
  estado?: string;
  observaciones?: string;
};

const TransaccionFinancieraListPage: React.FC = () => {
  const { id_empresa } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<TransaccionFinanciera[]>([]);
  const [filters, setFilters] = useState({ tipo: '', moneda: '', metodo: '', usuario: '', fecha_inicio: '', fecha_fin: '' });

  // Type guard para paginación
  function isPaginated(data: unknown): data is { results: TransaccionFinanciera[] } {
    return !!data && typeof data === 'object' && Array.isArray((data as { results?: unknown }).results);
  }
  useEffect(() => {
    if (!id_empresa) return;
    getTransaccionesFinancieras(id_empresa, filters).then(result => {
      if (Array.isArray(result)) {
        setData(result as TransaccionFinanciera[]);
      } else if (isPaginated(result)) {
        setData(result.results);
      } else {
        setData([]);
      }
    });
  }, [id_empresa, filters]);

  if (!id_empresa) {
    return (
      <PageLayout>
        <h2 style={{ marginBottom: 16 }}>Gestión de Transacciones Financieras</h2>
        <div style={{ margin: '32px 0', textAlign: 'center', color: '#c00', fontSize: 18 }}>
          Seleccione una empresa para ver sus transacciones financieras.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h2 style={{ marginBottom: 16 }}>Gestión de Transacciones Financieras</h2>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select
          value={filters.tipo}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(f => ({ ...f, tipo: e.target.value }))}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        >
          {tipoTransaccionOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <Input placeholder="Moneda" value={filters.moneda} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(f => ({ ...f, moneda: e.target.value }))} />
        <Input placeholder="Método de Pago" value={filters.metodo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(f => ({ ...f, metodo: e.target.value }))} />
        <Input placeholder="Usuario" value={filters.usuario} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(f => ({ ...f, usuario: e.target.value }))} />
        <Input type="date" label="Desde" value={filters.fecha_inicio} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(f => ({ ...f, fecha_inicio: e.target.value }))} />
        <Input type="date" label="Hasta" value={filters.fecha_fin} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(f => ({ ...f, fecha_fin: e.target.value }))} />
        <Button variant="primary" onClick={() => navigate(`/empresas/${id_empresa}/transacciones-financieras/new`)}>Nueva Transacción</Button>
        <Button variant="outline" onClick={() => exportTransaccionesFinancieras(id_empresa, filters)}>Exportar</Button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Moneda</th>
              <th>Moneda Base</th>
              <th>Monto Base</th>
              <th>Moneda País</th>
              <th>Monto País</th>
              <th>Método de Pago</th>
              <th>Referencia</th>
              <th>Descripción</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              console.log('Transacción row.id:', row.id, row);
              return (
                <tr key={row.id || idx}>
                  <td>{row.fecha_hora_transaccion}</td>
                  <td>{row.tipo_transaccion}</td>
                  <td>{row.monto_transaccion}</td>
                  <td>{row.id_moneda_transaccion__codigo_iso}</td>
                  <td>{row.id_moneda_base__codigo_iso || '-'}</td>
                  <td>{row.monto_base_empresa}</td>
                  <td>{row.id_moneda_pais_empresa__codigo_iso || '-'}</td>
                  <td>{row.monto_moneda_pais !== undefined ? row.monto_moneda_pais : '-'}</td>
                  <td>{row.id_metodo_pago__nombre_metodo}</td>
                  <td>{row.referencia_pago}</td>
                  <td>{row.descripcion}</td>
                  <td>{row.id_usuario_registro__username}</td>
                  <td>
                    <Button variant="outline" onClick={() => navigate(`/transacciones-financieras/${row.id}`)}>
                      Ver Detalle
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
};

export default TransaccionFinancieraListPage;
