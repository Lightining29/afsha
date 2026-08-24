export default function RakhiUnderline() {
  return (
    <div className="rakhi-curly-underline" aria-hidden="true">
      <svg
        viewBox="0 0 180 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="rakhi-curly-svg"
      >
        <defs>
          <linearGradient id="rakhiThreadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
            <stop offset="25%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="75%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="rakhiGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <radialGradient id="rakhiCenterBead" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>
        </defs>

        {/* Left Curly Swirl Thread */}
        <path
          d="M 5,10 C 20,2 32,18 48,10 C 62,3 74,13 82,10"
          stroke="url(#rakhiThreadGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Left Tassel Loop */}
        <path
          d="M 12,9 C 6,4 4,14 10,12"
          stroke="#f59e0b"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Left Decorative Beads */}
        <circle cx="28" cy="11" r="2.2" fill="url(#rakhiGoldGrad)" />
        <circle cx="48" cy="10" r="2.2" fill="#e11d48" />
        <circle cx="68" cy="10.5" r="2.2" fill="url(#rakhiGoldGrad)" />

        {/* Right Curly Swirl Thread */}
        <path
          d="M 98,10 C 106,13 118,3 132,10 C 148,18 160,2 175,10"
          stroke="url(#rakhiThreadGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Right Tassel Loop */}
        <path
          d="M 168,9 C 174,4 176,14 170,12"
          stroke="#f59e0b"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Right Decorative Beads */}
        <circle cx="112" cy="10.5" r="2.2" fill="url(#rakhiGoldGrad)" />
        <circle cx="132" cy="10" r="2.2" fill="#e11d48" />
        <circle cx="152" cy="11" r="2.2" fill="url(#rakhiGoldGrad)" />

        {/* Center Floral Rakhi Jewel Emblem */}
        {/* Golden Petals */}
        <circle cx="90" cy="10" r="7.5" fill="none" stroke="url(#rakhiGoldGrad)" strokeWidth="1.5" strokeDasharray="2 1.5" />
        <circle cx="90" cy="10" r="5.2" fill="url(#rakhiGoldGrad)" />
        {/* Inner Crimson Jewel */}
        <circle cx="90" cy="10" r="3.2" fill="url(#rakhiCenterBead)" />
        <circle cx="89" cy="9" r="0.9" fill="#ffffff" opacity="0.8" />
      </svg>
    </div>
  );
}
