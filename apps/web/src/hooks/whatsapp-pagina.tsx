import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { OrigenWhatsApp } from '../lib/whatsapp';

type Ctx = {
  origen: OrigenWhatsApp;
  nombre?: string;
  setOrigen: (origen: OrigenWhatsApp, nombre?: string) => void;
};

const Contexto = createContext<Ctx | null>(null);

export function ProveedorWhatsApp({ children }: { children: ReactNode }) {
  const [origen, setO] = useState<OrigenWhatsApp>('cabecera');
  const [nombre, setN] = useState<string | undefined>();
  const setOrigen = useCallback((o: OrigenWhatsApp, n?: string) => {
    setO(o);
    setN(n);
  }, []);
  const value = useMemo<Ctx>(() => ({ origen, nombre, setOrigen }), [origen, nombre, setOrigen]);
  return <Contexto.Provider value={value}>{children}</Contexto.Provider>;
}

export function usarWhatsAppPagina() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error('Falta el proveedor de WhatsApp');
  return ctx;
}
