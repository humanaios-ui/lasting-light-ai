/**
 * Delta Page Generator
 * Regenerates only pages affected by index changes (incremental rebuild)
 *
 * Triggered by: AI-EO Incremental Indexer "index-updated" events
 * Input: Delta index entries (changed entities)
 * Output: Regenerated HTML/React pages for affected topics and gaps
 * Targets: 5-minute latency from event to page deployment
 */

export interface DeltaIndexEntry {
  entity_id: string;
  entity_type: 'topic' | 'gap';
  title: string;
  velocity?: number;
  trending_trajectory?: string;
  related_entities?: Array<{ entity_id: string; relationship_type: string }>;
  signal_strength?: number;
  public_confidence?: number;
  discussion_volume?: number;
  lifecycle_stage?: string;
  days_active?: number;
  last_updated?: string;
  [key: string]: string | number | boolean | null | undefined | Record<string, unknown> | unknown[];
}

export interface RegeneratedPage {
  page_id: string;
  entity_id: string;
  path: string;
  status: 'success' | 'error';
  timestamp: string;
}

/**
 * Identify all pages affected by delta entries (browser-safe version)
 *
 * When a topic changes:
 * - Regenerate its topic detail page
 * - Regenerate all related gap pages (links back)
 *
 * When a gap changes:
 * - Regenerate its gap page
 * - Regenerate all related topic pages (references gap)
 */
export function identifyAffectedPages(deltaEntries: DeltaIndexEntry[]): Set<string> {
  const affectedPageIds = new Set<string>();

  for (const entry of deltaEntries) {
    affectedPageIds.add(`page-${entry.entity_id}`);

    if (entry.related_entities) {
      for (const related of entry.related_entities) {
        affectedPageIds.add(`page-${related.entity_id}`);
      }
    }
  }

  return affectedPageIds;
}

/**
 * Simulate page regeneration (browser-safe version)
 */
export async function simulatePageRegeneration(
  deltaEntries: DeltaIndexEntry[]
): Promise<RegeneratedPage[]> {
  console.log(`[Delta Generator] Starting regeneration of ${deltaEntries.length} delta entries`);

  const affectedPageIds = identifyAffectedPages(deltaEntries);
  console.log(`[Delta Generator] Identified ${affectedPageIds.size} affected pages`);

  const results: RegeneratedPage[] = [];

  for (const pageId of affectedPageIds) {
    const entityId = pageId.replace('page-', '');
    const indexEntry = deltaEntries.find((e) => e.entity_id === entityId);

    if (indexEntry) {
      const timestamp = new Date().toISOString();
      results.push({
        page_id: pageId,
        entity_id: entityId,
        path: `/api/${entityId}.json`,
        status: 'success',
        timestamp,
      });
    }
  }

  const successful = results.filter((r) => r.status === 'success').length;
  const failed = results.filter((r) => r.status === 'error').length;
  console.log(`[Delta Generator] Completed: ${successful} successful, ${failed} failed`);

  return results;
}

/**
 * Emit "index-updated" event for downstream listeners
 */
export function emitIndexUpdatedEvent(
  deltaEntries: DeltaIndexEntry[],
  results: RegeneratedPage[]
): void {
  const event = {
    type: 'index-updated',
    timestamp: new Date().toISOString(),
    delta_count: deltaEntries.length,
    pages_regenerated: results.filter((r) => r.status === 'success').length,
    pages_failed: results.filter((r) => r.status === 'error').length,
  };

  console.log('[Delta Generator] Index updated event:', JSON.stringify(event));
}
