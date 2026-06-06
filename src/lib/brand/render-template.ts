/**
 * Simple `{{placeholder}}` substitution for brand email templates.
 *
 * @packageDocumentation
 */

/** Replace `{{key}}` placeholders in a template string. */
export function renderBrandTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? '');
}
