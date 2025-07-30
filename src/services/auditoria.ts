import type { AuditLog } from '../pages/Core/Auditoria/AuditLogListPage';

// Utilidad local para obtener el token JWT del localStorage
function getToken(): string | null {
  return localStorage.getItem('token');
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchAuditLogs(): Promise<AuditLog[] | { results: AuditLog[] }> {
  const token = getToken();
  const res = await fetch(`${API_URL}/auditoria/logs-auditoria/`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
