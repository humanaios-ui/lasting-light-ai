import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface TopicDetail {
  entity_id: string;
  title: string;
  description: string;
  trending_trajectory: 'up_strong' | 'up' | 'stable' | 'down';
  velocity: number;
  signal_strength: number;
  public_confidence: number;
  discussion_volume: number;
  discussion_volume_change: number;
  sentiment_distribution: {
    concerned: number;
    constructive: number;
    skeptical: number;
  };
  key_concerns: string[];
  lifecycle_stage: 'emerging' | 'established' | 'resolved' | 'obsolete';
  days_active: number;
  source_platforms: string[];
  urls: string[];
}

interface RelatedEntity {
  entity_id: string;
  type: 'gap' | 'finding' | 'response' | 'related_topic';
  title: string;
  status?: string;
  confidence?: number;
}

export function TopicDetail() {
  const { topicId } = useParams<{ topicId?: string }>();
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [relatedEntities, setRelatedEntities] = useState<RelatedEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for prototype
    if (topicId === 'topic-llm-hallucinations') {
      const mockTopic: TopicDetail = {
        entity_id: 'topic-llm-hallucinations',
        title: 'LLM Hallucination Risks & Detection',
        description: 'Emerging discourse on hallucination detection and mitigation strategies across LLM deployment contexts. Discussion includes prompt engineering defenses, factual grounding techniques, and systemic factors contributing to hallucination rates.',
        trending_trajectory: 'up_strong',
        velocity: 0.73,
        signal_strength: 0.87,
        public_confidence: 0.87,
        discussion_volume: 1247,
        discussion_volume_change: 245,
        sentiment_distribution: {
          concerned: 0.62,
          constructive: 0.28,
          skeptical: 0.10,
        },
        key_concerns: ['prompt injection', 'factual drift', 'authorization bypass'],
        lifecycle_stage: 'emerging',
        days_active: 3,
        source_platforms: ['twitter', 'reddit', 'hackernews'],
        urls: [
          'https://twitter.com/search?q=llm+hallucination',
          'https://reddit.com/r/MachineLearning/search?q=hallucination',
          'https://news.ycombinator.com/search?stories=hallucination',
        ],
      };

      const mockRelated: RelatedEntity[] = [
        {
          entity_id: 'gap-hallucination-detection',
          type: 'gap',
          title: 'Hallucination Detection at Scale',
          status: 'open',
          confidence: 0.85,
        },
        {
          entity_id: 'finding-arena-001',
          type: 'finding',
          title: 'GPT-4 shows 23% hallucination rate on temporal facts',
          status: 'approved',
          confidence: 0.91,
        },
        {
          entity_id: 'response-001',
          type: 'response',
          title: 'Implement RAG-based hallucination mitigation',
          status: 'in_progress',
        },
        {
          entity_id: 'topic-ai-safety',
          type: 'related_topic',
          title: 'AI Safety and Alignment',
        },
      ];

      setTopic(mockTopic);
      setRelatedEntities(mockRelated);
    }
    setLoading(false);
  }, [topicId]);

  if (loading || !topic) {
    return (
      <div style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '60px 24px',
        textAlign: 'center',
        color: '#c2b8a6',
      }}>
        Loading topic...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 1000,
      margin: '0 auto',
      padding: '40px 24px',
    }}>
      {/* Breadcrumb */}
      <Link
        to="/research-velocity"
        style={{
          fontSize: '0.85rem',
          color: '#d4a04a',
          textDecoration: 'none',
          marginBottom: 24,
          display: 'inline-block',
        }}
      >
        ← Back to Research Velocity
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 300,
          color: '#f4ebdf',
          margin: '0 0 12px 0',
          lineHeight: 1.3,
        }}>
          {topic.title}
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#c2b8a6',
          margin: '0 0 16px 0',
          lineHeight: 1.6,
        }}>
          {topic.description}
        </p>

        {/* Key metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 16,
          marginTop: 16,
        }}>
          <div>
            <div style={{ color: '#7a7268', fontSize: '0.8rem', textTransform: 'uppercase' }}>Lifecycle</div>
            <div style={{ color: '#f4ebdf', fontSize: '1.1rem', fontWeight: 600 }}>
              {topic.lifecycle_stage.charAt(0).toUpperCase() + topic.lifecycle_stage.slice(1)}
            </div>
          </div>
          <div>
            <div style={{ color: '#7a7268', fontSize: '0.8rem', textTransform: 'uppercase' }}>Days Active</div>
            <div style={{ color: '#f4ebdf', fontSize: '1.1rem', fontWeight: 600 }}>{topic.days_active}</div>
          </div>
          <div>
            <div style={{ color: '#7a7268', fontSize: '0.8rem', textTransform: 'uppercase' }}>Discussions</div>
            <div style={{ color: '#f4ebdf', fontSize: '1.1rem', fontWeight: 600 }}>{topic.discussion_volume}</div>
          </div>
          <div>
            <div style={{ color: '#7a7268', fontSize: '0.8rem', textTransform: 'uppercase' }}>Velocity</div>
            <div style={{ color: '#d4a04a', fontSize: '1.1rem', fontWeight: 600 }}>
              {Math.round(topic.velocity * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 32,
        marginBottom: 48,
      }}>
        {/* Left: Analysis */}
        <div>
          {/* Confidence & Trending */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#d4a04a',
              margin: '0 0 16px 0',
              paddingBottom: 8,
              borderBottom: '1px solid rgba(212,160,74,0.2)',
            }}>
              Signal Strength & Trajectory
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                  fontSize: '0.85rem',
                }}>
                  <span style={{ color: '#c2b8a6' }}>Public Confidence</span>
                  <span style={{ color: '#d4a04a', fontWeight: 600 }}>
                    {Math.round(topic.public_confidence * 100)}%
                  </span>
                </div>
                <div style={{
                  height: 6,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${topic.public_confidence * 100}%`,
                    background: '#d4a04a',
                  }} />
                </div>
              </div>
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                  fontSize: '0.85rem',
                }}>
                  <span style={{ color: '#c2b8a6' }}>Signal Strength</span>
                  <span style={{ color: '#a8b088', fontWeight: 600 }}>
                    {Math.round(topic.signal_strength * 100)}%
                  </span>
                </div>
                <div style={{
                  height: 6,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${topic.signal_strength * 100}%`,
                    background: '#a8b088',
                  }} />
                </div>
              </div>
            </div>
          </section>

          {/* Sentiment */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#d4a04a',
              margin: '0 0 16px 0',
              paddingBottom: 8,
              borderBottom: '1px solid rgba(212,160,74,0.2)',
            }}>
              Discourse Sentiment
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
            }}>
              {Object.entries(topic.sentiment_distribution).map(([sentiment, percent]) => (
                <div key={sentiment} style={{
                  textAlign: 'center',
                  padding: 12,
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.05)',
                }}>
                  <div style{{ fontSize: '1.5rem', marginBottom: 6 }}>
                    {sentiment === 'concerned' ? '😟' : sentiment === 'constructive' ? '🤝' : '🤔'}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#f4ebdf',
                    marginBottom: 4,
                  }}>
                    {Math.round(percent * 100)}%
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#7a7268',
                    textTransform: 'capitalize',
                  }}>
                    {sentiment}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key Concerns */}
          <section>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#d4a04a',
              margin: '0 0 16px 0',
              paddingBottom: 8,
              borderBottom: '1px solid rgba(212,160,74,0.2)',
            }}>
              Key Concerns
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topic.key_concerns.map((concern, i) => (
                <div
                  key={i}
                  style={{
                    padding: 10,
                    borderRadius: 4,
                    background: 'rgba(212,160,74,0.08)',
                    border: '1px solid rgba(212,160,74,0.15)',
                    color: '#c2b8a6',
                    fontSize: '0.9rem',
                  }}
                >
                  • {concern}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Related Entities */}
        <div>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#d4a04a',
            margin: '0 0 16px 0',
            paddingBottom: 8,
            borderBottom: '1px solid rgba(212,160,74,0.2)',
          }}>
            Related Research
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {relatedEntities.map((entity) => (
              <div
                key={entity.entity_id}
                style={{
                  padding: 12,
                  borderRadius: 6,
                  border: '1px solid rgba(212,160,74,0.15)',
                  background: 'rgba(15,14,12,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  color: '#7a7268',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 4,
                }}>
                  {entity.type === 'gap' && '⚠️ Gap'}
                  {entity.type === 'finding' && '🔬 Finding'}
                  {entity.type === 'response' && '✓ Response'}
                  {entity.type === 'related_topic' && '🔗 Related'}
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  color: '#f4ebdf',
                  fontWeight: 500,
                  marginBottom: 6,
                }}>
                  {entity.title}
                </div>
                {entity.status && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#c2b8a6',
                  }}>
                    Status: {entity.status}
                  </div>
                )}
                {entity.confidence && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#c2b8a6',
                  }}>
                    Confidence: {Math.round(entity.confidence * 100)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source URLs */}
      <section style={{
        padding: 24,
        borderRadius: 8,
        border: '1px solid rgba(212,160,74,0.1)',
        background: 'rgba(212,160,74,0.02)',
      }}>
        <h2 style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: '#d4a04a',
          margin: '0 0 12px 0',
        }}>
          Sources
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {topic.source_platforms.map((platform) => (
            <div key={platform} style={{
              fontSize: '0.9rem',
              color: '#c2b8a6',
            }}>
              📍 {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </div>
          ))}
        </div>
        <p style={{
          fontSize: '0.8rem',
          color: '#7a7268',
          margin: '12px 0 0 0',
        }}>
          Signals collected from public discourse platforms. <Link to="/methodology" style={{ color: '#d4a04a' }}>Learn about data collection.</Link>
        </p>
      </section>
    </div>
  );
}
