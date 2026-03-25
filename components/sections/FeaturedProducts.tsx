'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeaturedProducts() {
  const { add } = useCart();
  const { config } = useStoreConfig();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Pegamos apenas produtos que estão ativos e marcados como destaque 
  const products = config.products.filter(p => p.featured);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); } });
    }, { threshold: 0.1 });

    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    reveals?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleAdd = (e: React.MouseEvent, product: Parameters<typeof add>[0]) => {
    e.preventDefault();
    add(product);
    toast.success(`${product.name} adicionado!`);
  };

  return (
    <section ref={sectionRef} className="section" style={{ background: '#0F0D0A' }}>
      <div className="container-max">
        {/* Header */}
        <div className="reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="text-label" style={{ marginBottom: '0.75rem' }}>Coleção atual</div>
            <h2 className="text-section">Os Bonés</h2>
          </div>
          <Link href="/colecao" className="btn-outline" style={{ fontSize: '0.7rem' }}>
            Ver tudo
          </Link>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
          gap: '1px',
          background: 'rgba(200,146,42,0.08)',
        }}>
          {products.map((product, i) => (
            <Link
              href={`/produto/${product.slug}`}
              key={product.id}
              className="product-card reveal"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {/* Image placeholder (styled bg until real images) */}
              <div style={{ position: 'relative' }}>
                {product.image ? (
                  <div
                    className="product-card-img"
                    style={{
                      position: 'relative',
                      background: 'radial-gradient(circle at center, rgba(245,237,216,0.05) 0%, transparent 70%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '2rem 1rem',
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'contain',
                        mixBlendMode: 'normal',
                        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))',
                      }} 
                    />
                  </div>
                ) : (
                  <div
                    className="product-card-img"
                    style={{
                      background: `hsl(${30 + i * 15}, ${20 + i * 5}%, ${8 + i * 2}%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '3rem',
                      fontWeight: 600,
                      color: 'rgba(200,146,42,0.25)',
                    }}>
                      🧢
                    </span>
                  </div>
                )}

                {/* Limited badge */}
                {product.stock <= 10 && (
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                    <span className="badge-limited">Últimas {product.stock} peças</span>
                  </div>
                )}

                {/* Quick add overlay */}
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

              {/* Info */}
              <div style={{ padding: '1.25rem', background: '#110F0B' }}>
                <div className="text-label" style={{ color: 'var(--color-muted)', marginBottom: '0.4rem' }}>
                  {product.sku} · {product.color}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  color: 'var(--color-sand)',
                  marginBottom: '0.5rem',
                }}>
                  {product.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--color-gold)',
                  }}>
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>
                    4x de R$ {(product.price / 4).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
