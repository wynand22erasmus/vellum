/**
 * Cycles light → dark → system theme via a toolbar button.
 *
 * @packageDocumentation
 */

import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { useTheme } from '../hooks/use-theme.ts';
import type { Theme } from '../lib/theme.ts';

const cycle: Theme[] = ['light', 'dark', 'system'];

const labels: Record<Theme, string> = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System theme',
};

/** Icon button that rotates through theme modes. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function handleClick() {
    const index = cycle.indexOf(theme);
    const next = cycle[(index + 1) % cycle.length]!;
    setTheme(next);
  }

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      aria-label={labels[theme]}
      title={labels[theme]}
      className="shrink-0"
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span className="sr-only">{labels[theme]}</span>
    </Button>
  );
}
