import { useState, useEffect } from 'react';
import {
    getEspacios,
    crearEspacio,
    asignarCarro,
    liberarEspacio,
    eliminarEspacio,
    getParqueaderos,
    getCarros
} from '../../api/api';

export default function EspacioList() {
    const [espacios, setEspacios] = useState([]);
    const [parqueaderos, setParqueaderos] = useState([]);
    const [carros, setCarros] = useState([]);
    const [form, setForm] = useState({ numeroEspacio: '', idParqueadero: '' });
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargar();
        cargarParqueaderos();
        cargarCarros();
    }, []);

    const cargar = async () => {
        const data = await getEspacios();
        setEspacios(data);
    };

    const cargarParqueaderos = async () => {
        const data = await getParqueaderos();
        setParqueaderos(data);
    };

    const cargarCarros = async () => {
        const data = await getCarros();
        setCarros(data);
    };

    const handleCrear = async (e) => {
        e.preventDefault();
        const payload = {
            numeroEspacio: parseInt(form.numeroEspacio),
            idParqueadero: parseInt(form.idParqueadero)
        };
        await crearEspacio(payload);
        setMensaje('Espacio creado correctamente');
        setForm({ numeroEspacio: '', idParqueadero: '' });
        cargar();
    };

    const handleAsignar = async (idEspacio) => {
        const idCarro = prompt('Ingresa el ID del carro a asignar:');
        if (idCarro) {
            await asignarCarro(idEspacio, parseInt(idCarro));
            setMensaje('Carro asignado correctamente');
            cargar();
        }
    };

    const handleLiberar = async (idEspacio) => {
        if (window.confirm('¿Liberar este espacio?')) {
            await liberarEspacio(idEspacio);
            setMensaje('Espacio liberado correctamente');
            cargar();
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Eliminar este espacio?')) {
            await eliminarEspacio(id);
            setMensaje('Espacio eliminado correctamente');
            cargar();
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Espacios de Parqueadero</h2>

            <form onSubmit={handleCrear} style={{ marginBottom: '1rem' }}>
                <input
                    placeholder="Número de espacio"
                    value={form.numeroEspacio}
                    onChange={e => setForm({ ...form, numeroEspacio: e.target.value })}
                    required
                    type="number"
                    style={{ marginRight: '8px' }}
                />
                <select
                    value={form.idParqueadero}
                    onChange={e => setForm({ ...form, idParqueadero: e.target.value })}
                    required
                    style={{ marginRight: '8px' }}
                >
                    <option value="">-- Selecciona Parqueadero --</option>
                    {parqueaderos.map(p => (
                        <option key={p.idParqueadero} value={p.idParqueadero}>
                            {p.nombre}
                        </option>
                    ))}
                </select>
                <button type="submit">Agregar Espacio</button>
            </form>

            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f0f0f0' }}>
                    <tr>
                        <th>ID</th>
                        <th>Número</th>
                        <th>Parqueadero</th>
                        <th>Estado</th>
                        <th>Placa</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {espacios.map(e => (
                        <tr key={e.idEspacio}>
                            <td>{e.idEspacio}</td>
                            <td>{e.numeroEspacio}</td>
                            <td>{e.nombreParqueadero}</td>
                            <td style={{ color: e.idCarro ? 'red' : 'green' }}>
                                {e.idCarro ? 'Ocupado' : 'Libre'}
                            </td>
                            <td>{e.placaCarro || '-'}</td>
                            <td>
                                {!e.idCarro ? (
                                    <button
                                        onClick={() => handleAsignar(e.idEspacio)}
                                        style={{ marginRight: '8px', color: 'blue' }}
                                    >
                                        Asignar Carro
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleLiberar(e.idEspacio)}
                                        style={{ marginRight: '8px', color: 'orange' }}
                                    >
                                        Liberar
                                    </button>
                                )}
                                <button onClick={() => handleEliminar(e.idEspacio)}>
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