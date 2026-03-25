'use client';
import { useEffect } from 'react';
import { useStoreConfig } from '@/context/StoreConfigContext';
import type { StoreConfig } from '@/context/StoreConfigContext';

/**
 * Listens for postMessage from the admin editor iframe
 * and applies config updates in real-time to the public site.
 */
export default function ConfigReceiver() {
  const { updateConfig } = useStoreConfig();

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'CNM_CONFIG_UPDATE') {
        const cfg = event.data.config as Partial<StoreConfig>;
        if (cfg) updateConfig(cfg);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [updateConfig]);

  return null;
}
