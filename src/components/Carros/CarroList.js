import { useState, useEffect } from 'react';
import {
    getCarros,
    crearCarro,
    actualizarCarro,
    eliminarCarro,
    getMarcas,
    getPropietarios
} from '../../api/api';

export default function CarroList() {
    const [carros, setCarros] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [propietarios, setPropietarios] = useState([]);
    const [form, setForm] = useState({ placa: '', color: '', idMarca: '', idPropietario: '' });
    const [editando, setEditando] = useState(null);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargar();
        cargarMarcas();
        cargarPropietarios();
    }, []);

    const cargar = async () => {
        const data = await getCarros();
        setCarros(data);
    };

    const cargarMarcas = async () => {
        const data = await getMarcas();
        setMarcas(data);
    };

    const cargarPropietarios = async () => {
        const data = await getPropietarios();
        setPropietarios(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            idMarca: parseInt(form.idMarca),
            idPropietario: parseInt(form.idPropietario)
        };
        if (editando) {
            await actualizarCarro({ ...payload, idCarro: editando.idCarro });
            setMensaje('Carro actualizado correctamente');
        } else {
            await crearCarro(payload);
            setMensaje('Carro creado correctamente');
        }
        setForm({ placa: '', color: '', idMarca: '', idPropietario: '' });
        setEditando(null);
        cargar();
    };

    const handleEditar = (c) => {
        setEditando(c);
        setForm({
            placa: c.placa,
            color: c.color,
            idMarca: c.idMarca,
            idPropietario: c.idPropietario
        });
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Eliminar este carro?')) {
            await eliminarCarro(id);
            setMensaje('Carro eliminado correctamente');
            cargar();
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Carros</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
                <input
                    placeholder="Placa"
                    value={form.placa}
                    onChange={e => setForm({ ...form, placa: e.target.value })}
                    required
                    style={{ marginRight: '8px' }}
                />
                <input
                    placeholder="Color"
                    value={form.color}
                    onChange={e => setForm({ ...form, color: e.target.value })}
                    required
                    style={{ marginRight: '8px' }}
                />
                <select
                    value={form.idMarca}
                    onChange={e => setForm({ ...form, idMarca: e.target.value })}
                    required
                    style={{ marginRight: '8px' }}
                >
                    <option value="">-- Selecciona Marca --</option>
                    {marcas.map(m => (
                        <option key={m.idMarca} value={m.idMarca}>
                            {m.nombreMarca}
                        </option>
                    ))}
                </select>
                <select
                    value={form.idPropietario}
                    onChange={e => setForm({ ...form, idPropietario: e.target.value })}
                    required
                    style={{ marginRight: '8px' }}
                >
                    <option value="">-- Selecciona Propietario --</option>
                    {propietarios.map(p => (
                        <option key={p.idPropietario} value={p.idPropietario}>
                            {p.nombre}
                        </option>
                    ))}
                </select>
                <button type="submit">
                    {editando ? 'Actualizar' : 'Agregar'}
                </button>
                {editando && (
                    <button type="button" onClick={() => {
                        setEditando(null);
                        setForm({ placa: '', color: '', idMarca: '', idPropietario: '' });
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
                        <th>Placa</th>
                        <th>Color</th>
                        <th>Marca</th>
                        <th>Propietario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {carros.map(c => (
                        <tr key={c.idCarro}>
                            <td>{c.idCarro}</td>
                            <td>{c.placa}</td>
                            <td>{c.color}</td>
                            <td>{c.nombreMarca}</td>
                            <td>{c.nombrePropietario}</td>
                            <td>
                                <button onClick={() => handleEditar(c)} style={{ marginRight: '8px' }}>
                                    Editar
                                </button>
                                <button onClick={() => handleEliminar(c.idCarro)}>
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