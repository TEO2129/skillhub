function Navbar({ userName, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span className="navbar-logo">SkillHub</span>
        <div className="navbar-user-section">
          <span>👤 {userName}</span>
          <button 
            className="btn-logout" 
            onClick={() => {
              console.log('Logout clicked'); // pour débugger
              onLogout();
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;