import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import PageLayout from '../../../components/PageLayout';
import { createTransferencia } from '../../../services/transaccionFinancieraService';

const RegistroTransferenciaPage: React.FC = () => {
  const { id_empresa } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fecha_hora_transaccion: '',
    monto_transaccion: '',
    id_moneda_transaccion: '',
    id_metodo_pago: '',
    referencia_pago: '',
    descripcion: '',
    origen_transferencia: '',
    destino_transferencia: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTransferencia(id_empresa, form);
      navigate(-1);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <h2 style={{ marginBottom: 16 }}>Registrar Transferencia</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
        <Input label="Fecha" name="fecha_hora_transaccion" type="datetime-local" value={form.fecha_hora_transaccion} onChange={handleChange} required />
        <Input label="Monto" name="monto_transaccion" type="number" value={form.monto_transaccion} onChange={handleChange} required />
        <Input label="Moneda" name="id_moneda_transaccion" value={form.id_moneda_transaccion} onChange={handleChange} required />
        <Input label="Método de Pago" name="id_metodo_pago" value={form.id_metodo_pago} onChange={handleChange} required />
        <Input label="Referencia" name="referencia_pago" value={form.referencia_pago} onChange={handleChange} />
        <Input label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} />
        <Input label="Origen" name="origen_transferencia" value={form.origen_transferencia} onChange={handleChange} required />
        <Input label="Destino" name="destino_transferencia" value={form.destino_transferencia} onChange={handleChange} required />
        <Button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar transferencia'}
        </Button>
      </form>
    </PageLayout>
  );
};

export default RegistroTransferenciaPage;
