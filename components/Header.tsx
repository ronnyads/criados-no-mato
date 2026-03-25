'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { count, toggle } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <CartDrawer />
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: 'var(--header-h)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          transition: 'background 0.5s, border-color 0.5s',
          background: scrolled ? 'rgba(13,11,8,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(200,146,42,0.15)' : '1px solid transparent',
        }}
      >
        {/* Left nav */}
        <nav style={{ display: 'flex', gap: '2rem', flex: 1 }}>
          <Link href="/colecao" className="text-label" style={{ color: 'rgba(245,237,216,0.6)', letterSpacing: '0.15em', fontSize: '0.7rem', textDecoration: 'none', transition: 'color 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,237,216,0.6)')}
          >Coleção</Link>
          <Link href="/look-builder" className="text-label" style={{ color: 'rgba(245,237,216,0.6)', letterSpacing: '0.15em', fontSize: '0.7rem', textDecoration: 'none', transition: 'color 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,237,216,0.6)')}
          >Monte seu Look</Link>
        </nav>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-sand)', letterSpacing: '0.08em', lineHeight: 1 }}>
              CRIADOS
            </div>
            <div style={{ fontFamily: 'var(--font-accent)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.4em', color: 'var(--color-gold)', textTransform: 'uppercase', marginTop: '2px' }}>
              NO MATO
            </div>
          </div>
        </Link>

        {/* Right */}
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
    </>
  );
}
