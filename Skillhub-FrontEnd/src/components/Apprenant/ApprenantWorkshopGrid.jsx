import ApprenantWorkshopCard from './ApprenantWorkshopCard';

function ApprenantWorkshopGrid({ workshops, onWorkshopClick }) {
  return (
    <div className="workshops-grid">
      {workshops.map(workshop => (
        <ApprenantWorkshopCard
          key={workshop.id}
          workshop={workshop}
          onClick={() => onWorkshopClick(workshop)}
        />
      ))}
    </div>
  );
}

export default ApprenantWorkshopGrid;