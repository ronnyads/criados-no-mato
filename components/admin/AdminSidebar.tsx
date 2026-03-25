'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Palette, Package, Gamepad2, LogOut, ExternalLink } from 'lucide-react';

const NAV = [
  { href: '/admin/editor', icon: Palette, label: 'Editor de Tema' },
  { href: '/admin/produtos', icon: Package, label: 'Produtos' },
  { href: '/admin/look-builder', icon: Gamepad2, label: 'Look Builder' },
];

const GOLD = '#C8922A';

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem('cnm_admin_auth');
    window.location.href = '/admin';
  };

  return (
    <aside style={{
      width: 240,
      background: '#1A1612',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontFamily: 'serif', fontSize: '1.1rem', fontWeight: 600, color: '#F5EDD8', letterSpacing: '0.08em' }}>
          CRIADOS
        </div>
        <div style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.4em', color: GOLD, textTransform: 'uppercase', marginTop: 2 }}>
          NO MATO · ADMIN
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '1rem 0', flex: 1 }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.25rem',
              textDecoration: 'none',
              color: active ? '#F5EDD8' : 'rgba(245,237,216,0.5)',
              background: active ? 'rgba(200,146,42,0.12)' : 'transparent',
              borderLeft: active ? `3px solid ${GOLD}` : '3px solid transparent',
              fontSize: '0.82rem',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}>
              <Icon size={16} strokeWidth={1.5} color={active ? GOLD : 'rgba(245,237,216,0.4)'} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer links */}
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <a
          href="/"
          target="_blank"
          rel="noopener"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(245,237,216,0.4)', fontSize: '0.75rem', textDecoration: 'none' }}
        >
          <ExternalLink size={13} />
          Ver loja
        </a>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'rgba(245,237,216,0.4)', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
        >
          <LogOut size={13} />
          Sair
        </button>
      </div>
    </aside>
  );
}
