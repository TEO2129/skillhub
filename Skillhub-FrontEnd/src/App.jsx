import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Partager/Navbar';
import Footer from './components/Partager/Footer';
import ApprenantDashboard from './pages/ApprenantDashboard';
import FormateurDashboard from './pages/FormateurDashboard';
import Login from './pages/Login';
import { api, logout } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      api.get('/profile')
        .then(res => setUser(JSON.parse(savedUser)))
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  // Pendant la vérification du token, afficher un loader
  if (checking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} />;

  const isFormateur = user.role === 'FORMATEUR';

  return (
    <div>
      <Navbar
        userName={`${user.prenom} ${user.nom}`}
        onLogout={handleLogout}
      />
      <main className="main-container">
        <Routes>
          <Route path="/" element={
            <Navigate to={isFormateur ? '/formateur' : '/apprenant'} replace />
          } />
          <Route path="/apprenant" element={
            isFormateur ? <Navigate to="/formateur" /> : <ApprenantDashboard />
          } />
          <Route path="/formateur" element={
            isFormateur ? <FormateurDashboard /> : <Navigate to="/apprenant" />
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;