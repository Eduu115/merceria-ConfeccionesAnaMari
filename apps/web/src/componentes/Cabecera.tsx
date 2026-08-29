import { useEffect, useId, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from './MarcadorSinFoto';
import { IconoWhatsApp } from './BurbujaWhatsApp';
import { usarAjustes } from '../hooks/usar-ajustes';
import { usarWhatsAppPagina } from '../hooks/whatsapp-pagina';
import { copys } from '../lib/copys';
import { enlaceWhatsApp } from '../lib/whatsapp';
import { cx } from '../lib/cx';

const ENLACES = [
  { to: '/', label: copys.menu.inicio, end: true },
  { to: '/arreglos', label: copys.menu.arreglos },
  { to: '/nosotros', label: copys.menu.nosotros },
  { to: '/contacto', label: copys.menu.contacto },
];

const ROPA = [
  { to: '/catalogo?categoria=ropa-de-mujer', label: 'Ropa de mujer' },
  { to: '/catalogo?categoria=ropa-interior', label: 'Ropa interior' },
  { to: '/catalogo?categoria=infantil-y-bebe', label: 'Infantil y bebé' },
];

export function Cabecera() {
  const { data } = usarAjustes();
  const { origen, nombre } = usarWhatsAppPagina();
  const [menu, setMenu] = useState(false);
  const [cat, setCat] = useState(false);
  const loc = useLocation();
  const catRef = useRef<HTMLDivElement>(null);
  const catId = useId();

  useEffect(() => {
    setMenu(false);
    setCat(false);
  }, [loc.pathname, loc.search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCat(false);
        setMenu(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const wa = data?.whatsapp_telefono
    ? enlaceWhatsApp(data.whatsapp_telefono, origen, { nombre })
    : null;
  const catalogoActivo =
    loc.pathname.startsWith('/catalogo') || loc.pathname.startsWith('/producto');

  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-crema">
      <div className="envoltorio flex h-[4.25rem] items-center gap-6">
        <Logo />
        <nav className="hidden flex-1 items-center gap-5 lg:flex" aria-label="Principal">
          <Item to="/" end>
            {copys.menu.inicio}
          </Item>
          <div
            className="relative"
            ref={catRef}
            onMouseEnter={() => setCat(true)}
            onMouseLeave={() => setCat(false)}
            onBlur={(e) => {
              if (!catRef.current?.contains(e.relatedTarget as Node)) {
                setCat(false);
              }
            }}
          >
            <NavLink
              to="/catalogo"
              className={cx(
                'text-[0.95rem] text-tinta',
                catalogoActivo && 'border-b-2 border-acento pb-0.5',
              )}
              aria-expanded={cat}
              aria-controls={catId}
              onFocus={() => setCat(true)}
            >
              {copys.menu.catalogo} ▾
            </NavLink>
            {cat && (
              <div className="absolute left-0 top-full z-50 w-64 pt-2">
                <div id={catId} className="border border-borde bg-crema p-4 shadow-panel">
                  <p className="mb-2 text-rotulo font-semibold uppercase text-tinta-apagada">
                    {copys.catalogoBloques.ropa}
                  </p>
                  <ul className="mb-3 space-y-1">
                    {ROPA.map((l) => (
                      <li key={l.to}>
                        <NavLink to={l.to} className="block py-1 text-sm hover:text-acento">
                          {l.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                  <p className="mb-2 text-rotulo font-semibold uppercase text-tinta-apagada">
                    {copys.catalogoBloques.merceria}
                  </p>
                  <NavLink to="/catalogo/merceria" className="block py-1 text-sm hover:text-acento">
                    Mercería y costura
                  </NavLink>
                </div>
              </div>
            )}
          </div>
          {ENLACES.filter((e) => e.to !== '/').map((e) => (
            <Item key={e.to} to={e.to}>
              {e.label}
            </Item>
          ))}
        </nav>
        <div className="ml-auto hidden lg:block">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escríbenos por WhatsApp"
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-boton px-3.5 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              <IconoWhatsApp className="h-4 w-4" />
              {copys.botones.whatsapp}
            </a>
          )}
        </div>
        <button
          type="button"
          className="ml-auto grid h-11 w-11 place-items-center lg:hidden"
          aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menu}
          onClick={() => setMenu((v) => !v)}
        >
          {menu ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </button>
      </div>
      {menu && (
        <nav className="border-t border-borde bg-crema px-4 py-4 lg:hidden" aria-label="Móvil">
          <ul className="space-y-1">
            <li>
              <NavLink to="/" className="block min-h-11 py-2" onClick={() => setMenu(false)}>
                {copys.menu.inicio}
              </NavLink>
            </li>
            {ROPA.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className="block min-h-11 py-2" onClick={() => setMenu(false)}>
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/catalogo/merceria"
                className="block min-h-11 py-2"
                onClick={() => setMenu(false)}
              >
                Mercería y costura
              </NavLink>
            </li>
            {ENLACES.filter((e) => e.to !== '/').map((e) => (
              <li key={e.to}>
                <NavLink to={e.to} className="block min-h-11 py-2" onClick={() => setMenu(false)}>
                  {e.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function Item({ to, end, children }: { to: string; end?: boolean; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cx('text-[0.95rem] text-tinta', isActive && 'border-b-2 border-acento pb-0.5')
      }
    >
      {children}
    </NavLink>
  );
}
