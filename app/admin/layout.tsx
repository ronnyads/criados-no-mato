import { StoreConfigProvider } from '@/context/StoreConfigContext';
import type { Metadata } from 'next';
import '../globals.css';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin — Criados no Mato',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: 'Inter, DM Sans, system-ui, sans-serif', background: '#F1F1F1', color: '#111' }}>
        <StoreConfigProvider>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar />
            <main style={{ flex: 1, overflow: 'auto' }}>
              {children}
            </main>
          </div>
        </StoreConfigProvider>
      </body>
    </html>
  );
}
