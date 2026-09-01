"use client"
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePageTransition } from '@/components/TransitionProvider';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { startTransition } = usePageTransition();

  const handleTitleClick = () => {
    startTransition('/', 'bg-black');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Profile', id: 'hero' },
    { name: 'Projects', id: 'projects' },
    { name: 'Journey', id: 'experience' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="about-topbar">
      <div
        className="about-topbar-inner"
        style={{
          width: 1100,
          maxWidth: '92%',
          margin: '0 auto',
          padding: '14px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div onClick={handleTitleClick} className="flex items-baseline gap-2 cursor-pointer shrink-0">
          <span className="font-departure" style={{ fontSize: 18, fontWeight: 'bold', whiteSpace: 'nowrap' }}>Rodolphe Yoann</span>
          {/* <span className="about-brand-seq hidden sm:inline" style={{ fontSize: 12 }}>rakharrs.dev</span> */}
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button key={link.name} onClick={() => scrollToSection(link.id)} className="about-nav-link">
              {link.name}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white shrink-0"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div style={{ background: '#1a1a1a' }}>
          <div style={{ display: 'flex', flexDirection: 'column', padding: 20, gap: 4 }}>
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="about-nav-link"
                style={{ textAlign: 'left', padding: '10px 0', borderBottom: '1px solid #333333' }}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
