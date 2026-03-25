'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { products } from '@/lib/products';
import { ShoppingBag, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ColecaoPage() {
  const { add } = useCart();
  const { config } = useStoreConfig();
  const [cat, setCat] = useState<'todos' | 'bones' | 'adesivos'>('todos');
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = cat === 'todos' ? products : products.filter(p => p.category === cat);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.05 });
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  const handleAdd = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    add(product);
    toast.success(`${product.name} adicionado!`);
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#0D0B08', paddingTop: 'var(--header-h)' }}>
      {/* Header Premium com Imagem */}
      <div style={{
        position: 'relative',
        height: config.collectionBannerImage ? 'clamp(300px, 40vh, 500px)' : 'auto',
        padding: config.collectionBannerImage ? '0' : '4rem clamp(1.5rem,5vw,5rem) 2rem',
        borderBottom: '1px solid rgba(200,146,42,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {config.collectionBannerImage && (
          <>
            <img 
              src={config.collectionBannerImage} 
              alt="Coleção Criados no Mato" 
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center',
                opacity: 0.6,
              }}
            />
            {/* Gradiente escuro para legibilidade */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, #0D0B08, transparent 80%)'
            }} />
          </>
        )}
        
        <div style={{
          position: 'relative', zIndex: 2,
          padding: config.collectionBannerImage ? 'clamp(1.5rem, 5vw, 5rem)' : 0,
          marginTop: config.collectionBannerImage ? 'auto' : 0,
        }}>
          <div className="text-label" style={{ marginBottom: '0.75rem', color: config.collectionBannerImage ? 'var(--color-gold)' : 'inherit' }}>
            Criados no Mato
          </div>
          <h1 className="text-section" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            A Coleção
          </h1>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        padding: '1.5rem clamp(1.5rem,5vw,5rem)',
        borderBottom: '1px solid rgba(200,146,42,0.08)',
        display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <SlidersHorizontal size={14} color="var(--color-muted)" strokeWidth={1.5} />
        {(['todos', 'bones', 'adesivos'] as const).map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              padding: '0.4rem 1.2rem',
              border: `1px solid ${cat === c ? 'rgba(200,146,42,0.6)' : 'rgba(200,146,42,0.15)'}`,
              background: cat === c ? 'rgba(200,146,42,0.1)' : 'transparent',
              color: cat === c ? 'var(--color-gold)' : 'var(--color-muted)',
              fontFamily: 'var(--font-accent)',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'capitalize',
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderRadius: 2,
            }}
          >
            {c === 'todos' ? 'Todos' : c === 'bones' ? 'Bonés' : 'Adesivos'}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
          {filtered.length} produtos
        </span>
      </div>

      {/* Grid */}
      <section ref={sectionRef} className="section">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px,100%), 1fr))',
          gap: '1px',
          background: 'rgba(200,146,42,0.08)',
        }}>
          {filtered.map((product, i) => (
            <Link
              href={`/produto/${product.slug}`}
              key={product.id}
              className="product-card reveal"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <div style={{ position: 'relative' }}>
                <div
                  className="product-card-img"
                  style={{
                    background: `hsl(${28 + i * 12}, ${18 + i * 4}%, ${9 + i}%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '3.5rem' }}>
                    {product.category === 'bones' ? '🧢' : '🏷️'}
                  </span>
                </div>

                {product.stock <= 10 && (
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                    <span className="badge-limited">Últimas {product.stock}</span>
                  </div>
                )}

                <div className="product-card-overlay">
                  <button
                    onClick={e => handleAdd(e, product)}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', fontSize: '0.65rem', flex: 1, justifyContent: 'center' }}
                  >
                    <ShoppingBag size={12} />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>

              <div style={{ padding: '1.25rem', background: '#110F0B' }}>
                <div className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '0.4rem' }}>
                  {product.sku}{product.color ? ` · ${product.color}` : ''}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                  {product.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-accent)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-gold)' }}>
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  {product.price > 50 && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
                      4x de R$ {(product.price / 4).toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
