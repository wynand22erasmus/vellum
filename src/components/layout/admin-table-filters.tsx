/**
 * Shared filter form and query helpers for admin data tables.
 *
 * @packageDocumentation
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/** Tailwind classes applied to native select controls in admin filters. */
export const ADMIN_FILTER_SELECT_CLASS =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs';

/** Configuration for a single admin table filter field. */
export type AdminTableFilterField = {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select';
  placeholder?: string;
  autoComplete?: string;
  options?: readonly { value: string; label: string }[];
};

type AdminTableFiltersProps = {
  fields: AdminTableFilterField[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  onApply: () => void;
  onClear: () => void;
};

function gridClassForFieldCount(count: number): string {
  if (count >= 4) {
    return 'sm:grid-cols-2 lg:grid-cols-4';
  }
  if (count === 3) {
    return 'sm:grid-cols-2 lg:grid-cols-3';
  }
  if (count === 2) {
    return 'sm:grid-cols-2';
  }
  return '';
}

/** Render configurable text, email, and select filters with apply and clear actions. */
export function AdminTableFilters({
  fields,
  values,
  onChange,
  onApply,
  onClear,
}: AdminTableFiltersProps) {
  const hasActiveFilters = fields.some((field) => values[field.id]?.trim());

  return (
    <div className="space-y-3">
      <div className={cn('grid gap-3', gridClassForFieldCount(fields.length))}>
        {fields.map((field) => (
          <div key={field.id} className="space-y-1">
            <Label htmlFor={field.id}>{field.label}</Label>
            {field.type === 'select' ? (
              <select
                id={field.id}
                className={ADMIN_FILTER_SELECT_CLASS}
                value={values[field.id] ?? ''}
                onChange={(event) => onChange(field.id, event.target.value)}
              >
                {(field.options ?? []).map((option) => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id={field.id}
                type={field.type}
                autoComplete={field.autoComplete ?? 'off'}
                placeholder={field.placeholder}
                value={values[field.id] ?? ''}
                onChange={(event) => onChange(field.id, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    onApply();
                  }
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={onApply}>
          Apply filters
        </Button>
        <Button type="button" variant="outline" onClick={onClear} disabled={!hasActiveFilters}>
          Clear filters
        </Button>
      </div>
    </div>
  );
}

/** Set a query parameter only when the value is non-empty. */
export function setOptionalQueryParam(
  params: URLSearchParams,
  key: string,
  value: string | undefined,
) {
  if (value) {
    params.set(key, value);
  }
}
