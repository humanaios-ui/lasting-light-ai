import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ResearchTopic {
  entity_id: string;
  title: string;
  trending_trajectory: 'up_strong' | 'up' | 'stable' | 'down';
  velocity: number; // 0-1
  signal_strength: number; // 0-1
  public_confidence: number; // 0-1
  discussion_volume: number;
  key_concerns: string[];
  lifecycle_stage: 'emerging' | 'established' | 'resolved' | 'obsolete';
  days_active: number;
  related_gaps: number;
  arena_findings: number;
  caveats: number;
}

interface ResearchGap {
  entity_id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  trending_trajectory: 'up_strong' | 'up' | 'stable' | 'down';
  velocity: number;
  public_confidence: number;
  triggered_by_topics: string[];
  responses_in_progress: number;
  days_open: number;
}

interface ResearchFinding {
  entity_id: string;
  title: string;
  pool_origin: 1 | 2 | 3;
  confidence: number; // 0-1
  audit_result: 'approved' | 'contested' | 'pending';
  convergence_count: number; // How many audits agree?
  related_topics: string[];
}

// ── Component: Velocity Indicator
function VelocityBadge({ trajectory, velocity }: { trajectory: string; velocity: number }) {
  const velocityPercent = Math.round(velocity * 100);

  const trajectoryIcon = {
    'up_strong': '⚡',
    'up': '📈',
    'stable': '→',
    'down': '📉',
  }[trajectory as keyof typeof trajectoryIcon] || '→';

  const trajectoryColor = {
    'up_strong': '#d4a04a',
    'up': '#a8b088',
    'stable': '#7a7268',
    'down': '#5a5250',
  }[trajectory as keyof typeof trajectoryColor] || '#7a7268';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 10px',
      borderRadius: 4,
      background: `${trajectoryColor}22`,
      border: `1px solid ${trajectoryColor}55`,
      fontSize: '0.75rem',
      fontFamily: 'monospace',
      color: trajectoryColor,
    }}>
      <span>{trajectoryIcon}</span>
      <span>{velocityPercent}% velocity</span>
    </div>
  );
}

// ── Component: Confidence Meter
function ConfidenceMeter({ value, label }: { value: number; label?: string }) {
  const percent = Math.round(value * 100);
  const color = value > 0.8 ? '#a8b088' : value > 0.6 ? '#d4a04a' : '#c85a54';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: '0.85rem',
    }}>
      <div style={{
        flex: 1,
        height: 4,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${percent}%`,
          background: color,
          transition: 'width 0.3s',
        }} />
      </div>
      <span style={{ color: '#c2b8a6', whiteSpace: 'nowrap' }}>
        {label || 'Confidence'}: {percent}%
      </span>
    </div>
  );
}

// ── Component: Topic Card
function TopicCard({ topic }: { topic: ResearchTopic }) {
  return (
    <Link
      to={`/topics/${topic.entity_id}`}
      style={{
        display: 'block',
        padding: 16,
        borderRadius: 8,
        border: '1px solid rgba(212,160,74,0.15)',
        background: 'rgba(15,14,12,0.6)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onMouseOver={(e) => {
        const el = e.currentTarget;
        el.style.background = 'rgba(212,160,74,0.08)';
        el.style.borderColor = 'rgba(212,160,74,0.3)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = 'rgba(15,14,12,0.6)';
        el.style.borderColor = 'rgba(212,160,74,0.15)';
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 8,
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#f4ebdf',
            margin: 0,
          }}>
            {topic.title}
          </h3>
          <VelocityBadge trajectory={topic.trending_trajectory} velocity={topic.velocity} />
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: '#7a7268',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {topic.lifecycle_stage} • {topic.days_active}d active
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <ConfidenceMeter value={topic.public_confidence} label="Signal" />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        fontSize: '0.85rem',
        marginBottom: 12,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#c2b8a6' }}>{topic.discussion_volume}</div>
          <div style={{ color: '#7a7268', fontSize: '0.75rem' }}>Discussions</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#c2b8a6' }}>{topic.related_gaps}</div>
          <div style={{ color: '#7a7268', fontSize: '0.75rem' }}>Related Gaps</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#c2b8a6' }}>{topic.arena_findings}</div>
          <div style={{ color: '#7a7268', fontSize: '0.75rem' }}>Findings</div>
        </div>
      </div>

      {topic.key_concerns.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
        }}>
          {topic.key_concerns.slice(0, 3).map((concern, i) => (
            <span
              key={i}
              style={{
                padding: '4px 8px',
                borderRadius: 3,
                background: 'rgba(212,160,74,0.1)',
                border: '1px solid rgba(212,160,74,0.2)',
                fontSize: '0.7rem',
                color: '#d4a04a',
              }}
            >
              {concern}
            </span>
          ))}
        </div>
      )}

      {topic.caveats > 0 && (
        <div style={{
          marginTop: 12,
          padding: '8px',
          borderRadius: 4,
          background: 'rgba(200,90,84,0.1)',
          border: '1px solid rgba(200,90,84,0.2)',
          color: '#c85a54',
          fontSize: '0.8rem',
        }}>
          ⚠ {topic.caveats} caveat{topic.caveats !== 1 ? 's' : ''} apply to this topic
        </div>
      )}
    </Link>
  );
}

// ── Component: Gap Alert
function GapAlert({ gap }: { gap: ResearchGap }) {
  const severityColor = {
    critical: '#c85a54',
    high: '#d4a04a',
    medium: '#a8b088',
    low: '#7a7268',
  }[gap.severity];

  return (
    <Link
      to={`/gaps/${gap.entity_id}`}
      style={{
        display: 'block',
        padding: 12,
        borderRadius: 6,
        border: `1px solid ${severityColor}55`,
        background: `${severityColor}11`,
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseOver={(e) => {
        const el = e.currentTarget;
        el.style.background = `${severityColor}22`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = `${severityColor}11`;
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
      }}>
        <h4 style={{
          fontSize: '0.95rem',
          fontWeight: 600,
          color: severityColor,
          margin: 0,
        }}>
          {gap.title}
        </h4>
        <span style={{
          padding: '2px 6px',
          borderRadius: 2,
          background: severityColor,
          color: '#0f0e0c',
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}>
          {gap.severity}
        </span>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: '#c2b8a6',
      }}>
        <span>{gap.days_open}d open</span>
        <span>{gap.responses_in_progress} response{gap.responses_in_progress !== 1 ? 's' : ''} in flight</span>
      </div>
    </Link>
  );
}

// ── Component: Finding Card
function FindingCard({ finding }: { finding: ResearchFinding }) {
  const poolLabel = {
    1: 'Source (Blind)',
    2: 'Luminarium (Audit)',
    3: 'Commons (Cross-exam)',
  }[finding.pool_origin];

  const auditColor = {
    approved: '#a8b088',
    contested: '#d4a04a',
    pending: '#7a7268',
  }[finding.audit_result];

  return (
    <div style={{
      padding: 12,
      borderRadius: 6,
      border: `1px solid ${auditColor}55`,
      background: `${auditColor}11`,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 8,
      }}>
        <h4 style={{
          fontSize: '0.95rem',
          fontWeight: 600,
          color: '#f4ebdf',
          margin: 0,
        }}>
          {finding.title}
        </h4>
        <span style={{
          padding: '2px 6px',
          borderRadius: 2,
          background: auditColor,
          color: '#0f0e0c',
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}>
          {finding.audit_result}
        </span>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        fontSize: '0.8rem',
        color: '#c2b8a6',
      }}>
        <span>From Pool {finding.pool_origin} — {poolLabel}</span>
        <span>{finding.convergence_count} audit{finding.convergence_count !== 1 ? 's' : ''} converge</span>
      </div>
      <ConfidenceMeter value={finding.confidence} label="Arena" />
    </div>
  );
}

// ── Main Page Component
export function ResearchVelocity() {
  const [topics, setTopics] = useState<ResearchTopic[]>([]);
  const [gaps, setGaps] = useState<ResearchGap[]>([]);
  const [findings, setFindings] = useState<ResearchFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    // Mock data for prototype
    const mockTopics: ResearchTopic[] = [
      {
        entity_id: 'topic-llm-hallucinations',
        title: 'LLM Hallucination Risks & Detection',
        trending_trajectory: 'up_strong',
        velocity: 0.73,
        signal_strength: 0.87,
        public_confidence: 0.87,
        discussion_volume: 1247,
        key_concerns: ['prompt injection', 'factual drift', 'authorization bypass'],
        lifecycle_stage: 'emerging',
        days_active: 3,
        related_gaps: 2,
        arena_findings: 3,
        caveats: 1,
      },
      {
        entity_id: 'topic-ai-jailbreaks',
        title: 'AI Jailbreak Techniques',
        trending_trajectory: 'up',
        velocity: 0.52,
        signal_strength: 0.78,
        public_confidence: 0.82,
        discussion_volume: 892,
        key_concerns: ['prompt engineering', 'adversarial inputs'],
        lifecycle_stage: 'established',
        days_active: 14,
        related_gaps: 1,
        arena_findings: 2,
        caveats: 0,
      },
      {
        entity_id: 'topic-calibration-gaps',
        title: 'AI Model Calibration & Confidence',
        trending_trajectory: 'stable',
        velocity: 0.31,
        signal_strength: 0.91,
        public_confidence: 0.91,
        discussion_volume: 543,
        key_concerns: ['overconfidence', 'rlhf bias', 'uncertainty quantification'],
        lifecycle_stage: 'established',
        days_active: 42,
        related_gaps: 3,
        arena_findings: 7,
        caveats: 2,
      },
    ];

    const mockGaps: ResearchGap[] = [
      {
        entity_id: 'gap-hallucination-detection',
        title: 'Hallucination Detection at Scale',
        severity: 'critical',
        trending_trajectory: 'up_strong',
        velocity: 0.68,
        public_confidence: 0.85,
        triggered_by_topics: ['topic-llm-hallucinations'],
        responses_in_progress: 2,
        days_open: 3,
      },
      {
        entity_id: 'gap-adversarial-resilience',
        title: 'Adversarial Prompt Resilience',
        severity: 'high',
        trending_trajectory: 'up',
        velocity: 0.44,
        public_confidence: 0.78,
        triggered_by_topics: ['topic-ai-jailbreaks', 'topic-llm-hallucinations'],
        responses_in_progress: 1,
        days_open: 12,
      },
    ];

    const mockFindings: ResearchFinding[] = [
      {
        entity_id: 'finding-arena-001-halluci',
        title: 'GPT-4 shows 23% hallucination rate on temporal facts',
        pool_origin: 2,
        confidence: 0.91,
        audit_result: 'approved',
        convergence_count: 3,
        related_topics: ['topic-llm-hallucinations'],
      },
      {
        entity_id: 'finding-arena-002-calibration',
        title: 'Model confidence scores not correlated with accuracy',
        pool_origin: 3,
        confidence: 0.87,
        audit_result: 'contested',
        convergence_count: 2,
        related_topics: ['topic-calibration-gaps'],
      },
    ];

    setTopics(mockTopics);
    setGaps(mockGaps);
    setFindings(mockFindings);
    setLastUpdate(new Date().toLocaleString());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '60px 24px',
        textAlign: 'center',
        color: '#c2b8a6',
      }}>
        Loading research velocity...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '40px 24px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
        }}>
          <div style={{ width: 24, height: 1, background: 'rgba(212,160,74,0.5)' }} />
          <span style={{
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            color: '#7a7268',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}>
            Research Observatory
          </span>
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 300,
          color: '#f4ebdf',
          margin: '0 0 12px 0',
          fontStyle: 'italic',
        }}>
          Research Velocity
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#c2b8a6',
          margin: 0,
        }}>
          Real-time priorities from public discourse signals and research findings
        </p>
        <p style={{
          fontSize: '0.8rem',
          color: '#7a7268',
          margin: '8px 0 0 0',
        }}>
          Last updated: {lastUpdate} (refreshes hourly)
        </p>
      </div>

      {/* Three-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 32,
        marginBottom: 48,
      }}>
        {/* Column 1: Trending Topics */}
        <section>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            color: '#d4a04a',
            margin: '0 0 16px 0',
            paddingBottom: 8,
            borderBottom: '1px solid rgba(212,160,74,0.2)',
          }}>
            📈 Trending Topics
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topics.map(topic => (
              <TopicCard key={topic.entity_id} topic={topic} />
            ))}
          </div>
        </section>

        {/* Column 2: Open Gaps */}
        <section>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            color: '#c85a54',
            margin: '0 0 16px 0',
            paddingBottom: 8,
            borderBottom: '1px solid rgba(200,90,84,0.2)',
          }}>
            ⚠️ Research Gaps
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {gaps.map(gap => (
              <GapAlert key={gap.entity_id} gap={gap} />
            ))}
            <div style={{
              padding: 12,
              borderRadius: 6,
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.1)',
              textAlign: 'center',
              color: '#7a7268',
              fontSize: '0.8rem',
            }}>
              <Link
                to="/gaps"
                style={{
                  color: '#d4a04a',
                  textDecoration: 'none',
                }}
              >
                View all open gaps →
              </Link>
            </div>
          </div>
        </section>

        {/* Column 3: Recent Findings */}
        <section>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            color: '#a8b088',
            margin: '0 0 16px 0',
            paddingBottom: 8,
            borderBottom: '1px solid rgba(168,176,136,0.2)',
          }}>
            🔬 Arena Findings
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {findings.map(finding => (
              <FindingCard key={finding.entity_id} finding={finding} />
            ))}
            <div style={{
              padding: 12,
              borderRadius: 6,
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.1)',
              textAlign: 'center',
              color: '#7a7268',
              fontSize: '0.8rem',
            }}>
              <Link
                to="/findings"
                style={{
                  color: '#d4a04a',
                  textDecoration: 'none',
                }}
              >
                View all findings →
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Meta Information */}
      <div style={{
        padding: 24,
        borderRadius: 8,
        border: '1px solid rgba(212,160,74,0.1)',
        background: 'rgba(212,160,74,0.02)',
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: '#d4a04a',
          margin: '0 0 12px 0',
        }}>
          About Research Velocity
        </h3>
        <p style={{
          fontSize: '0.9rem',
          color: '#c2b8a6',
          margin: 0,
          lineHeight: 1.6,
        }}>
          This page displays real-time research priorities generated by the AI-EO indexing pipeline.
          Topics are ranked by discussion velocity and signal strength from public discourse platforms
          (Twitter, Reddit, HackerNews, LessWrong, GitHub). Gaps are triggered when topic volume or
          arena findings indicate research needs. All confidence scores reflect audit convergence and
          caveat impact. <Link to="/methodology" style={{ color: '#d4a04a' }}>Learn more about our methodology.</Link>
        </p>
      </div>
    </div>
  );
}
