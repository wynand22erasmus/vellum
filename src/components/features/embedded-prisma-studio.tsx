/**
 * In-app Prisma Studio embed for development database inspection.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import { Studio } from '@prisma/studio-core/ui';
import { createPostgresAdapter } from '@prisma/studio-core/data/postgres-core';
import { createStudioBFFClient } from '@prisma/studio-core/data/bff';
import '@prisma/studio-core/ui/index.css';

/** Embed Prisma Studio against the authenticated `/api/studio` BFF endpoint. */
export function EmbeddedPrismaStudio() {
  const adapter = useMemo(() => {
    const executor = createStudioBFFClient({
      url: '/api/studio',
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          credentials: 'include',
        }),
    });
    return createPostgresAdapter({ executor });
  }, []);

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden [&_.ps-root]:h-full">
      <Studio adapter={adapter} />
    </div>
  );
}
