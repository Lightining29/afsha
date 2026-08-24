export default function RakhiUnderline() {
  return (
    <div className="rakhi-curly-underline" aria-hidden="true">
      <svg
        viewBox="0 0 240 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="rakhi-curly-svg"
      >
        <defs>
          {/* Silk Kalawa Thread Gradient */}
          <linearGradient id="rakhiSilkKalawa" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="15%" stopColor="#ea580c" />
            <stop offset="35%" stopColor="#e11d48" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="65%" stopColor="#e11d48" />
            <stop offset="85%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </linearGradient>

          {/* Golden Sheen Gradient */}
          <linearGradient id="rakhiGoldLustre" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="80%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Ruby Gemstone Center */}
          <radialGradient id="rakhiRubyCenter" cx="38%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="25%" stopColor="#f43f5e" />
            <stop offset="70%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>

          {/* Pearl Bead Gradient */}
          <radialGradient id="rakhiPearlGlow" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </radialGradient>
        </defs>

        {/* ── Left Flowing Silk Thread (Gentle Wave, No Hanging) ── */}
        <path
          d="M 12,12 Q 35,5 60,13 T 108,12"
          stroke="url(#rakhiSilkKalawa)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M 18,12 Q 42,17 68,11 T 108,12"
          stroke="url(#rakhiGoldLustre)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Left Ornate Beads along Thread */}
        <circle cx="28" cy="9.5" r="2" fill="url(#rakhiPearlGlow)" />
        <circle cx="46" cy="11.5" r="2.6" fill="url(#rakhiRubyCenter)" />
        <circle cx="64" cy="12" r="3.2" fill="url(#rakhiGoldLustre)" />
        <circle cx="82" cy="10" r="2.6" fill="url(#rakhiRubyCenter)" />
        <circle cx="96" cy="11.8" r="2" fill="url(#rakhiPearlGlow)" />

        {/* Left End Decorative Finial */}
        <circle cx="10" cy="12" r="1.8" fill="url(#rakhiGoldLustre)" />

        {/* ── Right Flowing Silk Thread (Gentle Wave, No Hanging) ── */}
        <path
          d="M 132,12 Q 155,19 180,11 T 228,12"
          stroke="url(#rakhiSilkKalawa)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M 132,12 Q 160,5 186,13 T 222,12"
          stroke="url(#rakhiGoldLustre)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Right Ornate Beads along Thread */}
        <circle cx="144" cy="11.8" r="2" fill="url(#rakhiPearlGlow)" />
        <circle cx="158" cy="10" r="2.6" fill="url(#rakhiRubyCenter)" />
        <circle cx="176" cy="12" r="3.2" fill="url(#rakhiGoldLustre)" />
        <circle cx="194" cy="11.5" r="2.6" fill="url(#rakhiRubyCenter)" />
        <circle cx="212" cy="9.5" r="2" fill="url(#rakhiPearlGlow)" />

        {/* Right End Decorative Finial */}
        <circle cx="230" cy="12" r="1.8" fill="url(#rakhiGoldLustre)" />

        {/* ── Centerpiece: Grand Floral Mandala Rakhi Emblem ── */}
        {/* Radiating Golden Sunburst Rays */}
        <g stroke="url(#rakhiGoldLustre)" strokeWidth="1.2" strokeLinecap="round">
          <line x1="120" y1="2" x2="120" y2="4.5" />
          <line x1="120" y1="19.5" x2="120" y2="22" />
          <line x1="110" y1="12" x2="112.5" y2="12" />
          <line x1="127.5" y1="12" x2="130" y2="12" />
          <line x1="113" y1="5" x2="114.8" y2="6.8" />
          <line x1="125.2" y1="17.2" x2="127" y2="19" />
          <line x1="113" y1="19" x2="114.8" y2="17.2" />
          <line x1="125.2" y1="6.8" x2="127" y2="5" />
        </g>

        {/* Golden Petals Ring */}
        <circle cx="120" cy="12" r="7.5" fill="none" stroke="url(#rakhiGoldLustre)" strokeWidth="1.6" />
        <circle cx="120" cy="12" r="6.2" fill="url(#rakhiGoldLustre)" />

        {/* Pearl Ring Dots around Center Gem */}
        <circle cx="120" cy="6.8" r="0.9" fill="#ffffff" />
        <circle cx="123.7" cy="8.3" r="0.9" fill="#ffffff" />
        <circle cx="125.2" cy="12" r="0.9" fill="#ffffff" />
        <circle cx="123.7" cy="15.7" r="0.9" fill="#ffffff" />
        <circle cx="120" cy="17.2" r="0.9" fill="#ffffff" />
        <circle cx="116.3" cy="15.7" r="0.9" fill="#ffffff" />
        <circle cx="114.8" cy="12" r="0.9" fill="#ffffff" />
        <circle cx="116.3" cy="8.3" r="0.9" fill="#ffffff" />

        {/* Faceted Ruby Center Gemstone */}
        <circle cx="120" cy="12" r="4.2" fill="url(#rakhiRubyCenter)" />
        {/* Sparkling Glint */}
        <circle cx="118.8" cy="10.8" r="1.1" fill="#ffffff" opacity="0.9" />
      </svg>
    </div>
  );
}
