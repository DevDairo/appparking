import { useState, useEffect } from 'react';
import { getCarros, getParqueaderos, getEspacios, getPropietarios } from '../../api/api';
import './Dashboard.css';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({ carros: 0, parqueaderos: 0, espacios: 0, libres: 0, ocupados: 0, propietarios: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCarros(), getParqueaderos(), getEspacios(), getPropietarios()])
      .then(([carros, parqueaderos, espacios, propietarios]) => {
        const libres   = espacios.filter(e => !e.idCarro).length;
        const ocupados = espacios.filter(e =>  e.idCarro).length;
        setStats({ carros: carros.length, parqueaderos: parqueaderos.length, espacios: espacios.length, libres, ocupados, propietarios: propietarios.length });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pct = stats.espacios > 0 ? Math.round((stats.ocupados / stats.espacios) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header__left">
          <h2 className="page-header__title">Bienvenido 👋</h2>
          <p className="page-header__sub">Resumen general del sistema de parqueadero</p>
        </div>
        <span className="dash-date">{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /><span>Cargando estadísticas...</span></div>
      ) : (
        <>
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--blue">
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M3 4a1 1 0 00-.82 1.573L3 6.22V15a2 2 0 002 2h.172a3 3 0 005.656 0H11a3 3 0 005.656 0H17a2 2 0 002-2v-5a1 1 0 00-.168-.557L15.088 4H3zm3.083 2h7.834l2.5 4H3.583l2.5-4z"/></svg>
              </div>
              <div className="stat-card__value">{stats.carros}</div>
              <div className="stat-card__label">Carros Registrados</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--green">
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/></svg>
              </div>
              <div className="stat-card__value">{stats.parqueaderos}</div>
              <div className="stat-card__label">Parqueaderos Activos</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--yellow">
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              </div>
              <div className="stat-card__value">{stats.espacios}</div>
              <div className="stat-card__label">Espacios Totales</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--purple">
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
              </div>
              <div className="stat-card__value">{stats.propietarios}</div>
              <div className="stat-card__label">Propietarios</div>
            </div>
          </div>

          {/* Occupation + Quick access */}
          <div className="dash-grid">
            {/* Occupation gauge */}
            <div className="card">
              <div className="card__header"><span className="card__title">Ocupación Actual</span></div>
              <div className="card__body dash-occ">
                <div className="occ-ring">
                  <svg viewBox="0 0 120 120" width="120" height="120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-elevated)" strokeWidth="12"/>
                    <circle
                      cx="60" cy="60" r="50"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                      transform="rotate(-90 60 60)"
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                    <text x="60" y="55" textAnchor="middle" fill="var(--text-primary)" fontSize="20" fontWeight="700" fontFamily="Syne">{pct}%</text>
                    <text x="60" y="72" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="DM Sans">Ocupado</text>
                  </svg>
                </div>
                <div className="occ-stats">
                  <div className="occ-stat">
                    <span className="badge badge--red"><span className="badge__dot"/>Ocupados</span>
                    <span className="occ-stat__val">{stats.ocupados}</span>
                  </div>
                  <div className="occ-stat">
                    <span className="badge badge--green"><span className="badge__dot"/>Libres</span>
                    <span className="occ-stat__val">{stats.libres}</span>
                  </div>
                  <div className="occ-stat">
                    <span style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>Total</span>
                    <span className="occ-stat__val">{stats.espacios}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card__header"><span className="card__title">Acceso Rápido</span></div>
              <div className="card__body dash-quick">
                {[
                  { id:'propietarios', label:'Propietarios', desc:'Gestionar propietarios', color:'blue' },
                  { id:'carros',       label:'Carros',        desc:'Registrar vehículos',    color:'purple' },
                  { id:'parqueaderos', label:'Parqueaderos',  desc:'Administrar sedes',       color:'green' },
                  { id:'espacios',     label:'Espacios',      desc:'Control de espacios',     color:'yellow' },
                ].map(q => (
                  <button key={q.id} className={`quick-btn quick-btn--${q.color}`} onClick={() => onNavigate(q.id)}>
                    <span className="quick-btn__label">{q.label}</span>
                    <span className="quick-btn__desc">{q.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
