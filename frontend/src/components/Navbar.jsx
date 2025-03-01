import { useState } from 'react';
import { Dna } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Dna size={28} color="var(--accent)" />
          <h1>IBD GENOSCOPE</h1>
        </div>
        
        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <a href="#">Home</a>
          <a href="#">Datasets</a>
          <a href="#">Tools</a>
          <a href="#">About</a>
        </div>
        
        <div className="navbar-mobile-toggle" onClick={toggleMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;