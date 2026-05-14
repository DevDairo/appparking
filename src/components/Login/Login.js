import { useState } from 'react';
import './Login.css';

// ── Credenciales definidas en frontend (sin backend) ──────────────
const VALID_USERS = [
  { username: 'admin',    password: 'admin123',   role: 'Administrador' },
  { username: 'operador', password: 'parking2024', role: 'Operador'       },
];
// ─────────────────────────────────────────────────────────────────

export default function Login({ onLogin }) {
  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulación de delay de red
    setTimeout(() => {
      const match = VALID_USERS.find(
        u => u.username === form.username.trim() &&
             u.password === form.password
      );
      if (match) {
        onLogin({ username: match.username, role: match.role });
      } else {
        setError('Usuario o contraseña incorrectos.');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="login-root">
      {/* Background grid */}
      <div className="login-bg">
        <div className="login-bg__grid" />
        <div className="login-bg__blob login-bg__blob--1" />
        <div className="login-bg__blob login-bg__blob--2" />
      </div>

      <div className="login-card fade-in">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" opacity=".2"/>
              <text x="8.5" y="11.5" fontSize="8" fontWeight="800" fill="currentColor" fontFamily="sans-serif">P</text>
              <rect x="3" y="17" width="18" height="2.5" rx="1.25" fill="currentColor" opacity=".35"/>
            </svg>
          </div>
          <div className="login-logo__text">
            <span className="login-logo__brand">PARKING</span>
            <span className="login-logo__sub">SYSTEM</span>
          </div>
        </div>

        <h1 className="login-title">Iniciar Sesión</h1>
        <p className="login-desc">Ingresa tus credenciales para continuar</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="login-field">
            <label className="login-label" htmlFor="username">Usuario</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </span>
              <input
                id="username"
                type="text"
                className="login-input"
                placeholder="Ingresa tu usuario"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label" htmlFor="password">Contraseña</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
              </span>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                className="login-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPw
                  ? <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                  : <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
                }
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`login-btn ${loading ? 'login-btn--loading' : ''}`}
            disabled={loading}
          >
            {loading
              ? <span className="login-spinner" />
              : 'Ingresar'
            }
          </button>
        </form>

        <p className="login-hint">
          Demo: <code>admin</code> / <code>admin123</code>
        </p>

        <p className="login-footer">© 2024 Parking System — Todos los derechos reservados</p>
      </div>
    </div>
  );
}
