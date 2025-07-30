// Servicio para obtener usuarios (solo id y username)
export type Usuario = { id: number; username: string };


// Utilidad local para obtener el token JWT del localStorage
function getToken(): string | null {
  return localStorage.getItem('token');
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchUsuarios(id_empresa?: string): Promise<Usuario[] | { results: Usuario[] }> {
  const token = getToken();
  let url = `${API_URL}/core/usuarios/`;
  if (id_empresa) {
    url += `?empresa=${encodeURIComponent(id_empresa)}`;
  }
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
