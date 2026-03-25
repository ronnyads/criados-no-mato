'use client';
import { useEffect, useRef } from 'react';
import { useStoreConfig } from '@/context/StoreConfigContext';

export default function Manifesto() {
  const { config } = useStoreConfig();
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
      <div className="hide-mobile" style={{
        position: 'absolute',
        left: 'clamp(0.5rem, 1vw, 1rem)',
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
        zIndex: 10,
      }}>
        Manifesto — 2024
      </div>

      <div className="container-max" style={{ paddingLeft: 'clamp(1rem, 4vw, 4rem)', position: 'relative', zIndex: 2 }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: config.manifestoImage ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr', 
          gap: 'clamp(3rem, 8vw, 6rem)',
          alignItems: 'center',
        }}>
          
          {/* Editorial Image (if uploaded) */}
          {config.manifestoImage && (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: 4, overflow: 'hidden' }}>
              <img 
                src={config.manifestoImage} 
                alt="Manifesto" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 100px rgba(13,11,8,0.5)', pointerEvents: 'none' }} />
              {/* Decorative corner accents */}
              <div style={{ position: 'absolute', top: 16, left: 16, width: 24, height: 24, borderTop: '1px solid var(--color-gold)', borderLeft: '1px solid var(--color-gold)' }} />
              <div style={{ position: 'absolute', bottom: 16, right: 16, width: 24, height: 24, borderBottom: '1px solid var(--color-gold)', borderRight: '1px solid var(--color-gold)' }} />
            </div>
          )}

          {/* Text Content */}
          <div>
            <div ref={lineRef} className="reveal" style={{ marginBottom: '2rem' }}>
              <div className="text-label">Nossa essência</div>
            </div>

            <div ref={textRef} className="reveal" style={{ transitionDelay: '0.1s' }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: config.manifestoImage ? 'clamp(1.6rem, 3.5vw, 2.75rem)' : 'clamp(1.8rem, 4vw, 3.2rem)',
                fontWeight: 400,
                lineHeight: 1.35,
                color: 'var(--color-sand)',
                maxWidth: 800,
                fontStyle: 'italic',
              }}>
                "{config.manifestoQuote}{' '}
                <em style={{ color: 'var(--color-gold)', fontStyle: 'normal' }}>{config.manifestoHighlight}</em>."
              </p>

              <div style={{
                width: 'clamp(3rem, 8vw, 7rem)',
                height: 1,
                background: 'linear-gradient(to right, var(--color-gold), transparent)',
                margin: '3rem 0',
              }} />

              <div style={{ display: 'flex', gap: 'clamp(2rem, 5vw, 4rem)', flexWrap: 'wrap' }}>
                {config.manifestoStats.map((stat, idx) => (
                  <div key={idx}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2rem, 4vw, 3rem)',
                      fontWeight: 600,
                      color: 'var(--color-gold)',
                      lineHeight: 1,
                    }}>
                      {stat.value}
                    </div>
                    <div className="text-label" style={{ color: 'var(--color-muted)', marginTop: '0.5rem', fontSize: '0.65rem' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
