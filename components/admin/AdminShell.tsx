'use client';
import { usePathname } from 'next/navigation';
import { StoreConfigProvider } from '@/context/StoreConfigContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useEffect, useState } from 'react';

// Admin shell: sidebar only shows when authenticated + not on login page
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin';
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem('cnm_admin_auth') === '1');
  }, [pathname]);

  const showSidebar = !isLoginPage && authed;

  return (
    <StoreConfigProvider>
      <div style={{
        display: showSidebar ? 'flex' : 'block',
        height: '100vh',
        fontFamily: 'Inter, DM Sans, system-ui, sans-serif',
        background: showSidebar ? '#F1F1F1' : '#0D0B08',
        color: '#111',
        overflow: 'hidden',
      }}>
        {showSidebar && <AdminSidebar />}
        <main style={{ flex: 1, overflowY: 'scroll', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </StoreConfigProvider>
  );
}
