function FormateurWorkshopCard({ workshop, onEdit, onDelete }) {
  const displayDate = workshop.date || 'Date non définie';
  
  const getStatusColor = (status) => {
    if (status === 'Complet') return '#ef4444';
    if (status === 'À venir' || status === 'Popular') return '#10b981';
    return '#6b7280';
  };

  return (
    <div className="workshop-card">
      <span className="workshop-category">{workshop.category}</span>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'start',
        marginBottom: '0.75rem'
      }}>
        <h3 className="workshop-title">{workshop.title}</h3>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: getStatusColor(workshop.status),
          whiteSpace: 'nowrap',
          marginLeft: '0.5rem'
        }}>
          {workshop.status === 'Popular' ? '👍 Populaire' : workshop.status}
        </span>
      </div>
      
      <p className="workshop-info">
        👥 {workshop.participants}/{workshop.maxParticipants} participants
      </p>
      <p className="workshop-info">📍 {workshop.format} • ⏱️ {workshop.duration}</p>
      <p className="workshop-date">📅 {displayDate}</p>
      <p style={{
        fontWeight: '700',
        fontSize: '1.1rem',
        color: '#6c5ce7',
        marginBottom: '1rem'
      }}>
        💰 {workshop.prix.toFixed(2)} €
      </p>
      <div className="workshop-actions">
        <button className="btn-edit" onClick={() => onEdit(workshop)}>
          Modifier
        </button>
        <button className="btn-delete" onClick={() => onDelete(workshop)}>
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default FormateurWorkshopCard;