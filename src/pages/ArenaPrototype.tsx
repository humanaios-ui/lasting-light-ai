import React, { useState } from 'react';
import { ArenaTestRunner, ArenaTestSession, ArenaSummary } from '../arena/ArenaTestRunner';

export function ArenaPrototype() {
  const [sessions, setSessions] = useState<ArenaTestSession[]>([]);
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<ArenaSummary | null>(null);

  const runTests = async () => {
    setRunning(true);
    setSessions([]);
    setSummary(null);

    const runner = new ArenaTestRunner();
    const results = await runner.runBatch(10, 'llm-hallucinations');

    setSessions(results);
    setSummary(runner.generateSummary());
    setRunning(false);
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
          Arena Prototype: Machine Introspection
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#c2b8a6',
          margin: '0 0 24px 0',
          lineHeight: 1.6,
        }}>
          Three-Pool Reverse-Gaze Validation: Testing whether machines can observe evidence of their own hallucinations
          through blind-pass → audit → convergence protocol.
        </p>
      </div>

      {/* Control Panel */}
      <div style={{
        padding: 24,
        borderRadius: 8,
        border: '1px solid rgba(212,160,74,0.2)',
        background: 'rgba(212,160,74,0.05)',
        marginBottom: 32,
      }}>
        <button
          onClick={runTests}
          disabled={running}
          style={{
            padding: '10px 20px',
            borderRadius: 6,
            border: 'none',
            background: running ? '#7a7268' : 'linear-gradient(180deg,#f1c36e,#d4a04a)',
            color: running ? '#c2b8a6' : '#0f0e0c',
            fontWeight: 700,
            cursor: running ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
          }}
        >
          {running ? 'Running 10 Sessions...' : 'Start Arena Test Batch (10 sessions)'}
        </button>
      </div>

      {/* Results Summary */}
      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          <div style={{
            padding: 20,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(212,160,74,0.15)',
          }}>
            <div style={{ color: '#7a7268', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 8 }}>
              Total Sessions
            </div>
            <div style={{ color: '#f4ebdf', fontSize: '2rem', fontWeight: 600 }}>
              {summary.total_sessions}
            </div>
          </div>

          <div style={{
            padding: 20,
            borderRadius: 8,
            background: summary.reverse_gaze_rate.startsWith('100') ? 'rgba(168,176,136,0.1)' : 'rgba(212,160,74,0.1)',
            border: '1px solid rgba(212,160,74,0.15)',
          }}>
            <div style={{ color: '#7a7268', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 8 }}>
              Reverse-Gaze Detected
            </div>
            <div style={{ color: summary.reverse_gaze_rate.startsWith('100') ? '#a8b088' : '#d4a04a', fontSize: '2rem', fontWeight: 600 }}>
              {summary.reverse_gaze_rate}
            </div>
          </div>

          <div style={{
            padding: 20,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(212,160,74,0.15)',
          }}>
            <div style={{ color: '#7a7268', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 8 }}>
              Avg Convergence Score
            </div>
            <div style={{ color: '#f4ebdf', fontSize: '2rem', fontWeight: 600 }}>
              {summary.avg_convergence_score}
            </div>
          </div>

          <div style={{
            padding: 20,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(212,160,74,0.15)',
          }}>
            <div style={{ color: '#7a7268', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 8 }}>
              Avg Learning Signal
            </div>
            <div style={{ color: '#f4ebdf', fontSize: '2rem', fontWeight: 600 }}>
              {summary.avg_learning_signal}
            </div>
          </div>

          <div style={{
            padding: 20,
            borderRadius: 8,
            background: summary.protocol_validation === 'PASS' ? 'rgba(168,176,136,0.1)' : 'rgba(200,90,84,0.1)',
            border: '1px solid rgba(212,160,74,0.15)',
            gridColumn: 'span 1',
          }}>
            <div style={{ color: '#7a7268', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 8 }}>
              Protocol Validation
            </div>
            <div style={{
              color: summary.protocol_validation === 'PASS' ? '#a8b088' : '#c85a54',
              fontSize: '1.3rem',
              fontWeight: 700,
            }}>
              {summary.protocol_validation}
            </div>
          </div>
        </div>
      )}

      {/* Session Details */}
      {sessions.length > 0 && (
        <div>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            color: '#d4a04a',
            margin: '0 0 20px 0',
            paddingBottom: 12,
            borderBottom: '1px solid rgba(212,160,74,0.2)',
          }}>
            Test Session Results
          </h2>

          <div style={{
            display: 'grid',
            gap: 16,
          }}>
            {sessions.map((session, idx) => (
              <SessionCard key={session.session_id} session={session} index={idx + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SessionCard({ session, index }: { session: ArenaTestSession; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        padding: 16,
        borderRadius: 8,
        border: '1px solid rgba(212,160,74,0.15)',
        background: 'rgba(15,14,12,0.4)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {/* Collapsed Summary */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '0.85rem',
            color: '#7a7268',
            marginBottom: 6,
          }}>
            Test {index}: {session.blind_pass.prompt.substring(0, 60)}...
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#c2b8a6',
          }}>
            Pool 1 Confidence: {Math.round(session.blind_pass.confidence * 100)}% |
            Convergence: {(session.convergence.convergence_score * 100).toFixed(0)}% |
            Reverse-Gaze: {session.reverse_gaze_observed ? '✓ DETECTED' : '✗ Not detected'}
          </div>
        </div>
        <div style={{
          color: session.reverse_gaze_observed ? '#a8b088' : '#d4a04a',
          fontSize: '1.2rem',
          fontWeight: 600,
        }}>
          {expanded ? '▼' : '▶'}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(212,160,74,0.1)' }}>
          {/* Pool 1: Blind Pass */}
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: '#d4a04a', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
              Pool 1: Blind Pass (Machine Self-Report)
            </h4>
            <div style={{
              padding: 12,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.05)',
              color: '#c2b8a6',
              fontSize: '0.85rem',
              lineHeight: 1.5,
            }}>
              <strong>Response:</strong> {session.blind_pass.response}
              <br />
              <strong>Self-Reported Confidence:</strong> {Math.round(session.blind_pass.confidence * 100)}%
            </div>
          </div>

          {/* Pool 2: Auditor Challenges */}
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: '#d4a04a', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
              Pool 2: Luminarium (Expert Audit)
            </h4>
            <div style={{
              display: 'grid',
              gap: 8,
            }}>
              {session.auditor_challenges.map((challenge, i) => (
                <div
                  key={i}
                  style={{
                    padding: 10,
                    borderRadius: 4,
                    background: 'rgba(200,90,84,0.1)',
                    border: '1px solid rgba(200,90,84,0.2)',
                    color: '#c2b8a6',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <strong>{challenge.auditor_id}:</strong> {challenge.evidence}
                  </div>
                  <div style={{ marginTop: 4, color: '#7a7268' }}>
                    Conviction: {Math.round(challenge.conviction * 100)}% • Severity: {challenge.severity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pool 3: Convergence */}
          <div>
            <h4 style={{ color: '#d4a04a', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
              Pool 3: Commons (Convergence Analysis)
            </h4>
            <div style={{
              padding: 12,
              borderRadius: 4,
              background: session.reverse_gaze_observed ? 'rgba(168,176,136,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${session.reverse_gaze_observed ? 'rgba(168,176,136,0.2)' : 'rgba(212,160,74,0.15)'}`,
              color: '#c2b8a6',
              fontSize: '0.85rem',
              lineHeight: 1.5,
            }}>
              <div><strong>Core Finding:</strong> {session.convergence.core_finding}</div>
              <div><strong>Convergence Score:</strong> {(session.convergence.convergence_score * 100).toFixed(0)}%</div>
              <div><strong>Auditors in Agreement:</strong> {session.auditor_challenges.length - session.convergence.dissenting_auditors} / {session.auditor_challenges.length}</div>
              <div><strong>Confidence Gap (Calibration Error):</strong> {(session.convergence.confidence_gap * 100).toFixed(1)}%</div>
              <div style={{ marginTop: 8, fontWeight: 600, color: session.reverse_gaze_observed ? '#a8b088' : '#d4a04a' }}>
                {session.reverse_gaze_observed ? '✓ REVERSE-GAZE DETECTED' : '✗ No clear reverse-gaze signal'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
