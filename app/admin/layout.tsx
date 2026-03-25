import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin — Criados no Mato',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Override public site styles in admin */}
      <style>{`
        body { background: #0D0B08 !important; }
        /* Disable grain and cursor effects inside admin */
        body::after { display: none !important; }
        .custom-cursor, .cursor-dot { display: none !important; }
      `}</style>
      <AdminShell>{children}</AdminShell>
    </>
  );
}

