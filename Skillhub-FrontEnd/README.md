```markdown
# SkillHub API - Documentation du développement

## Identifiants de test
Rôle       Email                      Mot de passe
FORMATEUR  sophie.martin@skillhub.fr   Sophie2026!
APPRENANT  apre@gmail.com              Apprenant2026!
FORMATEUR  Gil.b@skillhub.fr           BERTg2026!


Réponse aux exigences du projet
### 1. Front-end : React.js
L'application front-end est entièrement développée avec **React.js** et utilise :
- **Hooks** (`useState`, `useEffect`) pour la gestion d'état
- **React Router** pour la navigation entre les dashboards
- **Composants modulaires** (Navbar, Footer, Modals, etc.)

**Fichiers concernés :**
- `App.jsx` - Point d'entrée avec routage conditionnel selon le rôle
- `pages/FormateurDashboard.jsx` - Dashboard formateur
- `pages/ApprenantDashboard.jsx` - Dashboard apprenant
- `components/Formateur/CreateWorkshopModal.jsx` - Modal de création

---

### 2. Back-end : Laravel (API REST uniquement)
L'API respecte les principes REST et est utilisée **uniquement comme back-end**, sans rendu de vues Blade.

**Routes implémentées :**
- `POST /api/login` - Authentification
- `POST /api/logout` - Déconnexion
- `GET /api/me` - Infos utilisateur connecté
- `GET /api/formations` - Liste toutes les formations
- `GET /api/mes-formations` - Formations du formateur connecté
- `POST /api/formations` - Créer une formation
- `DELETE /api/formations/{id}` - Supprimer une formation

**Fichier de référence :** `api.js` (configuration des appels Axios)

---

### 3. Authentification JWT obligatoire
L'authentification est gérée par **JSON Web Tokens (JWT)** :

```javascript
// api.js - Intercepteur Axios
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Règles respectées :**
- Seul l'admin peut ajouter/supprimer des formations ✅
- Le token est systématiquement envoyé dans le header `Authorization`
- Routes protégées par middleware JWT côté Laravel

---

### 4. Base de données MySQL
Structure de la base conforme au fichier `skillhub2.sql` avec les tables :
- `utilisateur` (rôle, nom, email, password hashé)
- `formation` (nom, prix, durée, niveau, id_formateur, etc.)
- `categorie` (catégories de formations)
- `inscription` et `paiement` (relations utilisateur-formation)

---

### 5. Communications Axios
Toutes les communications front → back utilisent **Axios** avec une instance centralisée :

```javascript
// api.js
export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Exemple d'appel
export const getMesFormations = () => api.get('/mes-formations').then(r => r.data);
```

---

### 6. Séparation claire des responsabilités
- **Front-end** : `components/`, `pages/`, `services/`
- **Back-end** : API Laravel avec contrôleurs dédiés
- **Services** : `api.js` centralise tous les appels API

---

### 7. Validation côté client
Le formulaire de création de formation (`CreateWorkshopModal.jsx`) implémente une validation complète :

```javascript
const validate = () => {
  const newErrors = {};
  if (!formData.nom.trim()) newErrors.nom = 'Le titre est obligatoire';
  if (!formData.duree || formData.duree < 1) newErrors.duree = 'La durée doit être au moins 1h';
  if (!formData.prix || formData.prix < 0) newErrors.prix = 'Prix invalide';
  if (!formData.date_debut) newErrors.date_debut = 'La date est obligatoire';
  if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
  return newErrors;
};
```

---

### 8. Messages d'erreur visibles
- **Erreurs de validation** : affichées sous chaque champ concerné
- **Erreurs API** : message global en haut du modal
- **Gestion des codes HTTP** : 401, 403, 422 traités spécifiquement

```javascript
if (err.response?.status === 401) {
  setApiError('Non authentifié. Veuillez vous reconnecter.');
} else if (err.response?.status === 403) {
  setApiError('Accès refusé. Vous n\'avez pas les droits.');
}
```

---

### 9. Gestion propre du state (useState)
Chaque composant gère son état local avec `useState` :

```javascript
const [workshops, setWorkshops] = useState([]);
const [loading, setLoading] = useState(true);
const [showCreateModal, setShowCreateModal] = useState(false);
const [formData, setFormData] = useState({...});
const [errors, setErrors] = useState({});
```

---

### 10. Fermeture de modal après succès et réinitialisation
```javascript
// Après création réussie
setFormData({ nom: '', id_categorie: '1', duree: '', date_debut: '', niveau: 'DEBUTANT', prix: '', description: '' });
setErrors({});
onSubmit(nouvelle); // Passe la nouvelle formation au parent
setShowCreateModal(false); // Ferme la modal
```

---

Appel API sécurisé : 
```javascript
const token = localStorage.getItem('token');
await api.post('/formations', formData, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**Le `id_formateur` n'est jamais envoyé** - il est récupéré côté back via l'utilisateur authentifié.

---

Mise à jour immédiate de la liste (sans rechargement) : 
```javascript
// Dans FormateurDashboard.jsx
const handleCreate = (nouvelleFormation) => {
  setWorkshops(prev => [...prev, nouvelleFormation]); // ← Mise à jour immédiate
  setShowCreateModal(false);
};
```

---

Endpoint sécurisé - Codes HTTP : 

| Situation | Code HTTP | Implémentation |
|-----------|-----------|----------------|
| Token absent | 401 | `if (!token) return response()->json(['error' => 'Non authentifié'], 401);` |
| Token invalide | 403 | Géré par le middleware JWT |
| Erreur validation | 422 | Retourné automatiquement par Laravel |
| Création réussie | 201 | `return response()->json($formation, 201);` |


Documentation OpenAPI :

Le fichier `openapi.yaml` documente toutes les routes avec :
- Exemples de payload et réponses
- Codes HTTP documentés
- Schémas de données
- Sécurité (bearerAuth)

yaml
Extrait de la documentation POST /api/formations : 
post:
  summary: Créer une nouvelle formation
  security:
    - bearerAuth: []
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/FormationPayload'
  responses:
    '201': Formation créée
    '401': Token absent
    '403': Accès refusé
    '422': Erreur de validation
```


Tests automatisés PHPUnit
Chemin du test : skillhub-api\tests\Feature\FormationTest.php
Deux tests essentiels implémentés :

```php
// test_formation_creation.php
public function test_sans_token_retourne_401()
{
    $response = $this->postJson('/api/formations', $payload);
    $response->assertStatus(401);
}

public function test_admin_peut_creer_formation()
{
    $admin = User::factory()->create(['role' => 'ADMIN']);
    $token = auth()->login($admin);
    
    $response = $this->withHeader('Authorization', "Bearer $token")
                     ->postJson('/api/formations', $payload);
    
    $response->assertStatus(201);
}
```

Question posée à l'IA : 
IA Utilisée Deepseek.com

1) A partir de ces pages créer moi un dossier yaml

2) Corrige les erreurs présentes de ce code : CreateWorkshop.php, FormateurDashboard et jwt.php

3) A partir de ce fichier yaml créer moi un read.me

---

## 🚀 Fonctionnalités implémentées

✅ **Dashboard formateur** avec :
- Liste des formations créées
- Filtres (recherche, niveau, prix)
- Pagination
- Création de formation (modal)
- Suppression de formation (modal confirmation)
- Modification de formation (modal)

✅ **Dashboard apprenant** avec :
- Liste de toutes les formations
- Filtres avancés
- Inscription aux formations

✅ **Authentification** :
- Login sécurisé
- Persistance de session (localStorage)
- Déconnexion
- Redirection selon le rôle

✅ **Expérience utilisateur** :
- Loading states
- Messages d'erreur contextuels
- Modales accessibles
- Filtres en temps réel