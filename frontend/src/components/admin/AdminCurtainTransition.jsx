import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import './AdminCurtainTransition.css';

/**
 * Theatrical Curtain Opening Transition when Admin opens the Admin Dashboard.
 * Left and right rich velvet/obsidian panels part open in a grand cinematic motion.
 */
export default function AdminCurtainTransition() {
  const [active, setActive] = useState(true);
  const [parting, setParting] = useState(false);

  useEffect(() => {
    // Start curtain parting shortly after mount
    const timer1 = setTimeout(() => {
      setParting(true);
    }, 250);

    // Completely dismiss from DOM
    const timer2 = setTimeout(() => {
      setActive(false);
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!active) return null;

  return (
    <div className={`admin-curtain-wrapper ${parting ? 'curtains-parting' : ''}`}>
      {/* Left Curtain Panel with Folds */}
      <div className="admin-curtain-panel curtain-left">
        <div className="curtain-fold fold-1" />
        <div className="curtain-fold fold-2" />
        <div className="curtain-fold fold-3" />
        <div className="curtain-tassel tassel-left" />
      </div>

      {/* Center Royal Seal / Crest */}
      <div className="admin-curtain-crest">
        <div className="crest-icon-ring">
          <ShieldCheck size={32} color="#f59e0b" />
        </div>
        <h3 className="crest-title">AFSHA ENTERPRISES</h3>
        <p className="crest-subtitle">ADMINISTRATIVE DASHBOARD</p>
      </div>

      {/* Right Curtain Panel with Folds */}
      <div className="admin-curtain-panel curtain-right">
        <div className="curtain-fold fold-1" />
        <div className="curtain-fold fold-2" />
        <div className="curtain-fold fold-3" />
        <div className="curtain-tassel tassel-right" />
      </div>
    </div>
  );
}
