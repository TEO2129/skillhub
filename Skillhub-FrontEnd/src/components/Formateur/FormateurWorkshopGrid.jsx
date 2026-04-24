import FormateurWorkshopCard from './FormateurWorkshopCard';

function FormateurWorkshopGrid({ workshops, onEdit, onDelete }) {
  return (
    <div className="workshops-grid">
      {workshops.map(workshop => (
        <FormateurWorkshopCard
          key={workshop.id}
          workshop={workshop}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default FormateurWorkshopGrid;