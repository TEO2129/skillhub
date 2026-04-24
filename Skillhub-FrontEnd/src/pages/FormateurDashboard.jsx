import { useState, useEffect } from 'react';
import FormateurWorkshopGrid from '../components/Formateur/FormateurWorkshopGrid';
import Pagination from '../components/Partager/Pagination';
import CreateWorkshopModal from '../components/Formateur/CreateWorkshopModal';
import DeleteConfirmModal from '../components/Formateur/DeleteConfirmModal';
import Modal from '../components/Partager/Modal';
import { getMesFormations, createFormation, deleteFormation } from '../services/api';

function FormateurDashboard() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('Tous les niveaux');
  const [prixMax, setPrixMax] = useState(200);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [workshopToDelete, setWorkshopToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const loadFormations = () => {
    setLoading(true);
    getMesFormations()
      .then(data => setWorkshops(data))
      .catch(() => setError('Impossible de charger vos formations'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadFormations(); }, []);

  const handleCreate = (nouvelleFormation) => {
    setWorkshops(prev => [...prev, nouvelleFormation]); // ← state immédiat
    setShowCreateModal(false);
    alert('Formation créée avec succès ! 🎉');
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFormation(workshopToDelete.id);
      setWorkshopToDelete(null);
      loadFormations();
      alert('Formation supprimée ! ✅');
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const filtered = workshops.filter(w => {
    const matchSearch = w.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = levelFilter === 'Tous les niveaux' || w.level === levelFilter;
    const matchPrix = w.prix <= prixMax;
    return matchSearch && matchLevel && matchPrix;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Chargement...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '3rem' }}>{error}</p>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="page-title">Mes Formations</h2>
          <p className="page-stats">{filtered.length} formation(s) créée(s)</p>
        </div>
        <button className="btn-create-workshop" onClick={() => setShowCreateModal(true)}>
          + Créer une formation
        </button>
      </div>

      {/* FILTRES */}
      <div className="filters-container">
        <h3 className="filters-title">Filtrer les formations</h3>
        <div className="filters-grid">
          <div>
            <input
              type="text"
              placeholder="🔍 Rechercher..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
          <div>
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              className="filter-select"
            >
              <option>Tous les niveaux</option>
              <option>Débutant</option>
              <option>Intermédiaire</option>
              <option>Avancé</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
              Prix max : {prixMax} €
            </label>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={prixMax}
              onChange={e => setPrixMax(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6c5ce7' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
              <span>0 €</span>
              <span>200 €</span>
            </div>
          </div>
        </div>
      </div>

      <FormateurWorkshopGrid
        workshops={paginated}
        onEdit={setSelectedWorkshop}
        onDelete={setWorkshopToDelete}
      />

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {showCreateModal && (
        <CreateWorkshopModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} />
      )}
      {workshopToDelete && (
        <DeleteConfirmModal
          workshop={workshopToDelete}
          onClose={() => setWorkshopToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {selectedWorkshop && (
        <Modal
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
          onConfirm={() => { alert('Modifications enregistrées ! ✅'); setSelectedWorkshop(null); }}
          isFormateur={true}
        />
      )}
    </>
  );
}

export default FormateurDashboard;