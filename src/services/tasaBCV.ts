// Servicio para obtener la tasa oficial BCV
export async function fetchTasaBCV(moneda_origen = 'USD', moneda_destino = 'VES', fecha?: string) {
  let url = `/finanzas/tasa-oficial-bcv/?moneda_origen=${moneda_origen}&moneda_destino=${moneda_destino}`;
  if (fecha) url += `&fecha=${fecha}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al obtener tasa BCV');
  return response.json();
}
