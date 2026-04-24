function ApprenantWorkshopCard({ workshop, onClick }) {
  // Valeur par défaut pour la date
  const displayDate = workshop.date || 'Date non définie';
  
  return (
    <div className="workshop-card" onClick={onClick}>
      <span className="workshop-category">{workshop.category}</span>
      <h3 className="workshop-title">{workshop.title}</h3>
      <p className="workshop-info">👨‍🏫 {workshop.instructor}</p>
      <p className="workshop-info">⏱️ {workshop.duration} • 📊 {workshop.level}</p>
      <p className="workshop-date">📅 {displayDate}</p>
      <p style={{
        fontWeight: '700',
        fontSize: '1.1rem',
        color: '#6c5ce7',
        marginBottom: '1rem'
      }}>
        💰 {workshop.prix.toFixed(2)} €
      </p>
      <button className="btn-details">Voir les détails</button>
    </div>
  );
}

export default ApprenantWorkshopCard;