// Para definir que elementos existen en la pantalla.

// Importacion para que le diga al jsx como se ven los elementos.
import './App.css';

import logoHuella from './assets/huella.png'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import Shelter from './pages/Shelter';
import Search from './pages/Search';

// App principal.
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <TopBar/>
        </header>

          <main className="content">
          <Routes>
            {/* Ruta para el Inicio */}
            <Route path="/" element={
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Página de registro de mascotas</h1>
                <p>Bienvenido al sistema.</p>
              </div>
            } />

            {/* Ruta para la pagina de Refugios */}
            <Route path="/refugios" element={<Shelter />} />

            {/*Ruta para la pagina de busqueda*/}
            <Route path="/buscar" element={<Search />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;