/**
 * Builds RFC 9457 Problem Details objects.
 *
 * @packageDocumentation
 */

import {
  PROBLEM_STATUS,
  PROBLEM_TITLES,
  problemTypeUri,
  type ProblemTypeSlug,
} from '../errors/problem-types.ts';
import type { ProblemDetails } from './problem-details.ts';

/** Input for {@link buildProblem}. */
export type BuildProblemInput = {
  slug: ProblemTypeSlug;
  detail: string;
  instance?: string;
  status?: number;
  extensions?: Record<string, unknown>;
};

/** Assembles a Problem Details body from catalog metadata. */
export function buildProblem(input: BuildProblemInput): ProblemDetails {
  const status = input.status ?? PROBLEM_STATUS[input.slug];
  return {
    type: problemTypeUri(input.slug),
    title: PROBLEM_TITLES[input.slug],
    status,
    detail: input.detail,
    instance: input.instance,
    ...input.extensions,
  };
}
