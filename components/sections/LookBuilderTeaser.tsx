'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function LookBuilderTeaser() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.2 });

    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 5rem)',
      background: 'linear-gradient(135deg, #110F0B 0%, #1A1410 50%, #110F0B 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,146,42,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-max lbt-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 8vw, 8rem)', alignItems: 'center' }}>
        <style>{`
          @media (max-width: 768px) {
            .lbt-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          }
        `}</style>
        {/* Left */}
        <div>
          <div className="text-label reveal" style={{ marginBottom: '1rem' }}>Monte. Compartilhe. Compre.</div>
          <h2 className="text-section reveal" style={{ transitionDelay: '0.1s', marginBottom: '1.5rem' }}>
            Look Builder
          </h2>
          <p className="reveal" style={{
            transitionDelay: '0.2s',
            color: 'var(--color-muted)',
            fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
            lineHeight: 1.8,
            maxWidth: 420,
            marginBottom: '2.5rem',
          }}>
            Monte seu look completo, veja como fica, compartilhe com os amigos e adicione tudo ao carrinho de uma vez. O primeiro provador digital do campo. 🧢
          </p>
          <Link href="/look-builder" className="btn-primary reveal" style={{ transitionDelay: '0.3s', display: 'inline-flex' }}>
            <span>Montar meu look</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Right — Preview UI */}
        <div className="reveal" style={{ transitionDelay: '0.15s' }}>
          <div style={{
            border: '1px solid rgba(200,146,42,0.2)',
            borderRadius: 8,
            background: '#0D0B08',
            padding: '2rem',
            position: 'relative',
          }}>
            {/* Mock look builder UI */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              {/* Avatar silhouette */}
              <div style={{
                width: 160, height: 220, margin: '0 auto',
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* Body outline */}
                <svg viewBox="0 0 120 200" fill="none" style={{ width: '100%', height: '100%', opacity: 0.6 }}>
                  {/* Head */}
                  <circle cx="60" cy="28" r="20" stroke="rgba(200,146,42,0.4)" strokeWidth="1.5" />
                  {/* Cap */}
                  <path d="M38 22 Q60 8 82 22" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="34" y="21" width="52" height="8" rx="2" fill="rgba(200,146,42,0.8)" />
                  <rect x="30" y="27" width="10" height="2" rx="1" fill="rgba(200,146,42,0.5)" />
                  {/* Body */}
                  <path d="M40 48 L35 110 L45 110 L50 75 L70 75 L75 110 L85 110 L80 48 Z" stroke="rgba(245,237,216,0.15)" strokeWidth="1" fill="rgba(245,237,216,0.03)" />
                  {/* Arms */}
                  <path d="M40 52 L22 90" stroke="rgba(245,237,216,0.15)" strokeWidth="8" strokeLinecap="round" />
                  <path d="M80 52 L98 90" stroke="rgba(245,237,216,0.15)" strokeWidth="8" strokeLinecap="round" />
                  {/* Legs */}
                  <path d="M47 110 L43 175" stroke="rgba(245,237,216,0.15)" strokeWidth="10" strokeLinecap="round" />
                  <path d="M73 110 L77 175" stroke="rgba(245,237,216,0.15)" strokeWidth="10" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-label" style={{ marginBottom: '0.5rem' }}>Boné selecionado</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-gold)' }}>
                Vida de Cowboy
              </div>
            </div>

            {/* Cap options strip */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
              {['🟫','⬛','🟩','🟨','⬜'].map((color, i) => (
                <div key={i} style={{
                  width: 36, height: 36,
                  borderRadius: 4,
                  background: ['#6B4C30','#1A1A1A','#2D4A2D','#B8922A','#E8E0D0'][i],
                  border: i === 0 ? '2px solid var(--color-gold)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem',
                }} />
              ))}
            </div>

            {/* Add all */}
            <div className="btn-primary" style={{
              width: '100%', justifyContent: 'center', padding: '0.75rem',
              fontSize: '0.65rem', opacity: 0.9,
            }}>
              <ShoppingBag size={12} />
              <span>Adicionar Look ao Carrinho</span>
            </div>

            {/* Coming soon slots */}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {['👕 Camiseta', '🏷️ Adesivo'].map(slot => (
                <span key={slot} style={{
                  padding: '0.25rem 0.6rem',
                  border: '1px dashed rgba(200,146,42,0.2)',
                  borderRadius: 3,
                  fontSize: '0.65rem',
                  color: 'var(--color-muted)',
                  fontFamily: 'var(--font-accent)',
                }}>
                  {slot} · em breve
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Mini import for the icon inside the component
function ShoppingBag({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}
