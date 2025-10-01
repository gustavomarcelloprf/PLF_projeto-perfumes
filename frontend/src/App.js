import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Catalogo from './pages/Catalogo';
import Admin from './pages/Admin';
import AddPerfume from './pages/AddPerfume';
import EditPerfume from './pages/EditPerfume';
import Footer from './components/Footer'; // Importa o rodapé
import './App.css';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <nav className="navbar">
          <Link to="/" className="nav-logo-link">
            <img src="/logo.png" alt="Logo da loja" className="navbar-logo" />
          </Link>
          <Link to="/" className="nav-link">Catálogo</Link>
        </nav>

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/admin/add" element={<AddPerfume />} />
            <Route path="/admin/edit/:perfumeId" element={<EditPerfume />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<Catalogo />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;