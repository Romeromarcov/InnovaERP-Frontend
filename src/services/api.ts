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
  const token = localStorage.getItem('token');
  const isAuthEndpoint = endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(!isAuthEndpoint && token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {})
  };
  const isAbsolute = endpoint.startsWith('http://') || endpoint.startsWith('https://');
  const url = isAbsolute ? endpoint : `${API_URL}${endpoint}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorText = await res.text();
    let errorObj;
    try {
      errorObj = JSON.parse(errorText);
    } catch {
      errorObj = { error: errorText };
    }
    throw new Error(JSON.stringify(errorObj));
  }
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

export async function patch<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
  return fetcher<T>(endpoint, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
