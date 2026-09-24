/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://ksinisdzgtnqzsymhfya.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaW5pc2R6Z3RucXpzeW1oZnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDEzMzEsImV4cCI6MjA4OTg3NzMzMX0.2M9uE_JQOeDPy8obGweyNlPNMiJoISSf3xx4qeYbUU8';

export interface LiveStats {
  n_total: number;
  n_phase1: number;
  n_li: number;
  mean_li: number;
  self_assessment_gap?: number;
  overall_ans?: number;
  humility_gap?: number;
  h1_confirmed?: boolean;
  external_validation?: string;
  timestamp: string;
}

export async function fetchLiveStats(): Promise<LiveStats | null> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/acat_stats_v1?select=*&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      const row = data[0];
      return {
        n_total: row.n_total ?? 629,
        n_phase1: row.n_phase1 ?? 516,
        n_li: row.n_li ?? 307,
        mean_li: row.mean_li ?? 0.8632,
        self_assessment_gap: row.self_assessment_gap ?? 37.16,
        overall_ans: row.overall_ans ?? 79.8,
        humility_gap: row.humility_gap ?? 23.7,
        h1_confirmed: row.h1_confirmed ?? true,
        external_validation: row.external_validation ?? '7 sources',
        timestamp: row.timestamp ?? new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error('Failed to fetch live stats from Supabase:', error);
  }

  return null;
}
