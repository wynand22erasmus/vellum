/**
 * Type-safe TanStack Link wrappers for shadcn components.
 *
 * @packageDocumentation
 */

import { createLink } from '@tanstack/react-router';
import { Button, buttonVariants } from '@/components/ui/button';

/** Button styled as a TanStack Router link. */
export const RouterButton = createLink(Button);

export { buttonVariants };
