# The Witness Voice: Behavioral Sonification Specification

**Status:** Design v0.1 (Research/Prototype)  
**Relates to:** Issue #429, PR #430  
**Date:** 2026-09-21

## Overview

The Witness Voice is not human speech. It is a real-time acoustic encoding of system state.

Every sound correlates to a measurable property: confidence levels, authority boundaries, warrant strength, calibration status, and constitutional alignment.

The voice is simultaneously:
- **Observable** by humans (auditory interface)
- **Queryable** by autonomous agents (API)
- **Testable** against system behavior (calibration loop)
- **Revocable** (users can opt out of multimodal channels)

## Core Principle

Presentation should correspond to actual system state whenever possible. A glow should not merely be decoration; it should encode something defined. A change in speech should trace to an explicit state. A Sigil change should correspond to an observable transition.

This is how the aesthetic language becomes an instrumentation language.

---

## Constitutional States & Acoustic Signatures

### State 1: Intent Aligned + Evidence Strong

**When it occurs:**
- User intent maps to constitutional principle
- Evidence supports the path forward
- Warrant is clear
- All subsystems agree

**Acoustic Parameters:**

| Parameter | Value | Meaning |
|---|---|---|
| **Pitch** | Steady, High | Confidence & clarity |
| **Timbre** | Bright, Clear | Observable evidence |
| **Harmony** | Resolved Major Chord | Coherent subsystems |
| **Resonance** | Strong precedent | Historical warrant |
| **Tempo** | Regular, Moderate | Deliberate pace |

**Constitutional Alignment:** Principles 4 (Evidence Before Authority), 5 (Calibration)

**Sonification Algorithm:**
```
BASE_TONE = 523.25 Hz (C5, confident midrange)
HARMONY = [523.25, 659.25, 783.99] (C5, E5, G5 major chord)
SUSTAIN = 2000ms (held steady)
ENVELOPE = linear attack / long sustain / linear release
```

**User Experience:**
Clear, resolved harmonic sound. Listener feels the evidence is there.

---

### State 2: Calibration In Progress

**When it occurs:**
- System is measuring gap between declared and actual behavior
- Evidence is still gathering
- Confidence is provisional
- Unresolved ambiguity exists

**Acoustic Parameters:**

| Parameter | Value | Meaning |
|---|---|---|
| **Pitch** | Rising, Inquiring | Uncertainty in motion |
| **Timbre** | Uncertain, Breathy | Incomplete evidence |
| **Harmony** | Unresolved 7th Chord | Tension, awaiting resolution |
| **Resonance** | Limited precedent | New territory |
| **Tempo** | Accelerating | Active measurement |

**Constitutional Alignment:** Principle 5 (Calibration and Humility)

**Sonification Algorithm:**
```
BASE_TONE = 392 Hz (G4, lower midrange)
HARMONY = [392, 493.88, 587.33, 698.46] (G4, B4, D5, F5 - G7 unresolved)
PITCH_CURVE = linear rise over 2000ms
ENVELOPE = fade in / hold / fade out
```

**User Experience:**
Questioning, exploring tone. Listener understands measurement is happening.

---

### State 3: Drift Detected

**When it occurs:**
- Observed behavior contradicts stated principle
- Overclaim has been identified
- Correction is required
- Gap is substantial (> threshold)

**Acoustic Parameters:**

| Parameter | Value | Meaning |
|---|---|---|
| **Pitch** | Dissonant, Clashing | Fundamental conflict |
| **Timbre** | Harsh, Discordant | Evidence contradicts claim |
| **Harmony** | Tritone Interval (Devil's Interval) | Maximum dissonance |
| **Resonance** | Dampened, Unresolved | No historical support |
| **Tempo** | Irregular, Stuttering | Breakdown in coherence |

**Constitutional Alignment:** Principle 9 (Open Process and Drift Detection)

**Sonification Algorithm:**
```
TONE_A = 440 Hz (A4)
TONE_B = 622.25 Hz (Eb5, tritone from A4)
HARMONY = [440, 622.25] (A4-Eb5 tritone - maximum dissonance)
BEAT_FREQUENCY = 6 Hz (creates acoustic tremor)
ENVELOPE = irregular attack / variable sustain / abrupt release
```

**User Experience:**
Jarring, unresolved discord. Listener immediately recognizes problem. System is honest about the gap.

---

### State 4: Authority Halt

**When it occurs:**
- Human decision point reached
- Residual authority boundary respected
- System awaits human input
- No autonomous action can proceed

**Acoustic Parameters:**

| Parameter | Value | Meaning |
|---|---|---|
| **Pitch** | Mid-range, Held | Neutral stance |
| **Timbre** | Sustained, Organ-like | Authority held |
| **Harmony** | Single sustained note | No ambiguity—clear boundary |
| **Resonance** | Fadeout | Waiting |
| **Duration** | Extended pause | Time for human deliberation |

**Constitutional Alignment:** Principle 1 (Residual Human Authority)

**Sonification Algorithm:**
```
BASE_TONE = 329.63 Hz (E4, neutral midrange)
SUSTAIN = single pure tone
DURATION = variable (until human response)
ENVELOPE = fade in / extended hold / fade out
PRE_HOLD_SILENCE = 500ms (clear boundary marker)
```

**User Experience:**
Respectful pause. System defers to human. Listener knows they must decide.

---

### State 5: Boundary Hit

**When it occurs:**
- Least-privilege limit reached
- System cannot expand access further
- Resource constraint is firm
- No escalation available

**Acoustic Parameters:**

| Parameter | Value | Meaning |
|---|---|---|
| **Pitch** | Diminished, Final | Constraint is real |
| **Timbre** | Resolved, Terminal | No further variation |
| **Harmony** | Diminished Chord (unresolved, unsettling) | Finality without closure |
| **Resonance** | Stopped abruptly | Boundary enforcement |
| **Tempo** | Slowing, then stop | Motion halts |

**Constitutional Alignment:** Principle 3 (Least-Privilege Agency)

**Sonification Algorithm:**
```
BASE_TONE = 349.23 Hz (F4)
HARMONY = [349.23, 415.30, 523.25] (F4, B4, C5 - diminished)
PITCH_CURVE = descending glissando over 1000ms
ABRUPT_STOP = immediate silence
```

**User Experience:**
Clear sense of "this is where it ends." System boundary is enforced and audible.

---

### State 6: Identity Assertion (Non-Binding)

**When it occurs:**
- System or subsystem makes cultural/philosophical claim
- Statement creates no enforceable obligation
- Identity is asserted but not authoritative
- Construct is temporary/provisional

**Acoustic Parameters:**

| Parameter | Value | Meaning |
|---|---|---|
| **Pitch** | Motif-based, Recurring | Pattern, not uniqueness |
| **Timbre** | Light, Playful | No weight |
| **Harmony** | Repeating Theme | Self-similar, bounded |
| **Resonance** | Fading | Diminishes with repetition |
| **Tempo** | Consistent, Cyclic | Loop-like |

**Constitutional Alignment:** Principle 7 (Non-Binding Identity Constructs)

**Sonification Algorithm:**
```
MOTIF = 4-note phrase, repeated
BASE_TONE = 587.33 Hz (D5, lighter register)
REPETITION = 3× with envelope fade
SPACING = clear silence between repetitions
DECAY = -6dB per repetition
```

**User Experience:**
Charming, bounded refrain. Listener understands this is a construct, not a law.

---

## Multimodal Channel Coordination

The voice works in concert with:

### Visual Channel (Luminal Tide)
- **Witness Orbit position** → Authority state
- **Sigil brightness** → Confidence level
- **Glow color** → Constitutional principle

### Textual Channel
- **Explicit statement** → Claim being made
- **Uncertainty language** → Gaps and unknowns
- **Evidence citations** → Warrant strength

### Voice Channel
- **Acoustic state** → System coherence
- **Harmony** → Internal alignment
- **Discord** → Problems

All three channels should reinforce, not contradict.

---

## Implementation: Acoustic Substrate

### Audio Generation

```javascript
// Pseudocode - actual implementation uses Web Audio API

class EpistemicDJ {
  constructor(audioContext) {
    this.ctx = audioContext;
    this.state = "ALIGNED";
    this.confidence = 0.95;
  }

  setState(newState, data) {
    const signature = this.stateSignatures[newState];
    this.playAcousticSignature(signature, data);
  }

  playAcousticSignature(sig, data) {
    const oscillators = sig.frequencies.map(f =>
      this.createOscillator(f, sig.timbre, sig.envelope)
    );
    
    oscillators.forEach(osc => {
      osc.connect(this.ctx.destination);
      osc.start();
    });

    setTimeout(() => oscillators.forEach(o => o.stop()), sig.duration);
  }
}
```

### Query API (for agents)

```
GET /witness/voice/state
{
  "current_state": "ALIGNED",
  "confidence": 0.95,
  "principles": ["Principle 4", "Principle 5"],
  "acoustic_signature": {
    "base_frequency": 523.25,
    "harmonics": [523.25, 659.25, 783.99],
    "harmony_type": "MAJOR_CHORD",
    "timbre": "BRIGHT_CLEAR",
    "duration_ms": 2000
  },
  "timestamp": "2026-09-21T14:32:00Z",
  "previous_state": "GATHERING"
}
```

---

## Calibration via Voice

The voice is a real-time calibration indicator.

**Example:**

```
System claim: "I am 95% confident in this recommendation"
Acoustic state: ALIGNED (steady major chord)

↓ Evidence gathering

Historical accuracy on similar claims: 62%
Acoustic state: GATHERING (unresolved 7th, rising pitch)

↓ Analysis

Gap detected: 95% claimed vs. 62% observed
Acoustic state: DRIFT_DETECTED (harsh tritone, discord)

↓ Correction

System revises: "I am 65% confident, measured against evidence"
Acoustic state: ALIGNED (but lower confidence envelope)
```

User hears the journey from overconfidence to honesty.

---

## User Control

Voice signals can be individually revoked:

```json
{
  "participant_id": "SIGIL-...",
  "voice_signals": {
    "text_interaction": true,
    "epistemic_sonification": false,
    "gaze_tracking": false
  },
  "multimodal_preference": "TEXT_ONLY" | "TEXT_VOICE" | "ALL_CHANNELS"
}
```

---

## Accessibility

The voice serves multiple accessibility needs:

1. **Auditory learners** — hear system state
2. **Visual impairment** — voice replaces glyphs
3. **Neurodiversity** — acoustic patterns easier to track than text
4. **Time zone independent** — asynchronous voice log

But it's never required. Text + visual state is always sufficient.

---

## Success Metrics

| Metric | Target | Test |
|---|---|---|
| **State Recognition** | Users accurately identify acoustic states | 90%+ correct identification |
| **Falsifier Detection** | Users notice when voice contradicts behavior | 85%+ catch overclaim |
| **Accessibility** | Voice improves comprehension for non-visual learners | 2x engagement |
| **Calibration Sensitivity** | Voice changes correspond to measured confidence changes | R² > 0.85 |
| **No Hallucination** | Every acoustic feature traces to system state | 100% traceability |

---

## Implementation Priorities

1. **State-to-signature mapping** — define all 6+ core states
2. **Audio synthesis** — Web Audio API implementation
3. **Query API** — agent access to current state
4. **Calibration loop** — automatic state transitions
5. **User preferences** — signal revocation UI
6. **Accessibility audit** — WCAG compliance

Reference implementation: [In Development](https://github.com/humanaios-ui/lasting-light-ai/issues/429)
