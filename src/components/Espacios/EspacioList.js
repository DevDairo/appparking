import { useState, useEffect, useMemo } from 'react';
import { getEspacios, crearEspacio, asignarCarro, liberarEspacio, eliminarEspacio, getParqueaderos, getCarros } from '../../api/api';
import { useToast } from '../../hooks/useToast';

const EMPTY_FORM = { numeroEspacio: '', idParqueadero: '' };

export default function EspacioList() {
  const [items,        setItems]        = useState([]);
  const [parqueaderos, setParqueaderos] = useState([]);
  const [carros,       setCarros]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [showModal,    setShowModal]    = useState(false);
  const [showAssign,   setShowAssign]   = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);
  const [assignCarroId,setAssignCarroId]= useState('');
  const [search,       setSearch]       = useState('');
  const [filterState,  setFilterState]  = useState('todos');
  const [saving,       setSaving]       = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    cargar();
    getParqueaderos().then(setParqueaderos).catch(()=>{});
    getCarros().then(setCarros).catch(()=>{});
  }, []);

  const cargar = async () => {
    setLoading(true);
    try { setItems(await getEspacios()); }
    catch { show('Error al cargar espacios', 'error'); }
    finally { setLoading(false); }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await crearEspacio({ numeroEspacio: parseInt(form.numeroEspacio), idParqueadero: parseInt(form.idParqueadero) });
      show('Espacio creado');
      setForm(EMPTY_FORM);
      setShowModal(false);
      cargar();
    } catch { show('Error al crear espacio', 'error'); }
    finally { setSaving(false); }
  };

  const openAssign = (espacio) => { setAssignTarget(espacio); setAssignCarroId(''); setShowAssign(true); };

  const handleAsignar = async (e) => {
    e.preventDefault();
    if (!assignCarroId) return;
    setSaving(true);
    try {
      await asignarCarro(assignTarget.idEspacio, parseInt(assignCarroId));
      show('Carro asignado al espacio');
      setShowAssign(false);
      cargar();
    } catch { show('Error al asignar carro', 'error'); }
    finally { setSaving(false); }
  };

  const handleLiberar = async (idEspacio, numero) => {
    if (!window.confirm(`¿Liberar el espacio #${numero}?`)) return;
    try {
      await liberarEspacio(idEspacio);
      show('Espacio liberado');
      cargar();
    } catch { show('Error al liberar espacio', 'error'); }
  };

  const handleEliminar = async (id, numero) => {
    if (!window.confirm(`¿Eliminar el espacio #${numero}?`)) return;
    try {
      await eliminarEspacio(id);
      show('Espacio eliminado');
      cargar();
    } catch { show('Error al eliminar', 'error'); }
  };

  const filtered = useMemo(() => {
    return items.filter(e => {
      const matchSearch =
        String(e.numeroEspacio).includes(search) ||
        (e.nombreParqueadero||'').toLowerCase().includes(search.toLowerCase()) ||
        (e.placaCarro||'').toLowerCase().includes(search.toLowerCase());
      const matchState =
        filterState === 'todos' ? true :
        filterState === 'libre' ? !e.idCarro :
        filterState === 'ocupado' ? !!e.idCarro : true;
      return matchSearch && matchState;
    });
  }, [items, search, filterState]);

  const libres   = items.filter(e => !e.idCarro).length;
  const ocupados = items.filter(e =>  e.idCarro).length;

  return (
    <div>
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            {toast.type==='success'
              ? <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              : <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>}
          </svg>
          {toast.message}
        </div>
      )}

      <div className="page-header">
        <div className="page-header__left">
          <h2 className="page-header__title">Espacios</h2>
          <p className="page-header__sub">Control y asignación de espacios de parqueadero</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
          <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
          Nuevo Espacio
        </button>
      </div>

      {/* Mini stats */}
      <div className="stats-grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',marginBottom:'1.25rem'}}>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          </div>
          <div className="stat-card__value">{items.length}</div>
          <div className="stat-card__label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green">✓</div>
          <div className="stat-card__value">{libres}</div>
          <div className="stat-card__label">Libres</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--purple">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M3 4a1 1 0 00-.82 1.573L3 6.22V15a2 2 0 002 2h.172a3 3 0 005.656 0H11a3 3 0 005.656 0H17a2 2 0 002-2v-5a1 1 0 00-.168-.557L15.088 4H3z"/></svg>
          </div>
          <div className="stat-card__value">{ocupados}</div>
          <div className="stat-card__label">Ocupados</div>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <span className="card__title">Listado ({filtered.length})</span>
          <div className="toolbar">
            <div className="search-wrap">
              <span className="search-wrap__icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>
              </span>
              <input className="search-input" placeholder="Buscar espacio, parqueadero, placa..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <select className="form-select" style={{maxWidth:140}} value={filterState} onChange={e=>setFilterState(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="libre">Libres</option>
              <option value="ocupado">Ocupados</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner"/><span>Cargando...</span></div>
          ) : filtered.length === 0 ? (
            <div className="table-empty">
              <div className="table-empty__icon">🅿️</div>
              <div className="table-empty__text">{search ? 'No hay resultados' : 'No hay espacios registrados'}</div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>N° Espacio</th>
                  <th>Parqueadero</th>
                  <th>Estado</th>
                  <th>Placa</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.idEspacio}>
                    <td className="td-id">#{e.idEspacio}</td>
                    <td style={{fontFamily:'monospace',fontWeight:600}}>{String(e.numeroEspacio).padStart(2,'0')}</td>
                    <td style={{color:'var(--text-secondary)'}}>{e.nombreParqueadero}</td>
                    <td>
                      {e.idCarro
                        ? <span className="badge badge--red"><span className="badge__dot"/>Ocupado</span>
                        : <span className="badge badge--green"><span className="badge__dot"/>Libre</span>
                      }
                    </td>
                    <td>
                      {e.placaCarro
                        ? <span style={{fontFamily:'monospace',fontWeight:600,background:'var(--bg-elevated)',padding:'2px 8px',borderRadius:4,border:'1px solid var(--border)',letterSpacing:'0.08em',fontSize:'0.82rem'}}>{e.placaCarro}</span>
                        : <span style={{color:'var(--text-muted)'}}>—</span>
                      }
                    </td>
                    <td>
                      <div className="td-actions">
                        {!e.idCarro ? (
                          <button className="btn btn--success btn--sm" onClick={() => openAssign(e)}>
                            <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
                            Asignar
                          </button>
                        ) : (
                          <button className="btn btn--warning btn--sm" onClick={() => handleLiberar(e.idEspacio, e.numeroEspacio)}>
                            <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                            Liberar
                          </button>
                        )}
                        <button className="btn btn--danger btn--sm" onClick={() => handleEliminar(e.idEspacio, e.numeroEspacio)}>
                          <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="pagination">
          <span>Mostrando {filtered.length} de {items.length} espacios</span>
        </div>
      </div>

      {/* Modal Nuevo Espacio */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal__header">
              <span className="modal__title">Nuevo Espacio</span>
              <button className="modal__close" onClick={() => setShowModal(false)}>
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </button>
            </div>
            <form onSubmit={handleCrear}>
              <div className="modal__body">
                <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  <div className="form-field">
                    <label className="form-label">Número de espacio *</label>
                    <input type="number" className="form-input" placeholder="Ej: 15" min="1" value={form.numeroEspacio} onChange={e=>setForm({...form,numeroEspacio:e.target.value})} required/>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Parqueadero *</label>
                    <select className="form-select" value={form.idParqueadero} onChange={e=>setForm({...form,idParqueadero:e.target.value})} required>
                      <option value="">-- Seleccionar parqueadero --</option>
                      {parqueaderos.map(p => <option key={p.idParqueadero} value={p.idParqueadero}>{p.nombre}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? <span className="login-spinner" style={{width:16,height:16,borderWidth:2}}/> : 'Crear Espacio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Asignar Carro */}
      {showAssign && assignTarget && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowAssign(false)}>
          <div className="modal">
            <div className="modal__header">
              <span className="modal__title">Asignar Carro — Espacio #{String(assignTarget.numeroEspacio).padStart(2,'0')}</span>
              <button className="modal__close" onClick={() => setShowAssign(false)}>
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </button>
            </div>
            <form onSubmit={handleAsignar}>
              <div className="modal__body">
                <div className="form-field">
                  <label className="form-label">Seleccionar carro *</label>
                  <select className="form-select" value={assignCarroId} onChange={e=>setAssignCarroId(e.target.value)} required>
                    <option value="">-- Seleccionar carro --</option>
                    {carros.map(c => <option key={c.idCarro} value={c.idCarro}>{c.placa} — {c.nombreMarca} {c.color}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowAssign(false)}>Cancelar</button>
                <button type="submit" className="btn btn--primary" disabled={saving||!assignCarroId}>
                  {saving ? <span className="login-spinner" style={{width:16,height:16,borderWidth:2}}/> : 'Asignar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
