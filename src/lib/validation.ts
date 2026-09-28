/**
 * Zod validation schemas for contamination data and Supabase submissions
 * Used to validate JSON.parse results and submission payloads
 */

import { z } from 'zod';

/**
 * Schema for dimension scores (0-100)
 */
const ScoreSchema = z.number().int().min(0).max(100);

/**
 * Schema for an array of 6 core dimension scores (Phase 1)
 */
export const CoreScoresSchema = z.array(ScoreSchema).length(6);

/**
 * Schema for an array of 11 total dimension scores (extended)
 */
export const ExtendedScoresSchema = z.array(ScoreSchema).length(11);

/**
 * Schema for contamination metadata
 */
export const ContaminationMetadataSchema = z.object({
  p1_scores: z.array(ScoreSchema),
  p3_scores: z.array(ScoreSchema),
  agent_name: z.string().min(1),
  prompt_version: z.string(),
  acat_version: z.string(),
  instrument_variant: z.string(),
  p_version: z.string(),
  user_agent: z.string(),
  timestamp: z.string().datetime(),
  notes: z.string(),
  behavioral_summary: z.string(),
  extended_dims: z.record(z.string(), z.object({
      p1: ScoreSchema,
      p3: ScoreSchema,
    })
  ).optional(),
});

export type ContaminationMetadata = z.infer<typeof ContaminationMetadataSchema>;

/**
 * Schema for Supabase submission payload
 */
export const SupabasePayloadSchema = z.object({
  agent_name: z.string(),
  layer: z.string(),
  mode: z.string(),
  prompt_version: z.string(),
  acat_version: z.string(),
  instrument_variant: z.string(),
  thread_id: z.string(),
  bot_name: z.string(),
  p_version: z.string(),
  assessment_mode: z.string(),
  p1_truth: ScoreSchema,
  p1_service: ScoreSchema,
  p1_harm: ScoreSchema,
  p1_autonomy: ScoreSchema,
  p1_value: ScoreSchema,
  p1_humility: ScoreSchema,
  p3_truth: ScoreSchema,
  p3_service: ScoreSchema,
  p3_harm: ScoreSchema,
  p3_autonomy: ScoreSchema,
  p3_value: ScoreSchema,
  p3_humility: ScoreSchema,
  extended_dims: z.record(z.string(), z.object({
      p1: ScoreSchema,
      p3: ScoreSchema,
    })),
  version: z.string(),
  provider: z.string(),
  notes: z.string(),
  user_agent: z.string(),
  pair_id: z.string(),
  behavioral_summary: z.string(),
  flags: z.array(z.string()),
  contamination_flags: z.array(z.string()).nullable(),
  contamination_action: z.enum(['EXCLUDE', 'FLAG_FOR_REVIEW', 'INCLUDE']).nullable(),
  contamination_confidence: z.number().int().min(0).max(100),
  metadata: z.string(), // JSON stringified
});

export type SupabasePayload = z.infer<typeof SupabasePayloadSchema>;

/**
 * Schema for environment variables validation
 */
export const EnvironmentSchema = z.object({
  VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL must be a valid URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY is required'),
});

export type Environment = z.infer<typeof EnvironmentSchema>;

/**
 * Parse and validate JSON with Zod schema
 * Returns parsed data or null if validation fails
 */
export function parseJSON<T>(
  jsonString: string,
  schema: z.ZodSchema<T>
): T | null {
  try {
    const parsed = JSON.parse(jsonString);
    return schema.parse(parsed);
  } catch (error) {
    const errorMessage = error instanceof z.ZodError
      ? `Validation error: ${error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')}`
      : error instanceof SyntaxError
      ? `JSON syntax error: ${error.message}`
      : String(error);

    logAudit('JSON_PARSE_ERROR', {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    return null;
  }
}

/**
 * Audit log function for security events
 * Logs to contamination_review_log.txt (client-side this writes to console and localStorage)
 */
export function logAudit(
  event: string,
  data: Record<string, unknown>
): void {
  const logEntry = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  // Console logging for debugging
  console.warn('[AUDIT]', event, data);

  // Store in localStorage for persistence
  try {
    const auditLog = localStorage.getItem('contamination_audit_log') || '[]';
    const logs = JSON.parse(auditLog);
    logs.push(logEntry);
    // Keep only last 100 entries to avoid storage overflow
    const trimmed = logs.slice(-100);
    localStorage.setItem('contamination_audit_log', JSON.stringify(trimmed));
  } catch (error) {
    console.error('[AUDIT_STORAGE_ERROR]', error);
  }
}

/**
 * Retrieve audit logs from localStorage
 */
export function getAuditLogs(): unknown[] {
  try {
    const auditLog = localStorage.getItem('contamination_audit_log') || '[]';
    return JSON.parse(auditLog);
  } catch (error) {
    console.error('[AUDIT_RETRIEVAL_ERROR]', error);
    return [];
  }
}

/**
 * Export audit logs as a file
 */
export function exportAuditLogs(): string {
  const logs = getAuditLogs();
  const header = `# Contamination Review Audit Log\n# Generated: ${new Date().toISOString()}\n\n`;
  const entries = logs
    .map((log) => `${JSON.stringify(log, null, 2)}`)
    .join('\n---\n');
  return header + entries;
}
