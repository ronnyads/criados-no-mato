'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { ShoppingBag, Share2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

type Slot = { label: string; icon: string; active: boolean };

const SLOTS: Slot[] = [
  { label: 'Boné', icon: '🧢', active: true },
  { label: 'Camiseta', icon: '👕', active: false },
  { label: 'Adesivo', icon: '🏷️', active: false },
];

export default function LookBuilderPage() {
  const { add } = useCart();
  const { config } = useStoreConfig();
  
  // Pegamos apenas produtos que estão marcados como inLookBuilder e que sejam bonés
  const CAPS = config.products.filter(p => p.category === 'bones' && p.inLookBuilder);
  
  const [selectedCap, setSelectedCap] = useState(CAPS[0] || null);
  const [added, setAdded] = useState(false);

  // Fallback se o CAPS.length mudar
  useEffect(() => {
    if (CAPS.length > 0 && !selectedCap) {
      setSelectedCap(CAPS[0]);
    }
  }, [CAPS, selectedCap]);

  const handleAdd = () => {
    if (!selectedCap) return;
    add(selectedCap);
    setAdded(true);
    toast.success(`${selectedCap.name} adicionado ao carrinho!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    if (!selectedCap) return;
    const text = `🧢 Montei meu look no Criados no Mato!\n\nBoné: ${selectedCap.name}\nR$ ${selectedCap.price.toFixed(2).replace('.', ',')}\n\nCrie o seu: criadosnomato.com.br`;
    if (navigator.share) {
      await navigator.share({ text, url: 'https://criadosnomato.com.br' });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Link copiado! Cole no WhatsApp ou Instagram 📲');
    }
  };

  if (!selectedCap) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0D0B08', paddingTop: 'var(--header-h)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
        Nenhum produto configurado para o Look Builder.
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0D0B08', paddingTop: 'var(--header-h)' }}>
      {/* Hero strip */}
      <div style={{
        borderBottom: '1px solid rgba(200,146,42,0.1)',
        padding: '3rem clamp(1.5rem,5vw,5rem)',
        textAlign: 'center',
      }}>
        <div className="text-label" style={{ marginBottom: '0.75rem' }}>Look Builder</div>
        <h1 className="text-section">Monte seu Look</h1>
        <p style={{ color: 'var(--color-muted)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
          Escolha o boné, veja como fica e adicione ao carrinho em um clique.
        </p>
      </div>

      {/* Main builder */}
      <div className="lb-layout" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        maxWidth: 1100,
        margin: '0 auto',
        gap: 0,
        padding: '3rem clamp(1rem,5vw,5rem)',
        alignItems: 'start',
      }}>
        <style>{`
          @media (max-width: 768px) {
            .lb-layout { grid-template-columns: 1fr !important; }
          }
        `}</style>
        {/* Left — Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{
            position: 'relative',
            width: 280,
            height: 420,
            border: '1px solid rgba(200,146,42,0.15)',
            borderRadius: 8,
            background: 'linear-gradient(180deg, #110F0B 0%, #0D0B08 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {/* glow behind avatar */}
            <div style={{
              position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,146,42,0.08) 0%, transparent 70%)',
            }} />

            <svg viewBox="0 0 140 260" fill="none" style={{ width: 220, height: 330, position: 'relative', zIndex: 1 }}>
              {/* Head */}
              <circle cx="70" cy="42" r="26" fill="#1E1810" stroke="rgba(245,237,216,0.1)" strokeWidth="1.5" />

              {/* Cap — color from selected product */}
              <path d="M42 36 Q70 18 98 36" stroke="rgba(200,146,42,0.6)" strokeWidth="1" />
              <rect x="38" y="34" width="64" height="11" rx="3"
                fill={CAP_COLORS[selectedCap.color ?? ''] ?? '#6B4C30'}
                style={{ transition: 'fill 0.4s' }}
              />
              {/* Cap brim */}
              <rect x="32" y="43" width="18" height="3" rx="1.5"
                fill={CAP_COLORS[selectedCap.color ?? ''] ?? '#6B4C30'}
                style={{ transition: 'fill 0.4s' }} opacity="0.8"
              />
              {/* Cap logo dot */}
              <circle cx="70" cy="39" r="2.5" fill="rgba(200,146,42,0.7)" />

              {/* Face */}
              <ellipse cx="63" cy="48" rx="3" ry="3.5" fill="#2A2018" />
              <ellipse cx="77" cy="48" rx="3" ry="3.5" fill="#2A2018" />
              <path d="M64 56 Q70 60 76 56" stroke="rgba(245,237,216,0.3)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

              {/* Neck */}
              <rect x="64" y="67" width="12" height="14" rx="3" fill="#1A1410" />

              {/* Shirt body */}
              <path d="M35 82 Q45 72 55 78 L55 82 L85 82 L85 78 Q95 72 105 82 L108 155 L32 155 Z"
                fill="#1A1410" stroke="rgba(245,237,216,0.08)" strokeWidth="1" />
              {/* Shirt collar */}
              <path d="M55 78 Q70 90 85 78" stroke="rgba(245,237,216,0.15)" strokeWidth="1.5" fill="none" />

              {/* Arms */}
              <path d="M35 82 L18 130" stroke="#1A1410" strokeWidth="22" strokeLinecap="round" />
              <path d="M105 82 L122 130" stroke="#1A1410" strokeWidth="22" strokeLinecap="round" />

              {/* Hands */}
              <ellipse cx="17" cy="134" rx="8" ry="9" fill="#1E1810" />
              <ellipse cx="123" cy="134" rx="8" ry="9" fill="#1E1810" />

              {/* Belt */}
              <rect x="32" y="152" width="76" height="8" rx="2" fill="#2A1F14" />
              <rect x="66" y="153" width="8" height="6" rx="1" fill="rgba(200,146,42,0.6)" />

              {/* Pants */}
              <path d="M32 158 L40 240 L62 240 L70 200 L78 240 L100 240 L108 158 Z"
                fill="#1A1612" stroke="rgba(245,237,216,0.05)" strokeWidth="1" />

              {/* Boots */}
              <path d="M40 240 L36 256 L58 256 L62 240 Z" fill="#2A1F14" />
              <path d="M78 240 L82 256 L104 256 L100 240 Z" fill="#2A1F14" />
              <path d="M33 254 Q47 258 58 255" stroke="rgba(200,146,42,0.3)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M82 254 Q96 258 107 255" stroke="rgba(200,146,42,0.3)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>

            {/* Selected label */}
            <div style={{
              position: 'absolute', bottom: '1rem', left: 0, right: 0,
              textAlign: 'center',
            }}>
              <div className="text-label">{selectedCap.name}</div>
              <div style={{ fontFamily: 'var(--font-accent)', fontSize: '0.9rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                R$ {selectedCap.price.toFixed(2).replace('.', ',')}
              </div>
            </div>
          </div>

          {/* Slot tags */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {SLOTS.map(slot => (
              <span key={slot.label} style={{
                padding: '0.3rem 0.75rem',
                border: slot.active ? '1px solid rgba(200,146,42,0.5)' : '1px dashed rgba(200,146,42,0.15)',
                borderRadius: 3,
                fontSize: '0.7rem',
                color: slot.active ? 'var(--color-gold)' : 'var(--color-muted)',
                fontFamily: 'var(--font-accent)',
                background: slot.active ? 'rgba(200,146,42,0.05)' : 'transparent',
              }}>
                {slot.icon} {slot.label}{!slot.active && ' · em breve'}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: 280 }}>
            <button
              onClick={handleAdd}
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}
            >
              {added ? <Check size={16} /> : <ShoppingBag size={16} />}
              <span>{added ? 'Adicionado!' : 'Adicionar'}</span>
            </button>
            <button
              onClick={handleShare}
              className="btn-outline"
              style={{ padding: '1rem 1.25rem' }}
              title="Compartilhar look"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Right — Cap Selector */}
        <div>
          <div className="text-label" style={{ marginBottom: '1.5rem' }}>Escolha o Boné</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1px',
            background: 'rgba(200,146,42,0.08)',
          }}>
            {CAPS.map(cap => (
              <button
                key={cap.id}
                onClick={() => setSelectedCap(cap)}
                style={{
                  background: selectedCap.id === cap.id ? '#1A1612' : '#110F0B',
                  border: 'none',
                  padding: '1.25rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                }}
              >
                {/* Color swatch */}
                  <div style={{
                    width: '100%',
                    height: 80,
                    borderRadius: 4,
                    background: cap.image ? '#0F0D0A' : (CAP_COLORS[cap.color ?? ''] ?? '#2A1F14'),
                    marginBottom: '0.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem',
                    transition: 'all 0.3s',
                    overflow: 'hidden',
                  }}>
                    {cap.image ? (
                      <img src={cap.image} alt={cap.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span>🧢</span>
                    )}
                  </div>

                {/* Info */}
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--color-sand)', marginBottom: '0.2rem' }}>
                  {cap.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>
                  {cap.color}
                </div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                  R$ {cap.price.toFixed(2).replace('.', ',')}
                </div>

                {/* Stock badge */}
                {cap.stock <= 10 && (
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    <span className="badge-limited">Últimas!</span>
                  </div>
                )}

                {/* Selected indicator */}
                {selectedCap.id === cap.id && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 2,
                    background: 'var(--color-gold)',
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Map color names to CSS colors
const CAP_COLORS: Record<string, string> = {
  'Cáqui':       '#8B7355',
  'Preto':       '#1A1A1A',
  'Verde':       '#2D4A2D',
  'Marrom':      '#6B4C30',
  'Areia':       '#C4A882',
  'Palha':       '#D4C090',
  'Preto Total': '#0D0D0D',
  'Camuflado':   '#4A5C3A',
  '':            '#2A1F14',
};
