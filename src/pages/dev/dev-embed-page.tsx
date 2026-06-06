/**
 * Dev service embed page.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { EmbeddedPrismaStudio } from '@/components/features/embedded-prisma-studio';
import { EmptyState } from '@/components/layout/empty-state';
import { useTheme } from '@/hooks/use-theme';
import type { DevServiceLink } from '@/lib/dev-services';
import {
  devServiceEmbedMode,
  devServiceIframeSrc,
  resolveDevServiceUrl,
} from '@/lib/dev-embed';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiGet } from '@/lib/api-client';
import { normalizeAppPath } from '@/lib/sidebar-nav';

const EMBED_SHELL_CLASS = 'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden';

/** Full-page embed for a dev service (e.g. Prisma Studio). */
export function DevEmbedPage() {
  const { serviceId } = useParams({ strict: false }) as { serviceId: string };
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const [devServices, setDevServices] = useState<DevServiceLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) {
      void navigate({ to: normalizeAppPath('/dev'), replace: true });
    }
  }, [serviceId, navigate]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await apiGet<{ isProduction: boolean; devServices: DevServiceLink[] }>('/api/meta');
        if (!cancelled && !data.isProduction) setDevServices(data.devServices);
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
              <Link to={normalizeAppPath('/dev')}>Back to development</Link>
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
    <div className={EMBED_SHELL_CLASS}>
      <iframe
        key={iframeKey}
        title={service.label}
        src={devServiceIframeSrc(service)}
        className="min-h-0 w-full flex-1 border-0"
      />
    </div>
  );
}
