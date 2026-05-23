/**
 * Pulsing placeholder block for loading states.
 *
 * @packageDocumentation
 */

import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils.ts"

/** Gray animated rectangle used while content loads. */
function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
