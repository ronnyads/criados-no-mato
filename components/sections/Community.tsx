'use client';
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

const IG_POSTS = [
  { id: 1, emoji: '🧢', caption: 'Vida de Cowboy no campo' },
  { id: 2, emoji: '🐄', caption: 'Do jeito que nasceu pra ser' },
  { id: 3, emoji: '🌾', caption: 'Boiadeiro original' },
  { id: 4, emoji: '🤠', caption: 'The Black — puro estilo' },
  { id: 5, emoji: '🍂', caption: 'Caçador — natureza em forma' },
  { id: 6, emoji: '⭐', caption: 'Criados no Mato' },
];

export default function Community() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.1 });
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section" style={{ background: '#0D0B08' }}>
      <div className="container-max">
        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="text-label" style={{ marginBottom: '0.75rem' }}>Comunidade</div>
          <h2 className="text-section" style={{ marginBottom: '1rem' }}>Do Mato pra Vida</h2>
          <p style={{ color: 'var(--color-muted)', maxWidth: 480, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Quem usa Criados no Mato não é só cliente — é família. Mostre seu estilo e faça parte.
          </p>
        </div>

        {/* IG Grid */}
        <div className="reveal" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
          marginBottom: '3rem',
          transitionDelay: '0.1s',
        }}>
          {IG_POSTS.map((post, i) => (
            <a
              key={post.id}
              href="https://www.instagram.com/criadosnomato"
              target="_blank"
              rel="noopener"
              style={{
                aspectRatio: '1',
                background: `hsl(${28 + i * 8}, ${15 + i * 3}%, ${10 + i}%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: '3rem' }}>{post.emoji}</span>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(13,11,8,0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
              >
                <InstagramIcon size={24} />
                <span style={{ fontSize: '0.7rem', color: 'var(--color-sand)', textAlign: 'center', padding: '0 0.5rem', fontFamily: 'var(--font-sans)' }}>
                  {post.caption}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="reveal" style={{ textAlign: 'center', transitionDelay: '0.2s' }}>
          <a
            href="https://www.instagram.com/criadosnomato"
            target="_blank"
            rel="noopener"
            className="btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <InstagramIcon size={14} />
            <span>Seguir no Instagram</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
