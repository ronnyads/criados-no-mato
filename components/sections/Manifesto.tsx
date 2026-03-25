'use client';
import { useEffect, useRef } from 'react';

export default function Manifesto() {
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    if (lineRef.current)  observer.observe(lineRef.current);
    if (textRef.current)  observer.observe(textRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{
      padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 5rem)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Side text */}
      <div style={{
        position: 'absolute',
        left: 'clamp(1rem, 2vw, 2rem)',
        top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
        transformOrigin: 'center',
        fontFamily: 'var(--font-accent)',
        fontSize: '0.6rem',
        fontWeight: 700,
        letterSpacing: '0.3em',
        color: 'rgba(200,146,42,0.4)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        Manifesto — 2024
      </div>

      <div className="container-max" style={{ paddingLeft: 'clamp(2rem, 6vw, 6rem)' }}>
        <div ref={lineRef} className="reveal" style={{ marginBottom: '2rem' }}>
          <div className="text-label">Nossa essência</div>
        </div>

        <div ref={textRef} className="reveal" style={{ transitionDelay: '0.1s' }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
            fontWeight: 400,
            lineHeight: 1.35,
            color: 'var(--color-sand)',
            maxWidth: 800,
            fontStyle: 'italic',
          }}>
            "Nascemos no campo, crescemos no estilo. Cada boné carrega o cheiro de terra molhada,
            a força do sol no couro e a liberdade de quem escolheu viver do jeito
            que <em style={{ color: 'var(--color-gold)', fontStyle: 'normal' }}>nasceu pra ser</em>."
          </p>

          <div style={{
            width: 'clamp(3rem, 8vw, 7rem)',
            height: 1,
            background: 'linear-gradient(to right, var(--color-gold), transparent)',
            margin: '3rem 0',
          }} />

          <div style={{ display: 'flex', gap: 'clamp(3rem, 8vw, 8rem)', flexWrap: 'wrap' }}>
            {[
              { num: '018+', label: 'Modelos únicos' },
              { num: '10K+', label: 'Do Mato pra vida' },
              { num: '100%', label: 'Identidade autêntica' },
            ].map(stat => (
              <div key={stat.num}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 600,
                  color: 'var(--color-gold)',
                  lineHeight: 1,
                }}>
                  {stat.num}
                </div>
                <div className="text-label" style={{ color: 'var(--color-muted)', marginTop: '0.5rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
