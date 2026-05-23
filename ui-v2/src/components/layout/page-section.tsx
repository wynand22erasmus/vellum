import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PageSectionProps = {
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function PageSection({ title, description, className, children }: PageSectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      {title || description ? (
        <div>
          {title ? (
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          ) : null}
          {description ? (
            <p
              className={
                title
                  ? 'mt-1 text-sm text-muted-foreground'
                  : 'text-sm text-muted-foreground'
              }
            >
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** @deprecated Use {@link PageContainer.TableFrame} from `@/components/layout/page-container`. */
export { TableFrame } from '@/components/layout/page-container';
