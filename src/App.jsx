// Para definir que elementos existen en la pantalla.

// Importacion para que le diga al jsx como se ven los elementos.
import './App.css';

import logoHuella from './assets/huella.png'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import MessagesPage from "./pages/MessagesPage.jsx";

// App principal.
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <TopBar onMenuClick={() => setMenuVisible(true)} />
        </header>

        <Routes>
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>



      </div>
    </BrowserRouter>
  );
}

export default App;