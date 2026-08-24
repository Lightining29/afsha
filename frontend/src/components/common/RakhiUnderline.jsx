export default function RakhiUnderline() {
  return (
    <div className="rakhi-curly-underline" aria-hidden="true">
      <svg
        viewBox="0 0 240 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="rakhi-curly-svg"
      >
        <defs>
          {/* Silk Gradient for threads */}
          <linearGradient id="rakhiSilkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="25%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="75%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Hanging Thread Gradient */}
          <linearGradient id="rakhiHangingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="60%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* 24k Gold Metal Shimmer */}
          <linearGradient id="rakhiGoldShimmer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#fbbf24" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Ruby Center Jewel */}
          <radialGradient id="rubyJewel" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="25%" stopColor="#f43f5e" />
            <stop offset="65%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>

          {/* Emerald Accent Bead */}
          <radialGradient id="emeraldBead" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </radialGradient>
        </defs>

        {/* ── LEFT THREAD (Horizontal Waves & Ornamental Beads) ── */}
        {/* Curled start tassel */}
        <path
          d="M 6,14 C 2,10 4,6 8,8 C 12,10 16,16 24,14"
          stroke="url(#rakhiSilkGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Main Left Wave */}
        <path
          d="M 24,14 Q 45,6 66,15 T 88,14"
          stroke="url(#rakhiSilkGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Secondary braided filament */}
        <path
          d="M 28,15 Q 46,19 64,12 T 86,14"
          stroke="#f59e0b"
          strokeWidth="1.2"
          strokeDasharray="2 1.5"
          opacity="0.85"
        />

        {/* Left Thread Beads */}
        <circle cx="36" cy="11.5" r="2.8" fill="url(#rakhiGoldShimmer)" />
        <circle cx="52" cy="15" r="2.2" fill="url(#emeraldBead)" />
        <circle cx="68" cy="12" r="3" fill="url(#rakhiGoldShimmer)" />
        <circle cx="78" cy="13.5" r="2.2" fill="#e11d48" />

        {/* ── CENTER ORNATE RAKHI MEDALLION (At x=96, y=14) ── */}
        {/* Golden Aura / Ray Petals */}
        <circle cx="96" cy="14" r="10.5" stroke="url(#rakhiGoldShimmer)" strokeWidth="1.2" strokeDasharray="1.5 1.5" fill="none" />
        {/* 8-Petal Golden Flower */}
        <circle cx="96" cy="14" r="8" fill="url(#rakhiGoldShimmer)" />
        {/* Inner Golden Ring */}
        <circle cx="96" cy="14" r="5.5" fill="#fef08a" stroke="#b45309" strokeWidth="0.8" />
        {/* Central Ruby Jewel with facet glow */}
        <circle cx="96" cy="14" r="4.2" fill="url(#rubyJewel)" />
        <circle cx="94.6" cy="12.6" r="1.2" fill="#ffffff" opacity="0.9" />

        {/* ── RIGHT THREAD & HANGING HALF (Curling & Hanging Down) ── */}
        {/* Upper horizontal connecting wave */}
        <path
          d="M 104,14 Q 125,7 148,15 T 180,13"
          stroke="url(#rakhiSilkGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Secondary gold filament */}
        <path
          d="M 106,14.5 Q 126,19 146,12 T 176,14"
          stroke="#f59e0b"
          strokeWidth="1.2"
          strokeDasharray="2 1.5"
          opacity="0.85"
        />

        {/* Right Intermediate Beads */}
        <circle cx="116" cy="13" r="2.2" fill="#e11d48" />
        <circle cx="128" cy="12" r="3" fill="url(#rakhiGoldShimmer)" />
        <circle cx="145" cy="15.5" r="2.2" fill="url(#emeraldBead)" />
        <circle cx="162" cy="11.5" r="2.8" fill="url(#rakhiGoldShimmer)" />

        {/* ── HANGING HALF: Main Silk Thread Drape & Drop Tassel ── */}
        {/* Hanging Thread 1 (Curves over and gracefully hangs down to y=38) */}
        <path
          d="M 180,13 C 196,11 206,17 202,26 C 199,32 192,34 190,38"
          stroke="url(#rakhiHangingGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Hanging Thread 2 (Shorter parallel decorative strand) */}
        <path
          d="M 178,14 C 188,18 196,24 197,32"
          stroke="#ea580c"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Hanging Beads along the drop */}
        <circle cx="204" cy="20" r="2.6" fill="url(#rakhiGoldShimmer)" />
        <circle cx="200" cy="28" r="2.2" fill="url(#rubyJewel)" />
        <circle cx="194" cy="34" r="2.6" fill="url(#rakhiGoldShimmer)" />
        <circle cx="190" cy="38" r="2" fill="url(#emeraldBead)" />

        {/* Bottom Silk Tassel & Golden Cap */}
        {/* Golden Tassel Cone/Bell Cap */}
        <path
          d="M 187,38 L 193,38 L 191.5,41.5 L 188.5,41.5 Z"
          fill="url(#rakhiGoldShimmer)"
        />
        {/* Silk Tassel Fringe */}
        <path
          d="M 188,41.5 L 186,44 M 189.5,41.5 L 189.5,44.5 M 191,41.5 L 192,44 M 192.5,41.5 L 194,43.5"
          stroke="#e11d48"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Second Hanging Drop Bell (at x=197, y=32) */}
        <circle cx="197" cy="32" r="1.8" fill="url(#rakhiGoldShimmer)" />
        <path
          d="M 196,33 L 195,35.5 M 197,33 L 197,36 M 198,33 L 199,35.5"
          stroke="#f59e0b"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
