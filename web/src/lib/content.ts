/*
 * content.ts — shared ISR cache bookkeeping.
 *
 * Public reads (lib/api.ts) are wrapped in unstable_cache with this tag;
 * every admin write calls revalidateContent() so publishes go live
 * instantly instead of waiting out the 60s revalidate window.
 */

import { revalidateTag } from "next/cache";

export const CONTENT_TAG = "portfolio-content";

export function revalidateContent(): void {
  /* Next 16: two-arg form. "max" = serve stale for up to a year while the
     tagged data revalidates in the background — instant-feeling publishes. */
  revalidateTag(CONTENT_TAG, "max");
}
