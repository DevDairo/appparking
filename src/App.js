import { useState } from 'react';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import PropietarioList from './components/Propietarios/PropietarioList';
import ParqueaderoList from './components/Parqueaderos/ParqueaderoList';
import CarroList from './components/Carros/CarroList';
import EspacioList from './components/Espacios/EspacioList';
import './styles/globals.css';
import './styles/components.css';

export default function App() {
  const [user,   setUser]   = useState(null);   // null = not logged in
  const [module, setModule] = useState('dashboard');

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const renderModule = () => {
    switch (module) {
      case 'dashboard':     return <Dashboard onNavigate={setModule} />;
      case 'propietarios':  return <PropietarioList />;
      case 'parqueaderos':  return <ParqueaderoList />;
      case 'carros':        return <CarroList />;
      case 'espacios':      return <EspacioList />;
      default:              return <Dashboard onNavigate={setModule} />;
    }
  };

  return (
    <Layout
      activeModule={module}
      onNavigate={setModule}
      user={user}
      onLogout={() => setUser(null)}
    >
      {renderModule()}
    </Layout>
  );
}
