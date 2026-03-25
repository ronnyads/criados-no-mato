'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const HERO_SLIDES = [
  { tag: 'Lançamento', title: 'Vida de\nCowboy', sub: 'Identidade que nasce no campo, estilo que vai além.' },
  { tag: 'Destaque', title: 'The\nBlack', sub: 'Minimalismo cru. Zero concessões.' },
  { tag: 'Coleção', title: 'Criados\nno Mato', sub: 'Bonés feitos pra quem não precisa se explicar.' },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(c => (c + 1) % HERO_SLIDES.length);
      setAnimating(false);
    }, 600);
  };

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <section style={{
      position: 'relative',
      height: '100dvh',
      minHeight: 600,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      background: '#0D0B08',
    }}>
      {/* Background gradient layers */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 60% 30%, rgba(200,146,42,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(74,55,40,0.3) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Large decorative number */}
      <div className="hide-mobile" style={{
        position: 'absolute',
        right: '-0.05em',
        top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(18rem, 35vw, 36rem)',
        fontWeight: 700,
        lineHeight: 1,
        color: 'rgba(200,146,42,0.04)',
        userSelect: 'none',
        pointerEvents: 'none',
        letterSpacing: '-0.05em',
      }}>
        {String(current + 1).padStart(2, '0')}
      </div>

      {/* Vertical label right */}
      <div className="hide-mobile" style={{
        position: 'absolute',
        right: 'clamp(1.5rem, 4vw, 3rem)',
        top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
        transformOrigin: 'center',
        fontFamily: 'var(--font-accent)',
        fontSize: '0.6rem',
        fontWeight: 700,
        letterSpacing: '0.3em',
        color: 'var(--color-muted)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        criadosnomato.com.br
      </div>

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: 'clamp(1.5rem, 5vw, 4rem)',
        paddingBottom: 'clamp(4rem, 8vw, 7rem)',
        maxWidth: 900,
      }}>
        {/* Tag */}
        <div
          className="text-label"
          key={`tag-${current}`}
          style={{
            marginBottom: '1.5rem',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.5s, transform 0.5s',
          }}
        >
          ↳ {slide.tag}
        </div>

        {/* Title */}
        <h1
          className="text-hero"
          key={`title-${current}`}
          style={{
            marginBottom: '2rem',
            whiteSpace: 'pre-line',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(20px)' : 'translateY(0)',
            transition: 'opacity 0.6s 0.05s, transform 0.6s 0.05s',
          }}
        >
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p
          key={`sub-${current}`}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
            color: 'var(--color-muted)',
            maxWidth: 400,
            lineHeight: 1.7,
            marginBottom: '3rem',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(15px)' : 'translateY(0)',
            transition: 'opacity 0.6s 0.1s, transform 0.6s 0.1s',
          }}
        >
          {slide.sub}
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/colecao" className="btn-primary">
            <span>Explorar Coleção</span>
            <ArrowRight size={14} />
          </Link>
          <Link href="/look-builder" className="btn-outline">
            <span>Monte seu Look</span>
          </Link>
        </div>
      </div>

      {/* Slide indicators */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(1.5rem, 3vw, 3rem)',
        right: 'clamp(1.5rem, 5vw, 4rem)',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setAnimating(true); setTimeout(() => { setCurrent(i); setAnimating(false); }, 500); }}
            style={{
              width: i === current ? 32 : 8,
              height: 2,
              background: i === current ? 'var(--color-gold)' : 'rgba(245,237,216,0.2)',
              border: 'none',
              borderRadius: 2,
              transition: 'width 0.4s, background 0.4s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(1.5rem, 3vw, 3rem)',
        left: 'clamp(1.5rem, 5vw, 4rem)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: 'var(--color-muted)',
      }}>
        <div style={{
          width: 1,
          height: 48,
          background: 'linear-gradient(to bottom, transparent, var(--color-gold))',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
        <span style={{ fontFamily: 'var(--font-accent)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>
          Scroll
        </span>
        <style>{`@keyframes scrollPulse { 0%,100% { opacity:0.3; } 50% { opacity:1; } }`}</style>
      </div>
    </section>
  );
}
