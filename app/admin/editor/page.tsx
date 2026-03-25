'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreConfig } from '@/context/StoreConfigContext';
import { Save, RefreshCw, Monitor, Smartphone, Eye } from 'lucide-react';

const GOLD = '#C8922A';
const TABS = ['Hero', 'Manifesto', 'Cores & Logo', 'Footer', 'Senha'];

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  border: '1px solid #E0E0E0',
  borderRadius: 6,
  fontSize: '0.85rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box' as const,
  background: '#fff',
  color: '#111',
};

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#555',
  display: 'block' as const,
  marginBottom: 4,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

export default function ThemeEditorPage() {
  const router = useRouter();
  const { config, updateConfig, updateSlide } = useStoreConfig();
  const [tab, setTab] = useState('Hero');
  const [iframeWidth, setIframeWidth] = useState<'desktop' | 'mobile'>('mobile');
  const [saved, setSaved] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auth guard
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('cnm_admin_auth') !== '1') {
      router.replace('/admin');
    }
  }, [router]);

  // Send config to iframe whenever it changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const send = () => iframe.contentWindow?.postMessage({ type: 'CNM_CONFIG_UPDATE', config }, '*');
    iframe.addEventListener('load', send);
    send();
    return () => iframe.removeEventListener('load', send);
  }, [config]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left Panel */}
      <div style={{
        width: 360,
        background: '#fff',
        borderRight: '1px solid #E8E8E8',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111' }}>Editor de Tema</h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#888' }}>Edite e veja ao vivo</p>
          </div>
          <button
            onClick={handleSave}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1rem',
              background: saved ? '#22c55e' : GOLD,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            <Save size={13} />
            {saved ? 'Salvo!' : 'Salvar'}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '0 1rem', borderBottom: '1px solid #F0F0F0', gap: 0, overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.75rem 0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === t ? `2px solid ${GOLD}` : '2px solid transparent',
              color: tab === t ? GOLD : '#777',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {tab === 'Hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ margin: '0 0 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#333' }}>Botões CTA</h3>
                <label style={labelStyle}>Botão Principal</label>
                <input style={inputStyle} value={config.heroCtaPrimary} onChange={e => updateConfig({ heroCtaPrimary: e.target.value })} />
                <div style={{ height: 10 }} />
                <label style={labelStyle}>Botão Secundário</label>
                <input style={inputStyle} value={config.heroCtaSecondary} onChange={e => updateConfig({ heroCtaSecondary: e.target.value })} />
              </div>

              {config.heroSlides.map((slide, i) => (
                <div key={i} style={{ background: '#F8F8F8', borderRadius: 8, padding: '1rem', border: '1px solid #EBEBEB' }}>
                  <h3 style={{ margin: '0 0 1rem', fontSize: '0.82rem', fontWeight: 700, color: '#333' }}>Slide {i + 1}</h3>
                  <label style={labelStyle}>Tag</label>
                  <input style={inputStyle} value={slide.tag} onChange={e => updateSlide(i, { tag: e.target.value })} />
                  <div style={{ height: 8 }} />
                  <label style={labelStyle}>Título (use \n para quebra de linha)</label>
                  <textarea
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical' as const }}
                    value={slide.title}
                    onChange={e => updateSlide(i, { title: e.target.value })}
                  />
                  <div style={{ height: 8 }} />
                  <label style={labelStyle}>Subtítulo</label>
                  <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' as const }} value={slide.sub} onChange={e => updateSlide(i, { sub: e.target.value })} />
                </div>
              ))}
            </div>
          )}

          {tab === 'Manifesto' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Citação principal</label>
                <textarea rows={5} style={{ ...inputStyle, resize: 'vertical' as const }} value={config.manifestoQuote} onChange={e => updateConfig({ manifestoQuote: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Palavra em destaque dourado</label>
                <input style={inputStyle} value={config.manifestoHighlight} onChange={e => updateConfig({ manifestoHighlight: e.target.value })} />
              </div>
              <h3 style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', fontWeight: 700, color: '#333' }}>Estatísticas</h3>
              {config.manifestoStats.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Valor</label>
                    <input style={inputStyle} value={s.value} onChange={e => {
                      const stats = [...config.manifestoStats];
                      stats[i] = { ...stats[i], value: e.target.value };
                      updateConfig({ manifestoStats: stats });
                    }} />
                  </div>
                  <div style={{ flex: 2 }}>
                    <label style={labelStyle}>Label</label>
                    <input style={inputStyle} value={s.label} onChange={e => {
                      const stats = [...config.manifestoStats];
                      stats[i] = { ...stats[i], label: e.target.value };
                      updateConfig({ manifestoStats: stats });
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Cores & Logo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Nome da Marca (linha 1)</label>
                <input style={inputStyle} value={config.brandName} onChange={e => updateConfig({ brandName: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Nome da Marca (linha 2)</label>
                <input style={inputStyle} value={config.brandTagline} onChange={e => updateConfig({ brandTagline: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Cor Dourada</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="color" value={config.colorGold} onChange={e => updateConfig({ colorGold: e.target.value })} style={{ width: 36, height: 36, padding: 0, border: '1px solid #E0E0E0', borderRadius: 4, cursor: 'pointer' }} />
                    <input style={{ ...inputStyle, flex: 1 }} value={config.colorGold} onChange={e => updateConfig({ colorGold: e.target.value })} />
                  </div>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Cor de Fundo</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="color" value={config.colorEarth} onChange={e => updateConfig({ colorEarth: e.target.value })} style={{ width: 36, height: 36, padding: 0, border: '1px solid #E0E0E0', borderRadius: 4, cursor: 'pointer' }} />
                  <input style={{ ...inputStyle, flex: 1 }} value={config.colorEarth} onChange={e => updateConfig({ colorEarth: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Cor do Texto</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input type="color" value={config.colorSand} onChange={e => updateConfig({ colorSand: e.target.value })} style={{ width: 36, height: 36, padding: 0, border: '1px solid #E0E0E0', borderRadius: 4, cursor: 'pointer' }} />
                  <input style={{ ...inputStyle, flex: 1 }} value={config.colorSand} onChange={e => updateConfig({ colorSand: e.target.value })} />
                </div>
              </div>

              {/* Preview */}
              <div style={{ background: config.colorEarth, borderRadius: 8, padding: '1.5rem', textAlign: 'center', border: '1px solid #E0E0E0' }}>
                <div style={{ fontSize: '1.25rem', fontFamily: 'serif', fontWeight: 600, color: config.colorSand, letterSpacing: '0.08em' }}>{config.brandName}</div>
                <div style={{ fontSize: '0.45rem', fontWeight: 700, letterSpacing: '0.4em', color: config.colorGold, marginTop: 4 }}>{config.brandTagline}</div>
              </div>
            </div>
          )}

          {tab === 'Footer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Tagline do Rodapé</label>
                <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} value={config.footerTagline} onChange={e => updateConfig({ footerTagline: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>URL do Instagram</label>
                <input style={inputStyle} value={config.instagramUrl} onChange={e => updateConfig({ instagramUrl: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>URL de Contato</label>
                <input style={inputStyle} value={config.contactUrl} onChange={e => updateConfig({ contactUrl: e.target.value })} />
              </div>
            </div>
          )}

          {tab === 'Senha' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#FEF9EC', borderRadius: 8, padding: '1rem', border: '1px solid #F0DFA0', fontSize: '0.82rem', color: '#7A6200' }}>
                ⚠️ Altere a senha e clique em "Salvar". Na próxima vez que fizer login, use a nova senha.
              </div>
              <div>
                <label style={labelStyle}>Nova Senha de Administrador</label>
                <input type="password" style={inputStyle} value={config.adminPassword} onChange={e => updateConfig({ adminPassword: e.target.value })} placeholder="mínimo 6 caracteres" />
              </div>
              <button
                onClick={handleSave}
                style={{ padding: '0.75rem', background: GOLD, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Salvar nova senha
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right — Live Preview */}
      <div style={{ flex: 1, background: '#E8E8E8', display: 'flex', flexDirection: 'column' }}>
        {/* Preview toolbar */}
        <div style={{ padding: '0.75rem 1.25rem', background: '#fff', borderBottom: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Eye size={14} color="#888" />
          <span style={{ fontSize: '0.78rem', color: '#888', fontWeight: 600 }}>PREVIEW AO VIVO</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setIframeWidth('desktop')} style={{ padding: '0.35rem 0.6rem', background: iframeWidth === 'desktop' ? '#111' : 'transparent', color: iframeWidth === 'desktop' ? '#fff' : '#888', border: '1px solid #DDD', borderRadius: 5, cursor: 'pointer' }}>
              <Monitor size={14} />
            </button>
            <button onClick={() => setIframeWidth('mobile')} style={{ padding: '0.35rem 0.6rem', background: iframeWidth === 'mobile' ? '#111' : 'transparent', color: iframeWidth === 'mobile' ? '#fff' : '#888', border: '1px solid #DDD', borderRadius: 5, cursor: 'pointer' }}>
              <Smartphone size={14} />
            </button>
            <button onClick={() => iframeRef.current?.contentWindow?.location.reload()} style={{ padding: '0.35rem 0.6rem', background: 'transparent', color: '#888', border: '1px solid #DDD', borderRadius: 5, cursor: 'pointer' }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* iframe container */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '1.5rem', overflow: 'auto' }}>
          <div style={{
            width: iframeWidth === 'mobile' ? 390 : '100%',
            maxWidth: iframeWidth === 'desktop' ? '100%' : 390,
            height: iframeWidth === 'mobile' ? 844 : '100%',
            minHeight: iframeWidth === 'desktop' ? 600 : 844,
            background: '#fff',
            borderRadius: iframeWidth === 'mobile' ? 36 : 8,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: iframeWidth === 'mobile' ? '8px solid #222' : 'none',
            transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <iframe
              ref={iframeRef}
              src="/"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              title="Store Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
