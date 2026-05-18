/**
 * Shared UI and styling utilities.
 *
 * @packageDocumentation
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names with `clsx` and resolves conflicts via `tailwind-merge`.
 *
 * @param inputs - Class name fragments or conditional maps
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
