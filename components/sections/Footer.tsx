'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useStoreConfig } from '@/context/StoreConfigContext';

function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

export default function Footer() {
  const { config } = useStoreConfig();

  return (
    <footer style={{
      borderTop: '1px solid rgba(200,146,42,0.1)',
      padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 5rem) clamp(2rem, 4vw, 3rem)',
      background: '#0A0806',
    }}>
      <div className="container-max">
        {/* Top */}
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '3rem',
          marginBottom: '5rem',
          borderBottom: '1px solid rgba(200,146,42,0.08)',
          paddingBottom: '4rem',
        }}>
        <style>{`
          @media (max-width: 768px) {
            .footer-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          }
        `}</style>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-sand)', letterSpacing: '0.05em', lineHeight: 1 }}>
                CRIADOS
              </div>
              <div style={{ fontFamily: 'var(--font-accent)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.4em', color: 'var(--color-gold)', textTransform: 'uppercase', marginTop: '3px' }}>
                NO MATO
              </div>
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', lineHeight: 1.8, maxWidth: 240 }}>
              {config.footerTagline}
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-label" style={{ marginBottom: '1.5rem' }}>Navegue</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { href: '/colecao', label: 'Coleção Completa' },
                { href: '/colecao?cat=bones', label: 'Bonés' },
                { href: '/colecao?cat=adesivos', label: 'Adesivos' },
                { href: '/look-builder', label: 'Look Builder 🎮' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{
                  color: 'var(--color-muted)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <div className="text-label" style={{ marginBottom: '1.5rem' }}>Contato</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noopener"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
              >
                <InstagramIcon size={14} />
                @criadosnomato
                <ArrowUpRight size={12} />
              </a>
              <a
                href={config.contactUrl}
                target="_blank"
                rel="noopener"
                style={{ color: 'var(--color-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
              >
                Fale conosco
              </a>
            </div>

            {/* Newsletter */}
            <div style={{ marginTop: '2rem' }}>
              <div className="text-label" style={{ marginBottom: '0.75rem' }}>Seja o primeiro a saber</div>
              <div style={{ display: 'flex', gap: '0' }}>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  style={{
                    flex: 1,
                    background: '#110F0B',
                    border: '1px solid rgba(200,146,42,0.2)',
                    borderRight: 'none',
                    padding: '0.75rem 1rem',
                    color: 'var(--color-sand)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
                <button className="btn-primary" style={{ padding: '0.75rem 1rem', fontSize: '0.7rem' }}>
                  <span>OK</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
            © 2025 Criados no Mato. Todos os direitos reservados.
          </span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(200,146,42,0.4)', fontFamily: 'var(--font-accent)', letterSpacing: '0.1em' }}>
            FEITO COM ORGULHO DO CAMPO
          </span>
        </div>
      </div>
    </footer>
  );
}
