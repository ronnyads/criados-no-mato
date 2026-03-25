'use client';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
  const { state, remove, updateQty, toggle, total } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={toggle}
        style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(13,11,8,0.75)',
          backdropFilter: 'blur(4px)',
          opacity: state.isOpen ? 1 : 0,
          pointerEvents: state.isOpen ? 'all' : 'none',
          transition: 'opacity 0.4s',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(460px, 100vw)',
        zIndex: 1200,
        background: '#110F0B',
        borderLeft: '1px solid rgba(200,146,42,0.15)',
        display: 'flex', flexDirection: 'column',
        transform: state.isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(200,146,42,0.1)' }}>
          <span className="text-label">Seu Carrinho</span>
          <button onClick={toggle} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', padding: '4px' }}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {state.items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', color: 'var(--color-muted)' }}>
              <ShoppingBag size={40} strokeWidth={1} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Carrinho vazio</p>
              <p style={{ fontSize: '0.85rem', textAlign: 'center' }}>Adicione um boné e monte seu estilo</p>
            </div>
          ) : state.items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 80, height: 80, background: '#1A1512', flexShrink: 0, overflow: 'hidden', borderRadius: 2 }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 500, marginBottom: '0.25rem' }}>{item.name}</div>
                {item.color && <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>{item.color}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(200,146,42,0.2)', padding: '0.25rem 0.5rem' }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', display: 'flex' }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.85rem', minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', display: 'flex' }}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', fontSize: '0.7rem', letterSpacing: '0.1em', textDecoration: 'underline' }}>
                    Remover
                  </button>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-accent)', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-gold)', flexShrink: 0 }}>
                R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(200,146,42,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '1rem', textAlign: 'center' }}>
              💳 Pix: 5% OFF · Parcelamento em até 4x sem juros
            </div>
            <a
              href={`https://criadosnomato.com.br/`}
              target="_blank"
              rel="noopener"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
            >
              Finalizar Pedido
            </a>
          </div>
        )}
      </div>
    </>
  );
}
