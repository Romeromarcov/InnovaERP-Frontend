// Servicio para obtener métodos de pago activos por empresa
export async function fetchMetodosPagoEmpresaActivos(empresa: string) {
  // Usar el fetcher del servicio api.ts para evitar duplicar 'api' en la URL
  // Solo pasar la ruta relativa
  const data = await import('./api').then(api => api.fetcher(`/finanzas/metodos-pago-empresa-activas/?empresa=${empresa}`));
  return data;
}
