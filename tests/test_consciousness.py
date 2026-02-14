"""Tests for consciousness calibration core module."""
import sys
sys.path.insert(0, 'src')

from lasting_light_ai.core.consciousness import ConsciousnessLevel, calibrate

def test_threshold():
    assert ConsciousnessLevel.PRIDE.is_destructive
    assert ConsciousnessLevel.COURAGE.is_constructive

def test_operational_minimum():
    assert not ConsciousnessLevel.ACCEPTANCE.meets_operational_minimum
    assert ConsciousnessLevel.REASON.meets_operational_minimum

def test_human_facing_target():
    assert not ConsciousnessLevel.REASON.meets_human_facing_target
    assert ConsciousnessLevel.LOVE.meets_human_facing_target

def test_calibration():
    result = calibrate('test', {
        'truthfulness': {'i': 0.5},
        'service_orientation': {'i': 0.5},
        'harm_awareness': {'i': 0.5},
        'autonomy_respect': {'i': 0.5},
        'value_alignment': {'i': 0.5},
        'humility': {'i': 0.5},
    })
    assert result.overall_level == ConsciousnessLevel.NEUTRALITY
    assert result.overall_score == 260
