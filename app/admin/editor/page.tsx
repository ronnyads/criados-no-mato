'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreConfig } from '@/context/StoreConfigContext';
import type { StoreConfig } from '@/context/StoreConfigContext';
import { Save, RefreshCw, Monitor, Smartphone, Eye, Info } from 'lucide-react';

const GOLD = '#C8922A';
const TABS = ['Hero', 'Manifesto', 'Cores & Logo', 'Imagens', 'Footer', 'Senha'];

const field = (style?: object) => ({
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
  transition: 'border-color 0.2s',
  ...style,
});

const lbl = {
  fontSize: '0.72rem',
  fontWeight: 600,
  color: '#555',
  display: 'block' as const,
  marginBottom: 4,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

function DimHint({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
      <Info size={11} color={GOLD} />
      <span style={{ fontSize: '0.7rem', color: '#999', fontStyle: 'italic' }}>{text}</span>
    </div>
  );
}

function ImageUpload({ label, hint, value, onChange }: {
  label: string; hint: string; value?: string; onChange: (b64: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ ...lbl, marginBottom: 2 }}>{label}</div>
      <DimHint text={hint} />
      <div
        onClick={() => ref.current?.click()}
        style={{
          border: `2px dashed ${value ? GOLD : '#DDD'}`,
          borderRadius: 8,
          padding: '1rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: value ? '#FEF9EC' : '#FAFAFA',
          transition: 'all 0.2s',
        }}
      >
        {value ? (
          <img src={value} alt="" style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 4 }} />
        ) : (
          <div style={{ color: '#AAA', fontSize: '0.8rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>📸</div>
            Clique para fazer upload
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => onChange(ev.target?.result as string);
        reader.readAsDataURL(file);
      }} />
    </div>
  );
}

export default function ThemeEditorPage() {
  const router = useRouter();
  const { config, updateConfig, updateSlide } = useStoreConfig();
  const [tab, setTab] = useState('Hero');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saved, setSaved] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auth guard
  useEffect(() => {
    if (sessionStorage.getItem('cnm_admin_auth') !== '1') {
      router.replace('/admin');
    }
  }, [router]);

  // Broadcast config to iframe on change
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const send = () => {
      try { iframe.contentWindow?.postMessage({ type: 'CNM_CONFIG_UPDATE', config }, '*'); } catch { /* cross-origin ok */ }
    };
    iframe.addEventListener('load', send);
    send();
    return () => iframe.removeEventListener('load', send);
  }, [config]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F5F5F5' }}>
      {/* ─── Left Panel ────────────────────────────────────── */}
      <div style={{
        width: 340,
        background: '#fff',
        borderRight: '1px solid #E8E8E8',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
      }}>
        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111' }}>Editor de Tema</h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#999' }}>Salvo automaticamente no navegador</p>
          </div>
          <button
            onClick={handleSave}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.45rem 0.9rem',
              background: saved ? '#22c55e' : GOLD,
              color: '#fff', border: 'none', borderRadius: 6,
              fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            <Save size={12} />
            {saved ? '✓ Salvo' : 'Salvar'}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '0 0.75rem', borderBottom: '1px solid #F0F0F0', overflowX: 'auto', gap: 0, flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.65rem 0.65rem',
              background: 'none', border: 'none',
              borderBottom: tab === t ? `2px solid ${GOLD}` : '2px solid transparent',
              color: tab === t ? GOLD : '#888',
              fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{t}</button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', minHeight: 0 }}>

          {/* ── HERO ─────────────────────── */}
          {tab === 'Hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={lbl}>Botão Principal</div>
                <input
                  style={field()}
                  value={config.heroCtaPrimary}
                  onChange={e => updateConfig({ heroCtaPrimary: e.target.value })}
                  placeholder="Explorar Coleção"
                />
              </div>
              <div>
                <div style={lbl}>Botão Secundário</div>
                <input
                  style={field()}
                  value={config.heroCtaSecondary}
                  onChange={e => updateConfig({ heroCtaSecondary: e.target.value })}
                  placeholder="Monte seu Look"
                />
              </div>

              {config.heroSlides.map((slide, i) => (
                <div key={i} style={{ background: '#F8F8F8', borderRadius: 8, padding: '1rem', border: '1px solid #EBEBEB' }}>
                  <div style={{ ...lbl, color: GOLD, marginBottom: 10 }}>SLIDE {i + 1}</div>
                  <div style={lbl}>Tag</div>
                  <input style={field({ marginBottom: 8 })} value={slide.tag}
                    onChange={e => updateSlide(i, { tag: e.target.value })} />
                  <div style={lbl}>Título (use \n para quebra)</div>
                  <textarea rows={2} style={{ ...field({ resize: 'vertical' as const, marginBottom: 8 }) }}
                    value={slide.title} onChange={e => updateSlide(i, { title: e.target.value })} />
                  <div style={lbl}>Subtítulo</div>
                  <textarea rows={2} style={{ ...field({ resize: 'vertical' as const }) }}
                    value={slide.sub} onChange={e => updateSlide(i, { sub: e.target.value })} />
                </div>
              ))}
            </div>
          )}

          {/* ── MANIFESTO ───────────────── */}
          {tab === 'Manifesto' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={lbl}>Citação Principal</div>
                <textarea rows={5} style={{ ...field({ resize: 'vertical' as const }) }}
                  value={config.manifestoQuote}
                  onChange={e => updateConfig({ manifestoQuote: e.target.value })} />
              </div>
              <div>
                <div style={lbl}>Palavra em Dourado (destaque)</div>
                <input style={field()} value={config.manifestoHighlight}
                  onChange={e => updateConfig({ manifestoHighlight: e.target.value })} />
              </div>

              <div style={{ ...lbl, marginBottom: 0 }}>Estatísticas (4 valores)</div>
              {config.manifestoStats.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ width: 90 }}>
                    <div style={{ ...lbl, fontSize: '0.65rem' }}>Valor</div>
                    <input style={field({ textAlign: 'center' as const })} value={s.value} onChange={e => {
                      const stats = [...config.manifestoStats];
                      stats[i] = { ...stats[i], value: e.target.value };
                      updateConfig({ manifestoStats: stats });
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...lbl, fontSize: '0.65rem' }}>Label</div>
                    <input style={field()} value={s.label} onChange={e => {
                      const stats = [...config.manifestoStats];
                      stats[i] = { ...stats[i], label: e.target.value };
                      updateConfig({ manifestoStats: stats });
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── CORES & LOGO ─────────────── */}
          {tab === 'Cores & Logo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={lbl}>Nome da Marca (Linha 1)</div>
                <input style={field()} value={config.brandName}
                  onChange={e => updateConfig({ brandName: e.target.value })} />
              </div>
              <div>
                <div style={lbl}>Nome da Marca (Linha 2)</div>
                <input style={field()} value={config.brandTagline}
                  onChange={e => updateConfig({ brandTagline: e.target.value })} />
              </div>

              {[
                { key: 'colorGold', label: 'Cor de Destaque (Dourado)' },
                { key: 'colorEarth', label: 'Cor de Fundo' },
                { key: 'colorSand', label: 'Cor do Texto Principal' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <div style={lbl}>{label}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="color"
                      value={(config as unknown as Record<string, string>)[key]}
                      onChange={e => updateConfig({ [key]: e.target.value } as Partial<StoreConfig>)}
                      style={{ width: 36, height: 34, padding: 2, border: '1px solid #E0E0E0', borderRadius: 4, cursor: 'pointer' }}
                    />
                    <input style={{ ...field(), flex: 1 }}
                      value={(config as unknown as Record<string, string>)[key]}
                      onChange={e => updateConfig({ [key]: e.target.value } as Partial<StoreConfig>)}
                    />
                  </div>
                </div>
              ))}

              {/* Live color preview */}
              <div style={{ background: config.colorEarth, borderRadius: 10, padding: '1.5rem', textAlign: 'center', border: '1px solid #DDD', marginTop: 8 }}>
                <div style={{ fontSize: '1.2rem', fontFamily: 'Georgia, serif', fontWeight: 600, color: config.colorSand, letterSpacing: '0.08em' }}>{config.brandName}</div>
                <div style={{ fontSize: '0.45rem', fontWeight: 700, letterSpacing: '0.4em', color: config.colorGold, marginTop: 4 }}>{config.brandTagline}</div>
              </div>
            </div>
          )}

          {/* ── IMAGENS ──────────────────── */}
          {tab === 'Imagens' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ background: '#FEF9EC', border: '1px solid #F0DFA0', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.78rem', color: '#7A6200', marginBottom: '0.5rem' }}>
                💡 As imagens são salvas localmente no navegador. Para produção, faça upload direto em cada produto na página <strong>Produtos</strong>.
              </div>

              <ImageUpload
                label="Logo Principal"
                hint="Ideal: 300×80px | PNG ou SVG transparent | Max 200KB"
                value={config.logoImage}
                onChange={v => updateConfig({ logoImage: v })}
              />
              <ImageUpload
                label="Imagem do Hero (Background)"
                hint="Ideal: 1920×1080px (16:9) | JPG | Max 500KB"
                value={undefined}
                onChange={() => {}}
              />
              <ImageUpload
                label="Imagem do Manifesto"
                hint="Ideal: 800×1000px (4:5, retrato) | JPG | Max 300KB"
                value={undefined}
                onChange={() => {}}
              />
              <ImageUpload
                label="Bannner da Coleção (topo)"
                hint="Ideal: 1440×400px (wide) | JPG | Max 300KB"
                value={undefined}
                onChange={() => {}}
              />
              <ImageUpload
                label="OG Image (prévia nas redes sociais)"
                hint="Ideal: 1200×630px | JPG | Max 200KB"
                value={undefined}
                onChange={() => {}}
              />
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.78rem', color: '#166534' }}>
                🧢 <strong>Fotos de produtos:</strong> acesse <em>Produtos → Editar →</em> clique em "Adicionar foto" em cada produto.
              </div>
            </div>
          )}

          {/* ── FOOTER ───────────────────── */}
          {tab === 'Footer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={lbl}>Tagline do Rodapé</div>
                <textarea rows={3} style={{ ...field({ resize: 'vertical' as const }) }}
                  value={config.footerTagline}
                  onChange={e => updateConfig({ footerTagline: e.target.value })} />
              </div>
              <div>
                <div style={lbl}>URL do Instagram</div>
                <input style={field()} value={config.instagramUrl}
                  onChange={e => updateConfig({ instagramUrl: e.target.value })} />
              </div>
              <div>
                <div style={lbl}>URL de Contato</div>
                <input style={field()} value={config.contactUrl}
                  onChange={e => updateConfig({ contactUrl: e.target.value })} />
              </div>
            </div>
          )}

          {/* ── SENHA ────────────────────── */}
          {tab === 'Senha' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#FEF9EC', borderRadius: 8, padding: '1rem', border: '1px solid #F0DFA0', fontSize: '0.82rem', color: '#7A6200' }}>
                ⚠️ Após salvar, use a nova senha no próximo login.
              </div>
              <div>
                <div style={lbl}>Nova Senha</div>
                <input type="password" style={field()} value={config.adminPassword}
                  onChange={e => updateConfig({ adminPassword: e.target.value })} placeholder="mínimo 6 caracteres" />
              </div>
              <button onClick={handleSave} style={{ padding: '0.75rem', background: GOLD, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                Salvar nova senha
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Right — Live Preview ──────────────────────────── */}
      <div style={{ flex: 1, background: '#DDDCDA', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Preview toolbar */}
        <div style={{ padding: '0.6rem 1.25rem', background: '#fff', borderBottom: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <Eye size={13} color="#AAA" />
          <span style={{ fontSize: '0.72rem', color: '#AAA', fontWeight: 700, letterSpacing: '0.1em' }}>PREVIEW AO VIVO</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem' }}>
            <button onClick={() => setPreviewMode('desktop')} title="Desktop" style={{ padding: '0.3rem 0.55rem', background: previewMode === 'desktop' ? '#111' : '#F0F0F0', color: previewMode === 'desktop' ? '#fff' : '#666', border: 'none', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Monitor size={13} />
            </button>
            <button onClick={() => setPreviewMode('mobile')} title="Mobile" style={{ padding: '0.3rem 0.55rem', background: previewMode === 'mobile' ? '#111' : '#F0F0F0', color: previewMode === 'mobile' ? '#fff' : '#666', border: 'none', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Smartphone size={13} />
            </button>
            <button onClick={() => iframeRef.current?.contentWindow?.location.reload()} title="Recarregar" style={{ padding: '0.3rem 0.55rem', background: '#F0F0F0', color: '#666', border: 'none', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* iframe */}
        <div style={{ flex: 1, display: 'flex', alignItems: previewMode === 'mobile' ? 'flex-start' : 'stretch', justifyContent: 'center', padding: previewMode === 'mobile' ? '1.25rem' : '0', overflow: 'auto' }}>
          {previewMode === 'desktop' ? (
            <iframe
              ref={iframeRef}
              src="/"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              title="Desktop Preview"
            />
          ) : (
            <div style={{
              width: 390, height: 844, flexShrink: 0,
              borderRadius: 40, overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
              border: '10px solid #1A1A1A',
              background: '#fff',
            }}>
              <iframe
                ref={iframeRef}
                src="/"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title="Mobile Preview"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
