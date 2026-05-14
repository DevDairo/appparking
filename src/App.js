import { useState } from 'react';
import PropietarioList from './components/Propietarios/PropietarioList';
import ParqueaderoList from './components/Parqueaderos/ParqueaderoList';
import CarroList from './components/Carros/CarroList';
import EspacioList from './components/Espacios/EspacioList';

function App() {
    const [modulo, setModulo] = useState('propietarios');

    const estiloNav = {
        backgroundColor: '#1a1a2e',
        padding: '1rem',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
    };

    const estiloBoton = (nombre) => ({
        padding: '8px 16px',
        backgroundColor: modulo === nombre ? '#e94560' : '#16213e',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: modulo === nombre ? 'bold' : 'normal'
    });

    const estiloTitulo = {
        color: 'white',
        margin: '0',
        marginRight: '20px',
        fontSize: '1.3rem'
    };

    return (
        <div>
            <nav style={estiloNav}>
                <h1 style={estiloTitulo}>AppParking</h1>
                <button
                    style={estiloBoton('propietarios')}
                    onClick={() => setModulo('propietarios')}
                >
                    Propietarios
                </button>
                <button
                    style={estiloBoton('parqueaderos')}
                    onClick={() => setModulo('parqueaderos')}
                >
                    Parqueaderos
                </button>
                <button
                    style={estiloBoton('carros')}
                    onClick={() => setModulo('carros')}
                >
                    Carros
                </button>
                <button
                    style={estiloBoton('espacios')}
                    onClick={() => setModulo('espacios')}
                >
                    Espacios
                </button>
            </nav>

            <div style={{ padding: '1rem' }}>
                {modulo === 'propietarios' && <PropietarioList />}
                {modulo === 'parqueaderos' && <ParqueaderoList />}
                {modulo === 'carros' && <CarroList />}
                {modulo === 'espacios' && <EspacioList />}
            </div>
        </div>
    );
}

export default App;