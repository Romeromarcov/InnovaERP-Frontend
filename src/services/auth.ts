import { post, get } from './api';
import type { Usuario } from './users';

export async function fetchMe(): Promise<Usuario> {
  return get<Usuario>('/core/usuarios/me/');
}

export async function loginAndFetchUser(username: string, password: string): Promise<{ token: string; usuario: Usuario }> {
  const res = await post<{ access: string }>('/auth/login/', { username, password });
  localStorage.setItem('token', res.access);
  // Obtener el usuario autenticado
  const usuario = await fetchMe();
  localStorage.setItem('usuario', JSON.stringify(usuario));
  return { token: res.access, usuario };
}
