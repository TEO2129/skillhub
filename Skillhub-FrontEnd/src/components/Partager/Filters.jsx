function Filters({ searchTerm, levelFilter, formatFilter, onSearchChange, onLevelChange, onFormatChange }) {
  return (
    <div className="filters-container">
      <h3 className="filters-title">Filtrer les ateliers</h3>
      <div className="filters-grid">
        <div>
          <label htmlFor="search-input" className="sr-only">Rechercher un atelier</label>
          <input
            id="search-input"
            type="text"
            placeholder="🔍 Rechercher..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filter-input"
            aria-label="Rechercher un atelier par titre ou formateur"
          />
        </div>
        
        <div>
          <label htmlFor="level-filter" className="sr-only">Filtrer par niveau</label>
          <select
            id="level-filter"
            value={levelFilter}
            onChange={(e) => onLevelChange(e.target.value)}
            className="filter-select"
            aria-label="Filtrer les ateliers par niveau"
          >
            <option>Tous les niveaux</option>
            <option>Débutant</option>
            <option>Intermédiaire</option>
            <option>Avancé</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="format-filter" className="sr-only">Filtrer par format</label>
          <select
            id="format-filter"
            value={formatFilter}
            onChange={(e) => onFormatChange(e.target.value)}
            className="filter-select"
            aria-label="Filtrer les ateliers par format"
          >
            <option>Tous les formats</option>
            <option>Présentiel</option>
            <option>Visio</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filters;