function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="page-btn"
      >
        ← Précédent
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className="page-btn"
      >
        Suivant →
      </button>
    </div>
  );
}

export default Pagination;