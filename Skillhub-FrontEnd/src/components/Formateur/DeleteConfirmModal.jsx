function DeleteConfirmModal({ workshop, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn">×</button>
        <h2 className="modal-title" style={{ color: '#ef4444' }}>
          ⚠️ Supprimer l'atelier
        </h2>
        
        <div className="modal-content">
          <p className="modal-description" style={{ marginBottom: '1.5rem' }}>
            Êtes-vous sûr de vouloir supprimer cet atelier ? Cette action est irréversible.
          </p>
          
          <div className="modal-info-box" style={{ backgroundColor: '#fee2e2' }}>
            <div className="modal-info-row">
              <span className="modal-info-label">Atelier :</span>
              <span>{workshop.title}</span>
            </div>
            <div className="modal-info-row">
              <span className="modal-info-label">Date :</span>
              <span>{workshop.date}</span>
            </div>
            <div className="modal-info-row">
              <span className="modal-info-label">Participants inscrits :</span>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>
                {workshop.participants} personne{workshop.participants > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {workshop.participants > 0 && (
            <p className="modal-confirmation-text" style={{ color: '#dc2626', fontWeight: 600 }}>
              ⚠️ {workshop.participants} participant{workshop.participants > 1 ? 's seront' : ' sera'} notifié{workshop.participants > 1 ? 's' : ''} de l'annulation.
            </p>
          )}
        </div>
        
        <div className="modal-buttons">
          <button onClick={onClose} className="btn-cancel">
            Annuler
          </button>
          <button onClick={onConfirm} className="btn-delete-confirm">
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;