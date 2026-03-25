'use client';
import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [phase, setPhase] = useState<'loading' | 'revealing' | 'done'>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar from 0 to 100
    const start = Date.now();
    const duration = 1400;

    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);
      if (p < 100) {
        requestAnimationFrame(tick);
      } else {
        // Start reveal curtain
        setTimeout(() => setPhase('revealing'), 100);
        setTimeout(() => setPhase('done'), 900);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99000,
        background: '#0D0B08',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // Curtain slide up on reveal
        transform: phase === 'revealing' ? 'translateY(-100%)' : 'translateY(0)',
        transition: phase === 'revealing'
          ? 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)'
          : 'none',
        pointerEvents: 'all',
      }}
    >
      {/* Logo block */}
      <div
        style={{
          textAlign: 'center',
          opacity: phase === 'revealing' ? 0 : 1,
          transition: 'opacity 0.3s',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            fontWeight: 600,
            color: 'var(--color-sand)',
            letterSpacing: '0.05em',
            lineHeight: 1,
            animation: 'loaderFadeIn 0.6s ease forwards',
          }}
        >
          CRIADOS
        </div>
        <div
          style={{
            fontFamily: 'var(--font-accent)',
            fontSize: 'clamp(0.5rem, 2vw, 0.8rem)',
            fontWeight: 700,
            letterSpacing: '0.5em',
            color: 'var(--color-gold)',
            textTransform: 'uppercase',
            marginTop: 6,
            animation: 'loaderFadeIn 0.6s 0.2s ease forwards',
            opacity: 0,
          }}
        >
          NO MATO
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginTop: '3rem',
            width: 'clamp(120px, 30vw, 240px)',
            height: 1,
            background: 'rgba(245,237,216,0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(to right, var(--color-brown), var(--color-gold))',
              transition: 'width 0.05s linear',
            }}
          />
        </div>

        {/* Counter */}
        <div
          style={{
            marginTop: '0.75rem',
            fontFamily: 'var(--font-accent)',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'var(--color-muted)',
          }}
        >
          {String(progress).padStart(3, '0')}
        </div>
      </div>

      <style>{`
        @keyframes loaderFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
