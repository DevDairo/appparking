import { useState, useEffect } from 'react';
import {
    getParqueaderos,
    crearParqueadero,
    actualizarParqueadero,
    eliminarParqueadero
} from '../../api/api';

export default function ParqueaderoList() {
    const [parqueaderos, setParqueaderos] = useState([]);
    const [form, setForm] = useState({ nombre: '', direccion: '' });
    const [editando, setEditando] = useState(null);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargar();
    }, []);

    const cargar = async () => {
        const data = await getParqueaderos();
        setParqueaderos(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editando) {
            await actualizarParqueadero({ ...form, idParqueadero: editando.idParqueadero });
            setMensaje('Parqueadero actualizado correctamente');
        } else {
            await crearParqueadero(form);
            setMensaje('Parqueadero creado correctamente');
        }
        setForm({ nombre: '', direccion: '' });
        setEditando(null);
        cargar();
    };

    const handleEditar = (p) => {
        setEditando(p);
        setForm({ nombre: p.nombre, direccion: p.direccion });
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Eliminar este parqueadero?')) {
            await eliminarParqueadero(id);
            setMensaje('Parqueadero eliminado correctamente');
            cargar();
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Parqueaderos</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
                <input
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    required
                    style={{ marginRight: '8px' }}
                />
                <input
                    placeholder="Dirección"
                    value={form.direccion}
                    onChange={e => setForm({ ...form, direccion: e.target.value })}
                    required
                    style={{ marginRight: '8px' }}
                />
                <button type="submit">
                    {editando ? 'Actualizar' : 'Agregar'}
                </button>
                {editando && (
                    <button type="button" onClick={() => {
                        setEditando(null);
                        setForm({ nombre: '', direccion: '' });
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
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {parqueaderos.map(p => (
                        <tr key={p.idParqueadero}>
                            <td>{p.idParqueadero}</td>
                            <td>{p.nombre}</td>
                            <td>{p.direccion}</td>
                            <td>
                                <button onClick={() => handleEditar(p)} style={{ marginRight: '8px' }}>
                                    Editar
                                </button>
                                <button onClick={() => handleEliminar(p.idParqueadero)}>
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