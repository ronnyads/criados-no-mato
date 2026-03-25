'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreConfig } from '@/context/StoreConfigContext';

const GOLD = '#C8922A';

const CAP_COLORS: Record<string, string> = {
  'Cáqui': '#8B7355',
  'Preto': '#1A1A1A',
  'Verde': '#2D4A2D',
  'Marrom': '#6B4C30',
  'Areia': '#C4A882',
  'Preto Total': '#0D0D0D',
  'Camuflado': '#4A5C3A',
  '': '#8B7355',
};

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => onChange(!value)}>
      <div style={{
        width: 36, height: 20, borderRadius: 10,
        background: value ? GOLD : '#DDD',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 2, left: value ? 18 : 2,
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      <span style={{ fontSize: '0.8rem', color: '#444', userSelect: 'none' }}>{label}</span>
    </div>
  );
}

function AvatarSVG({ capColor }: { capColor: string }) {
  return (
    <svg viewBox="0 0 140 260" style={{ width: 120, height: 220 }}>
      {/* Head */}
      <circle cx="70" cy="55" r="28" fill="#5C3D2E" />
      {/* Cap brim */}
      <ellipse cx="70" cy="32" rx="38" ry="6" fill={capColor} />
      {/* Cap body */}
      <path d="M35 32 Q35 10 70 10 Q105 10 105 32 Z" fill={capColor} />
      {/* Cap logo dot */}
      <circle cx="70" cy="22" r="3" fill="rgba(255,255,255,0.3)" />
      {/* Face details */}
      <circle cx="62" cy="55" r="3" fill="#3A2616" />
      <circle cx="78" cy="55" r="3" fill="#3A2616" />
      <path d="M63 66 Q70 72 77 66" stroke="#3A2616" strokeWidth="1.5" fill="none" />
      {/* Body */}
      <rect x="45" y="88" width="50" height="70" rx="5" fill="#2C2C2C" />
      {/* Arms */}
      <rect x="20" y="90" width="25" height="55" rx="8" fill="#2C2C2C" />
      <rect x="95" y="90" width="25" height="55" rx="8" fill="#2C2C2C" />
      {/* Hands */}
      <circle cx="32" cy="148" r="9" fill="#5C3D2E" />
      <circle cx="108" cy="148" r="9" fill="#5C3D2E" />
      {/* Belt */}
      <rect x="43" y="150" width="54" height="10" rx="2" fill="#8B6914" />
      <rect x="65" y="151" width="10" height="8" rx="1" fill={GOLD} />
      {/* Legs */}
      <rect x="45" y="158" width="22" height="72" rx="5" fill="#1A1A1A" />
      <rect x="73" y="158" width="22" height="72" rx="5" fill="#1A1A1A" />
      {/* Boots */}
      <rect x="40" y="218" width="30" height="18" rx="4" fill="#4A3220" />
      <rect x="70" y="218" width="30" height="18" rx="4" fill="#4A3220" />
    </svg>
  );
}

export default function LookBuilderAdminPage() {
  const router = useRouter();
  const { config, updateProduct, updateSlot } = useStoreConfig();
  const [previewProductId, setPreviewProductId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('cnm_admin_auth') !== '1') {
      router.replace('/admin');
    }
    // Set default preview to first enabled product
    const first = config.products.find(p => p.inLookBuilder && p.category === 'bones');
    if (first) setPreviewProductId(first.id);
  }, [router]);

  const lookBuilderProducts = config.products.filter(p => p.category === 'bones');
  const previewProduct = config.products.find(p => p.id === previewProductId);
  const capColor = CAP_COLORS[previewProduct?.color || ''] || '#8B7355';

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#111' }}>Look Builder Config</h1>
        <p style={{ margin: '4px 0 0', color: '#888', fontSize: '0.85rem' }}>Configure quais produtos aparecem na gamificação e gerencie os slots disponíveis.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Left — config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Slots */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EBEBEB', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111' }}>🎮 Slots Disponíveis</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {config.lookBuilderSlots.map(slot => (
                <div key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#F8F8F8', borderRadius: 8, border: `1px solid ${slot.active ? '#E8F4E8' : '#EBEBEB'}` }}>
                  <span style={{ fontSize: '1.5rem' }}>{slot.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>{slot.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 2 }}>
                      {slot.active ? (slot.comingSoon ? '⏳ Em breve' : '✅ Ativo') : '❌ Desativado'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Toggle
                      value={slot.active}
                      onChange={v => updateSlot(slot.id, { active: v })}
                      label="Ativo"
                    />
                    <Toggle
                      value={slot.comingSoon}
                      onChange={v => updateSlot(slot.id, { comingSoon: v })}
                      label="Em breve"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products in Look Builder */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EBEBEB', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: '#111' }}>🧢 Bonés no Look Builder</h2>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', color: '#888' }}>Ative/desative quais bonés aparecem como opção na gamificação. Clique para visualizar no preview.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lookBuilderProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => setPreviewProductId(p.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.85rem 1rem',
                    background: previewProductId === p.id ? '#FEF9EC' : '#F8F8F8',
                    borderRadius: 8,
                    border: `1px solid ${previewProductId === p.id ? GOLD : '#EBEBEB'}`,
                    cursor: 'pointer',
                  }}
                >
                  {/* Color swatch */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: CAP_COLORS[p.color || ''] || '#8B7355',
                    flexShrink: 0,
                    border: '1px solid rgba(0,0,0,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem',
                  }}>
                    {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7 }} /> : '🧢'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#888' }}>{p.color} · R$ {p.price.toFixed(2)} · Estoque: {p.stock}</div>
                  </div>
                  <Toggle
                    value={p.inLookBuilder}
                    onChange={v => updateProduct(p.id, { inLookBuilder: v })}
                    label=""
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: '#F0FDF4', borderRadius: 12, border: '1px solid #BBF7D0', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600, marginBottom: 4 }}>
              ✅ Configuração atual
            </div>
            <div style={{ fontSize: '0.8rem', color: '#166534' }}>
              {config.products.filter(p => p.inLookBuilder).length} produtos ativos no Look Builder ·{' '}
              {config.lookBuilderSlots.filter(s => s.active && !s.comingSoon).length} slots totalmente ativos
            </div>
          </div>
        </div>

        {/* Right — Avatar Preview */}
        <div style={{ background: '#0D0B08', borderRadius: 16, padding: '2rem', textAlign: 'center', position: 'sticky', top: '1rem' }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', color: GOLD, marginBottom: '1rem', textTransform: 'uppercase' }}>
            Preview ao vivo
          </div>
          <div style={{ background: 'rgba(200,146,42,0.08)', borderRadius: 12, padding: '1.5rem 1rem', marginBottom: '1rem', display: 'inline-block' }}>
            <AvatarSVG capColor={capColor} />
          </div>
          {previewProduct && (
            <div>
              <div style={{ fontFamily: 'serif', fontSize: '1rem', fontWeight: 600, color: '#F5EDD8', marginBottom: 2 }}>
                {previewProduct.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(245,237,216,0.4)', marginBottom: 6 }}>
                {previewProduct.color}
              </div>
              <div style={{ color: GOLD, fontWeight: 700, fontSize: '0.95rem' }}>
                R$ {previewProduct.price.toFixed(2)}
              </div>
            </div>
          )}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {config.lookBuilderSlots.map(slot => (
              <span key={slot.id} style={{
                padding: '0.25rem 0.6rem',
                border: slot.active && !slot.comingSoon ? `1px solid ${GOLD}` : '1px dashed rgba(245,237,216,0.2)',
                borderRadius: 20,
                fontSize: '0.65rem',
                color: slot.active && !slot.comingSoon ? GOLD : 'rgba(245,237,216,0.3)',
              }}>
                {slot.icon} {slot.label} {slot.comingSoon ? '(em breve)' : slot.active ? '✓' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
