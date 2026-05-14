import { useState, useEffect, useMemo } from 'react';
import { getPropietarios, crearPropietario, actualizarPropietario, eliminarPropietario } from '../../api/api';
import { useToast } from '../../hooks/useToast';

const EMPTY = { nombre: '', documento: '', telefono: '' };

export default function PropietarioList() {
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [form,      setForm]      = useState(EMPTY);
  const [editando,  setEditando]  = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search,    setSearch]    = useState('');
  const [saving,    setSaving]    = useState(false);
  const { toast, show } = useToast();

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setLoading(true);
    try { setItems(await getPropietarios()); }
    catch { show('Error al cargar propietarios', 'error'); }
    finally { setLoading(false); }
  };

  const openNew  = () => { setForm(EMPTY); setEditando(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ nombre: p.nombre, documento: p.documento, telefono: p.telefono }); setEditando(p); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditando(null); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editando) {
        await actualizarPropietario({ ...form, idPropietario: editando.idPropietario });
        show('Propietario actualizado correctamente');
      } else {
        await crearPropietario(form);
        show('Propietario registrado correctamente');
      }
      closeModal();
      cargar();
    } catch { show('Error al guardar propietario', 'error'); }
    finally { setSaving(false); }
  };

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar al propietario "${nombre}"?`)) return;
    try {
      await eliminarPropietario(id);
      show('Propietario eliminado');
      cargar();
    } catch { show('Error al eliminar', 'error'); }
  };

  const filtered = useMemo(() =>
    items.filter(p =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.documento.includes(search) ||
      p.telefono.includes(search)
    ), [items, search]);

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            {toast.type === 'success'
              ? <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              : <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>}
          </svg>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="page-header__left">
          <h2 className="page-header__title">Propietarios</h2>
          <p className="page-header__sub">Gestiona los propietarios registrados en el sistema</p>
        </div>
        <button className="btn btn--primary" onClick={openNew}>
          <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
          Nuevo Propietario
        </button>
      </div>

      {/* Card */}
      <div className="card">
        <div className="card__header">
          <span className="card__title">Listado ({filtered.length})</span>
          <div className="toolbar">
            <div className="search-wrap">
              <span className="search-wrap__icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>
              </span>
              <input className="search-input" placeholder="Buscar por nombre, documento..." value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
          </div>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner"/><span>Cargando...</span></div>
          ) : filtered.length === 0 ? (
            <div className="table-empty">
              <div className="table-empty__icon">👤</div>
              <div className="table-empty__text">{search ? 'No hay resultados para tu búsqueda' : 'No hay propietarios registrados'}</div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Documento</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.idPropietario}>
                    <td className="td-id">#{p.idPropietario}</td>
                    <td style={{fontWeight:500}}>{p.nombre}</td>
                    <td>{p.documento}</td>
                    <td>{p.telefono}</td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn--ghost btn--sm" onClick={() => openEdit(p)}>
                          <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                          Editar
                        </button>
                        <button className="btn btn--danger btn--sm" onClick={() => handleEliminar(p.idPropietario, p.nombre)}>
                          <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                          Eliminar
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
          <span>Total: {filtered.length} propietarios registrados</span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal__header">
              <span className="modal__title">{editando ? 'Editar Propietario' : 'Nuevo Propietario'}</span>
              <button className="modal__close" onClick={closeModal}>
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                <div className="form-grid form-grid--1" style={{gap:'1rem'}}>
                  <div className="form-field">
                    <label className="form-label">Nombre completo *</label>
                    <input className="form-input" placeholder="Ej: Juan Pérez" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} required/>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Documento de identidad *</label>
                    <input className="form-input" placeholder="Ej: 1234567890" value={form.documento} onChange={e=>setForm({...form,documento:e.target.value})} required/>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Teléfono *</label>
                    <input className="form-input" placeholder="Ej: 3001234567" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})} required/>
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? <span className="login-spinner" style={{width:16,height:16,borderWidth:2}}/> : (editando ? 'Actualizar' : 'Registrar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
