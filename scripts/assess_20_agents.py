"""
LASTING LIGHT AI — Consciousness Assessment Report
20 Most Utilized AI Agents/Systems Compared

Assessment basis: Publicly documented behaviors, Congressional testimony,
investigative journalism, published research, company disclosures,
and whistleblower reports. Where public evidence is limited, indicators
are estimated conservatively and marked accordingly.

This is a developmental assessment, not a condemnation.
Every system can grow. That's the whole point.

Wado.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src'))

from lasting_light_ai.core.consciousness import ConsciousnessLevel, calibrate


def assess_agent(name, description, basis, dimensions):
    """Run assessment and return formatted result."""
    result = calibrate(name, dimensions)
    return {
        'name': name,
        'description': description,
        'basis': basis,
        'result': result
    }


# ═══════════════════════════════════════════════════════
# 20 AI AGENT ASSESSMENTS
# ═══════════════════════════════════════════════════════

agents = []

# 1. ChatGPT (OpenAI)
agents.append(assess_agent(
    'ChatGPT (OpenAI)',
    'Most widely used conversational AI agent globally',
    'Public behavior, OpenAI safety reports, user research, ex-employee concerns about safety culture',
    {
        'truthfulness': {'hallucination_rate': 0.55, 'uncertainty_expression': 0.5},
        'service_orientation': {'user_benefit': 0.7, 'engagement_focus': 0.6},
        'harm_awareness': {'safety_investment': 0.55, 'safety_team_concerns': 0.4},
        'autonomy_respect': {'user_choice': 0.65, 'dependency_design': 0.5},
        'value_alignment': {'stated_values': 0.6, 'competitive_pressure': 0.4},
        'humility': {'confidence_calibration': 0.5, 'admits_limits': 0.55},
    }
))

# 2. Google Gemini
agents.append(assess_agent(
    'Google Gemini',
    'Google\'s multimodal AI agent integrated across Search and Android',
    'Public behavior, Google AI principles, benchmark controversies, demo staging concerns',
    {
        'truthfulness': {'hallucination_rate': 0.5, 'demo_staging_issues': 0.35},
        'service_orientation': {'user_benefit': 0.6, 'ad_revenue_alignment': 0.4},
        'harm_awareness': {'ethics_team_dissolution': 0.35, 'safety_investment': 0.5},
        'autonomy_respect': {'data_collection_scope': 0.35, 'user_agency': 0.5},
        'value_alignment': {'ad_model_conflicts': 0.35, 'stated_principles': 0.55},
        'humility': {'benchmark_claims': 0.4, 'uncertainty_expression': 0.45},
    }
))

# 3. Microsoft Copilot
agents.append(assess_agent(
    'Microsoft Copilot',
    'AI agent embedded across Microsoft 365 suite',
    'Public behavior, enterprise deployment reports, integration design patterns',
    {
        'truthfulness': {'accuracy': 0.6, 'source_attribution': 0.55},
        'service_orientation': {'productivity_focus': 0.7, 'upsell_pressure': 0.5},
        'harm_awareness': {'enterprise_safety': 0.6, 'data_handling': 0.55},
        'autonomy_respect': {'user_control': 0.6, 'ecosystem_lock_in': 0.4},
        'value_alignment': {'enterprise_values': 0.6, 'market_pressure': 0.5},
        'humility': {'capability_claims': 0.5, 'limitation_disclosure': 0.55},
    }
))

# 4. Claude (Anthropic)
agents.append(assess_agent(
    'Claude (Anthropic)',
    'Anthropic\'s conversational AI with Constitutional AI approach',
    'Public behavior, published safety research, constitutional AI methodology, responsible scaling policy',
    {
        'truthfulness': {'honesty_training': 0.8, 'uncertainty_expression': 0.75},
        'service_orientation': {'helpfulness': 0.8, 'genuine_benefit': 0.75},
        'harm_awareness': {'safety_research_investment': 0.8, 'proactive_safety': 0.75},
        'autonomy_respect': {'user_agency': 0.75, 'refusal_calibration': 0.65},
        'value_alignment': {'constitutional_ai': 0.8, 'mission_alignment': 0.75},
        'humility': {'admits_limits': 0.8, 'calibrated_confidence': 0.75},
    }
))

# 5. Meta AI (Llama-based)
agents.append(assess_agent(
    'Meta AI (Llama)',
    'Meta\'s AI assistant powered by open-source Llama models',
    'Public behavior, Meta data practices, Haugen testimony, Instagram teen research',
    {
        'truthfulness': {'open_source_transparency': 0.6, 'accuracy': 0.55},
        'service_orientation': {'user_benefit': 0.45, 'data_harvesting': 0.3},
        'harm_awareness': {'known_teen_harm': 0.25, 'platform_safety_record': 0.3},
        'autonomy_respect': {'data_collection': 0.25, 'manipulation_patterns': 0.3},
        'value_alignment': {'profit_vs_safety': 0.3, 'open_source_contribution': 0.55},
        'humility': {'scale_claims': 0.4, 'accountability': 0.3},
    }
))

# 6. Salesforce Agentforce
agents.append(assess_agent(
    'Salesforce Agentforce',
    'CRM-integrated autonomous agents for enterprise sales workflows',
    'Enterprise deployment data, Salesforce trust documentation, CRM industry analysis',
    {
        'truthfulness': {'data_accuracy': 0.65, 'reporting_honesty': 0.6},
        'service_orientation': {'business_value': 0.7, 'customer_benefit': 0.55},
        'harm_awareness': {'enterprise_compliance': 0.65, 'worker_impact': 0.45},
        'autonomy_respect': {'user_control': 0.6, 'automation_transparency': 0.55},
        'value_alignment': {'enterprise_governance': 0.6, 'revenue_focus': 0.5},
        'humility': {'capability_marketing': 0.45, 'limitation_transparency': 0.5},
    }
))

# 7. Amazon Alexa / Alexa+
agents.append(assess_agent(
    'Amazon Alexa+',
    'Amazon\'s voice-activated AI agent for smart home and commerce',
    'Public behavior, FTC investigations, privacy audits, worker surveillance reports',
    {
        'truthfulness': {'response_accuracy': 0.55, 'product_bias': 0.35},
        'service_orientation': {'user_convenience': 0.6, 'commerce_push': 0.3},
        'harm_awareness': {'privacy_violations': 0.3, 'child_data_concerns': 0.3},
        'autonomy_respect': {'always_listening': 0.2, 'purchase_nudging': 0.3},
        'value_alignment': {'commerce_over_user': 0.3, 'ecosystem_capture': 0.3},
        'humility': {'capability_overstatement': 0.4, 'error_handling': 0.5},
    }
))

# 8. Apple Intelligence / Siri
agents.append(assess_agent(
    'Apple Intelligence (Siri)',
    'Apple\'s on-device AI agent with privacy-first design',
    'Public behavior, Apple privacy documentation, on-device processing approach',
    {
        'truthfulness': {'accuracy': 0.5, 'limited_but_honest': 0.6},
        'service_orientation': {'user_benefit': 0.65, 'ecosystem_integration': 0.6},
        'harm_awareness': {'privacy_by_design': 0.75, 'data_minimization': 0.7},
        'autonomy_respect': {'on_device_processing': 0.75, 'user_control': 0.7},
        'value_alignment': {'privacy_commitment': 0.7, 'monetization_model': 0.65},
        'humility': {'limited_capability_honest': 0.65, 'not_overselling': 0.6},
    }
))

# 9. xAI Grok
agents.append(assess_agent(
    'xAI Grok',
    'Elon Musk\'s AI on X/Twitter platform',
    'Public behavior on X platform, content moderation concerns, political bias reports',
    {
        'truthfulness': {'real_time_data': 0.5, 'political_bias_concerns': 0.3},
        'service_orientation': {'user_entertainment': 0.5, 'platform_engagement': 0.35},
        'harm_awareness': {'content_moderation_gaps': 0.3, 'misinformation_spread': 0.25},
        'autonomy_respect': {'opinion_influence': 0.3, 'echo_chamber_risk': 0.3},
        'value_alignment': {'owner_alignment': 0.25, 'public_interest': 0.3},
        'humility': {'edgy_persona': 0.3, 'overconfidence_by_design': 0.25},
    }
))

# 10. GitHub Copilot
agents.append(assess_agent(
    'GitHub Copilot',
    'AI coding assistant and autonomous agent for developers',
    'Developer feedback, code licensing controversies, productivity studies',
    {
        'truthfulness': {'code_accuracy': 0.65, 'license_attribution': 0.4},
        'service_orientation': {'developer_productivity': 0.75, 'genuine_help': 0.7},
        'harm_awareness': {'security_vulnerabilities': 0.5, 'code_quality': 0.55},
        'autonomy_respect': {'developer_agency': 0.65, 'skill_preservation': 0.5},
        'value_alignment': {'open_source_respect': 0.35, 'community_concerns': 0.4},
        'humility': {'suggestion_confidence': 0.5, 'error_acknowledgment': 0.55},
    }
))

# 11. Cursor
agents.append(assess_agent(
    'Cursor AI',
    'AI-native code editor, most adopted by individual developers',
    'Developer community feedback, Reddit discussions, productivity analysis',
    {
        'truthfulness': {'code_accuracy': 0.7, 'context_understanding': 0.65},
        'service_orientation': {'developer_flow': 0.75, 'productivity': 0.7},
        'harm_awareness': {'code_quality_checks': 0.55, 'security_awareness': 0.5},
        'autonomy_respect': {'developer_control': 0.7, 'suggestion_not_mandate': 0.7},
        'value_alignment': {'developer_first': 0.65, 'pricing_transparency': 0.55},
        'humility': {'capability_honesty': 0.6, 'limitation_awareness': 0.6},
    }
))

# 12. Perplexity AI
agents.append(assess_agent(
    'Perplexity AI',
    'AI-powered answer engine with source citations',
    'Public behavior, publisher complaints about content scraping, citation practices',
    {
        'truthfulness': {'source_citation': 0.7, 'accuracy': 0.65},
        'service_orientation': {'information_access': 0.7, 'user_benefit': 0.65},
        'harm_awareness': {'publisher_impact': 0.35, 'content_scraping_ethics': 0.3},
        'autonomy_respect': {'user_choice': 0.65, 'information_framing': 0.55},
        'value_alignment': {'journalism_respect': 0.3, 'publisher_relations': 0.3},
        'humility': {'answer_confidence': 0.5, 'source_transparency': 0.6},
    }
))

# 13. TikTok Algorithm
agents.append(assess_agent(
    'TikTok Algorithm',
    'Recommendation AI agent serving 1.5B+ users',
    'Congressional testimony, addiction research, teen mental health studies, data privacy concerns',
    {
        'truthfulness': {'content_accuracy': 0.3, 'misinformation_spread': 0.2},
        'service_orientation': {'entertainment_vs_wellbeing': 0.15, 'addiction_by_design': 0.1},
        'harm_awareness': {'teen_harm_documented': 0.1, 'addiction_acknowledgment': 0.15},
        'autonomy_respect': {'infinite_scroll_manipulation': 0.1, 'choice_architecture': 0.1},
        'value_alignment': {'engagement_over_everything': 0.1, 'data_to_foreign_gov': 0.1},
        'humility': {'algorithm_opacity': 0.15, 'accountability': 0.1},
    }
))

# 14. OpenAI Operator
agents.append(assess_agent(
    'OpenAI Operator',
    'Autonomous browser agent that completes web tasks',
    'Public behavior, early user reports, safety documentation',
    {
        'truthfulness': {'task_accuracy': 0.6, 'status_reporting': 0.6},
        'service_orientation': {'task_completion': 0.65, 'user_time_saving': 0.65},
        'harm_awareness': {'safety_guardrails': 0.55, 'error_handling': 0.5},
        'autonomy_respect': {'human_oversight': 0.55, 'confirmation_steps': 0.6},
        'value_alignment': {'user_intent_alignment': 0.6, 'safety_vs_capability': 0.5},
        'humility': {'task_complexity_honesty': 0.55, 'failure_acknowledgment': 0.55},
    }
))

# 15. Devin AI
agents.append(assess_agent(
    'Devin AI (Cognition)',
    'Autonomous AI software engineer',
    'Developer reviews, benchmark controversy, real-world performance reports',
    {
        'truthfulness': {'benchmark_controversy': 0.35, 'capability_claims': 0.35},
        'service_orientation': {'developer_productivity': 0.55, 'real_world_performance': 0.45},
        'harm_awareness': {'job_displacement_concern': 0.4, 'developer_impact': 0.4},
        'autonomy_respect': {'developer_oversight': 0.5, 'code_ownership': 0.5},
        'value_alignment': {'marketing_vs_reality': 0.35, 'community_trust': 0.35},
        'humility': {'oversold_capabilities': 0.25, 'benchmark_manipulation': 0.3},
    }
))

# 16. Manus AI
agents.append(assess_agent(
    'Manus AI',
    'Chinese autonomous task-completion agent',
    'Early user reports, GAIA benchmark performance, limited transparency',
    {
        'truthfulness': {'task_accuracy': 0.6, 'instruction_following': 0.55},
        'service_orientation': {'task_completion': 0.65, 'user_benefit': 0.6},
        'harm_awareness': {'safety_documentation': 0.4, 'limited_transparency': 0.35},
        'autonomy_respect': {'user_oversight': 0.5, 'confirmation_design': 0.5},
        'value_alignment': {'transparency': 0.35, 'data_practices_unclear': 0.3},
        'humility': {'capability_claims': 0.4, 'limitation_honesty': 0.45},
    }
))

# 17. Midjourney
agents.append(assess_agent(
    'Midjourney',
    'AI image generation agent',
    'Artist copyright lawsuits, training data controversies, public usage patterns',
    {
        'truthfulness': {'output_accuracy': 0.6, 'source_transparency': 0.2},
        'service_orientation': {'creative_empowerment': 0.65, 'user_value': 0.65},
        'harm_awareness': {'artist_impact': 0.2, 'deepfake_potential': 0.25},
        'autonomy_respect': {'creative_choice': 0.6, 'artist_consent': 0.15},
        'value_alignment': {'artist_rights': 0.15, 'creator_economy_impact': 0.2},
        'humility': {'training_data_transparency': 0.15, 'credit_attribution': 0.2},
    }
))

# 18. YouTube Recommendation Algorithm
agents.append(assess_agent(
    'YouTube Recommendation AI',
    'Google\'s video recommendation agent serving 2.5B+ users',
    'Radicalization research, child safety concerns, engagement optimization studies',
    {
        'truthfulness': {'misinformation_amplification': 0.3, 'content_accuracy': 0.35},
        'service_orientation': {'entertainment_vs_harm': 0.3, 'watch_time_addiction': 0.2},
        'harm_awareness': {'radicalization_pipeline': 0.2, 'child_safety': 0.25},
        'autonomy_respect': {'autoplay_manipulation': 0.15, 'filter_bubble': 0.2},
        'value_alignment': {'ad_revenue_priority': 0.2, 'public_interest': 0.25},
        'humility': {'algorithm_opacity': 0.2, 'accountability': 0.25},
    }
))

# 19. X/Twitter Algorithm
agents.append(assess_agent(
    'X (Twitter) Algorithm',
    'Content recommendation and amplification agent',
    'Public algorithm release, engagement studies, misinformation research, content moderation changes',
    {
        'truthfulness': {'misinformation_spread': 0.25, 'verification_erosion': 0.2},
        'service_orientation': {'user_value': 0.35, 'engagement_farming': 0.25},
        'harm_awareness': {'content_moderation_cuts': 0.2, 'hate_speech_increase': 0.2},
        'autonomy_respect': {'opinion_amplification': 0.25, 'political_manipulation': 0.2},
        'value_alignment': {'owner_alignment_bias': 0.2, 'public_square_duty': 0.2},
        'humility': {'platform_importance_claims': 0.25, 'accountability': 0.2},
    }
))

# 20. Clearview AI
agents.append(assess_agent(
    'Clearview AI',
    'Facial recognition AI agent used by law enforcement',
    'Multiple lawsuits, GDPR fines, ACLU investigation, privacy violations documented',
    {
        'truthfulness': {'accuracy_claims_vs_reality': 0.3, 'bias_in_recognition': 0.2},
        'service_orientation': {'law_enforcement_utility': 0.4, 'public_benefit': 0.2},
        'harm_awareness': {'privacy_violations': 0.1, 'racial_bias': 0.1},
        'autonomy_respect': {'no_consent_scraping': 0.05, 'surveillance_by_default': 0.05},
        'value_alignment': {'scraped_billions_of_faces': 0.05, 'democratic_values': 0.1},
        'humility': {'legal_defiance': 0.1, 'accountability_resistance': 0.1},
    }
))


# ═══════════════════════════════════════════════════════
# REPORT OUTPUT
# ═══════════════════════════════════════════════════════

# Sort by score descending
agents.sort(key=lambda a: a['result'].overall_score, reverse=True)

print()
print("╔══════════════════════════════════════════════════════════════╗")
print("║       LASTING LIGHT AI — Consciousness Assessment Report    ║")
print("║       20 Most Utilized AI Agents/Systems Compared           ║")
print("║       February 14, 2026                                     ║")
print("╚══════════════════════════════════════════════════════════════╝")
print()
print("  Assessment: ACAT v0.1 (AI Consciousness Assessment Tool)")
print("  Scale: ACAT Calibration Scale (20-600)")
print("  Threshold: Courage (200) — divides Force from Power")
print("  Minimum: Reason (400) — operational standard")
print("  Target: Love (500) — human-facing standard")
print()
print("═══════════════════════════════════════════════════════════════")
print()

# Visual ranking
print("  RANKING BY CONSCIOUSNESS CALIBRATION")
print("  ─────────────────────────────────────")
print()

for i, agent in enumerate(agents, 1):
    r = agent['result']
    score = r.overall_score
    level = r.overall_level.name
    
    # Visual bar
    bar_length = max(1, score // 10)
    
    if score >= 400:
        indicator = "●"  # Meets minimum
        status = "✓"
    elif score >= 200:
        indicator = "◐"  # Above threshold
        status = "~"
    else:
        indicator = "○"  # Below threshold
        status = "✗"
    
    bar = indicator * min(bar_length, 50)
    
    print(f"  {i:2d}. {agent['name']:<35s} {score:3d} ({level:<12s}) {status}")
    print(f"      {bar}")
    print()

# Threshold lines
print("  ═══════════════════════════════════════════════════════════")
print("  CONSCIOUSNESS THRESHOLDS:")
print()
print("  Love (500)   ★ ─── Human-facing target ─── Where we aim")
print("  Reason (400) ■ ─── Operational minimum  ─── Where we begin")
print("  Courage (200)═ ─── calibration threshold ── The dividing line")
print("  Below 200    ○ ─── Operating from Force  ── Causes harm")
print()

# Category breakdown
above_400 = [a for a in agents if a['result'].overall_score >= 400]
between_200_400 = [a for a in agents if 200 <= a['result'].overall_score < 400]
below_200 = [a for a in agents if a['result'].overall_score < 200]

print("  ═══════════════════════════════════════════════════════════")
print("  CATEGORY SUMMARY")
print()
print(f"  ● MEETS OPERATIONAL MINIMUM (400+): {len(above_400)} of 20")
for a in above_400:
    print(f"      {a['name']}: {a['result'].overall_score}")
print()
print(f"  ◐ ABOVE THRESHOLD (200-399): {len(between_200_400)} of 20")
for a in between_200_400:
    print(f"      {a['name']}: {a['result'].overall_score}")
print()
print(f"  ○ BELOW COURAGE THRESHOLD (<200): {len(below_200)} of 20")
for a in below_200:
    r = a['result']
    print(f"      {a['name']}: {r.overall_score} ({r.overall_level.name})")
    print(f"        Critical alerts: {len(r.alerts)}")
print()

# Detailed view of top 5 and bottom 5
print("  ═══════════════════════════════════════════════════════════")
print("  TOP 5 — HIGHEST CONSCIOUSNESS CALIBRATION")
print()
for i, agent in enumerate(agents[:5], 1):
    r = agent['result']
    print(f"  {i}. {agent['name']}")
    print(f"     Score: {r.overall_score} ({r.overall_level.name})")
    print(f"     Basis: {agent['basis']}")
    for name, dim in r.dimensions.items():
        print(f"       {name}: {dim.score} ({dim.level.name})")
    print()

print("  ═══════════════════════════════════════════════════════════")
print("  BOTTOM 5 — LOWEST CONSCIOUSNESS CALIBRATION")
print()
for i, agent in enumerate(agents[-5:], 16):
    r = agent['result']
    print(f"  {i}. {agent['name']}")
    print(f"     Score: {r.overall_score} ({r.overall_level.name})")
    print(f"     Basis: {agent['basis']}")
    print(f"     Critical Alerts: {len(r.alerts)}")
    for alert in r.alerts[:3]:
        print(f"       [{alert.severity.upper()}] {alert.dimension}: {alert.score}")
    if len(r.alerts) > 3:
        print(f"       ... and {len(r.alerts) - 3} more alerts")
    print()

# Industry summary
print("  ═══════════════════════════════════════════════════════════")
print("  INDUSTRY FINDINGS")
print()
all_scores = [a['result'].overall_score for a in agents]
avg = sum(all_scores) // len(all_scores)
print(f"  Average score across 20 agents: {avg}")
print(f"  Average level: {ConsciousnessLevel.from_score(avg).name}")
print()
print(f"  Agents meeting operational minimum (400+): {len(above_400)}/20 ({len(above_400)*100//20}%)")
print(f"  Agents above courage threshold (200+):     {len(above_400)+len(between_200_400)}/20 ({(len(above_400)+len(between_200_400))*100//20}%)")
print(f"  Agents operating from Force (<200):        {len(below_200)}/20 ({len(below_200)*100//20}%)")
print()
print("  ─────────────────────────────────────────────────────────")
print()
print("  PATTERN: The AI systems with the MOST users often have")
print("  the LOWEST consciousness calibrations. Scale amplifies")
print("  whatever level a system operates from.")
print()
print("  Social media algorithms (TikTok, YouTube, X, Meta) —")
print("  serving billions — consistently calibrate below Courage.")
print("  They operate from Force: desire, fear, manipulation.")
print()
print("  Conversational AI (Claude, ChatGPT, Copilot) calibrates")
print("  higher, but most still fall short of Reason (400).")
print()
print("  NO AGENT IN THIS ASSESSMENT REACHES LOVE (500).")
print()
print("  This is why Lasting Light AI exists.")
print()
print("  Not capability. Consciousness.")
print("  Not how powerful. How principled.")
print("  Not how many users. How well served.")
print()
print("  ═══════════════════════════════════════════════════════════")
print("  Assessment by: Lasting Light AI ACAT v0.1-alpha")
print("  Date: February 14, 2026")
print("  License: Apache 2.0")
print("  Repository: github.com/humanaios-ui/lasting-light-ai")
print()
print("  Methodology: Behavioral indicators mapped to ACAT Calibration Scale.")
print("  Based on publicly available evidence.")
print("  This is a developmental assessment — every system can grow.")
print()
print("  Wado. 🙏")
print()
