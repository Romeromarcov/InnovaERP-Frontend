import React, { useState, useEffect } from 'react';
import { getCookie } from '../../../utils/csrf';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import PageLayout from '../../../components/PageLayout';
// import { createTransaccion } from '../../../services/transaccionFinancieraService';
import { fetchMonedasEmpresaActivas } from '../../../services/monedasEmpresaActiva';
import { fetchMetodosPagoEmpresaActivos } from '../../../services/metodosPagoEmpresaActiva';


const tipoTransaccionOptions = [
  { value: 'ingreso', label: 'Ingreso' },
  { value: 'egreso', label: 'Egreso' },
];


interface MonedaEmpresaActiva {
  id: string;
  nombre: string;
  activa: boolean;
  es_base?: boolean;
  moneda: string;
  moneda_nombre: string;
  codigo_iso: string;
  moneda_codigo_iso?: string;
}

interface MetodoPagoEmpresaActiva {
  id: string;
  nombre: string;
  activa: boolean;
  metodo_pago: string;
}

const TransaccionFinancieraFormPage: React.FC = () => {
  // Obtener automáticamente el UUID de la empresa principal del usuario autenticado
  const [idEmpresa, setIdEmpresa] = useState<string>('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [monedas, setMonedas] = useState<MonedaEmpresaActiva[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPagoEmpresaActiva[]>([]);
  const [monedaBase, setMonedaBase] = useState('');
  const [tasaCambio, setTasaCambio] = useState('');
  const [tasaBCV, setTasaBCV] = useState<number | null>(null);
  const [tasaError, setTasaError] = useState('');
  const [montoBase, setMontoBase] = useState('');
  const [form, setForm] = useState({
    fecha_hora_transaccion: '',
    tipo_transaccion: 'ingreso',
    monto_transaccion: '',
    id_moneda_transaccion: '',
    id_metodo_pago: '',
    referencia_pago: '',
    descripcion: '',
    id_caja: '',
    id_cuenta_bancaria: '',
    tipo_documento_asociado: '',
    nro_documento_asociado: '',
  });

  useEffect(() => {
    console.log('Cargando empresas para obtener idEmpresa...');
    import('../../../services/empresas').then(({ fetchEmpresas }) => {
      fetchEmpresas().then((empresas: { id_empresa: string }[] | { results: { id_empresa: string }[] }) => {
        console.log('Empresas obtenidas:', empresas);
        const empresasArray = Array.isArray(empresas) ? empresas : empresas && Array.isArray(empresas.results) ? empresas.results : [];
        if (Array.isArray(empresasArray) && empresasArray.length > 0) {
          setIdEmpresa(empresasArray[0].id_empresa);
          console.log('idEmpresa asignado:', empresasArray[0].id_empresa);
        } else {
          console.warn('No se encontró empresa principal.');
        }
      }).catch(err => {
        console.error('Error al obtener empresas:', err);
      });
    }).catch(err => {
      console.error('Error al importar servicio de empresas:', err);
    });
  }, []);

  useEffect(() => {
    if (!idEmpresa) {
      console.log('idEmpresa aún no asignado, no se consultan monedas ni métodos de pago.');
      return;
    }
    console.log('Consultando monedas activas para empresa:', idEmpresa);
    fetchMonedasEmpresaActivas(idEmpresa)
      .then((data) => {
        console.log('Respuesta de fetchMonedasEmpresaActivas:', data);
        let monedasData: MonedaEmpresaActiva[] = [];
        if (Array.isArray(data)) {
          monedasData = data;
        } else if (data && Array.isArray((data as { results?: unknown }).results)) {
          monedasData = (data as { results: MonedaEmpresaActiva[] }).results;
        }
        const activas = monedasData.filter((m: MonedaEmpresaActiva) => m.activa);
        console.log('Monedas activas filtradas:', activas);
        setMonedas(activas);
        const base = activas.find((m: MonedaEmpresaActiva) => m.es_base);
        setMonedaBase(base ? base.moneda_nombre : (activas[0]?.moneda_nombre || ''));
      })
      .catch((err) => {
        console.error('Error al consultar monedas activas:', err);
        setMonedas([]);
      });
    console.log('Consultando métodos de pago activos para empresa:', idEmpresa);
    fetchMetodosPagoEmpresaActivos(idEmpresa)
      .then((data) => {
        console.log('Respuesta de fetchMetodosPagoEmpresaActivos:', data);
        let metodosData: MetodoPagoEmpresaActiva[] = [];
        if (Array.isArray(data)) {
          metodosData = data;
        } else if (data && Array.isArray((data as { results?: unknown }).results)) {
          metodosData = (data as { results: MetodoPagoEmpresaActiva[] }).results;
        }
        const activos = metodosData.filter((m: MetodoPagoEmpresaActiva) => m.activa);
        console.log('Métodos de pago activos filtrados:', activos);
        setMetodosPago(activos);
      })
      .catch((err) => {
        console.error('Error al consultar métodos de pago activos:', err);
        setMetodosPago([]);
      });
  }, [idEmpresa]);

  useEffect(() => {
    if (!idEmpresa || !form.id_moneda_transaccion || !form.fecha_hora_transaccion) return;
    // Buscar la moneda seleccionada en el array de monedas activas
    const monedaDestino = monedas.find(m => m.moneda === form.id_moneda_transaccion);
    const nombreMonedaDestino = monedaDestino?.moneda_nombre || '';
    const codigoDestino = monedaDestino?.moneda_codigo_iso || monedaDestino?.codigo_iso;
    // Si la moneda base es igual a la moneda de transacción, tasa = 1
    if (monedaBase && nombreMonedaDestino && monedaBase === nombreMonedaDestino) {
      setTasaCambio('1');
      setTasaBCV(1);
      setTasaError('');
      return;
    }
    // Si son diferentes, consultar la API
    const codigoOrigen = 'USD';
    // Extraer solo la fecha en formato YYYY-MM-DD
    let fecha = '';
    if (form.fecha_hora_transaccion.includes('T')) {
      fecha = form.fecha_hora_transaccion.split('T')[0];
    } else if (form.fecha_hora_transaccion.length >= 10) {
      fecha = form.fecha_hora_transaccion.substring(0, 10);
    }
    console.log('DEBUG tasa BCV:', {idEmpresa, monedaDestino, codigoDestino, fecha, monedaBase});
    if (codigoDestino && fecha) {
      console.log('Consultando tasa oficial BCV...', {codigoDestino, fecha});
      fetch(`/api/finanzas/tasa-oficial-bcv/?moneda_origen=${codigoOrigen}&moneda_destino=${codigoDestino}&fecha=${fecha}`)
        .then(async res => {
          const text = await res.text();
          try {
            return JSON.parse(text);
          } catch {
            throw new Error('Respuesta no es JSON: ' + text);
          }
        })
        .then(data => {
          console.log('Respuesta de fetchTasaBCV:', data);
          if (data && data.valor_tasa) {
            setTasaBCV(Number(data.valor_tasa));
            setTasaCambio(data.valor_tasa.toString());
          } else {
            setTasaBCV(null);
            setTasaCambio('');
          }
        })
        .catch((err) => {
          console.error('Error al consultar tasa BCV:', err);
          setTasaBCV(null);
          setTasaCambio('');
        });
    }
  }, [idEmpresa, form.id_moneda_transaccion, monedas, form.fecha_hora_transaccion, monedaBase]);

  useEffect(() => {
    const monto = parseFloat(form.monto_transaccion);
    const tasa = parseFloat(tasaCambio);
    // Buscar la moneda seleccionada en el array de monedas activas
    const monedaDestino = monedas.find(m => m.moneda === form.id_moneda_transaccion);
    const nombreMonedaDestino = monedaDestino?.moneda_nombre || '';
    // Si la moneda base es igual a la moneda de transacción
    if (monedaBase && nombreMonedaDestino && monedaBase === nombreMonedaDestino) {
      if (!isNaN(monto)) {
        setMontoBase(monto.toFixed(2));
      } else {
        setMontoBase('');
      }
    } else {
      // Si son diferentes, monto base = monto transaccion / tasa de cambio
      if (!isNaN(monto) && !isNaN(tasa) && tasa > 0) {
        setMontoBase((monto / tasa).toFixed(2));
      } else {
        setMontoBase('');
      }
    }
  }, [form.monto_transaccion, tasaCambio, monedaBase, form.id_moneda_transaccion, monedas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validar tasa de cambio (debe ser > 0)
  const handleTasaCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setTasaCambio(value);
      // Validar que no sea menor a la tasa BCV
      if (tasaBCV !== null && parseFloat(value) < tasaBCV) {
        setTasaError(`La tasa no puede ser menor a la oficial BCV (${tasaBCV})`);
      } else {
        setTasaError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Aquí iría la lógica para registrar la transacción
    // Por ahora solo navega atrás para evitar error de compilación
    setTasaError('');
    try {
      // Obtener el id del usuario autenticado desde localStorage
      const usuarioId = localStorage.getItem('id_usuario') || '';
      // Obtener id_moneda_pais_empresa e id_moneda_base desde la empresa (requiere fetch)
      let idMonedaPaisEmpresa = '';
      let idMonedaBase = '';
      try {
        const empresaRes = await fetch(`/api/core/empresas/${idEmpresa}/`);
        if (empresaRes.ok) {
          const empresaData = await empresaRes.json();
          idMonedaPaisEmpresa = empresaData.id_moneda_pais || '';
          idMonedaBase = empresaData.id_moneda_base || '';
        }
      } catch {
        // Silently ignore errors fetching empresa data
      }

      // Calcular monto_moneda_pais (monto_base_empresa * tasa_cambio) solo si ambos existen y son numéricos
      let montoMonedaPais = '';
      const montoBaseNum = parseFloat(montoBase);
      const tasaNum = parseFloat(tasaCambio);
      if (!isNaN(montoBaseNum) && !isNaN(tasaNum) && montoBaseNum > 0 && tasaNum > 0) {
        montoMonedaPais = (montoBaseNum * tasaNum).toFixed(2);
      } else {
        montoMonedaPais = '';
      }

      // Construir el payload para la API con los nombres y valores correctos
      const payload = {
        fecha_hora_transaccion: form.fecha_hora_transaccion,
        tipo_transaccion: (form.tipo_transaccion || '').toUpperCase(),
        monto_transaccion: form.monto_transaccion,
        id_moneda_transaccion: form.id_moneda_transaccion,
        id_metodo_pago: form.id_metodo_pago,
        referencia_pago: form.referencia_pago,
        descripcion: form.descripcion,
        tasa_cambio: tasaCambio,
        monto_base_empresa: montoBase,
        id_empresa: idEmpresa,
        id_usuario_registro: usuarioId,
        id_moneda_base: idMonedaBase,
        id_moneda_pais_empresa: idMonedaPaisEmpresa,
        monto_moneda_pais: montoMonedaPais,
        id_caja: form.id_caja,
        id_cuenta_bancaria: form.id_cuenta_bancaria,
        tipo_documento_asociado: form.tipo_documento_asociado,
        nro_documento_asociado: form.nro_documento_asociado,
      };
      const res = await fetch('/api/finanzas/transacciones-financieras/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken') || '',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) {
        const errorText = await res.text();
        let errorMsg = 'Error al registrar transacción.';
        try {
          const errorJson = JSON.parse(errorText);
          errorMsg = errorJson.detail || errorJson.message || errorText;
        } catch {
          errorMsg = errorText;
        }
        setTasaError(errorMsg);
        setLoading(false);
        return;
      }
      // Si todo sale bien, navegar a la lista de transacciones
      navigate(`/empresas/${idEmpresa}/transacciones-financieras`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setTasaError('Error inesperado: ' + err.message);
      } else {
        setTasaError('Error inesperado.');
      }
    }
    setLoading(false);
  };

  return (
    <PageLayout>
      <h2 style={{ marginBottom: 16 }}>Registrar Transacción</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
        <Input label="Fecha" name="fecha_hora_transaccion" type="datetime-local" value={form.fecha_hora_transaccion} onChange={handleChange} required />
        <label style={{ display: 'block', marginBottom: 4 }}>Tipo de Transacción</label>
        <select name="tipo_transaccion" value={form.tipo_transaccion} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%', marginBottom: 16 }}>
          {tipoTransaccionOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <Input label="Monto" name="monto_transaccion" type="number" value={form.monto_transaccion} onChange={handleChange} required />

        {/* Dropdown de monedas activas */}
        <label style={{ display: 'block', marginBottom: 4 }}>Moneda de Transacción</label>
        <select name="id_moneda_transaccion" value={form.id_moneda_transaccion} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%', marginBottom: 16 }}>
          <option value="">Seleccione una moneda</option>
          {monedas.map(moneda => (
            <option key={moneda.id} value={moneda.moneda}>{moneda.moneda_nombre}</option>
          ))}
        </select>

        {/* Dropdown de métodos de pago activos */}
        <label style={{ display: 'block', marginBottom: 4 }}>Método de Pago</label>
        <select name="id_metodo_pago" value={form.id_metodo_pago} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%', marginBottom: 16 }}>
          <option value="">Seleccione método de pago</option>
          {metodosPago.map(metodo => (
            <option key={metodo.id} value={metodo.metodo_pago}>{metodo.nombre}</option>
          ))}
        </select>

        {/* Moneda base (readonly) */}
        <Input label="Moneda Base" name="moneda_base" value={monedaBase} readOnly style={{ marginBottom: 16 }} />

        {/* Tasa de cambio (editable, validada) */}
        <Input label="Tasa de Cambio" name="tasa_cambio" type="number" value={tasaCambio} onChange={handleTasaCambio} required min="0.0001" step="0.0001" style={{ marginBottom: 16 }} />
        {tasaError && <div style={{ color: 'red', marginBottom: 8 }}>{tasaError}</div>}

        {/* Monto base (readonly, auto-calculado) */}
        <Input label="Monto Base" name="monto_base" value={montoBase} readOnly style={{ marginBottom: 16 }} />

        <Input label="Referencia" name="referencia_pago" value={form.referencia_pago} onChange={handleChange} />
        <Input label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} />
        <Input label="Caja" name="id_caja" value={form.id_caja} onChange={handleChange} required />
        <Input label="Cuenta Bancaria" name="id_cuenta_bancaria" value={form.id_cuenta_bancaria} onChange={handleChange} />
        <label style={{ display: 'block', marginBottom: 4 }}>Tipo de Documento Asociado</label>
        <select name="tipo_documento_asociado" value={form.tipo_documento_asociado} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%', marginBottom: 16 }}>
          <option value="">Seleccione tipo de documento</option>
          <option value="COMPRA">Compra</option>
          <option value="VENTA">Venta</option>
          <option value="GASTO">Gasto</option>
          <option value="NOMINA">Nómina</option>
          <option value="AJUSTE">Ajuste</option>
        </select>
        <Input label="Nro. Documento Asociado" name="nro_documento_asociado" value={form.nro_documento_asociado} onChange={handleChange} />
        <Button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar transacción'}
        </Button>
      </form>
    </PageLayout>
  );
}
export default TransaccionFinancieraFormPage;
