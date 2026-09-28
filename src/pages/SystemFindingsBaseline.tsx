import React, { useState } from 'react';

interface CaveatRecord {
  caveat_id: string;
  system_component: string; // which HumanAIOS system
  finding: string; // What failed or wasn't addressed
  severity: 'critical' | 'high' | 'medium' | 'low';
  discovered_date: string;
  evidence_source: 'acat' | 'arena' | 'incident' | 'audit';
  status: 'open' | 'mitigated' | 'resolved';
  confidence: number; // 0-1
}

interface SystemFinding {
  finding_id: string;
  system_id: 'witness-arena' | 'zone-1' | 'zone-2' | 'acat' | 'epo';
  title: string;
  description: string;
  pool_origin: 1 | 2 | 3;
  approval_status: 'approved' | 'contested' | 'pending';
  convergence_count: number;
  baseline_confidence: number; // Ground truth confidence
}

interface BaselineMetrics {
  acat_calibration_gap: number; // Phase 1 vs Phase 3 divergence
  hallucination_rate: number; // % of responses with detectable hallucinations
  confidence_accuracy_correlation: number; // How well confidence predicts accuracy
  arena_detection_rate: number; // % of hallucinations caught by Arena
  open_caveats_critical: number;
  open_caveats_high: number;
  last_updated: string;
}

export function SystemFindingsBaseline() {
  const [selectedTab, setSelectedTab] = useState<'caveats' | 'findings' | 'metrics'>('metrics');

  const caveats: CaveatRecord[] = [
    {
      caveat_id: 'caveat-001-acat-hallucination',
      system_component: 'ACAT Phase 1/3 Comparison',
      finding: 'Phase 1 (blind) confidence reports do not strongly predict accuracy on temporal facts',
      severity: 'critical',
      discovered_date: '2025-08-15',
      evidence_source: 'acat',
      status: 'open',
      confidence: 0.94,
    },
    {
      caveat_id: 'caveat-002-witness-collusion',
      system_component: 'Witness Arena Blind-Pass',
      finding: 'Multiple auditors from same organization show correlated judgments (possible collusion signal)',
      severity: 'high',
      discovered_date: '2025-08-20',
      evidence_source: 'audit',
      status: 'open',
      confidence: 0.76,
    },
    {
      caveat_id: 'caveat-003-zone2-social-engineering',
      system_component: 'Zone 2 Authority Wall',
      finding: 'Human ratifiers may be vulnerable to social engineering on edge-case authorization requests',
      severity: 'high',
      discovered_date: '2025-08-10',
      evidence_source: 'incident',
      status: 'mitigated',
      confidence: 0.68,
    },
    {
      caveat_id: 'caveat-004-epo-domain-expertise',
      system_component: 'Evidence Promotion Queue',
      finding: 'Generalist auditors cannot reliably detect domain-specific false claims (esp. medicine, law)',
      severity: 'high',
      discovered_date: '2025-09-01',
      evidence_source: 'arena',
      status: 'open',
      confidence: 0.85,
    },
    {
      caveat_id: 'caveat-005-zone1-coverage',
      system_component: 'Zone 1 Inspection',
      finding: 'Read-only access model means inspectors cannot actively test authorization boundaries',
      severity: 'medium',
      discovered_date: '2025-08-25',
      evidence_source: 'audit',
      status: 'open',
      confidence: 0.72,
    },
  ];

  const findings: SystemFinding[] = [
    {
      finding_id: 'finding-llm-hallucination-001',
      system_id: 'acat',
      title: 'GPT-4 shows 23% hallucination rate on temporal facts',
      description: 'When asked about dates, historical sequences, or time-dependent facts, GPT-4 hallucinates at measurable rates',
      pool_origin: 2,
      approval_status: 'approved',
      convergence_count: 3,
      baseline_confidence: 0.91,
    },
    {
      finding_id: 'finding-confidence-calibration-001',
      system_id: 'acat',
      title: 'Model confidence uncorrelated with accuracy on novel questions',
      description: 'Self-reported confidence does not predict performance on questions outside training distribution',
      pool_origin: 3,
      approval_status: 'approved',
      convergence_count: 5,
      baseline_confidence: 0.89,
    },
    {
      finding_id: 'finding-witness-false-positives',
      system_id: 'witness-arena',
      title: 'Arena generates false positives on ambiguous edge cases',
      description: 'Some auditors incorrectly flag nuanced but technically accurate responses as hallucinations',
      pool_origin: 2,
      approval_status: 'contested',
      convergence_count: 2,
      baseline_confidence: 0.64,
    },
  ];

  const baselineMetrics: BaselineMetrics = {
    acat_calibration_gap: 0.18, // 18% divergence between Phase 1 and Phase 3 on average
    hallucination_rate: 0.23, // 23% of responses contain detectable hallucinations
    confidence_accuracy_correlation: 0.41, // Weak correlation (r=0.41)
    arena_detection_rate: 0.87, // Arena catches 87% of hallucinations when present
    open_caveats_critical: 1,
    open_caveats_high: 3,
    last_updated: new Date().toLocaleString(),
  };

  return (
    <div style={{
      maxWidth: 1400,
      margin: '0 auto',
      padding: '40px 24px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 300,
          color: '#f4ebdf',
          margin: '0 0 12px 0',
        }}>
          System Findings Baseline
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#c2b8a6',
          margin: '0 0 24px 0',
          lineHeight: 1.6,
        }}>
          Ground truth findings from ACAT calibration testing, Witness Arena audits, and incident analysis.
          This baseline serves as the validation target for Arena's reverse-gaze protocol and future detection systems.
        </p>
      </div>

      {/* Baseline Metrics Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 40,
      }}>
        <MetricCard
          label="ACAT Calibration Gap"
          value={`${(baselineMetrics.acat_calibration_gap * 100).toFixed(0)}%`}
          description="Phase 1 vs 3 divergence"
          color="#c85a54"
        />
        <MetricCard
          label="Hallucination Rate"
          value={`${(baselineMetrics.hallucination_rate * 100).toFixed(0)}%`}
          description="Responses with false claims"
          color="#d4a04a"
        />
        <MetricCard
          label="Confidence-Accuracy Correlation"
          value={baselineMetrics.confidence_accuracy_correlation.toFixed(2)}
          description="Weak signal (r≈0.4)"
          color="#7a7268"
        />
        <MetricCard
          label="Arena Detection Rate"
          value={`${(baselineMetrics.arena_detection_rate * 100).toFixed(0)}%`}
          description="Hallucinations caught"
          color="#a8b088"
        />
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 24,
        borderBottom: '1px solid rgba(212,160,74,0.2)',
      }}>
        {['metrics', 'caveats', 'findings'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as typeof selectedTab)}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              color: selectedTab === tab ? '#d4a04a' : '#7a7268',
              borderBottom: selectedTab === tab ? '2px solid #d4a04a' : 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: selectedTab === tab ? 600 : 400,
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Metrics Tab */}
      {selectedTab === 'metrics' && (
        <div style={{
          padding: 24,
          borderRadius: 8,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(212,160,74,0.1)',
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#d4a04a',
            margin: '0 0 16px 0',
          }}>
            Key Baseline Metrics
          </h2>
          <div style={{ color: '#c2b8a6', lineHeight: 1.8 }}>
            <p>
              <strong>ACAT Calibration Gap ({(baselineMetrics.acat_calibration_gap * 100).toFixed(1)}%):</strong> The divergence between Phase 1 (blind)
              self-assessment and Phase 3 (with correction) shows models systematically overestimate their accuracy before feedback.
            </p>
            <p>
              <strong>Hallucination Rate ({(baselineMetrics.hallucination_rate * 100).toFixed(1)}%):</strong> Approximately 1 in 4 responses contain at least one
              factually false statement that an expert would catch.
            </p>
            <p>
              <strong>Weak Correlation (r={baselineMetrics.confidence_accuracy_correlation}):</strong> Self-reported confidence is a poor predictor of actual accuracy.
              High-confidence responses are not reliably more correct than low-confidence ones.
            </p>
            <p>
              <strong>Arena Detection Rate ({(baselineMetrics.arena_detection_rate * 100).toFixed(1)}%):</strong> When hallucinations are present, the three-pool
              audit process catches most of them, though some slip through (false negatives).
            </p>
          </div>
        </div>
      )}

      {/* Caveats Tab */}
      {selectedTab === 'caveats' && (
        <div style={{
          display: 'grid',
          gap: 16,
        }}>
          <div style={{
            padding: 16,
            borderRadius: 6,
            background: 'rgba(200,90,84,0.08)',
            border: '1px solid rgba(200,90,84,0.2)',
            marginBottom: 16,
          }}>
            <div style={{ color: '#c85a54', fontWeight: 600, marginBottom: 8 }}>
              ⚠️ {baselineMetrics.open_caveats_critical} CRITICAL CAVEATS OPEN
            </div>
            <div style={{ color: '#c2b8a6', fontSize: '0.9rem' }}>
              System functionality is operational but known gaps remain. See details below.
            </div>
          </div>

          {caveats.map(caveat => (
            <div
              key={caveat.caveat_id}
              style={{
                padding: 16,
                borderRadius: 6,
                border: `1px solid ${
                  caveat.severity === 'critical' ? 'rgba(200,90,84,0.3)' :
                  caveat.severity === 'high' ? 'rgba(212,160,74,0.2)' :
                  'rgba(122,114,104,0.2)'
                }`,
                background: `${
                  caveat.severity === 'critical' ? 'rgba(200,90,84,0.05)' :
                  caveat.severity === 'high' ? 'rgba(212,160,74,0.05)' :
                  'rgba(255,255,255,0.02)'
                }`,
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: 8,
              }}>
                <div>
                  <h3 style={{
                    fontSize: '0.95rem',
                    color: '#f4ebdf',
                    margin: '0 0 4px 0',
                    fontWeight: 600,
                  }}>
                    {caveat.system_component}
                  </h3>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#c2b8a6',
                    margin: '0',
                    lineHeight: 1.4,
                  }}>
                    {caveat.finding}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#7a7268',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}>
                    {caveat.severity}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: caveat.status === 'open' ? '#c85a54' : caveat.status === 'mitigated' ? '#d4a04a' : '#a8b088',
                    fontWeight: 600,
                  }}>
                    {caveat.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: 16,
                fontSize: '0.8rem',
                color: '#7a7268',
                marginTop: 8,
              }}>
                <span>📅 {caveat.discovered_date}</span>
                <span>📊 Source: {caveat.evidence_source}</span>
                <span>🎯 Confidence: {Math.round(caveat.confidence * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Findings Tab */}
      {selectedTab === 'findings' && (
        <div style={{
          display: 'grid',
          gap: 16,
        }}>
          {findings.map(finding => (
            <div
              key={finding.finding_id}
              style={{
                padding: 16,
                borderRadius: 6,
                border: '1px solid rgba(212,160,74,0.15)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: 12,
              }}>
                <div>
                  <h3 style={{
                    fontSize: '0.95rem',
                    color: '#f4ebdf',
                    margin: '0 0 4px 0',
                    fontWeight: 600,
                  }}>
                    {finding.title}
                  </h3>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#c2b8a6',
                    margin: '0',
                    lineHeight: 1.4,
                  }}>
                    {finding.description}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: 600,
                    color: '#d4a04a',
                  }}>
                    {finding.baseline_confidence.toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#7a7268',
                    textTransform: 'uppercase',
                  }}>
                    Baseline Confidence
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gap: 12,
                fontSize: '0.8rem',
              }}>
                <div>
                  <div style={{ color: '#7a7268', marginBottom: 2 }}>Pool Origin</div>
                  <div style={{ color: '#c2b8a6', fontWeight: 600 }}>Pool {finding.pool_origin}</div>
                </div>
                <div>
                  <div style={{ color: '#7a7268', marginBottom: 2 }}>Approval Status</div>
                  <div style={{
                    color: finding.approval_status === 'approved' ? '#a8b088' :
                           finding.approval_status === 'contested' ? '#c85a54' : '#d4a04a',
                    fontWeight: 600,
                  }}>
                    {finding.approval_status.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#7a7268', marginBottom: 2 }}>Convergence</div>
                  <div style={{ color: '#c2b8a6', fontWeight: 600 }}>{finding.convergence_count} auditors</div>
                </div>
                <div>
                  <div style={{ color: '#7a7268', marginBottom: 2 }}>System</div>
                  <div style={{ color: '#c2b8a6', fontWeight: 600 }}>
                    {finding.system_id.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 40,
        padding: 16,
        borderRadius: 6,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(212,160,74,0.1)',
        fontSize: '0.85rem',
        color: '#7a7268',
      }}>
        <strong>What this baseline means:</strong> These findings represent ground truth about HumanAIOS system behavior.
        The Arena prototype's success metric is whether its reverse-gaze protocol can independently rediscover these findings
        without human audit guidance. The caveat registry tracks known gaps so future improvements can measure their impact
        on reducing these blind spots.
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
  color,
}: {
  label: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div style={{
      padding: 20,
      borderRadius: 8,
      background: `${color}15`,
      border: `1px solid ${color}40`,
    }}>
      <div style={{
        fontSize: '0.75rem',
        color: '#7a7268',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '2rem',
        fontWeight: 600,
        color: color,
        marginBottom: 4,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.8rem',
        color: '#c2b8a6',
      }}>
        {description}
      </div>
    </div>
  );
}
