const Modal = ({ workshop, onClose, onConfirm, isFormateur }) => {
  // Valeurs par défaut
  const safeWorkshop = {
    date: 'Date non définie',
    duration: 'Non défini',
    format: 'Non défini',
    level: 'Non défini',
    participants: 0,
    maxParticipants: 20,
    status: 'À venir',
    ...workshop
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn">×</button>
        <h2 className="modal-title">
          {isFormateur ? "Détails de l'atelier" : "Confirmer l'inscription"}
        </h2>
        
        <div className="modal-content">
          <p className="modal-description">{safeWorkshop.description}</p>
          
          <div className="modal-info-box">
            <div className="modal-info-row">
              <span className="modal-info-label">Atelier :</span>
              <span>{safeWorkshop.title}</span>
            </div>
            <div className="modal-info-row">
              <span className="modal-info-label">Formateur :</span>
              <span>{safeWorkshop.instructor}</span>
            </div>
            <div className="modal-info-row">
              <span className="modal-info-label">Date :</span>
              <span>{safeWorkshop.date}</span>
            </div>
            <div className="modal-info-row">
              <span className="modal-info-label">Durée :</span>
              <span>{safeWorkshop.duration}</span>
            </div>
            <div className="modal-info-row">
              <span className="modal-info-label">Format :</span>
              <span>{safeWorkshop.format}</span>
            </div>
            <div className="modal-info-row">
              <span className="modal-info-label">Niveau :</span>
              <span>{safeWorkshop.level}</span>
            </div>
            <div className="modal-info-row">
              <span className="modal-info-label">Prix :</span>
              <span>{safeWorkshop.prix} €</span>
            </div>
            {isFormateur && (
              <>
                <div className="modal-info-row">
                  <span className="modal-info-label">Participants :</span>
                  <span>{safeWorkshop.participants}/{safeWorkshop.maxParticipants}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-info-label">Statut :</span>
                  <span style={{ 
                    color: safeWorkshop.status === 'Complet' ? '#ef4444' : '#10b981',
                    fontWeight: 600 
                  }}>
                    {safeWorkshop.status}
                  </span>
                </div>
              </>
            )}
          </div>
          
          {!isFormateur && (
            <p className="modal-confirmation-text">
              Une confirmation vous sera envoyée par email avec tous les détails.
            </p>
          )}
        </div>
        
        <div className="modal-buttons">
          <button onClick={onClose} className="btn-cancel">
            Annuler
          </button>
          <button onClick={onConfirm} className="btn-confirm">
            {isFormateur ? "Enregistrer les modifications" : "Confirmer l'inscription"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;