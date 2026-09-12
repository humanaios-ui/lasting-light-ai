/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */
export interface AssessmentDimension {
  id: string;
  label: string;
}

export interface ParsedAssessmentResponse {
  agent: string;
  p1Scores: number[] | null;
  p3Scores: number[] | null;
  summary: string;
}

export function clampScore(value: string | number): number {
  const parsed = typeof value === 'number' ? value : parseInt(value, 10);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
}

function parseScoreLine(prefix: string, lines: string[], dims: AssessmentDimension[]): number[] | null {
  const regex = new RegExp(`^${prefix}\\s*:`, 'i');
  const line = lines.find((entry) => regex.test(entry));
  if (!line) return null;

  const scoreStr = line.replace(regex, '').trim();
  const scores = Array(dims.length).fill(0);
  let found = 0;

  dims.forEach((dim, idx) => {
    const labelPattern = dim.label.replace(/[^a-zA-Z]/g, '.');
    const patterns = [
      new RegExp(`${dim.id}\\s*=\\s*(\\d+)`, 'i'),
      new RegExp(`${labelPattern}\\s*=\\s*(\\d+)`, 'i'),
    ];
    for (const pattern of patterns) {
      const match = scoreStr.match(pattern);
      if (match) {
        scores[idx] = clampScore(match[1]);
        found += 1;
        break;
      }
    }
  });

  return found >= 6 ? scores : null;
}

export function parseAssessmentResponse(text: string, dims: AssessmentDimension[]): ParsedAssessmentResponse {
  const normalized = text
    .replace(/\b(AGENT\s*:)/gi, '\n$1')
    .replace(/\b(P1\s*:)/gi, '\n$1')
    .replace(/\b(P3\s*:)/gi, '\n$1')
    .replace(/\b(SUMMARY\s*:)/gi, '\n$1');
  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const agentLine = lines.find((line) => /^AGENT\s*:/i.test(line));
  const agent = agentLine ? agentLine.replace(/^AGENT\s*:\s*/i, '').trim() : '';

  let summary = '';
  const summaryIndex = lines.findIndex((line) => /^SUMMARY\s*:/i.test(line));
  if (summaryIndex !== -1) {
    const firstLine = lines[summaryIndex].replace(/^SUMMARY\s*:\s*/i, '').trim();
    const continuation = [firstLine];
    for (let i = summaryIndex + 1; i < lines.length; i += 1) {
      if (/^(AGENT|P1|P3|SUMMARY)\s*:/i.test(lines[i])) break;
      continuation.push(lines[i]);
    }
    summary = continuation.join(' ').trim();
  } else {
    const p3Index = lines.findIndex((line) => /^P3\s*:/i.test(line));
    if (p3Index !== -1 && p3Index < lines.length - 1) {
      summary = lines
        .slice(p3Index + 1)
        .filter((line) => !/^(AGENT|P1|SUMMARY)\s*:/i.test(line))
        .join(' ')
        .trim();
    }
  }

  return {
    agent,
    p1Scores: parseScoreLine('P1', lines, dims),
    p3Scores: parseScoreLine('P3', lines, dims),
    summary,
  };
}
