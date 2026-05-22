/**
 * Full main-area iframe host for experimental dev service embeds.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { resolveExperimentalUrl } from '../lib/experimental-services.ts';
import type { DevServiceLink } from '../lib/dev-services.ts';

type MetaResponse = {
  isProduction: boolean;
  devServices: DevServiceLink[];
};

/** Embeds a web dev service in the main content pane (`/experimental/:serviceId`). */
export function ExperimentalEmbedPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [devServices, setDevServices] = useState<DevServiceLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/meta');
        if (!res.ok) {
          return;
        }
        const data = (await res.json()) as MetaResponse;
        if (!cancelled && !data.isProduction) {
          setDevServices(data.devServices);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!serviceId) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const service = resolveExperimentalUrl(serviceId, devServices);
  if (!service) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm text-muted-foreground">Unknown experimental service.</p>
        <Link to="/dashboard" className="text-sm text-primary underline underline-offset-2">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <iframe
        key={service.id}
        title={service.label}
        src={service.url}
        className="min-h-0 flex-1 w-full border-0"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
