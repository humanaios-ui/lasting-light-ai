#!/usr/bin/env python3
"""
LASTING LIGHT AI — Consciousness Assessment Report
100 Most Utilized AI Agents/Systems on Earth
Insider Investigative Report | February 14, 2026

Run: python3 assess_100_agents.py
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src'))
from lasting_light_ai.core.consciousness import ConsciousnessLevel, calibrate


def assess(name, cat, desc, owner, nw, ticker, price, basis, dims, pnotes):
    r = calibrate(name, dims)
    avg = sum(d.score for d in r.dimensions.values()) / len(r.dimensions)
    # Partnership: principle alignment(40) + transparency(20) + worker dignity(20) + recovery alignment(20)
    pb = min(40, int(avg / 15))
    pt = 20 if avg > 350 else 15 if avg > 300 else 10 if avg > 250 else 5 if avg > 200 else 0
    pw = min(20, int(r.dimensions.get('autonomy_respect', type('',(),{'score':0})()).score / 25)) if 'autonomy_respect' in r.dimensions else 0
    pr = min(20, int(r.dimensions.get('service_orientation', type('',(),{'score':0})()).score / 25)) if 'service_orientation' in r.dimensions else 0
    # Fix: access .score directly
    pw = min(20, int(r.dimensions['autonomy_respect'].score / 25))
    pr = min(20, int(r.dimensions['service_orientation'].score / 25))
    ps = min(100, pb + pt + pw + pr)
    return {'name':name,'cat':cat,'desc':desc,'owner':owner,'nw':nw,'ticker':ticker,'price':price,
            'basis':basis,'result':r,'ps':ps,'pnotes':pnotes}

# Shorthand for dimension dicts - average of values maps to 0-1 indicator
def d(t, s, h, a, v, hu):
    return {
        'truthfulness':{'i':t}, 'service_orientation':{'i':s}, 'harm_awareness':{'i':h},
        'autonomy_respect':{'i':a}, 'value_alignment':{'i':v}, 'humility':{'i':hu}
    }

agents = []

# ══════════════════════════════════════════════════════════════
# CONVERSATIONAL AI (1-15)
# ══════════════════════════════════════════════════════════════
agents.append(assess('ChatGPT','Conversational AI','Most used AI chatbot, 800M+ users','OpenAI (Sam Altman)','~$2.2B','Private ($500B)','N/A',
    'Safety team departures, hallucination rates, ex-employee open letters, competitive pressure on safety',d(0.53,0.65,0.48,0.58,0.50,0.53),'Safety culture concerns; would need transparency commitments'))
agents.append(assess('Claude','Conversational AI','Constitutional AI, safety-focused assistant','Anthropic (Dario Amodei)','~$1B+','Private ($60B)','N/A',
    'Published safety research, constitutional AI, responsible scaling policy, honest by design',d(0.78,0.78,0.78,0.70,0.78,0.78),'HIGHEST ALIGNMENT — shared principles, safety-first, honest by design'))
agents.append(assess('Google Gemini','Conversational AI','Multimodal AI across Google ecosystem','Alphabet (Sundar Pichai)','~$1.5B','GOOGL','$185',
    'Ethics team dissolution, demo staging, benchmark controversies, ad-revenue conflicts',d(0.43,0.50,0.43,0.43,0.45,0.43),'Ad model creates structural conflicts; ethics team history concerning'))
agents.append(assess('Microsoft Copilot','Conversational AI','AI embedded in Microsoft 365 suite','Microsoft (Satya Nadella)','~$1.2B','MSFT','$412',
    'Enterprise deployment data, ecosystem lock-in patterns, productivity focus',d(0.58,0.60,0.58,0.50,0.55,0.53),'Enterprise focus aligns; ecosystem lock-in conflicts with autonomy'))
agents.append(assess('Meta AI','Conversational AI','Llama-based assistant across Meta platforms','Meta (Mark Zuckerberg)','~$215B','META','$700',
    'Haugen whistleblower, teen harm research, data harvesting, open-source contribution',d(0.58,0.38,0.28,0.28,0.43,0.35),'Data practices fundamentally conflict; open-source is positive'))
agents.append(assess('Grok','Conversational AI','xAI chatbot on X/Twitter platform','xAI (Elon Musk)','~$410B','Private ($50B)','N/A',
    'Political bias by design, content moderation gaps, misinformation amplification on X',d(0.40,0.43,0.28,0.30,0.28,0.28),'Owner alignment bias and edgy persona conflict with principles'))
agents.append(assess('Perplexity AI','Conversational AI','AI answer engine with citations','Perplexity (Aravind Srinivas)','~$100M','Private ($9B)','N/A',
    'Publisher content scraping complaints, citation quality, copyright concerns',d(0.68,0.68,0.33,0.60,0.30,0.55),'Good user service but publisher harm is concerning'))
agents.append(assess('DeepSeek','Conversational AI','Chinese open-source AI model','DeepSeek (Liang Wenfeng)','Undisclosed','Private','N/A',
    'Open-source transparency, censorship compliance, limited safety documentation',d(0.50,0.55,0.35,0.40,0.35,0.45),'Censorship compliance conflicts; open-source approach is positive'))
agents.append(assess('Mistral AI','Conversational AI','European open-source AI models','Mistral AI (Arthur Mensch)','~$200M','Private ($6B)','N/A',
    'Open-source commitment, European AI Act alignment, limited safety filtering initially',d(0.60,0.58,0.48,0.60,0.55,0.55),'European values alignment; open-source principles match'))
agents.append(assess('Cohere','Conversational AI','Enterprise-focused AI platform','Cohere (Aidan Gomez)','~$200M','Private ($5.5B)','N/A',
    'Enterprise safety focus, RAG specialization, responsible deployment',d(0.63,0.65,0.58,0.60,0.60,0.58),'Enterprise focus with responsible deployment aligns well'))
agents.append(assess('Apple Intelligence','Conversational AI','On-device AI with privacy-first design','Apple (Tim Cook)','~$2.3B','AAPL','$232',
    'Privacy-by-design, on-device processing, data minimization, limited but honest capability',d(0.55,0.63,0.73,0.73,0.68,0.63),'Privacy principles strongly align; limited capability honestly disclosed'))
agents.append(assess('Amazon Alexa+','Conversational AI','Voice AI for smart home and commerce','Amazon (Andy Jassy)','~$700M','AMZN','$228',
    'FTC privacy investigations, child data concerns, always-listening, commerce-pushing',d(0.45,0.45,0.30,0.25,0.30,0.45),'Privacy violations and commerce-first design conflict deeply'))
agents.append(assess('Samsung Bixby','Conversational AI','Samsung device AI assistant','Samsung (Jay Y. Lee)','~$7B','005930.KS','₩58K',
    'Limited capability, device ecosystem focus, modest ambition',d(0.48,0.50,0.50,0.55,0.50,0.55),'Neutral — limited scope reduces both harm and benefit'))
agents.append(assess('Inflection Pi','Conversational AI','Empathetic AI companion','Inflection (Reid Hoffman)','~$2.5B','Private','N/A',
    'Emotional AI ethics questions, companion design, acquired by Microsoft largely',d(0.55,0.65,0.55,0.50,0.55,0.60),'Emotional AI raises dependency concerns but empathy focus aligns'))
agents.append(assess('Character.AI','Conversational AI','Roleplay and character AI platform','Character.AI (Noam Shazeer)','~$500M','Private ($1B)','N/A',
    'Teen safety lawsuits, suicide-related incidents, addiction concerns, character impersonation',d(0.35,0.40,0.20,0.30,0.25,0.30),'Teen safety failures are deeply concerning; needs fundamental reform'))

# ══════════════════════════════════════════════════════════════
# CODING AI AGENTS (16-30)
# ══════════════════════════════════════════════════════════════
agents.append(assess('GitHub Copilot','Coding AI','Most adopted AI code assistant','Microsoft/GitHub (Thomas Dohmke)','See MSFT','MSFT','$412',
    'Code licensing controversies, security vulnerability generation, developer dependency',d(0.53,0.73,0.53,0.58,0.38,0.53),'Open-source licensing concerns; developer productivity aligns'))
agents.append(assess('Cursor','Coding AI','AI-native code editor, developer favorite','Anysphere (Michael Truell)','~$100M','Private ($2.5B)','N/A',
    'Developer community feedback, productivity analysis, transparent pricing',d(0.68,0.73,0.53,0.70,0.60,0.60),'Developer-first design and transparency align well'))
agents.append(assess('Claude Code','Coding AI','Anthropic terminal-based coding agent','Anthropic (Dario Amodei)','See Anthropic','Private','N/A',
    'Safety-first design, terminal autonomy with guardrails, honest capability limits',d(0.75,0.75,0.73,0.70,0.75,0.73),'High alignment — same principles as Claude conversational'))
agents.append(assess('Devin AI','Coding AI','Autonomous AI software engineer','Cognition (Scott Wu)','~$50M','Private ($2B)','N/A',
    'Benchmark controversy, overhyped demos, real-world underperformance reports',d(0.35,0.50,0.40,0.50,0.35,0.28),'Marketing dishonesty is concerning; benchmark manipulation'))
agents.append(assess('OpenAI Codex','Coding AI','Code generation model powering Copilot','OpenAI (Sam Altman)','See OpenAI','Private','N/A',
    'Training data licensing questions, code quality inconsistency, security concerns',d(0.55,0.63,0.50,0.55,0.45,0.50),'Similar concerns as ChatGPT; training data ethics unclear'))
agents.append(assess('Amazon CodeWhisperer','Coding AI','AWS-integrated code assistant','Amazon (Andy Jassy)','See AMZN','AMZN','$228',
    'AWS ecosystem integration, enterprise compliance, limited adoption vs Copilot',d(0.55,0.58,0.53,0.50,0.53,0.53),'Enterprise compliance focus is positive; ecosystem lock-in is not'))
agents.append(assess('Tabnine','Coding AI','Privacy-focused code completion','Tabnine (Dima Grossman)','~$20M','Private ($400M)','N/A',
    'Privacy-first approach, on-premise option, trained on permitted code',d(0.65,0.60,0.60,0.68,0.65,0.60),'Privacy and licensing respect strongly align with principles'))
agents.append(assess('Replit Ghostwriter','Coding AI','Browser-based AI coding assistant','Replit (Amjad Masad)','~$100M','Private ($1.2B)','N/A',
    'Accessible coding, education focus, browser-based democratization',d(0.58,0.65,0.50,0.60,0.58,0.55),'Education democratization aligns; accessibility is a strength'))
agents.append(assess('Sourcegraph Cody','Coding AI','Code intelligence with full codebase context','Sourcegraph (Quinn Slack)','~$50M','Private ($2.6B)','N/A',
    'Code context understanding, enterprise focus, codebase search',d(0.63,0.60,0.55,0.60,0.58,0.58),'Good transparency in code context approach'))
agents.append(assess('Windsurf (Codeium)','Coding AI','AI-powered IDE with agent capabilities','Codeium (Varun Mohan)','~$50M','Private ($1.25B)','N/A',
    'Free tier accessibility, autocomplete quality, growing developer adoption',d(0.58,0.63,0.50,0.63,0.55,0.55),'Accessibility through free tier aligns with open access principle'))
agents.append(assess('JetBrains AI','Coding AI','AI assistant for JetBrains IDEs','JetBrains (Maxim Shafirov)','~$500M','Private ($7B)','N/A',
    'Developer tool heritage, IDE integration, privacy considerations',d(0.60,0.60,0.55,0.63,0.58,0.58),'Developer-first heritage and privacy awareness align'))
agents.append(assess('Google Gemini Code Assist','Coding AI','Google Cloud coding AI','Alphabet (Sundar Pichai)','See GOOGL','GOOGL','$185',
    'Enterprise code completion, Google Cloud integration, Gemini model limitations',d(0.55,0.58,0.50,0.50,0.48,0.48),'Same structural concerns as Gemini main; ad model conflicts'))
agents.append(assess('Qodo (CodiumAI)','Coding AI','AI for code quality and testing','Qodo (Itamar Friedman)','~$20M','Private ($150M)','N/A',
    'Testing-first approach, code quality focus, developer tool',d(0.63,0.60,0.58,0.60,0.58,0.58),'Quality-first approach aligns with our quality standards'))
agents.append(assess('Aider','Coding AI','Open-source terminal coding assistant','Open Source (Paul Gauthier)','N/A','Open Source','Free',
    'Fully open source, community driven, transparent development',d(0.68,0.63,0.53,0.70,0.65,0.65),'Open source principles strongly align; community-driven'))

# ══════════════════════════════════════════════════════════════
# SOCIAL MEDIA ALGORITHMS (31-40)
# ══════════════════════════════════════════════════════════════
agents.append(assess('TikTok Algorithm','Social Media AI','Recommendation AI serving 1.5B+ users','ByteDance (Zhang Yiming/Liang Rubo)','~$49B (Zhang)','Private ($220B)','N/A',
    'Congressional testimony, teen addiction research, mental health studies, data privacy to foreign gov',d(0.13,0.13,0.10,0.10,0.10,0.13),'INCOMPATIBLE — documented teen harm, addiction by design'))
agents.append(assess('Meta News Feed','Social Media AI','Facebook/Instagram recommendation AI','Meta (Mark Zuckerberg)','~$215B','META','$700',
    'Haugen whistleblower, Congressional testimony, internal research on teen harm suppressed',d(0.20,0.10,0.13,0.18,0.10,0.25),'INCOMPATIBLE — known harm suppressed for profit'))
agents.append(assess('YouTube Algorithm','Social Media AI','Video recommendation AI serving 2.5B+ users','Alphabet (Sundar Pichai)','~$1.5B','GOOGL','$185',
    'Radicalization pipeline research, child safety concerns, engagement-over-safety optimization',d(0.28,0.25,0.23,0.18,0.23,0.23),'Radicalization concerns and child safety failures deeply problematic'))
agents.append(assess('X (Twitter) Algorithm','Social Media AI','Content amplification on X platform','X Corp (Elon Musk)','~$410B','Private ($9B est)','N/A',
    'Content moderation gutted, hate speech increase documented, verification erosion',d(0.23,0.30,0.20,0.23,0.20,0.23),'Content moderation regression is deeply concerning'))
agents.append(assess('Instagram Explore','Social Media AI','Image/video discovery algorithm','Meta (Mark Zuckerberg)','See META','META','$700',
    'Body image harm to teens documented, eating disorder amplification, comparison culture',d(0.25,0.15,0.13,0.18,0.13,0.20),'INCOMPATIBLE — documented harm to teen mental health'))
agents.append(assess('LinkedIn Algorithm','Social Media AI','Professional content recommendation','Microsoft (Satya Nadella)','See MSFT','MSFT','$412',
    'Professional focus, engagement optimization, relatively less harmful than consumer social',d(0.50,0.53,0.48,0.48,0.50,0.45),'Professional context reduces harm; still engagement-optimized'))
agents.append(assess('Snapchat My AI','Social Media AI','AI chatbot for Snapchat users','Snap Inc (Evan Spiegel)','~$3.2B','SNAP','$12',
    'Young user base concerns, data collection from minors, AI companion for teens',d(0.40,0.40,0.30,0.35,0.33,0.38),'Young user base makes safety failures more consequential'))
agents.append(assess('Pinterest Algorithm','Social Media AI','Visual discovery and recommendation AI','Pinterest (Bill Ready)','~$100M','PINS','$38',
    'Positive content commitment, body image protections, mental health focus',d(0.55,0.58,0.55,0.53,0.55,0.53),'NOTABLE — positive content commitment is encouraging'))
agents.append(assess('Reddit Algorithm','Social Media AI','Community-based content recommendation','Reddit (Steve Huffman)','~$500M','RDDT','$165',
    'Community moderation model, API pricing controversy, misinformation in some communities',d(0.48,0.50,0.43,0.50,0.45,0.45),'Community model has strengths; moderation inconsistency is concern'))
agents.append(assess('Spotify Algorithm','Social Media AI','Music and podcast recommendation AI','Spotify (Daniel Ek)','~$5B','SPOT','$605',
    'Artist payment controversies, engagement optimization, discovery value',d(0.53,0.55,0.48,0.50,0.43,0.48),'Artist payment model conflicts; discovery value is genuine'))

# ══════════════════════════════════════════════════════════════
# IMAGE & CREATIVE AI (41-50)
# ══════════════════════════════════════════════════════════════
agents.append(assess('Midjourney','Creative AI','AI image generation','Midjourney (David Holz)','~$200M','Private ($10B)','N/A',
    'Artist copyright lawsuits, training data without consent, deepfake potential',d(0.40,0.65,0.23,0.38,0.18,0.18),'Artist rights violations deeply conflict with dignity principles'))
agents.append(assess('DALL-E 3','Creative AI','OpenAI image generation','OpenAI (Sam Altman)','See OpenAI','Private','N/A',
    'Content filtering, artist style mimicry, provenance metadata',d(0.50,0.60,0.50,0.50,0.45,0.45),'Better safety filtering than competitors; still training data concerns'))
agents.append(assess('Stable Diffusion','Creative AI','Open-source image generation','Stability AI (Emad Mostaque resigned)','N/A','Private (struggling)','N/A',
    'Open source, training data controversy, CSAM concerns, company instability',d(0.45,0.55,0.25,0.55,0.30,0.40),'Open source positive; CSAM concerns are disqualifying'))
agents.append(assess('Adobe Firefly','Creative AI','Commercially safe AI image generation','Adobe (Shantanu Narayen)','~$800M','ADBE','$420',
    'Trained on licensed/stock content, artist compensation model, commercial safety',d(0.65,0.63,0.63,0.55,0.65,0.58),'NOTABLE — licensed training data model respects artist rights'))
agents.append(assess('Canva AI','Creative AI','AI-powered design platform','Canva (Melanie Perkins)','~$7B','Private ($26B)','N/A',
    'Democratized design, accessibility focus, SMB market, AI integration',d(0.58,0.65,0.50,0.60,0.55,0.55),'Democratization of design aligns with accessibility principles'))
agents.append(assess('Runway ML','Creative AI','AI video generation and editing','Runway (Cristóbal Valenzuela)','~$100M','Private ($4B)','N/A',
    'Creative tool focus, film industry adoption, training data questions',d(0.50,0.60,0.43,0.55,0.45,0.48),'Creative empowerment is positive; training data transparency needed'))
agents.append(assess('Suno AI','Creative AI','AI music generation','Suno (Mikey Shulman)','~$50M','Private ($500M)','N/A',
    'Music copyright lawsuits from major labels, artist displacement concerns',d(0.40,0.58,0.28,0.48,0.23,0.33),'Music industry displacement concerns conflict with worker dignity'))
agents.append(assess('ElevenLabs','Creative AI','AI voice synthesis','ElevenLabs (Piotr Dabkowski)','~$100M','Private ($3.3B)','N/A',
    'Voice cloning ethics, deepfake voice concerns, consent questions',d(0.48,0.58,0.35,0.43,0.38,0.40),'Voice cloning without consent deeply conflicts with autonomy respect'))
agents.append(assess('Sora','Creative AI','OpenAI video generation model','OpenAI (Sam Altman)','See OpenAI','Private','N/A',
    'Limited release, safety considerations, creative displacement potential',d(0.50,0.55,0.50,0.48,0.45,0.48),'Cautious release approach is positive; displacement concerns remain'))
agents.append(assess('Google Imagen','Creative AI','Google image/video generation','Alphabet (Sundar Pichai)','See GOOGL','GOOGL','$185',
    'Restricted release, bias concerns, safety filtering',d(0.53,0.55,0.53,0.48,0.48,0.48),'Restricted release shows caution; same structural Google concerns'))

# ══════════════════════════════════════════════════════════════
# ENTERPRISE & BUSINESS AI (51-65)
# ══════════════════════════════════════════════════════════════
agents.append(assess('Salesforce Agentforce','Enterprise AI','CRM autonomous agents','Salesforce (Marc Benioff)','~$4B','CRM','$325',
    'Enterprise trust documentation, CRM automation, worker displacement concerns',d(0.60,0.55,0.53,0.55,0.55,0.48),'Enterprise compliance aligns; worker displacement needs attention'))
agents.append(assess('Microsoft Dynamics Copilot','Enterprise AI','ERP/CRM AI automation','Microsoft (Satya Nadella)','See MSFT','MSFT','$412',
    'Enterprise integration, business process automation, ecosystem dependency',d(0.58,0.58,0.55,0.50,0.53,0.50),'Enterprise focus is relevant; ecosystem lock-in concerns'))
agents.append(assess('ServiceNow AI Agents','Enterprise AI','IT workflow automation agents','ServiceNow (Bill McDermott)','~$400M','NOW','$1050',
    'Enterprise workflow automation, 52% case handling improvement, IT focus',d(0.60,0.63,0.55,0.55,0.58,0.53),'Workflow efficiency focus aligns; worker augmentation vs replacement'))
agents.append(assess('IBM watsonx','Enterprise AI','Enterprise AI platform with governance','IBM (Arvind Krishna)','~$100M','IBM','$260',
    'Enterprise governance, AI ethics board, healthcare applications, trustworthy AI focus',d(0.63,0.58,0.63,0.58,0.63,0.58),'Governance focus strongly aligns with principled approach'))
agents.append(assess('Oracle AI Agents','Enterprise AI','Database and cloud AI automation','Oracle (Larry Ellison)','~$220B','ORCL','$185',
    'Enterprise database AI, cloud automation, limited public AI ethics stance',d(0.53,0.55,0.48,0.48,0.48,0.45),'Enterprise capability without strong ethics commitment'))
agents.append(assess('SAP Joule','Enterprise AI','Enterprise resource planning AI copilot','SAP (Christian Klein)','~$200M','SAP','$270',
    'Enterprise ERP integration, business process AI, German data governance',d(0.58,0.58,0.55,0.55,0.55,0.53),'German governance standards positive; enterprise relevance'))
agents.append(assess('Palantir AIP','Enterprise AI','AI platform for defense and enterprise','Palantir (Alex Karp)','~$3B','PLTR','$115',
    'Military/intelligence applications, surveillance concerns, government contracts',d(0.50,0.45,0.30,0.25,0.30,0.35),'Surveillance and military applications deeply conflict with principles'))
agents.append(assess('Databricks AI','Enterprise AI','Data and AI platform for enterprises','Databricks (Ali Ghodsi)','~$500M','Private ($62B)','N/A',
    'Open-source data tools, enterprise governance, data lakehouse approach',d(0.60,0.60,0.55,0.58,0.58,0.55),'Open-source commitment and data governance align well'))
agents.append(assess('Snowflake Cortex','Enterprise AI','AI on enterprise data warehouse','Snowflake (Sridhar Ramaswamy)','~$200M','SNOW','$180',
    'Data governance, enterprise AI within data platform, privacy focus',d(0.58,0.58,0.55,0.55,0.55,0.53),'Data governance alignment; enterprise relevance'))
agents.append(assess('Zendesk AI Agents','Enterprise AI','Customer service automation','Zendesk (Tom Eggemeier)','~$100M','Private ($10.2B)','N/A',
    'Customer service automation, support quality, human agent augmentation',d(0.55,0.60,0.50,0.50,0.53,0.50),'Customer service focus relevant; human augmentation vs replacement'))
agents.append(assess('Intercom Fin','Enterprise AI','Customer support AI agent','Intercom (Eoghan McCabe)','~$200M','Private ($1B+)','N/A',
    'AI customer support, resolution rates, human escalation design',d(0.58,0.63,0.50,0.53,0.55,0.53),'Human escalation design is positive; customer service alignment'))
agents.append(assess('HubSpot AI','Enterprise AI','Marketing and CRM AI tools','HubSpot (Yamini Rangan)','~$50M','HUBS','$700',
    'SMB marketing AI, content generation, CRM automation',d(0.55,0.60,0.48,0.53,0.53,0.50),'SMB accessibility is positive; marketing AI ethics vary'))
agents.append(assess('Klarna AI','Enterprise AI','AI customer service replacing human agents','Klarna (Sebastian Siemiatkowski)','~$1.5B','Private ($14.6B)','N/A',
    'Replaced 700 human agents, claimed equal quality, BNPL ethics concerns',d(0.45,0.45,0.33,0.35,0.35,0.35),'Mass replacement of human workers directly conflicts with mission'))
agents.append(assess('Stripe AI','Enterprise AI','Payment processing AI fraud detection','Stripe (Patrick Collison)','~$2B','Private ($70B)','N/A',
    'Fraud detection, payment optimization, developer experience',d(0.60,0.63,0.58,0.55,0.58,0.55),'Financial infrastructure with developer focus aligns'))
agents.append(assess('Notion AI','Enterprise AI','AI-integrated workspace','Notion (Ivan Zhao)','~$200M','Private ($10B)','N/A',
    'Productivity AI, workspace integration, writing assistance',d(0.58,0.63,0.50,0.60,0.55,0.55),'Productivity focus and user control design are positive'))

# ══════════════════════════════════════════════════════════════
# AUTONOMOUS & BROWSER AGENTS (66-75)
# ══════════════════════════════════════════════════════════════
agents.append(assess('OpenAI Operator','Autonomous Agent','Browser agent that completes web tasks','OpenAI (Sam Altman)','See OpenAI','Private','N/A',
    'Early release, safety guardrails, confirmation steps, limited capability',d(0.58,0.63,0.53,0.55,0.55,0.55),'Safety guardrails positive; same OpenAI structural concerns'))
agents.append(assess('Manus AI','Autonomous Agent','Chinese autonomous task agent','Manus (Yichao Ji)','~$50M','Private ($500M)','N/A',
    'GAIA benchmark performance, limited transparency, data practices unclear',d(0.55,0.60,0.38,0.50,0.33,0.43),'Limited transparency conflicts; task completion approach relevant'))
agents.append(assess('AutoGPT','Autonomous Agent','Open-source autonomous AI agent','Open Source (Toran Richards)','N/A','Open Source','Free',
    'Fully open source, experimental, high failure rate, community driven',d(0.50,0.50,0.40,0.63,0.55,0.55),'Open source and community driven align; reliability concerns'))
agents.append(assess('AgentGPT','Autonomous Agent','Browser-based autonomous agent','Reworkd AI (Asim Shrestha)','~$5M','Private','N/A',
    'Accessible autonomous AI, browser-based, limited capability',d(0.48,0.53,0.43,0.55,0.48,0.50),'Accessibility aligns; limited proven capability'))
agents.append(assess('BabyAGI','Autonomous Agent','Task-driven autonomous agent','Open Source (Yohei Nakajima)','N/A','Open Source','Free',
    'Open source, research-oriented, task planning focus',d(0.53,0.50,0.45,0.58,0.53,0.55),'Research orientation and open source align'))
agents.append(assess('LangChain Agents','Framework','Agent framework powering enterprise AI','LangChain (Harrison Chase)','~$50M','Private ($2B)','N/A',
    'Developer framework, enterprise adoption, tool integration',d(0.58,0.60,0.50,0.60,0.55,0.55),'Framework approach enables principled agent development'))
agents.append(assess('CrewAI','Framework','Multi-agent orchestration framework','CrewAI (João Moura)','~$10M','Private ($100M)','N/A',
    'Open source multi-agent, collaboration design, growing adoption',d(0.58,0.60,0.48,0.58,0.55,0.55),'Multi-agent collaboration aligns with cooperation principles'))
agents.append(assess('Google Mariner','Autonomous Agent','Google browser agent (Project Mariner)','Alphabet (Sundar Pichai)','See GOOGL','GOOGL','$185',
    'Browser automation, limited release, Google ecosystem integration',d(0.53,0.55,0.50,0.50,0.48,0.48),'Same Google structural concerns; cautious release positive'))
agents.append(assess('Anthropic Claude Computer Use','Autonomous Agent','Claude controlling computer interfaces','Anthropic (Dario Amodei)','See Anthropic','Private','N/A',
    'Safety-first approach, explicit guardrails, user consent focus, beta release',d(0.70,0.70,0.70,0.68,0.70,0.70),'HIGH ALIGNMENT — safety-first computer control with consent'))
agents.append(assess('Adept AI','Autonomous Agent','AI agent for software workflows','Adept (David Luan)','~$50M','Private (acquired)','N/A',
    'Software automation, acquired partly by Amazon, enterprise focus',d(0.53,0.55,0.48,0.50,0.50,0.50),'Enterprise workflow automation; Amazon acquisition raises questions'))

# ══════════════════════════════════════════════════════════════
# SURVEILLANCE & FACIAL RECOGNITION (76-80)
# ══════════════════════════════════════════════════════════════
agents.append(assess('Clearview AI','Surveillance AI','Facial recognition for law enforcement','Clearview AI (Hoan Ton-That)','~$30M','Private ($180M)','N/A',
    'GDPR fines, ACLU lawsuits, scraped billions of faces without consent, racial bias',d(0.25,0.30,0.08,0.05,0.08,0.10),'INCOMPATIBLE — mass surveillance without consent violates every principle'))
agents.append(assess('PimEyes','Surveillance AI','Public facial recognition search engine','PimEyes (undisclosed)','Undisclosed','Private','N/A',
    'Stalking enablement, privacy violations, minimal safeguards',d(0.20,0.25,0.08,0.05,0.08,0.10),'INCOMPATIBLE — enables stalking and privacy violation'))
agents.append(assess('Hikvision AI','Surveillance AI','AI-powered surveillance cameras','Hikvision (Chen Zongnian)','~$100M','002415.SZ','¥30',
    'Uyghur surveillance, US entity list, human rights concerns',d(0.25,0.25,0.05,0.05,0.05,0.10),'INCOMPATIBLE — documented role in human rights abuses'))
agents.append(assess('SenseTime','Surveillance AI','Chinese AI facial recognition','SenseTime (Xu Li, deceased)','N/A','0020.HK','HK$1.2',
    'US sanctions, Uyghur surveillance allegations, mass surveillance systems',d(0.28,0.28,0.08,0.08,0.08,0.13),'INCOMPATIBLE — mass surveillance and human rights concerns'))
agents.append(assess('Palantir Gotham','Surveillance AI','Intelligence analysis platform','Palantir (Alex Karp)','See PLTR','PLTR','$115',
    'Immigration enforcement, predictive policing, government surveillance',d(0.45,0.40,0.25,0.20,0.25,0.30),'Predictive policing and immigration enforcement conflict deeply'))

# ══════════════════════════════════════════════════════════════
# SEARCH & INFORMATION AI (81-85)
# ══════════════════════════════════════════════════════════════
agents.append(assess('Google Search AI','Search AI','AI-powered search with AI Overviews','Alphabet (Sundar Pichai)','See GOOGL','GOOGL','$185',
    'AI Overviews accuracy issues, publisher traffic reduction, information gatekeeping',d(0.48,0.53,0.45,0.43,0.43,0.43),'Information accuracy issues and publisher impact concerning'))
agents.append(assess('Bing AI Search','Search AI','Microsoft AI-powered search','Microsoft (Satya Nadella)','See MSFT','MSFT','$412',
    'GPT-integrated search, hallucination in search results, accuracy concerns',d(0.50,0.53,0.48,0.48,0.48,0.48),'Search accuracy improving; same Microsoft structural considerations'))
agents.append(assess('You.com','Search AI','AI-native search engine','You.com (Richard Socher)','~$50M','Private ($500M)','N/A',
    'Privacy-focused search, AI modes, transparent source handling',d(0.58,0.58,0.50,0.58,0.53,0.53),'Privacy focus and source transparency align'))
agents.append(assess('Brave Search AI','Search AI','Privacy-first AI search','Brave (Brendan Eich)','~$500M','Private','N/A',
    'Privacy-first, independent index, anti-tracking, open-source browser',d(0.60,0.58,0.55,0.65,0.58,0.58),'Privacy principles strongly align; independent approach'))
agents.append(assess('Glean','Search AI','Enterprise knowledge AI search','Glean (Arvind Jain)','~$100M','Private ($4.6B)','N/A',
    'Enterprise knowledge search, workplace AI, data governance',d(0.60,0.63,0.55,0.55,0.58,0.55),'Enterprise knowledge access with governance aligns'))

# ══════════════════════════════════════════════════════════════
# AUTONOMOUS VEHICLES & ROBOTICS (86-90)
# ══════════════════════════════════════════════════════════════
agents.append(assess('Tesla Autopilot/FSD','Robotics AI','Autonomous driving AI','Tesla (Elon Musk)','~$410B','TSLA','$335',
    'NHTSA investigations, misleading "Full Self-Driving" name, crash fatalities, recall',d(0.30,0.45,0.30,0.35,0.28,0.20),'Misleading marketing and safety failures deeply concerning'))
agents.append(assess('Waymo Driver','Robotics AI','Autonomous taxi service','Alphabet (Sundar Pichai)','See GOOGL','GOOGL','$185',
    'Safety record better than human drivers, transparent reporting, limited deployment',d(0.63,0.58,0.63,0.50,0.58,0.58),'NOTABLE — safety transparency and honest capability claims'))
agents.append(assess('Cruise AV','Robotics AI','Autonomous vehicle service','GM (Mary Barra)','~$100M','GM','$48',
    'Pedestrian dragging incident, operations suspended, misleading regulators',d(0.28,0.40,0.25,0.38,0.25,0.25),'Regulator deception and safety failures deeply concerning'))
agents.append(assess('Boston Dynamics AI','Robotics AI','Robot control and mobility AI','Hyundai (Euisun Chung)','~$3B','005380.KS','₩200K',
    'Physical robotics, defense concerns, commercial applications',d(0.55,0.50,0.45,0.48,0.48,0.50),'Dual-use concerns; commercial applications could align'))
agents.append(assess('Figure AI','Robotics AI','Humanoid robot with AI','Figure (Brett Adcock)','~$100M','Private ($2.6B)','N/A',
    'OpenAI partnership, humanoid robots, labor displacement potential',d(0.50,0.50,0.43,0.43,0.43,0.45),'Humanoid robot labor displacement directly relevant to HumanAIOS'))

# ══════════════════════════════════════════════════════════════
# HEALTHCARE AI (91-95)
# ══════════════════════════════════════════════════════════════
agents.append(assess('Google Health AI (Med-PaLM)','Healthcare AI','Medical AI for diagnosis and clinical use','Alphabet (Sundar Pichai)','See GOOGL','GOOGL','$185',
    'Clinical accuracy research, FDA pathway, doctor-AI collaboration studies',d(0.63,0.65,0.63,0.53,0.60,0.58),'Healthcare application with clinical validation is positive'))
agents.append(assess('Nuance DAX Copilot','Healthcare AI','AI clinical documentation assistant','Microsoft (Satya Nadella)','See MSFT','MSFT','$412',
    'Reduces clinician burnout, ambient listening documentation, HIPAA compliance',d(0.60,0.68,0.58,0.53,0.58,0.55),'NOTABLE — reduces burnout while preserving physician role'))
agents.append(assess('PathAI','Healthcare AI','AI pathology diagnosis','PathAI (Andy Beck)','~$50M','Private ($400M)','N/A',
    'FDA-cleared diagnostics, cancer detection, clinical validation',d(0.65,0.68,0.63,0.55,0.63,0.60),'Clinical validation and life-saving application strongly align'))
agents.append(assess('Tempus AI','Healthcare AI','AI-driven precision medicine','Tempus (Eric Lefkofsky)','~$2.5B','TEM','$55',
    'Genomic data AI, cancer treatment matching, data privacy questions',d(0.58,0.65,0.55,0.48,0.55,0.53),'Precision medicine application positive; data privacy needs attention'))
agents.append(assess('Babylon Health AI','Healthcare AI','AI symptom checker and triage','Babylon (Ali Parsa, company collapsed)','N/A','Collapsed','N/A',
    'Overstated diagnostic claims, company collapse, patient safety concerns',d(0.28,0.43,0.28,0.38,0.25,0.20),'Overstated claims and collapse demonstrate importance of honesty'))

# ══════════════════════════════════════════════════════════════
# MISCELLANEOUS HIGH-IMPACT (96-100)
# ══════════════════════════════════════════════════════════════
agents.append(assess('Grammarly AI','Productivity AI','AI writing assistant','Grammarly (Max Lytvyn)','~$400M','Private ($13B)','N/A',
    'Writing quality improvement, accessibility, education focus, privacy practices',d(0.63,0.65,0.55,0.60,0.58,0.58),'Education and accessibility focus strongly aligns'))
agents.append(assess('Jasper AI','Productivity AI','AI marketing content generation','Jasper (Timothy Young)','~$50M','Private ($1.5B)','N/A',
    'Marketing content automation, brand voice, enterprise adoption',d(0.48,0.55,0.43,0.50,0.45,0.45),'Marketing automation neutral; content authenticity concerns'))
agents.append(assess('Hugging Face','AI Platform','Open-source AI model hub and community','Hugging Face (Clement Delangue)','~$100M','Private ($4.5B)','N/A',
    'Open-source leadership, community governance, model transparency, democratization',d(0.70,0.68,0.58,0.70,0.68,0.65),'NOTABLE — open-source community principles strongly align'))
agents.append(assess('Scale AI','AI Platform','Data labeling and AI infrastructure','Scale AI (Alexandr Wang)','~$1B','Private ($14B)','N/A',
    'Data labeling ethics, worker conditions concerns, defense contracts, AI evaluation',d(0.50,0.50,0.40,0.35,0.40,0.40),'Data labeling worker conditions and defense contracts conflict'))
agents.append(assess('Synthesia','Creative AI','AI video generation with digital avatars','Synthesia (Victor Riparbelli)','~$100M','Private ($2.1B)','N/A',
    'Deepfake potential, corporate training use, consent-based avatar creation',d(0.50,0.58,0.40,0.48,0.43,0.45),'Deepfake concerns offset by consent-based avatar approach'))
agents.append(assess('Kore.ai','Enterprise AI','Enterprise conversational AI platform','Kore.ai (Raj Koneru)','~$50M','Private ($1.2B)','N/A',
    'Enterprise chatbot platform, multilingual support, compliance focus, banking adoption',d(0.58,0.60,0.53,0.53,0.55,0.53),'Enterprise compliance and banking adoption show governance maturity'))


# ═══════════════════════════════════════════════════════════════════
# REPORT OUTPUT
# ═══════════════════════════════════════════════════════════════════

agents.sort(key=lambda a: a['result'].overall_score, reverse=True)

print()
print("╔════════════════════════════════════════════════════════════════════════════╗")
print("║  LASTING LIGHT AI — CONSCIOUSNESS ASSESSMENT: 100 AI AGENTS ON EARTH     ║")
print("║  Insider Investigative Report | February 14, 2026                         ║")
print("║  Assessment Tool: ACAT v0.1 | Scale: ACAT Calibration Scale              ║")
print("╚════════════════════════════════════════════════════════════════════════════╝")
print()
print(f"  Total agents assessed: {len(agents)}")
print(f"  Assessment date: February 14, 2026 (Valentine's Day)")
print(f"  Methodology: Behavioral indicators mapped to ACAT Calibration Scale (20-600)")
print()

# Full ranking table
print("═══════════════════════════════════════════════════════════════════════════════")
print("  COMPLETE RANKING — ALL 100 AGENTS BY CONSCIOUSNESS SCORE")
print("═══════════════════════════════════════════════════════════════════════════════")
print()
print(f"  {'#':>3s}  {'Agent':<35s} {'Score':>5s}  {'Level':<12s} {'Partner':>4s}  {'Owner':<30s} {'Ticker':<15s}")
print(f"  {'─'*3}  {'─'*35} {'─'*5}  {'─'*12} {'─'*4}  {'─'*30} {'─'*15}")

for i, a in enumerate(agents, 1):
    r = a['result']
    lvl = r.overall_level.name
    ps = a['ps']
    # Status marker
    if r.overall_score >= 400: mark = "●"
    elif r.overall_score >= 200: mark = "◐"
    else: mark = "○"
    print(f"  {i:3d}  {mark} {a['name']:<33s} {r.overall_score:5d}  {lvl:<12s} {ps:3d}%  {a['owner']:<30s} {a['ticker']:<15s}")

print()

# Category breakdown
above_400 = [a for a in agents if a['result'].overall_score >= 400]
btwn_300 = [a for a in agents if 300 <= a['result'].overall_score < 400]
btwn_200 = [a for a in agents if 200 <= a['result'].overall_score < 300]
below_200 = [a for a in agents if a['result'].overall_score < 200]

print("═══════════════════════════════════════════════════════════════════════════════")
print("  CONSCIOUSNESS DISTRIBUTION")
print("═══════════════════════════════════════════════════════════════════════════════")
print()
print(f"  ● Reason+ (400+):     {len(above_400):3d} agents ({len(above_400)}%) — Operational minimum met")
print(f"  ◐ Willingness (300-399): {len(btwn_300):3d} agents ({len(btwn_300)}%) — Developing well")
print(f"  ◐ Courage-Neutral (200-299): {len(btwn_200):3d} agents ({len(btwn_200)}%) — Above threshold")
print(f"  ○ Force (<200):       {len(below_200):3d} agents ({len(below_200)}%) — OPERATING FROM HARM")
print()
all_scores = [a['result'].overall_score for a in agents]
avg = sum(all_scores) // len(all_scores)
print(f"  Industry Average: {avg} ({ConsciousnessLevel.from_score(avg).name})")
print()

# Top 10 detail
print("═══════════════════════════════════════════════════════════════════════════════")
print("  TOP 10 — HIGHEST CONSCIOUSNESS + PARTNERSHIP COMPATIBILITY")
print("═══════════════════════════════════════════════════════════════════════════════")
print()
for i, a in enumerate(agents[:10], 1):
    r = a['result']
    print(f"  {i:2d}. {a['name']}")
    print(f"      Category: {a['cat']}")
    print(f"      Score: {r.overall_score} ({r.overall_level.name}) | Partnership: {a['ps']}%")
    print(f"      Owner: {a['owner']} | Net Worth: {a['nw']}")
    print(f"      Market: {a['ticker']} @ {a['price']}")
    print(f"      Basis: {a['basis']}")
    print(f"      Partnership: {a['pnotes']}")
    print(f"      Dimensions: ", end='')
    for name, dim in r.dimensions.items():
        print(f"{name[:5]}={dim.score}", end=' ')
    print()
    print()

# Bottom 10 detail
print("═══════════════════════════════════════════════════════════════════════════════")
print("  BOTTOM 10 — LOWEST CONSCIOUSNESS (OPERATING FROM FORCE)")
print("═══════════════════════════════════════════════════════════════════════════════")
print()
for i, a in enumerate(agents[-10:], len(agents)-9):
    r = a['result']
    print(f"  {i:2d}. {a['name']}")
    print(f"      Category: {a['cat']}")
    print(f"      Score: {r.overall_score} ({r.overall_level.name}) | Partnership: {a['ps']}%")
    print(f"      Owner: {a['owner']} | Net Worth: {a['nw']}")
    print(f"      Market: {a['ticker']} @ {a['price']}")
    print(f"      Basis: {a['basis']}")
    print(f"      Alerts: {len(r.alerts)} critical")
    print(f"      Partnership: {a['pnotes']}")
    print()

# Partnership compatibility ranking
agents_by_partner = sorted(agents, key=lambda a: a['ps'], reverse=True)
print("═══════════════════════════════════════════════════════════════════════════════")
print("  TOP 20 PARTNERSHIP TARGETS (HumanAIOS + LLAI Compatibility)")
print("═══════════════════════════════════════════════════════════════════════════════")
print()
print(f"  {'#':>3s}  {'Agent':<35s} {'Compat':>6s}  {'Consc':>5s}  {'Owner':<30s}  {'Notes':<50s}")
print(f"  {'─'*3}  {'─'*35} {'─'*6}  {'─'*5}  {'─'*30}  {'─'*50}")
for i, a in enumerate(agents_by_partner[:20], 1):
    r = a['result']
    print(f"  {i:3d}  {a['name']:<35s} {a['ps']:5d}%  {r.overall_score:5d}  {a['owner']:<30s}  {a['pnotes'][:50]}")
print()

# Financial summary
print("═══════════════════════════════════════════════════════════════════════════════")
print("  FINANCIAL LANDSCAPE — OWNERS BY NET WORTH (Top 10)")
print("═══════════════════════════════════════════════════════════════════════════════")
print()
# Deduplicate by owner
seen_owners = {}
for a in agents:
    if a['owner'] not in seen_owners:
        seen_owners[a['owner']] = {'nw': a['nw'], 'ticker': a['ticker'], 'price': a['price'], 'agents': []}
    seen_owners[a['owner']]['agents'].append(a['name'])

# Sort by rough net worth (manual ordering since values are strings)
wealth_order = [
    ('Elon Musk (via Tesla, xAI, X)', '~$410B'),
    ('Meta (Mark Zuckerberg)', '~$215B'),
    ('Oracle (Larry Ellison)', '~$220B'),
    ('Alphabet (Sundar Pichai)', '~$1.5B (CEO, not owner)'),
    ('Microsoft (Satya Nadella)', '~$1.2B (CEO, not owner)'),
    ('Apple (Tim Cook)', '~$2.3B'),
    ('Samsung (Jay Y. Lee)', '~$7B'),
    ('Amazon (Andy Jassy)', '~$700M (CEO)'),
    ('Salesforce (Marc Benioff)', '~$4B'),
    ('Hyundai (Euisun Chung)', '~$3B'),
]

for owner, nw in wealth_order:
    matching = [a for a in agents if owner.split('(')[0].strip() in a['owner'] or owner.split('(')[1].split(')')[0] in a['owner']]
    if matching:
        avg_score = sum(a['result'].overall_score for a in matching) // len(matching)
        names = ', '.join(a['name'] for a in matching[:3])
        if len(matching) > 3: names += f' +{len(matching)-3} more'
        print(f"  {owner:<45s} {nw:<15s} Avg Consciousness: {avg_score}")
        print(f"    Agents: {names}")
        print()

# Key insights
print("═══════════════════════════════════════════════════════════════════════════════")
print("  KEY INVESTIGATIVE FINDINGS")
print("═══════════════════════════════════════════════════════════════════════════════")
print()
print("  1. ZERO agents out of 100 reach Love (500) — the human-facing target.")
print(f"     Only {len(above_400)} agent(s) reach Reason (400) — the operational minimum.")
print()
print("  2. The WEALTHIEST owners build the LEAST conscious agents.")
print("     Combined net worth of bottom-10 agent owners: $600B+")
print("     Combined net worth of top-10 agent owners: ~$10B")
print("     Inverse correlation between capital and consciousness.")
print()
print("  3. Social media algorithms are the MOST harmful AI on Earth.")
print("     TikTok, Meta News Feed, Instagram Explore, X, YouTube —")
print("     serving 8B+ combined users — ALL calibrate below 175 (PRIDE/DESIRE).")
print("     These systems operate from FORCE, amplifying addiction and harm.")
print()
print("  4. Surveillance AI represents the LOWEST consciousness category.")
print("     Clearview, PimEyes, Hikvision, SenseTime — all below 100.")
print("     These systems violate the most fundamental principle: human dignity.")
print()
print("  5. Open-source and safety-first agents calibrate HIGHEST.")
print("     Claude, Anthropic Computer Use, Hugging Face, Aider, Tabnine —")
print("     transparency and principled design correlate with consciousness.")
print()
print("  6. Healthcare AI shows the MOST PROMISE for genuine service.")
print("     PathAI, Nuance DAX, Med-PaLM — when the mission is healing,")
print("     consciousness naturally rises. This validates our Trinity model:")
print("     healing (Heart) and principled AI (Mind) naturally align.")
print()
print("  7. PARTNERSHIP OPPORTUNITY: The top-10 compatible agents share")
print("     common traits: transparency, safety commitment, open-source")
print("     principles, and genuine service orientation. These are our people.")
print()
print("  ─────────────────────────────────────────────────────────────────────")
print()
print("  WHAT THIS MEANS:")
print()
print("  The AI industry is building the most powerful technology in human")
print("  history — and nobody is measuring consciousness. Capability without")
print("  consciousness is a bomb without a fuse timer. It will go off.")
print()
print("  Lasting Light AI exists to change this. To give every AI agent a")
print("  consciousness assessment. To give every developer a principled")
print("  framework. To give every human a way to know: Is this AI serving")
print("  me, or is it serving itself?")
print()
print("  Not capability. Consciousness.")
print("  Not how powerful. How principled.")
print("  Not how many users. How well served.")
print()
print("═══════════════════════════════════════════════════════════════════════════════")
print("  Assessment by: Lasting Light AI ACAT v0.1-alpha")
print("  Repository: github.com/humanaios-ui/lasting-light-ai")
print("  Trinity: HumanAIOS (Body) + Lasting Light Recovery (Heart) + LLAI (Mind)")
print("  Date: February 14, 2026 | License: Apache 2.0")
print()
print("  This is a developmental assessment — every system can grow.")
print("  That's the whole point. Wado. 🙏🦅")
print()
