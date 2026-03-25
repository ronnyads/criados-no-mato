'use client';
import { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Guilherme R.',
    location: 'Uberaba, MG',
    rating: 5,
    text: 'Melhor boné que já usei. O acabamento é impecável, bordado firme e o tecido não desbota. Comprei o Vida de Cowboy e já pedi mais dois.',
    product: 'Vida de Cowboy',
    initials: 'GR',
    color: '#8B6340',
  },
  {
    name: 'Leonardo M.',
    location: 'Goiânia, GO',
    rating: 5,
    text: 'Chegou rápido, embalagem cuidadosa. Qualidade absurda pro preço. Uso todo dia no trabalho na fazenda e ainda vai pra balada à noite.',
    product: 'The Black',
    initials: 'LM',
    color: '#4A3728',
  },
  {
    name: 'Caio B.',
    location: 'Ribeirão Preto, SP',
    rating: 5,
    text: 'Recebi elogio de todo mundo na rodeio. Parece caro, mas é bem acessível. A marca tem identidade de verdade, diferente das outras.',
    product: 'Boiadeiro',
    initials: 'CB',
    color: '#6B5040',
  },
  {
    name: 'Rafael O.',
    location: 'Campo Grande, MS',
    rating: 5,
    text: 'Comprei pra mim e pra dois amigos. Todos apaixonados. O site já me deixou com vontade de comprar antes mesmo de ver o produto.',
    product: 'Caçador',
    initials: 'RO',
    color: '#3D5240',
  },
];

const STATS = [
  { value: '4.9★', label: 'Avaliação média' },
  { value: '+1.200', label: 'Clientes felizes' },
  { value: '97%', label: 'Recomendam' },
  { value: '2 dias', label: 'Entrega média' },
];

export default function SocialProof() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.08 });
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ background: '#0F0C09', padding: 'clamp(5rem,10vw,9rem) clamp(1.25rem,5vw,5rem)' }}>
      <div className="container-max">

        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="text-label" style={{ marginBottom: '0.75rem' }}>Avaliações</div>
          <h2 className="text-section" style={{ marginBottom: '1rem' }}>Eles falaram primeiro</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '0.75rem' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="var(--color-gold)" color="var(--color-gold)" />
            ))}
          </div>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            4.9 de 5 · baseado em +320 avaliações verificadas
          </p>
        </div>

        {/* Stats bar */}
        <div className="reveal sp-stats" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid rgba(200,146,42,0.15)',
          borderBottom: '1px solid rgba(200,146,42,0.15)',
          marginBottom: '5rem',
          transitionDelay: '0.1s',
        }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{
              padding: 'clamp(1.5rem, 3vw, 2.5rem) 1rem',
              textAlign: 'center',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(200,146,42,0.08)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: 600,
                color: 'var(--color-gold)',
                lineHeight: 1,
                marginBottom: '0.5rem',
              }}>
                {stat.value}
              </div>
              <div className="text-label" style={{ color: 'var(--color-muted)', fontSize: '0.6rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
          <style>{`
            @media (max-width: 768px) {
              .sp-stats { grid-template-columns: repeat(2, 1fr) !important; }
              .sp-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>

        {/* Testimonials grid */}
        <div className="sp-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1px',
          background: 'rgba(200,146,42,0.08)',
        }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="reveal"
              style={{
                background: '#0F0C09',
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                position: 'relative',
                transitionDelay: `${i * 0.07}s`,
              }}
            >
              {/* Quote icon */}
              <div style={{ marginBottom: '1.25rem', opacity: 0.25 }}>
                <Quote size={28} color="var(--color-gold)" strokeWidth={1} />
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={12} fill="var(--color-gold)" color="var(--color-gold)" />
                ))}
              </div>

              {/* Text */}
              <p style={{
                color: 'var(--color-sand)',
                fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
                fontStyle: 'italic',
                opacity: 0.85,
              }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: t.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-accent)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'rgba(245,237,216,0.8)',
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-sand)' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
                    {t.location} · {t.product}
                  </div>
                </div>

                {/* Verified badge */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }} />
                  <span style={{ fontSize: '0.6rem', color: 'var(--color-muted)', fontFamily: 'var(--font-accent)' }}>VERIFICADO</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="reveal" style={{ textAlign: 'center', marginTop: '4rem', transitionDelay: '0.3s' }}>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Junte-se a mais de 1.200 pessoas que já escolheram autenticidade.
          </p>
          <a href="/colecao" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            <span>Ver a Coleção Completa</span>
          </a>
        </div>

      </div>
    </section>
  );
}
