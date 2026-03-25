'use client';
import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string | null;
  color?: string;
  sku?: string;
  slug: string;
  category: string;
  stock: number;
}

interface CartItem extends Product { qty: number; }
interface CartState { items: CartItem[]; isOpen: boolean; }

type Action =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: string | number }
  | { type: 'UPDATE_QTY'; id: string | number; qty: number }
  | { type: 'TOGGLE' }
  | { type: 'CLEAR' };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.product.id);
      if (existing) {
        return { ...state, isOpen: true, items: state.items.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, isOpen: true, items: [...state.items, { ...action.product, qty: 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i).filter(i => i.qty > 0) };
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

  state: CartState;
  add: (p: Product) => void;
  remove: (id: string | number) => void;
  updateQty: (id: string | number, qty: number) => void;
  toggle: () => void;
  total: number;
  count: number;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false });

  const total = state.items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = state.items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartCtx.Provider value={{
      state,
      add:       (p) => dispatch({ type: 'ADD', product: p }),
      remove:    (id) => dispatch({ type: 'REMOVE', id }),
      updateQty: (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }),
      toggle:    () => dispatch({ type: 'TOGGLE' }),
      total,
      count,
    }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
