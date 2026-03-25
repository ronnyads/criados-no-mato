'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreConfig } from '@/context/StoreConfigContext';
import type { ProductConfig } from '@/context/StoreConfigContext';
import { Plus, Trash2, X, Edit2, Star, Eye, EyeOff, ImagePlus } from 'lucide-react';
import { compressImageToBlob } from '@/utils/imageCompressor';
import { uploadImage, deleteImage } from '@/utils/supabaseStorage';

const GOLD = '#C8922A';

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  border: '1px solid #E0E0E0',
  borderRadius: 6,
  fontSize: '0.85rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box' as const,
  color: '#111',
  background: '#fff',
};

const labelStyle = {
  fontSize: '0.72rem',
  fontWeight: 600,
  color: '#555',
  display: 'block' as const,
  marginBottom: 3,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const EMPTY_PRODUCT: Omit<ProductConfig, 'id'> = {
  name: '',
  slug: '',
  sku: '',
  color: '',
  price: 0,
  stock: 0,
  category: 'bones',
  featured: false,
  inLookBuilder: false,
  active: true,
};

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => onChange(!value)}>
      <div style={{
        width: 36, height: 20, borderRadius: 10,
        background: value ? GOLD : '#DDD',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 2, left: value ? 18 : 2,
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      <span style={{ fontSize: '0.8rem', color: '#444', userSelect: 'none' }}>{label}</span>
    </div>
  );
}

export default function ProdutosPage() {
  const router = useRouter();
  const { config, updateProduct, addProduct, deleteProduct } = useStoreConfig();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<ProductConfig>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ ...EMPTY_PRODUCT });
  const [filter, setFilter] = useState<'all' | 'bones' | 'adesivos'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('cnm_admin_auth') !== '1') {
      router.replace('/admin');
    }
  }, [router]);

  const filtered = config.products.filter(p => filter === 'all' || p.category === filter);

  const startEdit = (p: ProductConfig) => {
    setEditingId(p.id);
    setEditDraft({ ...p });
  };

  const saveEdit = () => {
    if (editingId) {
      updateProduct(editingId, editDraft);
      setEditingId(null);
      setEditDraft({});
    }
  };

  const handleImageUpload = async (file: File, target: 'edit' | 'new', inputEl?: HTMLInputElement | null) => {
    try {
      setUploading(true);
      const blob = await compressImageToBlob(file);
      const url = await uploadImage(blob, file.name.split('.')[0] || 'product');
      
      if (target === 'edit') {
        if (editDraft.image) deleteImage(editDraft.image).catch(console.warn);
        setEditDraft(d => ({ ...d, image: url }));
      } else {
        if (newProduct.image) deleteImage(newProduct.image).catch(console.warn);
        setNewProduct(p => ({ ...p, image: url }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Erro ao enviar imagem para a nuvem.');
    } finally {
      setUploading(false);
      // Reset so same file can be re-selected
      if (inputEl) inputEl.value = '';
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    addProduct({
      ...newProduct,
      slug: newProduct.slug || newProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
    setNewProduct({ ...EMPTY_PRODUCT });
    setShowAdd(false);
  };

  const CategoryBadge = ({ cat }: { cat: string }) => (
    <span style={{
      padding: '0.2rem 0.5rem',
      background: cat === 'bones' ? '#FEF3E2' : '#E8F5E9',
      color: cat === 'bones' ? '#B45309' : '#2E7D32',
      borderRadius: 20,
      fontSize: '0.68rem',
      fontWeight: 600,
    }}>
      {cat === 'bones' ? '🧢 Boné' : '🏷️ Adesivo'}
    </span>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#111' }}>Produtos</h1>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: '0.85rem' }}>{config.products.length} produtos cadastrados</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', background: GOLD, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
        >
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['all', 'bones', 'adesivos'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.4rem 1rem',
            border: `1px solid ${filter === f ? GOLD : '#DDD'}`,
            background: filter === f ? GOLD : '#fff',
            color: filter === f ? '#fff' : '#555',
            borderRadius: 20,
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            {f === 'all' ? 'Todos' : f === 'bones' ? '🧢 Bonés' : '🏷️ Adesivos'}
          </button>
        ))}
      </div>

      {/* Product Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EBEBEB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#F8F8F8', borderBottom: '1px solid #EBEBEB' }}>
              {['Produto', 'Preço', 'Estoque', 'Categoria', 'Destaque', 'Look Builder', 'Ativo', 'Ações'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, color: '#444', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                {editingId === p.id ? (
                  // Inline edit row
                  <td colSpan={8} style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label style={labelStyle}>Nome</label>
                        <input style={inputStyle} value={editDraft.name || ''} onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))} />
                      </div>
                      <div>
                        <label style={labelStyle}>Preço (R$)</label>
                        <input type="number" step="0.01" style={inputStyle} value={editDraft.price || ''} onChange={e => setEditDraft(d => ({ ...d, price: parseFloat(e.target.value) }))} />
                      </div>
                      <div>
                        <label style={labelStyle}>Estoque</label>
                        <input type="number" style={inputStyle} value={editDraft.stock || ''} onChange={e => setEditDraft(d => ({ ...d, stock: parseInt(e.target.value) }))} />
                      </div>
                      <div>
                        <label style={labelStyle}>Cor</label>
                        <input style={inputStyle} value={editDraft.color || ''} onChange={e => setEditDraft(d => ({ ...d, color: e.target.value }))} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <Toggle value={!!editDraft.featured} onChange={v => setEditDraft(d => ({ ...d, featured: v }))} label="Destaque" />
                      <Toggle value={!!editDraft.inLookBuilder} onChange={v => setEditDraft(d => ({ ...d, inLookBuilder: v }))} label="Look Builder" />
                      <Toggle value={!!editDraft.active} onChange={v => setEditDraft(d => ({ ...d, active: v }))} label="Ativo" />

                      {/* Image upload */}
                      <button disabled={uploading} onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', background: '#F5F5F5', border: '1px solid #DDD', borderRadius: 6, fontSize: '0.78rem', cursor: uploading ? 'wait' : 'pointer' }}>
                        <ImagePlus size={14} /> {uploading ? 'Enviando...' : (editDraft.image ? 'Trocar foto' : 'Adicionar foto')}
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, 'edit', fileInputRef.current); }} />
                      {editDraft.image && (
                        <>
                          <img src={editDraft.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #DDD' }} />
                          <button onClick={() => setEditDraft(d => ({ ...d, image: null }))} title="Remover foto" style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, padding: '0.3rem 0.5rem', cursor: 'pointer', fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>✕ Remover</button>
                        </>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={saveEdit} style={{ padding: '0.5rem 1rem', background: GOLD, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Salvar</button>
                      <button onClick={() => setEditingId(null)} style={{ padding: '0.5rem 1rem', background: '#F5F5F5', color: '#555', border: '1px solid #DDD', borderRadius: 6, fontSize: '0.8rem', cursor: 'pointer' }}>Cancelar</button>
                    </div>
                  </td>
                ) : (
                  <>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {p.image ? (
                          <img src={p.image} alt={p.name} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 6, border: '1px solid #EEE' }} />
                        ) : (
                          <div style={{ width: 32, height: 32, background: '#F0F0F0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🧢</div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: '#111' }}>{p.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#888' }}>{p.sku} · {p.color}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: GOLD, fontWeight: 700 }}>R$ {p.price.toFixed(2)}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ color: p.stock <= 5 ? '#ef4444' : p.stock <= 10 ? '#f59e0b' : '#22c55e', fontWeight: 600 }}>{p.stock}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}><CategoryBadge cat={p.category} /></td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <button onClick={() => updateProduct(p.id, { featured: !p.featured })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                        <Star size={16} fill={p.featured ? GOLD : 'none'} color={p.featured ? GOLD : '#CCC'} />
                      </button>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ padding: '0.25rem 0.6rem', background: p.inLookBuilder ? '#E8F4E8' : '#F5F5F5', color: p.inLookBuilder ? '#2E7D32' : '#999', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600 }}>
                        {p.inLookBuilder ? '✅ Sim' : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <button onClick={() => updateProduct(p.id, { active: !p.active })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                        {p.active ? <Eye size={16} color="#22c55e" /> : <EyeOff size={16} color="#CCC" />}
                      </button>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => startEdit(p)} style={{ padding: '0.3rem', background: '#F5F5F5', border: '1px solid #DDD', borderRadius: 5, cursor: 'pointer' }}>
                          <Edit2 size={13} color="#666" />
                        </button>
                        <button onClick={() => { if (confirm(`Excluir "${p.name}"?`)) deleteProduct(p.id); }} style={{ padding: '0.3rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 5, cursor: 'pointer' }}>
                          <Trash2 size={13} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Novo Produto</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Nome *</label>
                <input style={inputStyle} value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Vida de Cowboy" />
              </div>
              <div>
                <label style={labelStyle}>SKU</label>
                <input style={inputStyle} value={newProduct.sku} onChange={e => setNewProduct(p => ({ ...p, sku: e.target.value }))} placeholder="CNM021" />
              </div>
              <div>
                <label style={labelStyle}>Cor</label>
                <input style={inputStyle} value={newProduct.color || ''} onChange={e => setNewProduct(p => ({ ...p, color: e.target.value }))} placeholder="Cáqui" />
              </div>
              <div>
                <label style={labelStyle}>Preço (R$) *</label>
                <input type="number" step="0.01" style={inputStyle} value={newProduct.price || ''} onChange={e => setNewProduct(p => ({ ...p, price: parseFloat(e.target.value) }))} placeholder="129.90" />
              </div>
              <div>
                <label style={labelStyle}>Estoque</label>
                <input type="number" style={inputStyle} value={newProduct.stock || ''} onChange={e => setNewProduct(p => ({ ...p, stock: parseInt(e.target.value) }))} placeholder="10" />
              </div>
              <div>
                <label style={labelStyle}>Categoria</label>
                <select style={inputStyle} value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value as 'bones' | 'adesivos' }))}>
                  <option value="bones">🧢 Boné</option>
                  <option value="adesivos">🏷️ Adesivo</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <Toggle value={newProduct.featured} onChange={v => setNewProduct(p => ({ ...p, featured: v }))} label="Destaque na home" />
              <Toggle value={newProduct.inLookBuilder} onChange={v => setNewProduct(p => ({ ...p, inLookBuilder: v }))} label="Look Builder" />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button disabled={uploading} onClick={() => newFileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#F5F5F5', border: '1px solid #DDD', borderRadius: 6, fontSize: '0.82rem', cursor: uploading ? 'wait' : 'pointer' }}>
                  <ImagePlus size={14} /> {uploading ? 'Enviando...' : (newProduct.image ? 'Trocar foto' : 'Adicionar foto')}
                </button>
                <input ref={newFileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, 'new', newFileInputRef.current); }} />
                {newProduct.image && (
                  <>
                    <img src={newProduct.image} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #DDD' }} />
                    <button onClick={() => setNewProduct(p => ({ ...p, image: null }))} style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>✕ Remover</button>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleAddProduct} disabled={!newProduct.name || !newProduct.price} style={{ flex: 1, padding: '0.75rem', background: newProduct.name && newProduct.price ? GOLD : '#DDD', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: newProduct.name && newProduct.price ? 'pointer' : 'default' }}>
                Criar Produto
              </button>
              <button onClick={() => setShowAdd(false)} style={{ padding: '0.75rem 1.5rem', background: '#F5F5F5', color: '#555', border: '1px solid #DDD', borderRadius: 8, cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
