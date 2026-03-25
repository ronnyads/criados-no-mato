'use client';
import { usePathname } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  /** If true, renders only on admin routes (inverted logic) */
  invert?: boolean;
}

/**
 * Renders children only on non-admin routes (or admin-only when invert=true).
 * Used to isolate admin panel from CustomCursor, SmoothScroll, Header etc.
 */
export default function PublicOnly({ children, invert = false }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;
  const shouldRender = invert ? isAdmin : !isAdmin;
  return shouldRender ? <>{children}</> : null;
}
