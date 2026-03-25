'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface HeroSlide {
  tag: string;
  title: string;
  sub: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ProductConfig {
  id: number;
  name: string;
  slug: string;
  sku: string;
  color?: string;
  price: number;
  stock: number;
  category: 'bones' | 'adesivos';
  image?: string | null; // base64 or URL, null = removed
  featured: boolean;      // show on homepage grid
  inLookBuilder: boolean; // show in gamification
  active: boolean;        // visible in store at all
}

export interface LookBuilderSlot {
  id: string;
  label: string;
  icon: string;
  active: boolean;        // is this slot enabled?
  comingSoon: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  product: string;
  text: string;
  rating: number;
  initials: string;
  color: string;
  active: boolean;
}

export interface StoreConfig {
  // Global
  brandName: string;
  brandTagline: string;
  adminPassword: string;

  // Hero
  heroSlides: HeroSlide[];
  heroCtaPrimary: string;
  heroCtaSecondary: string;

  // Manifesto
  manifestoQuote: string;
  manifestoHighlight: string;
  manifestoStats: StatItem[];

  // Products
  products: ProductConfig[];

  // Look Builder
  lookBuilderSlots: LookBuilderSlot[];

  // Social Proof
  testimonials: Testimonial[];
  socialProofStats: StatItem[];

  // Footer
  footerTagline: string;
  instagramUrl: string;
  contactUrl: string;

  // Images
  logoImage?: string | null;
  heroImage?: string | null;
  manifestoImage?: string | null;
  collectionBannerImage?: string | null;
  ogImage?: string | null;

  // Theme colors
  colorGold: string;
  colorEarth: string;
  colorSand: string;
}

const DEFAULT_CONFIG: StoreConfig = {
  brandName: 'CRIADOS',
  brandTagline: 'NO MATO',
  adminPassword: 'mato2025',

  heroSlides: [
    { tag: 'Lançamento', title: 'Vida de\nCowboy', sub: 'Identidade que nasce no campo, estilo que vai além.' },
    { tag: 'Destaque', title: 'The\nBlack', sub: 'Minimalismo cru. Zero concessões.' },
    { tag: 'Coleção', title: 'Criados\nno Mato', sub: 'Bonés feitos pra quem não precisa se explicar.' },
  ],
  heroCtaPrimary: 'Explorar Coleção',
  heroCtaSecondary: 'Monte seu Look',

  manifestoQuote: '"Nascemos no campo, crescemos no estilo. Cada boné carrega o cheiro de terra molhada, a força do sol no couro e a liberdade de quem escolheu viver do jeito que nasceu pra ser."',
  manifestoHighlight: 'nasceu pra ser',
  manifestoStats: [
    { value: '018+', label: 'Modelos Únicos' },
    { value: '10K+', label: 'Do Mato pra Vida' },
    { value: '100%', label: 'Qualidade Artesanal' },
    { value: '2010', label: 'Ano de Fundação' },
  ],

  products: [
    { id: 1, name: 'Vida de Cowboy', slug: 'cnm013-vida-de-cowboy', sku: 'CNM013', color: 'Cáqui', price: 129.90, stock: 8, category: 'bones', featured: true, inLookBuilder: true, active: true },
    { id: 2, name: 'CNM018', slug: 'cnm018', sku: 'CNM018', color: 'Preto', price: 139.90, stock: 15, category: 'bones', featured: true, inLookBuilder: true, active: true },
    { id: 3, name: 'CNM017', slug: 'cnm017', sku: 'CNM017', color: 'Verde', price: 139.90, stock: 5, category: 'bones', featured: true, inLookBuilder: true, active: true },
    { id: 4, name: 'Laço Comprido', slug: 'laco-comprido', sku: 'CNM015', color: 'Marrom', price: 129.90, stock: 12, category: 'bones', featured: true, inLookBuilder: true, active: true },
    { id: 5, name: 'CNM014', slug: 'cnm014', sku: 'CNM014', color: 'Areia', price: 119.90, stock: 20, category: 'bones', featured: true, inLookBuilder: true, active: true },
    { id: 6, name: 'CNM016', slug: 'cnm016', sku: 'CNM016', color: 'Preto Total', price: 149.90, stock: 3, category: 'bones', featured: false, inLookBuilder: false, active: true },
    { id: 7, name: 'Boiadeiro', slug: 'boiadeiro', sku: 'CNM019', color: 'Camuflado', price: 159.90, stock: 7, category: 'bones', featured: false, inLookBuilder: false, active: true },
    { id: 8, name: 'Caçador', slug: 'cacador', sku: 'CNM020', color: 'Marrom', price: 129.90, stock: 10, category: 'bones', featured: false, inLookBuilder: false, active: true },
    { id: 9, name: 'Adesivo Pack Vol.1', slug: 'adesivo-pack-vol1', sku: 'ADH001', price: 29.90, stock: 50, category: 'adesivos', featured: false, inLookBuilder: false, active: true },
    { id: 10, name: 'Mato Selvagem', slug: 'mato-selvagem', sku: 'ADH002', price: 19.90, stock: 30, category: 'adesivos', featured: false, inLookBuilder: false, active: true },
  ],

  lookBuilderSlots: [
    { id: 'bones', label: 'Boné', icon: '🧢', active: true, comingSoon: false },
    { id: 'camiseta', label: 'Camiseta', icon: '👕', active: false, comingSoon: true },
    { id: 'adesivo', label: 'Adesivo', icon: '🏷️', active: false, comingSoon: true },
  ],

  testimonials: [
    { id: 1, name: 'Guilherme R.', location: 'Uberaba, MG', product: 'Vida de Cowboy', text: 'Melhor boné que já usei. O acabamento é impecável, bordado firme e o tecido não desbota. Comprei o Vida de Cowboy e já pedi mais dois.', rating: 5, initials: 'GR', color: '#8B6340', active: true },
    { id: 2, name: 'Leonardo M.', location: 'Goiânia, GO', product: 'The Black', text: 'Chegou rápido, embalagem cuidadosa. Qualidade absurda pro preço. Uso todo dia no trabalho na fazenda e ainda vai pra balada à noite.', rating: 5, initials: 'LM', color: '#4A3728', active: true },
    { id: 3, name: 'Caio B.', location: 'Ribeirão Preto, SP', product: 'Boiadeiro', text: 'Recebi elogio de todo mundo na rodeio. Parece caro, mas é bem acessível. A marca tem identidade de verdade, diferente das outras.', rating: 5, initials: 'CB', color: '#6B5040', active: true },
    { id: 4, name: 'Rafael O.', location: 'Campo Grande, MS', product: 'Caçador', text: 'Comprei pra mim e pra dois amigos. Todos apaixonados. O site já me deixou com vontade de comprar antes mesmo de ver o produto.', rating: 5, initials: 'RO', color: '#3D5240', active: true },
  ],
  socialProofStats: [
    { value: '4.9★', label: 'Avaliação média' },
    { value: '+1.200', label: 'Clientes felizes' },
    { value: '97%', label: 'Recomendam' },
    { value: '2 dias', label: 'Entrega média' },
  ],

  footerTagline: 'Nascidos no campo. Criados com estilo. Bonés e acessórios para quem vive com autenticidade.',
  instagramUrl: 'https://www.instagram.com/criadosnomato',
  contactUrl: 'https://criadosnomato.com.br/contato/',

  colorGold: '#C8922A',
  colorEarth: '#0D0B08',
  colorSand: '#F5EDD8',
};

const STORAGE_KEY = 'cnm_store_config';

interface StoreConfigContextType {
  config: StoreConfig;
  updateConfig: (partial: Partial<StoreConfig>) => void;
  updateProduct: (id: number, partial: Partial<ProductConfig>) => void;
  addProduct: (product: Omit<ProductConfig, 'id'>) => void;
  deleteProduct: (id: number) => void;
  updateSlide: (index: number, partial: Partial<HeroSlide>) => void;
  updateSlot: (id: string, partial: Partial<LookBuilderSlot>) => void;
  updateTestimonial: (id: number, partial: Partial<Testimonial>) => void;
  resetToDefault: () => void;
}

const StoreConfigContext = createContext<StoreConfigContextType | null>(null);

export function StoreConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_CONFIG);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage whenever config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      // Notify any iframes listening (for live preview)
      window.postMessage({ type: 'CNM_CONFIG_UPDATE', config }, '*');
    } catch {
      // ignore
    }
  }, [config]);

  const updateConfig = useCallback((partial: Partial<StoreConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  }, []);

  const updateProduct = useCallback((id: number, partial: Partial<ProductConfig>) => {
    setConfig(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.id !== id) return p;
        // Use Object.assign so null values (e.g. image: null) are preserved
        return Object.assign({}, p, partial);
      }),
    }));
  }, []);

  const addProduct = useCallback((product: Omit<ProductConfig, 'id'>) => {
    setConfig(prev => ({
      ...prev,
      products: [...prev.products, { ...product, id: Date.now() }],
    }));
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setConfig(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id),
    }));
  }, []);

  const updateSlide = useCallback((index: number, partial: Partial<HeroSlide>) => {
    setConfig(prev => {
      const slides = [...prev.heroSlides];
      slides[index] = { ...slides[index], ...partial };
      return { ...prev, heroSlides: slides };
    });
  }, []);

  const updateSlot = useCallback((id: string, partial: Partial<LookBuilderSlot>) => {
    setConfig(prev => ({
      ...prev,
      lookBuilderSlots: prev.lookBuilderSlots.map(s => s.id === id ? { ...s, ...partial } : s),
    }));
  }, []);

  const updateTestimonial = useCallback((id: number, partial: Partial<Testimonial>) => {
    setConfig(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? { ...t, ...partial } : t),
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <StoreConfigContext.Provider value={{
      config, updateConfig, updateProduct, addProduct, deleteProduct,
      updateSlide, updateSlot, updateTestimonial, resetToDefault,
    }}>
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  const ctx = useContext(StoreConfigContext);
  if (!ctx) throw new Error('useStoreConfig must be used within StoreConfigProvider');
  return ctx;
}

export { DEFAULT_CONFIG };
