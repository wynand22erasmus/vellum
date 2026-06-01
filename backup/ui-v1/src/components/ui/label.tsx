/**
 * Accessible form label (Radix Label primitive).
 *
 * @packageDocumentation
 */

import * as LabelPrimitive from '@radix-ui/react-label';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils.ts';

/** Associates label text with a form control. */
export function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    />
  );
}
