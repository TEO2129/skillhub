import { useState } from 'react';
import { createFormation } from '../../services/api';

function CreateWorkshopModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nom:          '',
    id_categorie: '1',
    duree:        '',
    date_debut:   '',
    niveau:       'DEBUTANT',
    prix:         '',
    description:  ''
  });

  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Efface l'erreur du champ modifié
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validation côté client
  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim())        newErrors.nom         = 'Le titre est obligatoire';
    if (!formData.duree)             newErrors.duree       = 'La durée est obligatoire';
    if (formData.duree < 1)          newErrors.duree       = 'La durée doit être au moins 1h';
    if (!formData.prix)              newErrors.prix        = 'Le prix est obligatoire';
    if (formData.prix < 0)           newErrors.prix        = 'Le prix ne peut pas être négatif';
    if (!formData.date_debut)        newErrors.date_debut  = 'La date est obligatoire';
    if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
    return newErrors;
  };

  const handleSubmit = async () => {
    setApiError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const nouvelle = await createFormation(formData);
      // Réinitialise le formulaire
      setFormData({
        nom: '', id_categorie: '1', duree: '',
        date_debut: '', niveau: 'DEBUTANT', prix: '', description: ''
      });
      setErrors({});
      onSubmit(nouvelle); // passe la nouvelle formation au parent
    } catch (err) {
      if (err.response?.status === 401) {
        setApiError('Non authentifié. Veuillez vous reconnecter.');
      } else if (err.response?.status === 403) {
        setApiError('Accès refusé. Vous n\'avez pas les droits nécessaires.');
      } else if (err.response?.status === 422) {
        // Erreurs de validation Laravel
        const laravelErrors = err.response.data.errors;
        const mapped = {};
        Object.keys(laravelErrors).forEach(key => {
          mapped[key] = laravelErrors[key][0];
        });
        setErrors(mapped);
      } else {
        setApiError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '0.625rem 1rem',
    border: `1px solid ${errors[field] ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-large" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn">×</button>
        <h2 className="modal-title">Créer une nouvelle formation</h2>

        {apiError && (
          <div style={{background:'#fee2e2',color:'#dc2626',padding:'0.75rem',borderRadius:'0.375rem',marginBottom:'1rem',fontSize:'0.875rem'}}>
            {apiError}
          </div>
        )}

        <div className="workshop-form">
          {/* Titre */}
          <div className="form-group">
            <label>Titre *</label>
            <input type="text" name="nom" value={formData.nom}
              onChange={handleChange} style={inputStyle('nom')}
              placeholder="Ex: Introduction à React" />
            {errors.nom && <span style={{color:'#ef4444',fontSize:'0.75rem'}}>{errors.nom}</span>}
          </div>

          <div className="form-row">
            {/* Catégorie */}
            <div className="form-group">
              <label>Catégorie *</label>
              <select name="id_categorie" value={formData.id_categorie}
                onChange={handleChange} style={inputStyle('id_categorie')}>
                <option value="1">Développement</option>
                <option value="2">Design</option>
                <option value="3">Marketing</option>
                <option value="4">Soft Skills</option>
              </select>
            </div>

            {/* Niveau */}
            <div className="form-group">
              <label>Niveau *</label>
              <select name="niveau" value={formData.niveau}
                onChange={handleChange} style={inputStyle('niveau')}>
                <option value="DEBUTANT">Débutant</option>
                <option value="INTERMEDIAIRE">Intermédiaire</option>
                <option value="AVANCE">Avancé</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            {/* Durée */}
            <div className="form-group">
              <label>Durée (heures) *</label>
              <input type="number" name="duree" value={formData.duree}
                onChange={handleChange} style={inputStyle('duree')}
                placeholder="Ex: 4" min="1" />
              {errors.duree && <span style={{color:'#ef4444',fontSize:'0.75rem'}}>{errors.duree}</span>}
            </div>

            {/* Prix */}
            <div className="form-group">
              <label>Prix (€) *</label>
              <input type="number" name="prix" value={formData.prix}
                onChange={handleChange} style={inputStyle('prix')}
                placeholder="Ex: 99" min="0" step="0.01" />
              {errors.prix && <span style={{color:'#ef4444',fontSize:'0.75rem'}}>{errors.prix}</span>}
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date de début *</label>
            <input type="date" name="date_debut" value={formData.date_debut}
              onChange={handleChange} style={inputStyle('date_debut')} />
            {errors.date_debut && <span style={{color:'#ef4444',fontSize:'0.75rem'}}>{errors.date_debut}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" value={formData.description}
              onChange={handleChange} style={inputStyle('description')}
              rows="4" placeholder="Décrivez le contenu..." />
            {errors.description && <span style={{color:'#ef4444',fontSize:'0.75rem'}}>{errors.description}</span>}
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="btn-cancel">
              Annuler
            </button>
            <button type="button" onClick={handleSubmit} className="btn-confirm" disabled={loading}>
              {loading ? 'Création...' : 'Créer la formation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkshopModal;