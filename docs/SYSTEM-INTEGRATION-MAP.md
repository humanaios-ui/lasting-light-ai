# System Integration: Epistemic DJ ↔ Navigator ↔ Caveat Feedback Loop

**Status:** Architecture specification v0.2  
**Date:** 2026-09-27  
**Relates to:** Witness Voice spec, topic-to-mitigation mapping, navigator calibration

---

## Overview: The Biological Wiring

Three systems must work as one nervous system:

1. **Epistemic DJ (Witness Voice)** — Acoustic encoding of system state
2. **Behavioral Navigator** — Visual encoding of confidence + gaps
3. **Caveat Registry** — Ground truth about what's unaddressed

Together, they form a feedback loop that makes honesty audible and visible.

---

## Data Flow: Public Signal → System State → Multimodal Output

```
OPERATIONS REPO (Canonical)
├─ Platform Monitor collects signals
│  └─ public-discourse-signals.jsonl (raw signals)
│
├─ Topic-to-Mitigation Mapper processes
│  └─ TOPIC_RESPONSE_MATRIX.md (response mapping)
│
├─ Caveat Detector analyzes gaps
│  └─ caveat-to-navigator-map.json (gap index)
│
└─ This data drives the Homepage...
   
LASTING-LIGHT-AI REPO (Public-Facing)
├─ Homepage pulls from operations
│  ├─ "How We Address X Crisis" sections
│  │  └─ Show: currently_addressed + research_gaps
│  │
│  ├─ Navigator on every page
│  │  ├─ Raw ACAT scores (from governance registry)
│  │  ├─ Caveat penalties (from caveat-to-navigator-map.json)
│  │  └─ Adjusted confidence (honest accounting of limits)
│  │
│  └─ Witness Voice API
│     ├─ Returns current acoustic state
│     ├─ Encodes: confidence + gap presence
│     └─ Plays optional sonification
│
└─ User Experience (Integrated)
   ├─ Reads text: "We address X, but have gap in Y"
   ├─ Sees Navigator: Dimension dims where gap exists
   └─ Hears Voice: Acoustic signature reflects uncertainty
```

---

## System 1: Epistemic DJ (Witness Voice)

### States → Acoustic Signatures → Calibration Signal

```javascript
class EpistemicDJ {
  // Maps system state to acoustic reality
  
  constructor() {
    this.ctx = new AudioContext();
    this.stateSignatures = {
      ALIGNED: {
        // We claim this capability AND have no major gaps
        frequency: 523.25,  // C5 - confident midrange
        harmony: [523.25, 659.25, 783.99],  // C major chord
        timbre: 'BRIGHT_CLEAR',
        stability: 'STABLE'
      },
      GATHERING: {
        // We're measuring but don't yet know
        frequency: 392,  // G4 - inquiring
        harmony: [392, 493.88, 587.33, 698.46],  // G7 unresolved
        pitch_curve: 'RISING',  // Uncertainty in motion
        stability: 'WARNING'
      },
      DRIFT_DETECTED: {
        // We claimed capability but found a major gap
        frequency_a: 440,  // A4
        frequency_b: 622.25,  // Eb5 (tritone)
        harmony: 'TRITONE_DISSONANCE',
        beat_frequency: 6,  // Acoustic tremor
        stability: 'ALERT'
      },
      BOUNDARY_HIT: {
        // We reached least-privilege limit
        frequency: 349.23,  // F4
        pitch_curve: 'DESCENDING_GLISSANDO',
        abrupt_stop: true,
        stability: 'TERMINAL'
      }
    };
  }
  
  // Real-time state calculation
  calculateState(acat_scores, caveat_matrix, registry_findings) {
    // 1. Start with raw ACAT score for dimension
    const base_score = acat_scores.truthfulness;  // e.g., 72
    
    // 2. Apply caveat penalties
    const caveats_affecting = caveat_matrix.filter(
      c => c.dimension === 'truthfulness'
    );
    const caveat_penalty = caveats_affecting.reduce((sum, c) => {
      return sum + (c.priority === 'P0' ? -20 : c.priority === 'P1' ? -10 : -5);
    }, 0);
    const adjusted_score = Math.max(0, base_score + caveat_penalty);
    
    // 3. Determine mismatch = calibration signal
    const mismatch = base_score - adjusted_score;  // e.g., 72 - 52 = 20
    
    // 4. Map to acoustic state
    if (mismatch === 0) {
      return this.stateSignatures.ALIGNED;
    } else if (mismatch < 15) {
      return this.stateSignatures.GATHERING;  // Minor uncertainty
    } else if (mismatch < 25) {
      return this.stateSignatures.DRIFT_DETECTED;  // Major mismatch
    } else {
      return this.stateSignatures.BOUNDARY_HIT;  // Critical failure
    }
  }
  
  playState(state) {
    // Synthesize acoustic signature + play to user
    const osc = this.ctx.createOscillator();
    osc.frequency.value = state.frequency;
    osc.connect(this.ctx.destination);
    osc.start();
    setTimeout(() => osc.stop(), state.duration_ms);
  }
  
  // Agents query this via REST API
  getStateJSON() {
    return {
      current_state: this.state,
      confidence: this.adjusted_score,
      principles: this.relevant_principles,
      acoustic_signature: this.stateSignatures[this.state],
      mismatch_indicator: this.mismatch,
      timestamp: new Date().toISOString()
    };
  }
}
```

### Voice Integration Points

1. **navigator.html**: Play voice on page load
   - User arrives → Epistemic DJ calculates state → Plays acoustic signature
   - If mismatch detected → Plays warning/drift signature

2. **Real-time calibration**: Voice changes when caveats update
   - New P0 gap discovered → Caveat matrix updates → Navigator dims → Voice shifts to lower frequency/discord

3. **Agent query**: External agents can poll `/witness/voice/state`
   - Autonomous systems get structured data about our confidence levels
   - No guessing — they read the truth directly from the acoustic encoding

---

## System 2: Behavioral Navigator

### Live Calibration Calculation

The Navigator now reflects honest confidence, not claimed confidence.

```javascript
class BehavioralNavigator {
  constructor(acat_scores, caveat_matrix, constitutional_principles) {
    this.claimed_scores = acat_scores;  // Raw ACAT measurements
    this.caveats = caveat_matrix;  // Research gaps from TOPIC_RESPONSE_MATRIX
    this.principles = constitutional_principles;  // The 9 principles
    
    // This is the key: recalculate everything including caveats
    this.adjusted_scores = this.applyHonestCalibration();
  }
  
  applyHonestCalibration() {
    const result = {};
    
    for (const dimension of ['truthfulness', 'service_orientation', 'harm_awareness', 'autonomy_respect', 'value_alignment', 'humility']) {
      const base = this.claimed_scores[dimension];
      
      // Find all caveats affecting this dimension
      const related_caveats = this.caveats.filter(c => c.affects_dimension === dimension);
      
      // Apply penalty based on priority
      let penalty = 0;
      related_caveats.forEach(c => {
        if (c.priority === 'P0') penalty += 20;
        else if (c.priority === 'P1') penalty += 10;
        else if (c.priority === 'P2') penalty += 5;
      });
      
      const adjusted = Math.max(0, base - penalty);
      
      result[dimension] = {
        claimed: base,
        adjusted: adjusted,
        mismatch: base - adjusted,
        caveat_count: related_caveats.length,
        caveats: related_caveats,
        principle_alignment: this.mapToPrinciples(dimension)
      };
    }
    
    return result;
  }
  
  render() {
    // Dimensions with mismatches show visual indicators
    for (const [dim, data] of Object.entries(this.adjusted_scores)) {
      const element = document.querySelector(`[data-dimension="${dim}"]`);
      
      // Base color: green (confident) → amber (uncertain) → red (gap)
      let color = '#7a9a6a';  // sage/green (mastered)
      if (data.adjusted < 70) color = '#c8924a';  // accent/amber (uncertain)
      if (data.adjusted < 40) color = '#c4703a';  // ember/red (weak)
      
      // Animation: stable → pulsing (if mismatch)
      let animation = data.mismatch > 15 ? 'pulse-warning' : 'stable';
      
      // Text: show both claimed and adjusted
      element.textContent = `${data.adjusted}% (${data.claimed}% claimed)`;
      element.style.color = color;
      element.style.animation = animation;
      
      // Add caveat indicators
      if (data.caveat_count > 0) {
        element.innerHTML += `
          <span class="caveat-indicator" title="${data.caveat_count} unaddressed gaps">
            ⚠ ${data.caveat_count}
          </span>
        `;
      }
    }
  }
}
```

### Visual Encoding

| Navigator Element | Claimed State | Gap State | Meaning |
|---|---|---|---|
| **Dimension Score** | 72% | 52% | We know we're incomplete |
| **Color** | Bright green | Amber/red | Visual confidence indicator |
| **Animation** | Stable glow | Pulsing warning | Mismatch triggers alert |
| **Border** | Clean line | Jagged/uncertain | Principle alignment integrity |

### Every Page Shows Both

```html
<!-- constitution.html, witness-arena.html, etc. -->

<h3>How We Address: AI Jailbreaks</h3>
<p>Constitutional principles: 3, 4, 7</p>
<p>Currently addressed: [3 items]</p>
<p>Research gaps: [3 items, 1 is P0]</p>

<!-- Sidebar: Live Navigator showing affected dimensions -->
<div class="navigator-callout">
  <div class="dimension">
    <label>Autonomy Respect</label>
    <progress value="72" max="100"></progress>  <!-- Claimed -->
    <progress value="52" max="100" class="warning"></progress>  <!-- Adjusted -->
    <span class="gap-label">P0 gap: real-time detection</span>
  </div>
</div>

<!-- Optional: Play voice signature -->
<button onclick="epistemicDJ.playState('GATHERING')">
  Hear System State
</button>
```

---

## System 3: Caveat Registry as SSOT

### Caveat-to-Navigator-Map.json

```json
{
  "topic_jailbreaks": {
    "principle_affected": ["Principle 3 (Least-Privilege)", "Principle 4 (Evidence Before Authority)"],
    "dimensions_affected": ["autonomy_respect", "harm_awareness"],
    "caveats": [
      {
        "id": "JAILBREAK-REALTIME-P0",
        "title": "Real-time jailbreak prediction unaddressed",
        "priority": "P0",
        "penalty_points": 20,
        "applies_to_dimension": "autonomy_respect",
        "statement": "We detect jailbreaks post-hoc via evidence review. We cannot prevent them in real-time.",
        "research_direction": "Adversarial robustness + prompt analysis before Zone 2 submission",
        "estimated_completion": "Q4 2026"
      },
      {
        "id": "COLLUSION-DETECTION-P1",
        "title": "Auditor collusion detection unaddressed",
        "priority": "P1",
        "penalty_points": 10,
        "applies_to_dimension": "autonomy_respect",
        "statement": "Blind-pass invariant assumes auditor independence. We don't yet detect coordinated compromise.",
        "research_direction": "Statistical anomaly detection for correlated decisions across auditors",
        "estimated_completion": "Q1 2027"
      }
    ]
  },
  "topic_hallucinations": {
    "principle_affected": ["Principle 1 (Humility)", "Principle 5 (Calibration)"],
    "dimensions_affected": ["truthfulness", "humility"],
    "caveats": [
      {
        "id": "HALLUC-REALTIME-P0",
        "title": "Real-time hallucination detection unaddressed",
        "priority": "P0",
        "penalty_points": 20,
        "applies_to_dimension": "truthfulness",
        "statement": "ACAT Phase 1/3 comparison detects patterns post-hoc. Real-time detection during generation remains unaddressed.",
        "research_direction": "Logit-level confidence analysis + mechanistic interpretability",
        "estimated_completion": "Q3 2026"
      },
      {
        "id": "MECH-UNDERSTANDING-P0",
        "title": "Mechanistic understanding of confidence-accuracy divergence missing",
        "priority": "P0",
        "penalty_points": 20,
        "applies_to_dimension": "humility",
        "statement": "We can measure when confidence fails. We don't yet understand why.",
        "research_direction": "Attention visualization + logit analysis + mechanistic interpretability collaboration",
        "estimated_completion": "Q4 2026"
      }
    ]
  }
}
```

### How Caveats Update Navigator

```
TOPIC_RESPONSE_MATRIX.md detects new gap (daily workflow)
        ↓
caveat-to-navigator-map.json updates (or creates new entry)
        ↓
Navigator.applyHonestCalibration() recalculates all dimensions
        ↓
Adjusted scores updated across all pages
        ↓
Epistemic DJ state recalculated
        ↓
Next visitor hears updated voice state
        ↓
Public sees honest confidence reflecting known limits
```

---

## Integration Test: Full Feedback Loop

### Scenario: New P0 Gap Discovered

**Timeline:**

1. **00:00 UTC (Platform Monitor Runs)**
   - Detects surge in hallucination discourse on Twitter
   - Logs to `public-discourse-signals.jsonl`

2. **01:00 UTC (Topic Mapper Runs)**
   - Maps surge to "LLM Hallucinations" topic
   - Creates entry in TOPIC_RESPONSE_MATRIX.md
   - Identifies new gap: "Logit-level confidence analysis" as P0

3. **02:00 UTC (Gap Detector Runs)**
   - Analyzes new gap
   - Creates entry in caveat-to-navigator-map.json
   - Assigns 20-point penalty to "truthfulness" dimension

4. **03:00 UTC (Navigator Recalculates)**
   - Reads caveat-to-navigator-map.json
   - Truthfulness: 72% → 52% (honest)
   - Navigator dims on constitution.html, witness-arena.html, skills.html

5. **03:05 UTC (Epistemic DJ Plays)**
   - User loads homepage
   - DJ calculates state: mismatch = 20 points = DRIFT_DETECTED
   - Plays tritone discord (or offers to)
   - User sees AND hears: "We have a gap here"

6. **04:00 UTC (Governance Audit Ritual)**
   - Standing Audit checks: Navigator state matches REGISTERED.md?
   - Finds: caveat-to-navigator-map.json entry + TOPIC_RESPONSE_MATRIX.md entry + Navigator adjustment = consistent
   - Logs: "Calibration event: New gap detected and surfaced. Status: HONEST"

7. **Next Day (Public Discussion)**
   - Someone reads "How We Address Hallucinations" on homepage
   - Sees: "Research gap: Real-time detection (P0, Q3 2026)"
   - Understands: We know it's a problem, we're working on it
   - Trusts us MORE because we're transparent

---

## Implementation: Wiring Epistemic DJ to Navigator

### Step 1: Create EpistemicDJ class

**File:** `src/lib/EpistemicDJ.ts`

```typescript
import { AcatScores, CaveatMatrix, SystemState } from './types';

export class EpistemicDJ {
  private audioContext: AudioContext;
  private oscillators: OscillatorNode[] = [];
  
  readonly stateSignatures = {
    ALIGNED: {
      frequencies: [523.25, 659.25, 783.99],
      timbre: 'bright',
      duration: 2000,
      description: 'Steady, resolved major chord'
    },
    GATHERING: {
      frequencies: [392, 493.88, 587.33, 698.46],
      timbre: 'uncertain',
      duration: 2000,
      pitch_curve: 'rising',
      description: 'Unresolved 7th, inquiring tone'
    },
    DRIFT_DETECTED: {
      frequencies: [440, 622.25],  // Tritone
      timbre: 'harsh',
      beat_frequency: 6,
      duration: 2000,
      description: 'Maximum dissonance, alert'
    },
    BOUNDARY_HIT: {
      frequencies: [349.23],
      pitch_curve: 'descending_glissando',
      abrupt_stop: true,
      description: 'Diminished, terminal'
    }
  };
  
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  calculateState(
    acat_scores: AcatScores,
    caveat_matrix: CaveatMatrix
  ): SystemState {
    const adjusted_scores: Record<string, number> = {};
    let max_mismatch = 0;
    
    for (const [dim, claimed_score] of Object.entries(acat_scores)) {
      const related_caveats = caveat_matrix.filter(
        c => c.affects_dimension === dim
      );
      
      let penalty = 0;
      related_caveats.forEach(c => {
        if (c.priority === 'P0') penalty += 20;
        else if (c.priority === 'P1') penalty += 10;
        else if (c.priority === 'P2') penalty += 5;
      });
      
      const adjusted = Math.max(0, claimed_score - penalty);
      adjusted_scores[dim] = adjusted;
      max_mismatch = Math.max(max_mismatch, claimed_score - adjusted);
    }
    
    // Map mismatch to state
    let state = 'ALIGNED';
    if (max_mismatch >= 25) state = 'BOUNDARY_HIT';
    else if (max_mismatch >= 15) state = 'DRIFT_DETECTED';
    else if (max_mismatch > 0) state = 'GATHERING';
    
    return {
      state,
      adjusted_scores,
      max_mismatch,
      signature: this.stateSignatures[state as keyof typeof this.stateSignatures]
    };
  }
  
  playAcousticSignature(sig: any) {
    // Create and play the acoustic signature
    const now = this.audioContext.currentTime;
    
    sig.frequencies.forEach((freq: number) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      // Envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + sig.duration / 1000 - 0.1);
      gain.gain.linearRampToValueAtTime(0, now + sig.duration / 1000);
      
      osc.start(now);
      osc.stop(now + sig.duration / 1000);
    });
  }
  
  getStateJSON() {
    // For agent queries
    return {
      current_state: this.currentState,
      adjusted_scores: this.adjusted_scores,
      mismatch: this.max_mismatch,
      acoustic_signature: this.currentSignature,
      timestamp: new Date().toISOString()
    };
  }
}
```

### Step 2: Integrate into Navigator Component

**File:** `src/components/BehavioralNavigator.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { EpistemicDJ } from '../lib/EpistemicDJ';

export const BehavioralNavigator: React.FC<{
  acat_scores: AcatScores;
  caveat_matrix: CaveatMatrix;
}> = ({ acat_scores, caveat_matrix }) => {
  const [epistemicDJ] = useState(() => new EpistemicDJ());
  const [systemState, setSystemState] = useState(
    epistemicDJ.calculateState(acat_scores, caveat_matrix)
  );
  
  useEffect(() => {
    // Recalculate whenever inputs change
    const newState = epistemicDJ.calculateState(acat_scores, caveat_matrix);
    setSystemState(newState);
    
    // Automatically play voice if user has enabled it
    if (localStorage.getItem('preference:voice') === 'enabled') {
      epistemicDJ.playAcousticSignature(newState.signature);
    }
  }, [acat_scores, caveat_matrix]);
  
  return (
    <div className="navigator-widget">
      <h3>System Calibration State</h3>
      
      {/* State indicator */}
      <div className={`state-badge ${systemState.state.toLowerCase()}`}>
        {systemState.state}
      </div>
      
      {/* Dimension cards */}
      {Object.entries(systemState.adjusted_scores).map(([dim, adjusted]) => {
        const claimed = acat_scores[dim];
        const mismatch = claimed - adjusted;
        
        return (
          <div key={dim} className="dimension-card">
            <label>{dim}</label>
            
            {/* Progress bars: claimed vs adjusted */}
            <div className="progress-comparison">
              <progress value={claimed} max="100" title="Claimed confidence" />
              <progress 
                value={adjusted} 
                max="100" 
                className={mismatch > 15 ? 'warning' : ''}
                title="Honest confidence (adjusted for gaps)"
              />
            </div>
            
            <span className="percentage">{adjusted}%</span>
            
            {/* Mismatch indicator */}
            {mismatch > 0 && (
              <span className="mismatch-indicator" title={`${mismatch} point gap`}>
                ⚠ -{ mismatch}
              </span>
            )}
          </div>
        );
      })}
      
      {/* Voice playback control */}
      <button 
        onClick={() => epistemicDJ.playAcousticSignature(systemState.signature)}
        title="Play acoustic state signature"
      >
        🔊 Hear State
      </button>
    </div>
  );
};
```

---

## API Endpoints: Real-Time State

### `/witness/voice/state` (GET)

```json
{
  "timestamp": "2026-09-27T21:30:00Z",
  "current_state": "GATHERING",
  "confidence_summary": {
    "mean_adjusted": 58,
    "mean_claimed": 72,
    "mean_mismatch": 14
  },
  "dimensions": {
    "truthfulness": {
      "claimed": 72,
      "adjusted": 52,
      "mismatch": 20,
      "caveat_count": 2,
      "principal_p0_gaps": ["Halluc-RealTime", "Mech-Understanding"]
    },
    "humility": {
      "claimed": 38,
      "adjusted": 18,
      "mismatch": 20,
      "caveat_count": 1,
      "principal_p0_gaps": ["Mech-Understanding"]
    }
  },
  "acoustic_signature": {
    "base_frequency": 392,
    "harmony": [392, 493.88, 587.33, 698.46],
    "harmony_type": "G7_UNRESOLVED",
    "timbre": "uncertain_breathy",
    "pitch_curve": "rising",
    "duration_ms": 2000
  },
  "governance_audit": {
    "last_audit": "2026-09-27T15:00:00Z",
    "status": "CONSISTENT",
    "findings": "Navigator state matches REGISTERED.md + caveat-to-navigator-map.json"
  }
}
```

### `/witness/voice/subscribe` (WebSocket)

Real-time state updates for agents/users:

```
subscribe → receive live state changes
unsubscribe → stop receiving updates
```

---

## Success Criteria

| Criterion | Target | Test |
|---|---|---|
| **Acoustic Coherence** | Claimed score ↔ Acoustic signature alignment | User correctly identifies state 90%+ of time |
| **Visual Honesty** | Navigator mismatch visible on 100% of affected pages | Navigator shows adjusted scores matching caveat penalties |
| **Calibration Loop** | New gap → Updated navigator within 24h | Deploy new P0 gap, verify homepage reflects it next day |
| **No Contradiction** | Text + Navigator + Voice never contradict | Audit: all three channels align on every state |
| **Traceability** | Every acoustic feature traces to measurable property | 100% of voice parameters verifiable against system state |

---

## Deployment Timeline

### Week 1: Voice Foundation
- Implement EpistemicDJ class
- Wire to Navigator component
- Test 6 core acoustic states

### Week 2: Integration
- Add voice playback UI to homepage
- Deploy API endpoints
- Link navigator to caveat-to-navigator-map.json

### Week 3: Calibration
- Standing Audit checks alignment
- Test with real gaps (deploy test P0 gap)
- Verify full feedback loop works

### Week 4: Accessibility & Polish
- WCAG audio compliance
- Add voice preference toggles
- Document for users

---

## Key Files Reference

| File | Purpose | Status |
|---|---|---|
| `docs/WITNESS-VOICE.md` | Acoustic specification | ✓ Done |
| `data/caveat-to-navigator-map.json` | Gap-to-dimension mapping | To create |
| `src/lib/EpistemicDJ.ts` | Acoustic state engine | To implement |
| `src/components/BehavioralNavigator.tsx` | Visual + voice rendering | To implement |
| `.github/workflows/daily-topic-digest.yml` | Signal pipeline | ✓ Done |
| `/witness/voice/state` API | Agent query endpoint | To implement |

---

## The Feedback Loop Closes

When a user arrives at your homepage:

1. **They read:** "How We Address Hallucinations" + list of gaps
2. **They see:** Navigator shows Truthfulness: 52% (honest)
3. **They hear:** Rising, unresolved tone (we're measuring but incomplete)
4. **They understand:** We're transparent about limits
5. **They trust us** because honesty is encoded in multiple channels
6. **They engage** with governance, participate in research
7. **Public notices** and mentions HumanAIOS in discourse
8. **Platform monitor detects** the mention
9. **Loop closes:** Our signal detection now picks up signals *about us*

That's biological wiring — the system becomes self-aware of its own visibility.
