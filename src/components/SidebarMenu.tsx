import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SidebarMenu.css';

const SidebarMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={`sidebar-menu${collapsed ? ' collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(c => !c)}
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        {collapsed ? '▶' : '◀'}
      </button>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li>
            <details>
              <summary>Empresas</summary>
              <ul style={{ paddingLeft: 16 }}>
                <li><Link to="/empresas">Listado de empresas</Link></li>
                <li>
                  <Link to={`/empresas/${(() => {
                    try {
                      const empresaStr = localStorage.getItem('empresa');
                      if (!empresaStr) return '';
                      const empresa = JSON.parse(empresaStr);
                      return empresa.id_empresa || '';
                    } catch { return ''; }
                  })()}/sucursales`}>
                    Sucursales
                  </Link>
                </li>
                <li>
                  <Link to="/departamentos">Departamentos</Link>
                </li>
                {/* Enlace a 'Usuarios' removido del submenu 'Empresas' */}
              </ul>
            </details>
          </li>
          <li>
            <details>
              <summary>Finanzas</summary>
              <ul style={{ paddingLeft: 16 }}>
                <li><Link to="/finanzas/monedas">Monedas</Link></li>
                <li>
                  <Link to={`/empresas/${localStorage.getItem('id_empresa') || ''}/tasas-cambio`}>
                    Tasas de Cambio
                  </Link>
                </li>
                <li>
                  <Link to={`/empresas/${localStorage.getItem('id_empresa') || ''}/metodos-pago`}>
                    Métodos de Pago
                  </Link>
                </li>
                <li>
                  <Link to="/finanzas/tipos-impuesto">
                    Tipos de Impuesto
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details>
              <summary>Usuarios</summary>
              <ul style={{ paddingLeft: 16 }}>
                <li><Link to={`/empresas/${localStorage.getItem('id_empresa') || '1'}/usuarios`}>Listado de usuarios</Link></li>
                <li><Link to="/roles">Roles</Link></li>
                <li><Link to="/permisos">Permisos</Link></li>
                <li><Link to="/auditoria">Auditoría</Link></li>
                {/* Enlace a 'Perfil' removido del submenu 'Usuarios' */}
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default SidebarMenu;
