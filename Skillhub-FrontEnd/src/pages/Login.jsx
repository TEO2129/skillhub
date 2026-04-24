import { useState } from 'react';
import { login } from '../services/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>SkillHub</h1>
        <h2 style={styles.title}>Connexion</h2>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.fr"
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Mot de passe</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            style={loading ? {...styles.btn, opacity: 0.7} : styles.btn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  card: {
    background: 'white', borderRadius: '0.75rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    padding: '2.5rem', width: '100%', maxWidth: '420px',
  },
  logo: { color: '#6c5ce7', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem' },
  title: { fontSize: '1.25rem', textAlign: 'center', color: '#374151', marginBottom: '1.5rem' },
  error: { background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  group: { display: 'flex', flexDirection: 'column', gap: '0.375rem' },
  label: { fontWeight: '600', fontSize: '0.875rem', color: '#374151' },
  input: { padding: '0.625rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', outline: 'none' },
  btn: { background: '#6c5ce7', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', border: 'none', marginTop: '0.5rem' },
};

export default Login;