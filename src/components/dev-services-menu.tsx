/**
 * Dev-only dropdown menu linking to local infrastructure (Mailpit, MinIO, docs).
 *
 * @packageDocumentation
 */

import { ExternalLink, Server } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from './ui/button.tsx';

type DevServiceLink = {
  id: string;
  label: string;
  url: string;
  description?: string;
};

type MetaResponse = {
  isProduction: boolean;
  devServices: DevServiceLink[];
};

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** Top-bar menu with links to dev infrastructure; hidden in production. */
export function DevServicesMenu() {
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<DevServiceLink[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/meta');
        if (!res.ok) {
          return;
        }
        const data = (await res.json()) as MetaResponse;
        if (!cancelled && !data.isProduction && data.devServices.length > 0) {
          setServices(data.devServices);
        }
      } catch {
        // ignore — menu stays hidden
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (services.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="shrink-0 gap-1.5"
      >
        <Server className="h-4 w-4" aria-hidden />
        <span>Dev services</span>
      </Button>

      {open ? (
        <nav
          id={menuId}
          aria-label="Development services"
          className="absolute left-0 top-full z-50 mt-1 min-w-[14rem] rounded-md border border-[var(--color-border)] bg-[var(--color-card)] py-1 shadow-lg"
        >
          <ul className="flex flex-col">
            {services.map((service) => {
              const external = isExternalUrl(service.url);
              return (
                <li key={service.id}>
                  <a
                    href={service.url}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-2 px-3 py-2 text-sm hover:bg-[var(--color-muted)]"
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex min-w-0 flex-1 flex-col text-left">
                      <span className="font-medium text-[var(--color-foreground)]">
                        {service.label}
                      </span>
                      {service.description ? (
                        <span className="text-xs text-[var(--color-muted-foreground)]">
                          {service.description}
                        </span>
                      ) : null}
                    </span>
                    {external ? (
                      <ExternalLink
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-muted-foreground)]"
                        aria-hidden
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
