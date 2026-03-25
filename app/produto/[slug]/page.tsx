'use client';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getBySlug, getFeatured } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Check, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProdutoPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const product = getBySlug(slug);
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const related = getFeatured().filter(p => p.id !== product?.id).slice(0, 3);

  if (!product) return notFound();

  const handleAdd = () => {
    add(product);
    setAdded(true);
    toast.success(`${product.name} adicionado ao carrinho!`);
    setTimeout(() => setAdded(false), 2500);
  };

  const pix = (product.price * 0.95).toFixed(2).replace('.', ',');
  const installment = (product.price / 4).toFixed(2).replace('.', ',');

  return (
    <div style={{ minHeight: '100dvh', background: '#0D0B08', paddingTop: 'var(--header-h)' }}>
      {/* Back */}
      <div style={{ padding: '1.5rem clamp(1.5rem,5vw,5rem)', borderBottom: '1px solid rgba(200,146,42,0.08)' }}>
        <Link href="/colecao" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-muted)', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
        >
          <ArrowLeft size={14} />
          Voltar à coleção
        </Link>
      </div>

      {/* Product */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 0,
        maxWidth: 1200,
        margin: '0 auto',
        padding: 'clamp(2rem,5vw,5rem) clamp(1.5rem,5vw,5rem)',
      }}>
        {/* Image */}
        <div style={{ position: 'relative' }}>
          <div style={{
            aspectRatio: '4/5',
            background: `linear-gradient(135deg, hsl(28,20%,10%) 0%, hsl(28,15%,7%) 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            borderRadius: 4,
          }}>
            <span style={{ fontSize: '8rem' }}>🧢</span>

            {/* Decorative */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '40%',
              background: 'linear-gradient(to top, rgba(13,11,8,0.8), transparent)',
            }} />
          </div>

          {product.stock <= 10 && (
            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
              <span className="badge-limited">Últimas {product.stock} peças!</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: 'clamp(1.5rem,4vw,4rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Labels */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="text-label">{product.sku}</span>
            {product.color && (
              <span className="text-label" style={{ color: 'var(--color-muted)' }}>· {product.color}</span>
            )}
          </div>

          {/* Name */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 500, lineHeight: 1.1 }}>
            {product.name}
          </h1>

          {/* Stars */}
          <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="var(--color-gold)" color="var(--color-gold)" />
            ))}
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginLeft: '0.5rem' }}>
              (47 avaliações)
            </span>
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Price block */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-gold)', lineHeight: 1 }}>
              R$ {product.price.toFixed(2).replace('.', ',')}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '0.5rem' }}>
              💳 Pix: <strong style={{ color: 'var(--color-sand)' }}>R$ {pix}</strong> (5% OFF)
              &nbsp;·&nbsp;
              4x de <strong style={{ color: 'var(--color-sand)' }}>R$ {installment}</strong> sem juros
            </div>
          </div>

          {/* Description */}
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.8 }}>
            Um boné nascido no campo, moldado pela identidade de quem vive com autenticidade.
            Tecido premium, bordado resistente, regulagem em 6 posições.
            Feito pra durar tanto quanto seu orgulho.
          </p>

          {/* Stock indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: product.stock > 10 ? '#4ADE80' : '#F59E0B' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
              {product.stock > 10 ? 'Em estoque' : `Apenas ${product.stock} unidades restantes`}
            </span>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={handleAdd}
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '1.25rem', fontSize: '0.8rem' }}
            >
              {added ? <Check size={18} /> : <ShoppingBag size={18} />}
              <span>{added ? 'Adicionado ao Carrinho!' : 'Adicionar ao Carrinho'}</span>
            </button>
            <Link
              href="/look-builder"
              className="btn-outline"
              style={{ justifyContent: 'center', textAlign: 'center', textDecoration: 'none' }}
            >
              🎮 Montar look com este boné
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
            {['🔒 Compra segura', '🚚 Frete rápido', '↩️ Troca grátis'].map(badge => (
              <span key={badge} style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{badge}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      <div style={{ padding: 'clamp(3rem,6vw,6rem) clamp(1.5rem,5vw,5rem)', borderTop: '1px solid rgba(200,146,42,0.08)' }}>
        <div className="text-label" style={{ marginBottom: '0.75rem' }}>Você também pode gostar</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(200,146,42,0.08)' }}>
          {related.map(p => (
            <Link key={p.id} href={`/produto/${p.slug}`} className="product-card">
              <div style={{ background: '#110F0B', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🧢</div>
              <div style={{ padding: '1rem', background: '#110F0B' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '0.9rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                  R$ {p.price.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
