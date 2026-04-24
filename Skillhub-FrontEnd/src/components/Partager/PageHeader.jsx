function PageHeader({ totalWorkshops, upcomingCount, title }) {
  return (
    <div className="page-header">
      <h2 className="page-title">{title || "Mes Ateliers"}</h2>
      <p className="page-stats">
        {totalWorkshops} atelier{totalWorkshops > 1 ? 's' : ''}
        {upcomingCount && ` • ${upcomingCount} à venir cette semaine`}
      </p>
    </div>
  );
}

export default PageHeader;