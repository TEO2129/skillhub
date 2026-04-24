import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gestion des erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Transformation des données Laravel → format React (CORRIGÉ)
const mapFormation = (f) => ({
  id: f.id,
  title: f.titre,                    
  description: f.description,
  category: f.categorie || 'Développement',
  level: f.niveau === 'debutant' ? 'Débutant'
        : f.niveau === 'intermediaire' ? 'Intermédiaire'
        : f.niveau === 'avance' ? 'Avancé'
        : f.niveau || 'Débutant',
  instructor: f.formateur?.nom || 'Inconnu',
  date: new Date(f.created_at).toLocaleDateString('fr-FR') || 'Date non définie',
  duration: f.duree_heures ? `${f.duree_heures}h` : 'Non défini',
  prix: parseFloat(f.prix) || 0,
  status: f.nombre_de_vues > 0 ? 'Popular' : 'À venir',
  participants: f.inscriptions_count || 0,
  maxParticipants: 20,
  format: 'En ligne',               
  views: f.nombre_de_vues || 0,
  created_at: f.created_at,
  formateur_id: f.formateur_id,
  original: f
});

// AUTHENTIFICATION

export const register = async (userData) => {
  const res = await api.post('/register', userData);
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
};

export const login = async (email, password) => {
  const res = await api.post('/login', { email, password });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
};

export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (e) {
    console.error('Logout error:', e);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getProfile = () => api.get('/user').then(r => r.data);

// FORMATIONS

export const getFormations = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.categorie) params.append('categorie', filters.categorie);
  if (filters.niveau) params.append('niveau', filters.niveau);
  
  const response = await api.get('/formations', { params });
  if (Array.isArray(response.data)) {
    return response.data.map(mapFormation);
  }
  return [];
};

export const getFormationById = async (id) => {
  const response = await api.get(`/formations/${id}`);
  return mapFormation(response.data);
};

export const getMesFormations = async () => {
  const response = await api.get('/mes-formations');
  if (Array.isArray(response.data)) {
    return response.data.map(mapFormation);
  }
  return [];
};

export const createFormation = async (data) => {
  const response = await api.post('/formations', {
    titre: data.title,
    description: data.description,
    categorie: data.category,
    niveau: data.level === 'Débutant' ? 'debutant' 
           : data.level === 'Intermédiaire' ? 'intermediaire' 
           : 'avance',
    prix: data.prix,
    duree_heures: parseInt(data.duration) || 4
  });
  return mapFormation(response.data);
};

export const updateFormation = async (id, data) => {
  const response = await api.put(`/formations/${id}`, {
    titre: data.title,
    description: data.description,
    categorie: data.category,
    niveau: data.level === 'Débutant' ? 'debutant' 
           : data.level === 'Intermédiaire' ? 'intermediaire' 
           : 'avance',
    prix: data.prix,
    duree_heures: parseInt(data.duration) || 4
  });
  return mapFormation(response.data);
};

export const deleteFormation = (id) => 
  api.delete(`/formations/${id}`).then(r => r.data);

// INSCRIPTIONS 

export const inscrireFormation = (formationId) => 
  api.post(`/formations/${formationId}/inscription`).then(r => r.data);

export const desinscrireFormation = (formationId) => 
  api.delete(`/formations/${formationId}/inscription`).then(r => r.data);

// UTILITAIRES

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const isFormateur = () => {
  const user = getCurrentUser();
  return user?.role === 'formateur';
};

export const isApprenant = () => {
  const user = getCurrentUser();
  return user?.role === 'apprenant';
};