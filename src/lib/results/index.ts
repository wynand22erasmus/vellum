/**
 * Public exports for Vellum success result responses.
 *
 * @packageDocumentation
 */

export {
  RESULT_TYPE_BASE_URL,
  RESULT_TITLES,
  RESULT_STATUS,
  resultTypeUri,
  type ResultTypeSlug,
} from './result-types.ts';
export { sendResult, sendResultEnvelope } from './send-result.ts';
