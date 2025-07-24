import React from 'react';
import { DashboardCard } from '../components/DashboardCard';
import { Card } from '../components/Card';

interface DashboardPageProps {
  user: {
    first_name: string;
    last_name: string;
    roles: { id: number; name: string }[];
  };
  empresa: { nombre: string };
  sucursal: { nombre: string };
  actividades: { id: number; descripcion: string; fecha: string }[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, empresa, sucursal, actividades }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f0ff 0%, #f6fafd 100%)',
      padding: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 900,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '32px 24px',
        margin: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#1976d2' }}>
          Bienvenido, {user.first_name} {user.last_name}
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <DashboardCard title="Empresa" value={empresa.nombre} />
          <DashboardCard title="Sucursal" value={sucursal.nombre} />
          <Card>
            <h4>Roles asignados</h4>
            <ul style={{ paddingLeft: 0, margin: 0 }}>
              {user.roles.map(role => (
                <li key={role.id} style={{ listStyle: 'none', marginBottom: 4 }}>
                  <span style={{ background: '#e3f0ff', borderRadius: 4, padding: '2px 8px' }}>{role.name}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <Card>
          <h4>Actividades recientes</h4>
          <ul style={{ paddingLeft: 0, margin: 0 }}>
            {actividades.map(act => (
              <li key={act.id} style={{ listStyle: 'none', marginBottom: 4 }}>
                <span style={{ color: '#1976d2', fontWeight: 500 }}>{act.descripcion}</span> - {act.fecha}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
