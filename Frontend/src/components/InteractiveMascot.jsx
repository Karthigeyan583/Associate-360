import React, { useState, useEffect } from 'react';

/**
 * InteractiveMascot - "Otto the Control Tower Bot / BA Specialist"
 * Features funny, market-leading interactive behaviors:
 * 1. Follows cursor/typing when email is focused.
 * 2. Covers eyes with hands when typing password (No peeking! 🙈).
 * 3. Peeks through fingers if user toggles "Show Password" (👀).
 * 4. Reacts with unique funny quotes to each role persona.
 * 5. Celebrates on authentication loading.
 */
export default function InteractiveMascot({
  isEmailFocused,
  isPasswordFocused,
  showPassword,
  isLoading,
  isError,
  activePersona,
  emailLength = 0
}) {
  const [speechBubble, setSpeechBubble] = useState('Welcome back! Ready for 360° control?');
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural periodic blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Contextual funny quotes based on state
  useEffect(() => {
    if (isLoading) {
      setSpeechBubble('Verifying IND visas & rate spreads... 🚀');
    } else if (isError) {
      setSpeechBubble('Whoops! That password didn\'t match our records! 🧐');
    } else if (isPasswordFocused) {
      if (showPassword) {
        setSpeechBubble('Ooh, peeking at the password! I see you! 👀');
      } else {
        setSpeechBubble('Strict GDPR & Dutch privacy compliance! I won\'t peek! 🙈');
      }
    } else if (isEmailFocused) {
      setSpeechBubble(emailLength > 15 ? 'Good email format! Checking consultant DB...' : 'Type in your Associate 360° handle...');
    } else if (activePersona) {
      const quotes = {
        ADMIN: 'Superadmin mode! Full Control Tower clearance unlocked! 👑',
        OPERATIONS: 'Operations Lead: Keeping all 10 agreement chains running! 📋',
        COMPLIANCE: 'Compliance Officer: Checking Justis VOG & SNA NEN 4400-1! 🛡️',
        FINANCE: 'Finance Lead: Calculating hourly margins & rate spreads! 💶',
        DIRECTOR: 'Managing Director: Ready for high-altitude 360° oversight! 📈'
      };
      setSpeechBubble(quotes[activePersona] || '1-Click Persona selected! Logging you in...');
    } else {
      setSpeechBubble('Hey there! Sign in to manage consultant placements.');
    }
  }, [isEmailFocused, isPasswordFocused, showPassword, isLoading, isError, activePersona, emailLength]);

  // Calculate eye pupil position based on typing length
  const pupilShiftX = isEmailFocused ? Math.min(Math.max((emailLength - 10) * 0.7, -4), 4) : 0;
  const pupilShiftY = isEmailFocused ? 3 : 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '12px',
      position: 'relative'
    }}>
      
      {/* Dynamic Funny Speech Bubble */}
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: '16px',
        padding: '6px 14px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '8px',
        maxWidth: '310px',
        textAlign: 'center',
        position: 'relative',
        animation: 'bubbleFloat 3s ease-in-out infinite',
        transition: 'all 0.25s ease'
      }}>
        <span>{speechBubble}</span>
        {/* Speech Bubble Arrow */}
        <div style={{
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid var(--border-medium)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid var(--bg-elevated)',
        }} />
      </div>

      {/* Interactive Mascot SVG Canvas */}
      <div style={{
        width: '110px',
        height: '100px',
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isEmailFocused ? 'translateY(2px) rotate(1deg)' : (isPasswordFocused ? 'scale(1.03)' : 'translateY(0)')
      }}>
        <svg
          viewBox="0 0 120 110"
          width="100%"
          height="100%"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Body Gradient */}
            <linearGradient id="mascotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Belly Screen Gradient */}
            <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Hand / Paw Gradient */}
            <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
          </defs>

          {/* Antenna with glowing beacon */}
          <g>
            <line x1="60" y1="20" x2="60" y2="8" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
            <circle
              cx="60"
              cy="6"
              r="4"
              fill={isLoading ? '#10b981' : (isError ? '#f43f5e' : '#06b6d4')}
              style={{
                animation: isLoading ? 'pulseGlow 0.6s infinite' : 'pulseGlow 2s infinite',
                filter: 'drop-shadow(0 0 4px #06b6d4)'
              }}
            />
          </g>

          {/* Ears / Headset */}
          <rect x="18" y="38" width="6" height="16" rx="3" fill="#4338ca" />
          <rect x="96" y="38" width="6" height="16" rx="3" fill="#4338ca" />
          <path d="M 21 40 Q 60 16 99 40" fill="none" stroke="#6366f1" strokeWidth="3" />

          {/* Robot / Mascot Head & Torso Capsule */}
          <rect
            x="24"
            y="20"
            width="72"
            height="76"
            rx="36"
            fill="url(#mascotBodyGrad)"
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(99, 102, 241, 0.35))'
            }}
          />

          {/* Face Screen Visor */}
          <rect
            x="32"
            y="30"
            width="56"
            height="42"
            rx="18"
            fill="url(#screenGrad)"
            stroke="#6366f1"
            strokeWidth="1.5"
          />

          {/* Cheeks Blush */}
          <circle cx="38" cy="54" r="3.5" fill="#f43f5e" opacity="0.45" />
          <circle cx="82" cy="54" r="3.5" fill="#f43f5e" opacity="0.45" />

          {/* EYES SECTION */}
          {isBlinking ? (
            /* Blinking Slits */
            <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round">
              <line x1="44" y1="46" x2="52" y2="46" />
              <line x1="68" y1="46" x2="76" y2="46" />
            </g>
          ) : isError ? (
            /* Dizzy / Error Eyes (X eyes) */
            <g stroke="#f43f5e" strokeWidth="2" strokeLinecap="round">
              <line x1="44" y1="42" x2="52" y2="50" />
              <line x1="52" y1="42" x2="44" y2="50" />
              <line x1="68" y1="42" x2="76" y2="50" />
              <line x1="76" y1="42" x2="68" y2="50" />
            </g>
          ) : (
            /* Normal & Cursor-Tracking Eyes */
            <g>
              {/* Left Eye Outer */}
              <circle cx="48" cy="46" r="6.5" fill="#ffffff" />
              {/* Left Eye Pupil */}
              <circle
                cx={48 + pupilShiftX}
                cy={46 + pupilShiftY}
                r="3.5"
                fill="#1e1b4b"
              />
              <circle cx={49 + pupilShiftX} cy={44 + pupilShiftY} r="1.2" fill="#ffffff" />

              {/* Right Eye Outer */}
              <circle cx="72" cy="46" r="6.5" fill="#ffffff" />
              {/* Right Eye Pupil */}
              <circle
                cx={72 + pupilShiftX}
                cy={46 + pupilShiftY}
                r="3.5"
                fill="#1e1b4b"
              />
              <circle cx={73 + pupilShiftX} cy={44 + pupilShiftY} r="1.2" fill="#ffffff" />
            </g>
          )}

          {/* Cute Smart Glasses */}
          <g stroke="#38bdf8" strokeWidth="1.8" fill="none" opacity="0.85">
            <circle cx="48" cy="46" r="8" />
            <circle cx="72" cy="46" r="8" />
            <path d="M 56 46 Q 60 44 64 46" />
          </g>

          {/* Mouth */}
          {isLoading ? (
            /* Surprised / O mouth */
            <circle cx="60" cy="60" r="3" fill="#38bdf8" />
          ) : isError ? (
            /* Wobbly sad mouth */
            <path d="M 54 62 Q 60 57 66 62" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : (
            /* Friendly smile */
            <path d="M 54 58 Q 60 64 66 58" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
          )}

          {/* Little Tie / Badge */}
          <polygon points="60,74 56,86 60,90 64,86" fill="#06b6d4" />
          <circle cx="60" cy="74" r="2" fill="#ffffff" />

          {/* HANDS / PAWS INTERACTIVE OVERLAY */}
          {isPasswordFocused && !showPassword ? (
            /* Covering Eyes Completely (🙈 No Peeking) */
            <g style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              {/* Left Hand Covering Left Eye */}
              <ellipse cx="48" cy="46" rx="10" ry="8" fill="url(#handGrad)" stroke="#312e81" strokeWidth="1" />
              <circle cx="43" cy="42" r="2.5" fill="#a5b4fc" />
              <circle cx="48" cy="40" r="2.5" fill="#a5b4fc" />
              <circle cx="53" cy="42" r="2.5" fill="#a5b4fc" />

              {/* Right Hand Covering Right Eye */}
              <ellipse cx="72" cy="46" rx="10" ry="8" fill="url(#handGrad)" stroke="#312e81" strokeWidth="1" />
              <circle cx="67" cy="42" r="2.5" fill="#a5b4fc" />
              <circle cx="72" cy="40" r="2.5" fill="#a5b4fc" />
              <circle cx="77" cy="42" r="2.5" fill="#a5b4fc" />
            </g>
          ) : isPasswordFocused && showPassword ? (
            /* Peeking Hands (👀 Peeking between fingers) */
            <g style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              {/* Left hand lower */}
              <ellipse cx="48" cy="54" rx="9" ry="7" fill="url(#handGrad)" stroke="#312e81" strokeWidth="1" />
              {/* Right hand tilted peeking */}
              <ellipse cx="74" cy="52" rx="9" ry="7" fill="url(#handGrad)" stroke="#312e81" strokeWidth="1" />
            </g>
          ) : (
            /* Resting Hands on sides */
            <g>
              <ellipse cx="23" cy="70" rx="5" ry="7" fill="url(#handGrad)" />
              <ellipse cx="97" cy="70" rx="5" ry="7" fill="url(#handGrad)" />
            </g>
          )}

        </svg>
      </div>

      <style>{`
        @keyframes bubbleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}
