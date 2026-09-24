import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Mail, Phone, X } from 'lucide-react';
import { Logo } from './LogoMarca';
import { IconoWhatsApp } from './IconoWhatsApp';
import { BotonTema } from './BotonTema';
import { usarAjustes } from '../hooks/usar-ajustes';
import { usarWhatsAppPagina } from '../hooks/whatsapp-pagina';
import { copys } from '../lib/copys';
import { enlaceWhatsApp, telHref } from '../lib/whatsapp';
import { cx } from '../lib/cx';

const ENLACES = [
  { to: '/', label: copys.menu.inicio, end: true },
  { to: '/arreglos', label: copys.menu.arreglos },
  { to: '/nosotros', label: copys.menu.nosotros },
  { to: '/contacto', label: copys.menu.contacto },
];

const ROPA = [
  { to: '/catalogo?categoria=mujer', label: 'Mujer' },
  { to: '/catalogo?categoria=hombre', label: 'Hombre' },
  { to: '/catalogo?categoria=ninos', label: 'Niños' },
];

const OPCION_CAT =
  '-mx-1 block rounded-md px-2 py-1.5 text-sm text-tinta transition-colors hover:bg-arena-2 hover:text-acento';

export function Cabecera() {
  const { data } = usarAjustes();
  const { origen, nombre } = usarWhatsAppPagina();
  const [menu, setMenu] = useState(false);
  const [cat, setCat] = useState(false);
  const [catMovil, setCatMovil] = useState(false);
  const loc = useLocation();
  const catRef = useRef<HTMLDivElement>(null);
  const catId = useId();
  const catMovilId = useId();

  useEffect(() => {
    setMenu(false);
    setCat(false);
    setCatMovil(false);
  }, [loc.pathname, loc.search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCat(false);
        setCatMovil(false);
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
      <div className="envoltorio flex h-[4.75rem] items-center gap-8 lg:h-[5.25rem]">
        <Logo />
        <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Principal">
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
                'text-[1.05rem] text-tinta',
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
                        <NavLink to={l.to} className={OPCION_CAT}>
                          {l.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                  <p className="mb-2 text-rotulo font-semibold uppercase text-tinta-apagada">
                    {copys.catalogoBloques.merceria}
                  </p>
                  <NavLink to="/catalogo/merceria" className={OPCION_CAT}>
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
        <div className="ml-auto hidden items-center gap-0.5 lg:flex">
          <BotonTema />
          {data?.telefono && (
            <IconoContacto href={telHref(data.telefono)} etiqueta="Llamar a la tienda">
              <Phone className="h-5 w-5" strokeWidth={1.75} />
            </IconoContacto>
          )}
          {data?.email && (
            <IconoContacto href={`mailto:${data.email}`} etiqueta="Enviar un correo">
              <Mail className="h-5 w-5" strokeWidth={1.75} />
            </IconoContacto>
          )}
          {wa && (
            <IconoContacto href={wa} etiqueta="Escríbenos por WhatsApp">
              <IconoWhatsApp className="h-5 w-5" />
            </IconoContacto>
          )}
        </div>
        <div className="ml-auto flex items-center gap-0.5 lg:hidden">
          <BotonTema />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center"
            aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menu}
            onClick={() => setMenu((v) => !v)}
          >
            {menu ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>
      </div>
      {menu && (
        <nav className="border-t border-borde bg-crema px-4 py-4 lg:hidden" aria-label="Móvil">
          <ul className="space-y-1">
            <li>
              <NavLink to="/" className="block min-h-11 py-2" onClick={() => setMenu(false)}>
                {copys.menu.inicio}
              </NavLink>
            </li>
            <li>
              <button
                type="button"
                className="flex min-h-11 w-full items-center justify-between py-2 text-left text-tinta"
                aria-expanded={catMovil}
                aria-controls={catMovilId}
                onClick={() => setCatMovil((v) => !v)}
              >
                {copys.menu.catalogo}
                <ChevronDown
                  className={cx('h-5 w-5 transition-transform', catMovil && 'rotate-180')}
                  aria-hidden
                />
              </button>
              {catMovil && (
                <ul id={catMovilId} className="mb-1 space-y-1 pl-4">
                  <li>
                    <NavLink
                      to="/catalogo"
                      end
                      className="block min-h-11 py-2 text-sm"
                      onClick={() => setMenu(false)}
                    >
                      Ver todo el catálogo
                    </NavLink>
                  </li>
                  {ROPA.map((l) => (
                    <li key={l.to}>
                      <NavLink
                        to={l.to}
                        className="block min-h-11 py-2 text-sm"
                        onClick={() => setMenu(false)}
                      >
                        {l.label}
                      </NavLink>
                    </li>
                  ))}
                  <li>
                    <NavLink
                      to="/catalogo/merceria"
                      className="block min-h-11 py-2 text-sm"
                      onClick={() => setMenu(false)}
                    >
                      Mercería y costura
                    </NavLink>
                  </li>
                </ul>
              )}
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

function IconoContacto({
  href,
  etiqueta,
  children,
}: {
  href: string;
  etiqueta: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={etiqueta}
      className="grid h-10 w-10 place-items-center rounded-md text-tinta hover:bg-arena-2"
    >
      {children}
    </a>
  );
}

function Item({ to, end, children }: { to: string; end?: boolean; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cx('text-[1.05rem] text-tinta', isActive && 'border-b-2 border-acento pb-0.5')
      }
    >
      {children}
    </NavLink>
  );
}
