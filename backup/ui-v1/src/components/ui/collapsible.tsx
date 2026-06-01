/**
 * Collapsible expand/collapse region (Radix primitive wrappers).
 *
 * @packageDocumentation
 */

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/** Root that toggles visibility of collapsible sections. */
const Collapsible = CollapsiblePrimitive.Root

/** Opens or closes the associated content. */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

/** Animated region revealed when expanded. */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
