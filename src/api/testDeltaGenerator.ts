/**
 * Delta Page Generator - Demo/Test Script
 * Runs entirely in the browser using simulated data
 */

import { simulatePageRegeneration, identifyAffectedPages, emitIndexUpdatedEvent, DeltaIndexEntry } from './generateDeltaPages';

export const DEMO_DELTA_ENTRIES: DeltaIndexEntry[] = [
  {
    entity_id: 'topic-ai-jailbreaks-2026',
    entity_type: 'topic',
    title: 'AI Jailbreak Techniques & Detection Methods',
    velocity: 0.82,
    trending_trajectory: 'up_strong',
    signal_strength: 0.9,
    public_confidence: 0.78,
    discussion_volume: 342,
    lifecycle_stage: 'emerging',
    days_active: 14,
    last_updated: new Date().toISOString(),
    related_entities: [
      { entity_id: 'gap-jailbreak-detection', relationship_type: 'addresses' },
    ]
  },
  {
    entity_id: 'gap-jailbreak-detection',
    entity_type: 'gap',
    title: 'Real-time Jailbreak Detection Gap',
    velocity: 0.65,
    trending_trajectory: 'up',
    signal_strength: 0.72,
    public_confidence: 0.65,
    discussion_volume: 89,
    lifecycle_stage: 'research_needed',
    days_active: 28,
    last_updated: new Date().toISOString(),
    related_entities: [
      { entity_id: 'topic-ai-jailbreaks-2026', relationship_type: 'addressed_by' }
    ]
  }
];

export async function runDemoTest(): Promise<{
  deltaEntries: number;
  affectedPages: number;
  pagesRegenerated: number;
  pagesFailed: number;
}> {
  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║     Delta Page Generator - Browser Demo                            ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  console.log('📊 Identifying Affected Pages (Transitive Closure)');
  const affectedPageIds = identifyAffectedPages(DEMO_DELTA_ENTRIES);
  console.log(`✓ Found ${affectedPageIds.size} affected pages from ${DEMO_DELTA_ENTRIES.length} delta entries\n`);
  
  affectedPageIds.forEach(pageId => {
    const entityId = pageId.replace('page-', '');
    const entry = DEMO_DELTA_ENTRIES.find(e => e.entity_id === entityId);
    if (entry) {
      console.log(`  • ${pageId}: ${entry.title} (velocity: ${entry.velocity})`);
    }
  });
  
  console.log('\n🔄 Regenerating Changed Pages');
  const results = await simulatePageRegeneration(DEMO_DELTA_ENTRIES);
  
  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'error').length;
  
  console.log(`✓ Regeneration complete: ${successful} successful, ${failed} failed\n`);
  
  emitIndexUpdatedEvent(DEMO_DELTA_ENTRIES, results);

  return {
    deltaEntries: DEMO_DELTA_ENTRIES.length,
    affectedPages: affectedPageIds.size,
    pagesRegenerated: successful,
    pagesFailed: failed,
  };
}
