import { useState, useEffect } from 'react';
import {
    getPropietarios,
    crearPropietario,
    actualizarPropietario,
    eliminarPropietario
} from '../../api/api';

export default function PropietarioList() {
    const [propietarios, setPropietarios] = useState([]);
    const [form, setForm] = useState({ nombre: '', documento: '', telefono: '' });
    const [editando, setEditando] = useState(null);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargar();
    }, []);

    const cargar = async () => {
        const data = await getPropietarios();
        setPropietarios(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editando) {
            await actualizarPropietario({ ...form, idPropietario: editando.idPropietario });
            setMensaje('Propietario actualizado correctamente');
        } else {
            await crearPropietario(form);
            setMensaje('Propietario creado correctamente');
        }
        setForm({ nombre: '', documento: '', telefono: '' });
        setEditando(null);
        cargar();
    };

    const handleEditar = (p) => {
        setEditando(p);
        setForm({ nombre: p.nombre, documento: p.documento, telefono: p.telefono });
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Eliminar este propietario?')) {
            await eliminarPropietario(id);
            setMensaje('Propietario eliminado correctamente');
            cargar();
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Propietarios</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
                <input
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    required
                    style={{ marginRight: '8px' }}
                />
                <input
                    placeholder="Documento"
                    value={form.documento}
                    onChange={e => setForm({ ...form, documento: e.target.value })}
                    required
                    style={{ marginRight: '8px' }}
                />
                <input
                    placeholder="Teléfono"
                    value={form.telefono}
                    onChange={e => setForm({ ...form, telefono: e.target.value })}
                    required
                    style={{ marginRight: '8px' }}
                />
                <button type="submit">
                    {editando ? 'Actualizar' : 'Agregar'}
                </button>
                {editando && (
                    <button type="button" onClick={() => {
                        setEditando(null);
                        setForm({ nombre: '', documento: '', telefono: '' });
                    }} style={{ marginLeft: '8px' }}>
                        Cancelar
                    </button>
                )}
            </form>

            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f0f0f0' }}>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Documento</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {propietarios.map(p => (
                        <tr key={p.idPropietario}>
                            <td>{p.idPropietario}</td>
                            <td>{p.nombre}</td>
                            <td>{p.documento}</td>
                            <td>{p.telefono}</td>
                            <td>
                                <button onClick={() => handleEditar(p)} style={{ marginRight: '8px' }}>
                                    Editar
                                </button>
                                <button onClick={() => handleEliminar(p.idPropietario)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}