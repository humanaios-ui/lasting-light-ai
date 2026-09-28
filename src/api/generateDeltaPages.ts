/**
 * Delta Page Generator
 * Regenerates only pages affected by index changes (incremental rebuild)
 *
 * Triggered by: AI-EO Incremental Indexer "index-updated" events
 * Input: Delta index entries (changed entities)
 * Output: Regenerated HTML/React pages for affected topics and gaps
 * Targets: 5-minute latency from event to page deployment
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

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
 * Identify all pages affected by delta entries
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
    // Primary page for this entity
    affectedPageIds.add(`page-${entry.entity_id}`);

    // Related pages (transitive closure)
    if (entry.related_entities) {
      for (const related of entry.related_entities) {
        affectedPageIds.add(`page-${related.entity_id}`);
      }
    }
  }

  return affectedPageIds;
}

/**
 * Regenerate a single page from entity data
 * Stub: In production, this would render React components or generate HTML
 */
export async function regeneratePage(
  entityId: string,
  indexData: DeltaIndexEntry,
  outputDir: string
): Promise<RegeneratedPage> {
  const pageId = `page-${entityId}`;
  const timestamp = new Date().toISOString();

  try {
    // Path where page would be written
    // In production: /public/topics/{entity_id}.json or /pages/topics/{entity_id}.html
    const pagePath = join(outputDir, `${entityId}.json`);

    // Prepare page data structure
    const pageData = {
      id: pageId,
      entity_id: entityId,
      entity_type: indexData.entity_type,
      title: indexData.title,
      velocity: indexData.velocity,
      trending_trajectory: indexData.trending_trajectory,
      signal_strength: indexData.signal_strength,
      public_confidence: indexData.public_confidence,
      discussion_volume: indexData.discussion_volume,
      lifecycle_stage: indexData.lifecycle_stage,
      days_active: indexData.days_active,
      related_entities: indexData.related_entities || [],
      generated_at: timestamp,
    };

    // In production, this would:
    // 1. Render React component with data
    // 2. Generate static HTML
    // 3. Optimize images/assets
    // 4. Write to CDN or S3
    //
    // For now, write JSON representation
    writeFileSync(pagePath, JSON.stringify(pageData, null, 2));

    return {
      page_id: pageId,
      entity_id: entityId,
      path: pagePath,
      status: 'success',
      timestamp,
    };
  } catch (error) {
    console.error(`Failed to regenerate page for ${entityId}:`, error);
    return {
      page_id: pageId,
      entity_id: entityId,
      path: '',
      status: 'error',
      timestamp,
    };
  }
}

/**
 * Main entry point: Regenerate all affected pages
 *
 * Usage:
 *   const index = JSON.parse(readFileSync('ai-eo-index.json', 'utf8'));
 *   const deltaEntries = index.entries.filter(e => e.last_updated > checkpoint);
 *   const results = await regenerateChangedPages(deltaEntries, './public/api');
 */
export async function regenerateChangedPages(
  deltaEntries: DeltaIndexEntry[],
  outputDir: string = './public/api'
): Promise<RegeneratedPage[]> {
  const startTime = Date.now();

  console.log(`[Delta Generator] Starting regeneration of ${deltaEntries.length} delta entries`);

  // Identify all affected pages (transitive closure)
  const affectedPageIds = identifyAffectedPages(deltaEntries);
  console.log(`[Delta Generator] Identified ${affectedPageIds.size} affected pages`);

  // Regenerate pages in parallel
  const regenerationPromises: Promise<RegeneratedPage>[] = [];

  for (const pageId of affectedPageIds) {
    const entityId = pageId.replace('page-', '');
    const indexEntry = deltaEntries.find((e) => e.entity_id === entityId);

    if (indexEntry) {
      regenerationPromises.push(regeneratePage(entityId, indexEntry, outputDir));
    }
  }

  const results = await Promise.all(regenerationPromises);

  // Log results
  const successful = results.filter((r) => r.status === 'success').length;
  const failed = results.filter((r) => r.status === 'error').length;
  const elapsed = Date.now() - startTime;

  console.log(
    `[Delta Generator] Completed: ${successful} successful, ${failed} failed (${elapsed}ms)`
  );

  return results;
}

/**
 * Emit "index-updated" event for downstream listeners
 * (e.g., React components that subscribe to index changes)
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

  // In production, this would:
  // - Emit to EventEmitter or RxJS Observable
  // - Post to message queue for downstream consumption
  // - Trigger browser updates via WebSocket
}

// Export for CLI usage
if (require.main === module) {
  const indexPath = process.argv[2] || './ai-eo-index.json';
  const outputDir = process.argv[3] || './public/api';

  try {
    const indexContent = readFileSync(indexPath, 'utf8');
    const indexData = JSON.parse(indexContent);
    const deltaEntries = (indexData.entries || []) as DeltaIndexEntry[];

    regenerateChangedPages(deltaEntries, outputDir)
      .then((results) => {
        emitIndexUpdatedEvent(deltaEntries, results);
        process.exit(results.some((r) => r.status === 'error') ? 1 : 0);
      })
      .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
      });
  } catch (error) {
    console.error('Failed to load index:', error);
    process.exit(1);
  }
}
