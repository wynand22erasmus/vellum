/**
 * Embed development tools such as Prisma Studio and service UIs.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { EmbeddedPrismaStudio } from '@/components/features/embedded-prisma-studio';
import { EmptyState } from '@/components/layout/empty-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  devServiceEmbedMode,
  devServiceIframeSrc,
  resolveDevServiceUrl,
} from '@/lib/dev-embed';
import { useTheme } from '@/hooks/use-theme';
import type { DevServiceLink } from '@/lib/dev-services';

type MetaResponse = {
  isProduction: boolean;
  devServices: DevServiceLink[];
};

const EMBED_SHELL_CLASS = 'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden';

/** Render an iframe or native embed for a dev service (`/dev/:serviceId`). */
export function DevEmbedPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { resolvedTheme } = useTheme();
  const [devServices, setDevServices] = useState<DevServiceLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/meta');
        if (!res.ok) return;
        const data = (await res.json()) as MetaResponse;
        if (!cancelled && !data.isProduction) {
          setDevServices(data.devServices);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!serviceId) {
    return <Navigate to="/dev" replace />;
  }

  if (loading) {
    return (
      <div className={EMBED_SHELL_CLASS}>
        <Skeleton className="h-full min-h-0 w-full rounded-none" />
      </div>
    );
  }

  const service = resolveDevServiceUrl(serviceId, devServices);
  if (!service) {
    return (
      <div className={`${EMBED_SHELL_CLASS} p-4`}>
        <EmptyState
          title="Unknown dev service"
          action={
            <Button variant="link" asChild>
              <Link to="/dev">Back to development</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const mode = devServiceEmbedMode(service.id);

  if (mode === 'native-prisma') {
    return (
      <div className={EMBED_SHELL_CLASS}>
        <EmbeddedPrismaStudio />
      </div>
    );
  }

  const iframeKey =
    service.id === 'mailpit' ||
    service.id === 'minio-console' ||
    service.id === 'db-admin'
      ? `${service.id}-${resolvedTheme}`
      : service.id;

  return (
    <iframe
      key={iframeKey}
      title={service.label}
      src={devServiceIframeSrc(service)}
      className="block h-full min-h-0 w-full flex-1 border-0"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
