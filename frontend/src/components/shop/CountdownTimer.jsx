import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import './CountdownTimer.css';

export default function CountdownTimer({ targetDate, compact = false, label = 'Offer Ends in' }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  function calculateTimeLeft(target) {
    if (!target) return null;
    const difference = new Date(target).getTime() - new Date().getTime();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(targetDate);
      setTimeLeft(remaining);
      if (!remaining) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  const pad = (n) => String(n).padStart(2, '0');

  if (compact) {
    return (
      <div className="bogo-countdown-compact" title={`Offer ends in ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}>
        <Clock size={11} className="bogo-clock-icon" />
        <span>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  return (
    <div className="bogo-countdown-box">
      {label && <span className="bogo-countdown-label"><Clock size={13} /> {label}</span>}
      <div className="bogo-countdown-grid">
        {timeLeft.days > 0 && (
          <div className="bogo-time-seg">
            <span className="bogo-time-val">{pad(timeLeft.days)}</span>
            <span className="bogo-time-unit">Days</span>
          </div>
        )}
        <div className="bogo-time-seg">
          <span className="bogo-time-val">{pad(timeLeft.hours)}</span>
          <span className="bogo-time-unit">Hrs</span>
        </div>
        <span className="bogo-time-sep">:</span>
        <div className="bogo-time-seg">
          <span className="bogo-time-val">{pad(timeLeft.minutes)}</span>
          <span className="bogo-time-unit">Mins</span>
        </div>
        <span className="bogo-time-sep">:</span>
        <div className="bogo-time-seg">
          <span className="bogo-time-val">{pad(timeLeft.seconds)}</span>
          <span className="bogo-time-unit">Secs</span>
        </div>
      </div>
    </div>
  );
}
