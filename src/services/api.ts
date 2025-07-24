export async function put<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
  return fetcher<T>(endpoint, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
// Servicio compartido para llamadas a la API
export const API_URL = 'http://localhost:8000/api'; // Ajusta según tu backend

export async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function get<T>(endpoint: string): Promise<T> {
  return fetcher<T>(endpoint);
}

export async function post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
  return fetcher<T>(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
