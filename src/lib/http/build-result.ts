/**
 * Builds Vellum success result envelopes.
 *
 * @packageDocumentation
 */

import {
  RESULT_STATUS,
  RESULT_TITLES,
  resultTypeUri,
  type ResultTypeSlug,
} from '../results/result-types.ts';
import type { VellumResult } from './vellum-result.ts';

/** Input for {@link buildResult}. */
export type BuildResultInput<T> = {
  slug: ResultTypeSlug;
  data: T;
  detail?: string;
  instance?: string;
  status?: number;
};

/** Assembles a VellumResult body from catalog metadata. */
export function buildResult<T>(input: BuildResultInput<T>): VellumResult<T> {
  const status = input.status ?? RESULT_STATUS[input.slug];
  return {
    type: resultTypeUri(input.slug),
    title: RESULT_TITLES[input.slug],
    status,
    detail: input.detail,
    instance: input.instance,
    data: input.data,
  };
}
