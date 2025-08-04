// Servicio para obtener monedas activas por empresa
export async function fetchMonedasEmpresaActivas(empresa: string) {
  // Usar el fetcher del servicio api.ts para evitar duplicar 'api' en la URL
  // Solo pasar la ruta relativa
  const data = await import('./api').then(api => api.fetcher(`/finanzas/monedas-empresa-activas/?empresa=${empresa}`));
  return data;
}
