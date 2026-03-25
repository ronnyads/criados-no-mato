'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const GOLD = '#C8922A';
const DEFAULT_PW = 'mato2025';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('cnm_admin_auth') === '1') {
      router.replace('/admin/editor');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Get password from localStorage config (falls back to default)
    let storedPw = DEFAULT_PW;
    try {
      const saved = localStorage.getItem('cnm_store_config');
      if (saved) { storedPw = JSON.parse(saved).adminPassword || DEFAULT_PW; }
    } catch { /* ignore */ }

    setTimeout(() => {
      if (password === storedPw) {
        sessionStorage.setItem('cnm_admin_auth', '1');
        router.push('/admin/editor');
      } else {
        setError('Senha incorreta. Tente novamente.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D0B08',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'serif', fontSize: '2rem', fontWeight: 600, color: '#F5EDD8', letterSpacing: '0.08em', marginBottom: 6 }}>
            CRIADOS
          </div>
          <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.5em', color: GOLD, textTransform: 'uppercase' }}>
            NO MATO · ADMIN
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: '#1A1612',
          borderRadius: 12,
          padding: '2.5rem',
          border: '1px solid rgba(200,146,42,0.15)',
        }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#F5EDD8', marginBottom: '0.5rem', margin: '0 0 0.5rem' }}>
            Acesso ao Painel
          </h1>
          <p style={{ color: 'rgba(245,237,216,0.4)', fontSize: '0.82rem', marginBottom: '2rem' }}>
            Insira a senha de administrador para continuar.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Senha de administrador"
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.875rem 3rem 0.875rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${error ? '#ef4444' : 'rgba(245,237,216,0.12)'}`,
                  borderRadius: 8,
                  color: '#F5EDD8',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = GOLD; }}
                onBlur={e => { e.currentTarget.style.borderColor = error ? '#ef4444' : 'rgba(245,237,216,0.12)'; }}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(245,237,216,0.4)', cursor: 'pointer', padding: 0 }}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'left' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                padding: '0.875rem',
                background: password && !loading ? GOLD : 'rgba(200,146,42,0.3)',
                color: '#0D0B08',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: password && !loading ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p style={{ marginTop: '2rem', color: 'rgba(245,237,216,0.2)', fontSize: '0.7rem' }}>
          Senha padrão: mato2025 · Altere nas configurações
        </p>
      </div>
    </div>
  );
}
