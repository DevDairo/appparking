import './Layout.css';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Inicio',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
    ),
  },
  {
    id: 'propietarios',
    label: 'Propietarios',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
    ),
  },
  {
    id: 'parqueaderos',
    label: 'Parqueaderos',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/></svg>
    ),
  },
  {
    id: 'carros',
    label: 'Carros',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M3 4a1 1 0 00-.82 1.573L3 6.22V15a2 2 0 002 2h.172a3 3 0 005.656 0H11a3 3 0 005.656 0H17a2 2 0 002-2v-5a1 1 0 00-.168-.557L15.088 4H3zm3.083 2h7.834l2.5 4H3.583l2.5-4z"/></svg>
    ),
  },
  {
    id: 'espacios',
    label: 'Espacios',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
    ),
  },
];

export default function Layout({ children, activeModule, onNavigate, user, onLogout }) {
  return (
    <div className="layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".15"/>
              <text x="7.5" y="16.5" fontSize="11" fontWeight="800" fill="currentColor" fontFamily="sans-serif">P</text>
            </svg>
          </div>
          <div className="sidebar__logo-text">
            <span className="sidebar__brand">PARKING</span>
            <span className="sidebar__sub">SYSTEM</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          <p className="sidebar__section-label">MENÚ</p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`sidebar__item ${activeModule === item.id ? 'sidebar__item--active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="sidebar__item-icon">{item.icon}</span>
              <span className="sidebar__item-label">{item.label}</span>
              {activeModule === item.id && <span className="sidebar__item-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user.username}</span>
              <span className="sidebar__user-role">{user.role}</span>
            </div>
          </div>
          <button className="sidebar__logout" onClick={onLogout} title="Cerrar sesión">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main">
        <div className="main__content fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
