'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import { usePathname } from 'next/navigation';
import { useStoreConfig } from '@/context/StoreConfigContext';

export default function Header() {
  const pathname = usePathname();
  const { config } = useStoreConfig();
  const { count, toggle } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Hide completely on admin routes (after all hooks)
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <CartDrawer />

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1050,
          background: '#0D0B08',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '3rem',
        }}>
          <button onClick={() => setMenuOpen(false)}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--color-sand)' }}>
            <X size={24} strokeWidth={1.5} />
          </button>

          {[
            { href: '/colecao', label: 'Coleção' },
            { href: '/look-builder', label: 'Monte seu Look 🎮' },
          ].map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 500, color: 'var(--color-sand)', textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-sand)')}>
              {link.label}
            </Link>
          ))}

          <div style={{ width: 60, height: 1, background: 'rgba(200,146,42,0.3)' }} />
          <a href={config.instagramUrl} target="_blank" rel="noopener"
            style={{ fontFamily: 'var(--font-accent)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--color-muted)', textDecoration: 'none' }}>
            @CRIADOSNOMATO
          </a>
        </div>
      )}

      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 'var(--header-h)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        padding: '0 clamp(1rem, 4vw, 4rem)',
        transition: 'background 0.5s, border-color 0.5s',
        background: scrolled ? 'rgba(13,11,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(200,146,42,0.15)' : '1px solid transparent',
      }}>
        {/* Left — desktop nav / mobile hamburger */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <nav style={{ display: 'none' }} className="desktop-nav">
            <Link href="/colecao" style={{ color: 'rgba(245,237,216,0.6)', letterSpacing: '0.15em', fontSize: '0.7rem', textDecoration: 'none', fontFamily: 'var(--font-accent)', fontWeight: 700, textTransform: 'uppercase', transition: 'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,237,216,0.6)')}>Coleção</Link>
          </nav>
          <nav style={{ display: 'none' }} className="desktop-nav">
            <Link href="/look-builder" style={{ color: 'rgba(245,237,216,0.6)', letterSpacing: '0.15em', fontSize: '0.7rem', textDecoration: 'none', fontFamily: 'var(--font-accent)', fontWeight: 700, textTransform: 'uppercase', transition: 'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,237,216,0.6)')}>Monte seu Look</Link>
          </nav>

          <button onClick={() => setMenuOpen(true)} className="mobile-menu-btn"
            style={{ background: 'none', border: 'none', color: 'var(--color-sand)', padding: 4, display: 'none' }}>
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Center — Logo (image if uploaded, fallback to text) */}
        <Link href="/" style={{ textDecoration: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          {config.logoImage ? (
            <img src={config.logoImage} alt={config.brandName} style={{ height: 36, objectFit: 'contain', display: 'block' }} />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-sand)', letterSpacing: '0.08em', lineHeight: 1 }}>
                {config.brandName}
              </div>
              <div style={{ fontFamily: 'var(--font-accent)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.4em', color: 'var(--color-gold)', textTransform: 'uppercase', marginTop: '2px' }}>
                {config.brandTagline}
              </div>
            </div>
          )}
        </Link>

        {/* Right — cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'flex-end' }}>
          <button onClick={toggle} style={{ background: 'none', border: 'none', color: 'var(--color-sand)', position: 'relative', padding: '4px' }}>
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0,
                width: '16px', height: '16px',
                borderRadius: '50%',
                background: 'var(--color-gold)',
                color: 'var(--color-earth)',
                fontSize: '0.6rem',
                fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: 'translate(40%, -40%)',
              }}>{count}</span>
            )}
          </button>
        </div>
      </header>

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
