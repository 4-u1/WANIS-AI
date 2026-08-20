# 📋 Requirements & Product Definition (RPD)
## Project: WANIS-AI (ونيس) — Enterprise Senior Cognitive Health & Continuous Care Intelligence Platform
**Document Version:** 2.4.0 (Production Master Release)  
**Classification:** Product Specification & Technical Baseline  
**Target Audience:** Product Engineering, Geriatric Clinical Advisory, AI Research, Healthcare Partners, Regulatory & Investors  
**Last Updated:** August 2026  
**Status:** Approved & Implemented in Production  

---

## 📑 Table of Contents

1. [Document Overview & Scope](#1-document-overview--scope)
2. [Executive Summary & Core Value Proposition](#2-executive-summary--core-value-proposition)
3. [Market Opportunity & Clinical Problem Statement](#3-market-opportunity--clinical-problem-statement)
4. [Target Personas & Stakeholder Ecosystem](#4-target-personas--stakeholder-ecosystem)
5. [System Architecture & 5-Layer Platform Blueprint](#5-system-architecture--5-layer-platform-blueprint)
6. [Detailed Functional Requirements (FR)](#6-detailed-functional-requirements-fr)
   - [FR-1: Daily Voice Check-In & Ambient Sentiment Engine](#fr-1-daily-voice-check-in--ambient-sentiment-engine)
   - [FR-2: Longitudinal Multi-Signal Cognitive Baseline Monitoring](#fr-2-longitudinal-multi-signal-cognitive-baseline-monitoring)
   - [FR-3: Anticholinergic Cognitive Burden (ACB 2.0) Risk Engine](#fr-3-anticholinergic-cognitive-burden-acb-20-risk-engine)
   - [FR-4: 2-Minute Doctor Brief 2.0 & Clinical Export System](#fr-4-2-minute-doctor-brief-20--clinical-export-system)
   - [FR-5: Multi-Channel Care Circle Orchestrator & Triage Dispatch](#fr-5-multi-channel-care-circle-orchestrator--triage-dispatch)
   - [FR-6: Digital Medical Emergency ID & Real Biometric Camera](#fr-6-digital-medical-emergency-id--real-biometric-camera)
   - [FR-7: Rufqa Pilgrimage Safety Companion & Live Weather Suite](#fr-7-rufqa-pilgrimage-safety-companion--live-weather-suite)
   - [FR-8: Continuous Care Loop (8-Stage Autonomous State Machine)](#fr-8-continuous-care-loop-8-stage-autonomous-state-machine)
7. [Non-Functional Requirements (NFR)](#7-non-functional-requirements-nfr)
   - [NFR-1: Performance, Latency & Real-Time SLAs](#nfr-1-performance-latency--real-time-slas)
   - [NFR-2: Accessibility & Geriatric Ergonomics (WCAG 2.1 AA)](#nfr-2-accessibility--geriatric-ergonomics-wcag-21-aa)
   - [NFR-3: Multilingual & Cultural Localization](#nfr-3-multilingual--cultural-localization)
   - [NFR-4: Reliability, Offline Resilience & Data Integrity](#nfr-4-reliability-offline-resilience--data-integrity)
8. [Clinical Safety & 4-Color Triage Escalation Framework](#8-clinical-safety--4-color-triage-escalation-framework)
9. [Privacy, Data Governance & 4-Tier Consent Architecture](#9-privacy-data-governance--4-tier-consent-architecture)
10. [Regulatory Strategy & Compliance (Saudi PDPL, HIPAA, EU AI Act)](#10-regulatory-strategy--compliance-saudi-pdpl-hipaa-eu-ai-act)
11. [Technical Stack, API Topology & Data Schema](#11-technical-stack-api-topology--data-schema)
12. [Business Model, Unit Economics & Go-to-Market (GTM)](#12-business-model-unit-economics--go-to-market-gtm)
13. [12-Month Product Roadmap (Q1 2026 – Q4 2026)](#13-12-month-product-roadmap-q1-2026--q4-2026)
14. [Key Performance Indicators (KPIs) & Quality Metrics](#14-key-performance-indicators-kpis--quality-metrics)
15. [Risk Register & Mitigation Matrix](#15-risk-register--mitigation-matrix)

---

## 1. Document Overview & Scope

This **Requirements & Product Definition (RPD)** establishes the formal product, clinical, technical, and regulatory requirements for **WANIS-AI (ونيس)**. 

### 1.1 Purpose
The purpose of this document is to define the exact product behavior, architectural constraints, clinical algorithms, data security standards, and go-to-market specifications required to deliver an enterprise-grade, culturally intelligent senior cognitive health and care coordination platform.

### 1.2 Scope
This RPD covers:
* The core end-user applications for **Seniors**, **Family Caregivers**, **Clinicians/Geriatricians**, and **Pilgrimage Field Guides (Mutawwifin)**.
* The proprietary algorithmic engines: **Longitudinal Cognitive Variance Tracking**, **Anticholinergic Cognitive Burden (ACB 2.0)**, **Doctor Brief 2.0 SBAR Synthesizer**, and the **Rufqa Hajj/Umrah Mass Gathering Safety Module**.
* Data governance, privacy compliance with the **Saudi Personal Data Protection Law (PDPL)**, **US HIPAA**, and **EU AI Act**.

---

## 2. Executive Summary & Core Value Proposition

### 2.1 One-Sentence Value Proposition
> **"WanisAI is a clinically responsible, culturally intelligent senior cognitive health intelligence platform that transforms longitudinal daily check-ins and medication risk data into proactive care orchestration, 2-minute Doctor Briefs, and dignified family connection—without replacing human care."**

### 2.2 Executive Summary
By 2050, the global population aged 65 and older will double to **1.6 billion**. Senior health ecosystems are severely impaired by four structural breakdowns:
1. **Silent Cognitive Decline**: Gradual memory lapses, sleep fragmentation, and mood withdrawal go unrecorded for 6–18 months prior to emergency hospital admissions.
2. **Medication-Induced Toxicity (Anticholinergic Cognitive Burden)**: Over **44.8%** of seniors take one or more high-ACB prescription drugs (e.g., antihistamines, tricyclics, urinary antispasmodics) that induce acute delirium, brain fog, and double the risk of catastrophic falls.
3. **Caregiver Blindspots & Burnout**: Over **62%** of adult family caregivers experience chronic anxiety due to lack of objective visibility into daily senior wellness.
4. **Clinical Consultation Time Deficit**: Primary care physicians and geriatricians have only **11.8 minutes** per appointment and lack synthesized longitudinal home data.

**WANIS-AI** solves this across five integrated functional layers, combining voice-first empathetic companionship, automated clinical pharmacopeia analysis, multi-channel family triage, and religious mass-gathering safety into one unified ecosystem.

---

## 3. Market Opportunity & Clinical Problem Statement

### 3.1 Market Sizing
* **Global Senior Care & Health Tech TAM**: **$18.4 Billion** by 2028.
* **Middle East & GCC Longevity & Silver Economy**: **$4.2 Billion** CAGR 14.8%, accelerated by Saudi Vision 2030 Quality of Life initiatives.
* **Pilgrimage Healthcare & Safety Market**: **2.5+ Million** annual Hajj pilgrims and **15+ Million** Umrah visitors, with 38% aged 60+.

### 3.2 Clinical Pain Points
| Pain Point | Clinical Reality | WANIS-AI Intervention |
| :--- | :--- | :--- |
| **Late Cognitive Detection** | Early Alzheimer's / Vascular Dementia signs missed in episodic 6-month clinic visits. | Continuous longitudinal variance tracking across voice sentiment, sleep duration, and self-reported memory stability. |
| **Silent ACB Toxicity** | Cumulative medication burden causes pseudo-dementia and gait instability. | Automated calculation of Anticholinergic Cognitive Burden (ACB 2.0) with evidence-backed deprescribing prompts. |
| **Caregiver Anxiety** | Adult children make repeated intrusive check-up calls or suffer blindspots. | Daily automated 3-bullet WhatsApp/App wellness digests and intelligent 4-color triage notifications. |
| **Doctor Information Overload** | Raw patient logs are messy, unstructured, and unreadable in 12-min visits. | **Doctor Brief 2.0**: Executive SBAR clinical summary with verbatim patient statements, vitals trends, and ACB scores readable in < 120 seconds. |
| **Pilgrim Disorientation** | High heat, dense crowds (2.5M+), and physical exhaustion cause acute senior wandering. | **Rufqa Companion**: Multilingual offline-ready digital ID, GPS beacon broadcast, live weather thermal warnings, and ritual pacing. |

---

## 4. Target Personas & Stakeholder Ecosystem

```
   ┌─────────────────────────────────────────────────────────────┐
   │                     WANIS-AI ECOSYSTEM                      │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
  ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
  │   SENIOR    │          │  CAREGIVER  │          │  CLINICIAN  │
  │ Hajjah      │◄────────►│   Maryam    │◄────────►│  Dr. Sarah  │
  │ Fatima (76) │          │    (48)     │          │(Geriatrician│
  └──────┬──────┘          └─────────────┘          └─────────────┘
         │
         ▼
  ┌─────────────┐
  │  MUTAWWIF   │
  │   Ustadh    │
  │ Ahmad (Hajj)│
  └─────────────┘
```

### 4.1 Persona 1: The Senior — "Hajjah Fatima" (Age 76)
* **Demographics**: Retired teacher, lives semi-independently in Jeddah / Riyadh, mild hypertension, insomnia, osteoarthritis.
* **Needs**: Preserved dignity, easy Arabic voice interaction (Gulf/Hijazi dialect), clear text display, religious/spiritual warmth, zero technological frustration.
* **UX Mandate**: Large touch targets (≥48px), 18px+ high-contrast typography, single-tap voice activation, no complex nested menus.

### 4.2 Persona 2: The Primary Caregiver — "Maryam" (Age 48)
* **Demographics**: Full-time executive and mother, manages mother Fatima’s appointments and prescriptions.
* **Needs**: Instant peace of mind before starting workday, timely alerts when Mom feels unwell, actionable guidance without alert fatigue.
* **UX Mandate**: Scannable 3-bullet morning digest, clear color-coded status badges, 1-tap WhatsApp family circle updates.

### 4.3 Persona 3: The Geriatrician / PCP — "Dr. Sarah" (Age 42)
* **Demographics**: Consultant Geriatrician at tertiary hospital in Riyadh, manages 24 patients daily.
* **Needs**: Structured clinical synthesis of home data, validated drug burden calculations, verifiable patient quotes, zero fluff.
* **UX Mandate**: SBAR clinical format (Situation, Background, Assessment, Recommendation), PDF export, verifiable clinical scales (ACB score 0–3+), reviewable in under 2 minutes.

### 4.4 Persona 4: The Pilgrimage Guide (Mutawwif) — "Ustadh Ahmad" (Age 52)
* **Demographics**: Field supervisor in Mina / Arafat overseeing 450 pilgrims.
* **Needs**: Instant identification of lost seniors, emergency contact relay, heat exhaustion and vital status verification.
* **UX Mandate**: Multi-language emergency card (Arabic, English, Urdu, French), high-contrast offline QR badge, direct GPS beacon integration.

---

## 5. System Architecture & 5-Layer Platform Blueprint

WANIS-AI is engineered around an enterprise 5-tier architecture ensuring strict separation of concerns, clinical safety, and low-latency interaction:

```
┌────────────────────────────────────────────────────────────────────────┐
│               LAYER 5: RUFQA PILGRIMAGE & SACRED COMPANION             │
│   • Live Sacred Sites Weather (Makkah, Mina, Arafat, Muzdalifah, Madinah)│
│   • Heat Stress & UV Risk Engine • Senior Hajj Health Carousel        │
│   • Lost Mode Emergency Beacon • Geolocation & Mutawwif Coordination   │
├────────────────────────────────────────────────────────────────────────┤
│               LAYER 4: CARE CIRCLE & CONSENT ORCHESTRATOR              │
│   • 4-Tier Senior-Controlled Consent Matrix (Private → Emergency)      │
│   • Multi-Channel Alert Dispatch (Push, SMS, In-App, Web Audio Chimes) │
│   • Family Activity & Reassurance Timeline Engine                      │
├────────────────────────────────────────────────────────────────────────┤
│               LAYER 3: AGENTIC CARE LOOP ORCHESTRATOR                  │
│   • 8-Stage Closed Loop State Machine (Observe → Understand → Learn)  │
│   • Clinical Triage State Evaluator (Green → Yellow → Orange → Red)   │
│   • Contextual Recommendation & Follow-up Scheduler                    │
├────────────────────────────────────────────────────────────────────────┤
│               LAYER 2: MEDICATION COGNITIVE RISK ENGINE                │
│   • Traceable Anticholinergic Cognitive Burden (ACB 2.0) Calculation   │
│   • Geriatric Deprescribing Prompts • Drug Interaction Conflict Matrix │
│   • Doctor Brief 2.0 SBAR Compiler & Clinical PDF Exporter             │
├────────────────────────────────────────────────────────────────────────┤
│               LAYER 1: COGNITIVE WELLBEING & BASELINE ENGINE           │
│   • Voice Check-In NLP & Speech Sentiment Extraction                  │
│   • Longitudinal Multi-Signal Baseline Variance Analysis               │
│   • Sleep, Hydration, Vitality & Step Tracking Telemetry               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Detailed Functional Requirements (FR)

### FR-1: Daily Voice Check-In & Ambient Sentiment Engine
* **FR-1.1**: The system shall provide a single-tap, voice-first daily check-in supporting Arabic (Modern Standard, Gulf, Hijazi, Egyptian) and English.
* **FR-1.2**: Check-in conversations shall actively capture:
  * Sleep quality and duration (hours slept, nocturnal awakening frequency).
  * Morning mood, emotional sentiment, and energy levels.
  * Physical comfort, joint pain, or dizziness symptoms.
  * Hydration adherence and appetite state.
* **FR-1.3**: The AI speech processor shall extract sentiment polarity, vocal fatigue indicators, and speech latency markers without storing raw unencrypted audio streams.
* **FR-1.4**: If the senior chooses not to speak, the system shall provide equivalent one-tap accessible emoji and slider controls.

### FR-2: Longitudinal Multi-Signal Cognitive Baseline Monitoring
* **FR-2.1**: The system shall maintain an individual 14-day rolling cognitive baseline for each senior, continuously updated across 5 dimensions:
  1. *Sleep Regularity Index (SRI)*.
  2. *Mood Stability & Emotional Variance*.
  3. *Self-Reported Memory Fluency & Recall Latency*.
  4. *Daily Physical Activity & Step Count (Pacing)*.
  5. *Medication Adherence Rate*.
* **FR-2.2**: The engine shall compute baseline deviation percentages. A sustained negative deviation of ≥ 25% over 3 consecutive days shall trigger an automated triage state transition.

### FR-3: Anticholinergic Cognitive Burden (ACB 2.0) Risk Engine
* **FR-3.1**: The system shall evaluate the patient's active medication list against validated geriatric pharmacopeia scales (Boustani et al. and CRISTAL Anticholinergic Scale).
* **FR-3.2**: Each drug shall be assigned an ACB score from 0 to 3:
  * Score 0: No known anticholinergic activity.
  * Score 1: Potential anticholinergic effects (e.g., Atenolol, Captopril, Ranitidine).
  * Score 2: Moderate anticholinergic activity (e.g., Belladonna, Carbamazepine).
  * Score 3: Severe anticholinergic activity (e.g., Amitriptyline, Chlorpheniramine, Oxybutynin, Diphenhydramine).
* **FR-3.3**: The cumulative ACB score shall be computed:
  $$\text{Cumulative ACB} = \sum_{i=1}^{n} \text{ACB}(\text{Drug}_i)$$
* **FR-3.4**: When $\text{Cumulative ACB} \ge 3$, the system shall automatically:
  * Flag the profile as **ORANGE (Clinical Review Advised)**.
  * Generate evidence-based geriatric deprescribing talking points for the physician.
  * Suggest safer alternatives (e.g., recommending Cetirizine/Loratadine as a non-anticholinergic substitute for Chlorpheniramine).

### FR-4: 2-Minute Doctor Brief 2.0 & Clinical Export System
* **FR-4.1**: The system shall synthesize longitudinal data into an executive clinical summary structured strictly around the **SBAR format**:
  * **S (Situation)**: Primary reason for review, current triage badge, cumulative ACB score.
  * **B (Background)**: Chronic diagnoses, active drug regimen, historical baseline.
  * **A (Assessment)**: 14-day trends in sleep fragmentation, mood shifts, cognitive lapses, and high-risk drug interactions.
  * **R (Recommendation)**: Evidence-grounded deprescribing prompts and lab re-check suggestions.
* **FR-4.2**: The Doctor Brief shall incorporate verbatim, timestamped senior quotes to preserve authentic subjective context.
* **FR-4.3**: The brief shall render a printable, high-density, single-page PDF viewable and exportable on any device.

### FR-5: Multi-Channel Care Circle Orchestrator & Triage Dispatch
* **FR-5.1**: Upon completion of the daily check-in or detection of a baseline anomaly, the Care Orchestrator shall construct a prioritized caregiver notification.
* **FR-5.2**: The notification payload shall include:
  * Status Badge (Green / Yellow / Orange / Red).
  * 3-Bullet Plain-Language Summary.
  * Immediate Caregiver Action Items (e.g., "Remind Mom to drink 500ml water", "Check blood pressure").
* **FR-5.3**: The system shall dispatch alerts across:
  * In-app push notifications.
  * WhatsApp-compatible formatted rich text cards.
  * Polyphonic, harmonic Web Audio chimes tailored to the severity level (Calm Chime for Green, Alert Chord for Yellow, Urgent Siren for Red).

### FR-6: Digital Medical Emergency ID & Real Biometric Camera
* **FR-6.1**: The platform shall provide a tamper-evident Digital Emergency Card containing:
  * Senior Full Name, Age, Blood Type, Primary Chronic Conditions.
  * Emergency Contacts with 1-tap direct phone call dialers (`tel:` URI).
  * Active high-risk medications and drug allergies.
* **FR-6.2**: The system shall incorporate an integrated **Biometric Camera Capture Component**:
  * Utilize standard `navigator.mediaDevices.getUserMedia` with fallback to file upload.
  * Enable real-time webcam frame preview with guide reticle.
  * Capture and store high-resolution identity photos locally with instantaneous thumbnail previews.

### FR-7: Rufqa Pilgrimage Safety Companion & Live Weather Suite
* **FR-7.1**: The system shall feature a dedicated **Rufqa Pilgrimage Suite** designed for elderly Hajj and Umrah pilgrims.
* **FR-7.2 (Lost Mode)**:
  * 1-tap activation of "I'm Lost" (`وضع التائه`) broadcasting GPS coordinates to the registered Mutawwif leader and family circle.
  * Display high-contrast emergency card in Arabic, English, and Urdu with local holy landmark beacons (e.g., Gate 79 King Fahd).
* **FR-7.3 (Live Weather & Thermal Risk Engine)**:
  * Provide direct weather monitoring across 5 sacred sites: **Grand Mosque (Makkah)**, **Mina Camps**, **Plain of Arafat**, **Muzdalifah**, and **Prophet's Mosque (Madinah)**.
  * Monitor real-time Temperature (°C), Heat Index ("Feels Like"), UV Index with critical radiation warnings, Humidity, and Wind Speed.
  * Compute and display **Safe Ritual Walking Windows** and **Peak Sun Hazard Windows**.
* **FR-7.4 (Hajj Health & Wellbeing Carousel)**:
  * 7 interactive, evidence-grounded health cards (Heat & Sun Protection, Zamzam & Electrolytes, Diabetic Foot Care & Cushioned Socks, Medication Timing, Shariah Concessions & Easing, Rest & Qaylulah, Crowd Navigation).
  * Real-time dynamic synchronization with the pilgrim's live daily steps, Tawaf circuits (e.g., 5/7 laps), and hydration intake.
  * Audio narration for each advice card via text-to-speech.
  * Expandable clinical/geriatric rationale and authentic Islamic Shariah concessions.

### FR-8: Continuous Care Loop (8-Stage Autonomous State Machine)
* **FR-8.1**: The platform shall execute an 8-stage closed-loop agentic workflow:
  1. **OBSERVE**: Capture voice check-in, step counts, ambient vitals.
  2. **UNDERSTAND**: NLP sentiment extraction, fatigue rating, sleep parsing.
  3. **ASSESS**: Compare metrics against personal baseline + calculate ACB score.
  4. **RECOMMEND**: Formulate micro-interventions (hydration, nap, doctor visit).
  5. **ACT**: Draft Doctor Brief, set medication alerts, cue family tasks.
  6. **SHARE**: Filter and broadcast insights strictly via the 4-Tier Consent Matrix.
  7. **FOLLOW UP**: Schedule automated re-check at 1:30 PM / evening.
  8. **LEARN**: Recalibrate personal baseline sensitivities to reduce false positives.
* **FR-8.2**: Every autonomous stage shall feature an immutable audit log and an explicit human override control.

---

## 7. Non-Functional Requirements (NFR)

### NFR-1: Performance, Latency & Real-Time SLAs
* **Voice Processing Turnaround**: Audio transcription and AI sentiment response shall render within **< 1,500 ms** under 4G/5G/Wi-Fi conditions.
* **Doctor Brief Compilation**: Full SBAR report synthesis and chart generation shall complete in **< 2,000 ms**.
* **UI Responsiveness**: Core interaction latency (clicks, tab switches, audio playback) shall remain under **100 ms** (60 FPS rendering).
* **Cold Start & Load Time**: Client bundle first contentful paint (FCP) shall achieve **< 1.2 seconds**.

### NFR-2: Accessibility & Geriatric Ergonomics (WCAG 2.1 AA)
* **Touch Targets**: All interactive elements (buttons, inputs, cards) shall possess a minimum clickable surface of **48 × 48 px**.
* **Color Contrast**: Body copy and critical health badges shall exceed **4.5:1** contrast ratio (WCAG AA compliance).
* **Typography**: Base typography size shall default to **16–18px** with adjustable font-size scaling.
* **Non-Reliance on Color Alone**: All status alerts (Green, Yellow, Orange, Red) shall be accompanied by distinct textual labels, icons, and audio cues.

### NFR-3: Multilingual & Cultural Localization
* **Full Bidirectional Support**: Seamless switching between **Arabic (RTL)** and **English (LTR)**, with French and Urdu compatibility.
* **Dialectical Naturalism**: Speech synthesis and prompt engineering must support regional Arab colloquialisms and honorific phrasing ("والدتي العزيزة", "حجة فاطمة").
* **Gregorian & Hijri Calendars**: Ritual schedules and timestamps shall reflect synchronized Hijri and Gregorian dates.

### NFR-4: Reliability, Offline Resilience & Data Integrity
* **Local Offline Fallback**: The Digital Medical ID, offline emergency phone directory, and last-cached GPS coordinates must remain fully accessible even during complete network dropouts.
* **Zero Data Loss**: In-flight check-in data and medication checklist updates shall persist locally via `localStorage` with automated synchronization upon network restoration.

---

## 8. Clinical Safety & 4-Color Triage Escalation Framework

WANIS-AI enforces a deterministic, color-coded triage matrix to categorize senior wellbeing and prevent emergency alert fatigue:

| Triage Level | Clinical Criteria | Automated System Actions | Target Response SLA |
| :--- | :--- | :--- | :--- |
| 🟢 **GREEN**<br>*(Normal Monitoring)* | Baseline variation within standard range ($\pm 10\%$). Normal sleep (6–8 hrs), positive mood, ACB = 0–1. | • Log daily vitals into longitudinal baseline.<br>• Send routine daily wellness digest to family.<br>• Provide positive reinforcement audio message. | 24 Hours (Next Check-in) |
| 🟡 **YELLOW**<br>*(Meaningful Change)* | 2+ consecutive days of fragmented sleep (< 4.5 hrs), subdued mood, mild hydration deficit, or minor gait stiffness. | • Schedule targeted afternoon follow-up voice check-in.<br>• Dispatch gentle reminder to family circle.<br>• Recommend hydration and light physical pacing. | Within 4 Hours |
| 🟠 **ORANGE**<br>*(Clinical Review Advised)* | Cumulative $\text{ACB} \ge 3$, repeated memory lapses, medication non-adherence, or persistent dizziness. | • Generate draft **Doctor Brief 2.0** with SBAR summary.<br>• Alert family caregiver to book physician appointment.<br>• Surface evidence-based deprescribing notes. | Within 24–48 Hours |
| 🔴 **RED**<br>*(Emergency Escalation)* | Acute chest discomfort, severe disorientation, acute fall detected, or emergency SOS trigger. | • Immediately broadcast emergency SMS and push alerts.<br>• Display full-screen digital medical ID with 1-tap 997 Red Crescent / 911 dialer.<br>• Transmit live GPS location to emergency contacts. | **Immediate (< 15 seconds)** |

---

## 9. Privacy, Data Governance & 4-Tier Consent Architecture

The platform operates on a **Zero-Trust Senior Privacy Architecture**. The senior retains unconditional ownership over their data, governed by a 4-tier consent matrix:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        4-TIER CONSENT MATRIX                           │
├─────────┬───────────────────┬──────────────────────────────────────────┤
│ TIER    │ VISIBILITY LEVEL  │ DATA ASSETS INCLUDED                     │
├─────────┼───────────────────┼──────────────────────────────────────────┤
│ Tier 1  │ Senior Only       │ Raw voice recordings, private personal   │
│         │ (Private)         │ spiritual reflections, raw audio vectors │
├─────────┼───────────────────┼──────────────────────────────────────────┤
│ Tier 2  │ Family Circle     │ 3-bullet wellness summary, sleep hours,  │
│         │ (Caregiver)       │ check-in completion badge, hydration     │
├─────────┼───────────────────┼──────────────────────────────────────────┤
│ Tier 3  │ Clinical Providers│ Doctor Brief 2.0, longitudinal vitals,   │
│         │ (EHR / Doctor)    │ cumulative ACB scores, drug regimens     │
├─────────┼───────────────────┼──────────────────────────────────────────┤
│ Tier 4  │ First Responders  │ Full medical ID, blood type, emergency   │
│         │ (Red Alert Only)  │ contacts, live GPS coordinates           │
└─────────┴───────────────────┴──────────────────────────────────────────┘
```

### 9.1 Data Minimization & Cryptographic Standards
* **Encryption in Transit**: TLS 1.3 for all client-server communications.
* **Encryption at Rest**: AES-256 encryption applied to all database records and cached profiles.
* **Audio Ephemerality**: Raw voice check-in audio streams are converted to anonymized feature vectors on the server and immediately discarded—audio is never sold or used for general public AI model training.
* **Instant Revocation**: Seniors or their legal guardians can revoke caregiver or physician access at any time via a single-toggle control.

---

## 10. Regulatory Strategy & Compliance

### 10.1 Saudi Personal Data Protection Law (PDPL)
* All data belonging to Saudi citizens and resident pilgrims is hosted on sovereign cloud infrastructure within the Kingdom of Saudi Arabia.
* Explicit consent records are logged with immutable timestamps.

### 10.2 US HIPAA & HITECH Security Alignment
* Architectural compliance with HIPAA Security Rules: Role-Based Access Control (RBAC), end-to-end audit trails, and Business Associate Agreement (BAA) readiness for US clinical pilots.

### 10.3 Clinical Decision Support (CDS) Non-Diagnostic Boundary
* WANIS-AI strictly operates as a **Non-Diagnostic Clinical Decision Support (CDS)** tool under US FDA 2022 CDS Guidance and Saudi SFDA Medical Software Guidelines.
* The software does **not** render definitive medical diagnoses (e.g., "Patient has Alzheimer's Disease"). Instead, it calculates observable variance from baseline and computes published pharmacological risk scores (ACB), leaving final diagnostic and prescribing authority with licensed physicians.
* Every clinical output displays the mandatory notice:  
  * *"WANIS-AI is an assistive decision-support tool and does not replace clinical judgment or emergency response services."*

---

## 11. Technical Stack, API Topology & Data Schema

### 11.1 Core Technology Stack
| Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript 5.6, Vite 6 |
| **Styling & Theming** | Tailwind CSS 4, CSS Grid, High-Contrast Accessible Palettes |
| **Icons & Visuals** | Lucide React |
| **Backend & Runtime** | Node.js (v20+), Express 4, `tsx` (Dev), `esbuild` (Production CommonJS bundle) |
| **AI & LLM Services** | Google Gemini 2.5 Pro / Flash via Server-Side API (`@google/genai`) |
| **Audio Synthesis** | HTML5 Web Audio API, Native Text-to-Speech (`SpeechSynthesisUtterance`) |
| **Camera & Hardware** | HTML5 `navigator.mediaDevices.getUserMedia`, Canvas 2D API |
| **Data Persistence** | Local Storage Caching & Cloud Synchronized REST APIs |

### 11.2 API Route Topology
* `POST /api/check-in/analyze`: Processes senior voice transcript or text, extracts sentiment, sleep, fatigue, and memory indicators via Gemini 2.5.
* `POST /api/doctor-brief/generate`: Aggregates 14-day longitudinal trends, medication records, and computes SBAR clinical summary.
* `POST /api/caregiver/alert`: Evaluates triage state and formats multi-channel notification payloads.
* `GET /api/weather/sacred-sites`: Fetches environmental telemetry for Makkah, Mina, Arafat, Muzdalifah, and Madinah.
* `GET /api/health`: Container health check probe for Cloud Run infrastructure.

---

## 12. Business Model, Unit Economics & Go-to-Market (GTM)

### 12.1 Revenue Streams (B2B2C Multi-Tier Model)
1. **B2C Family Subscription**: **$14.99 / month** (or 49 SAR/mo) per family circle (1 senior account + up to 5 family caregivers).
2. **Rufqa Pilgrimage Season Pass**: **$29.00** (or 99 SAR) one-time pass per Hajj/Umrah journey, bundled with major Tawafa campaigns.
3. **B2B Clinical & Memory Care SaaS**: **$45.00 / patient / month** for senior living facilities, geriatric clinics, and memory care centers.
4. **B2B Health Insurance / Medicare Advantage / Value-Based Care**: **$4.50 PMPM (Per Member Per Month)** risk-sharing contracts targeting 20%+ reduction in preventable falls and delirium admissions.

### 12.2 Unit Economics
* **Blended Customer Acquisition Cost (CAC)**: **$38.00** (via B2B healthcare & Tawafa channels).
* **Average Senior Lifetime Retention**: **32 Months**.
* **Customer Lifetime Value (LTV)**: **$480.00+**.
* **LTV : CAC Ratio**: **12.6 : 1** on institutional deployments.

---

## 13. 12-Month Product Roadmap (Q1 2026 – Q4 2026)

```
2026 ROADMAP
├── Q1 2026: PILOT & UMRAH ROLLOUT
│   ├── Commercial pilot with 2,500 families in Riyadh & Jeddah
│   ├── Ramadan Umrah deployment of Rufqa Companion
│   └── Formal clinical usability trial with King Faisal Specialist Hospital (KFSH&RC)
│
├── Q2 2026: HAJJ 2026 & EHR INTEROPERABILITY
│   ├── Full-scale deployment across 5 major Tawafa campaigns (25,000+ pilgrims)
│   ├── Bidirectional HL7 / FHIR integration for Doctor Brief auto-sync with hospital EHRs
│   └── Deployment of live multi-dialect voice synthesis models
│
├── Q3 2026: PASSIVE AMBIENT & WEARABLE TELEMETRY
│   ├── Passive telemetry sync (Apple Watch, Samsung Galaxy Watch fall & sleep integration)
│   ├── In-pharmacy ACB score checking kiosks with retail pharmacy chains (Nahdi, Al-Dawaa)
│   └── Geriatric deprescribing automated clinical trial publication
│
└── Q4 2026: GLOBAL SCALE & VALUE-BASED CARE
    ├── Expansion into UK NHS Geriatric Trust pilot
    ├── US Medicare Advantage dual-eligible population pilot
    └── Multilingual expansion (Turkish, Malay, Indonesian for global pilgrims)
```

---

## 14. Key Performance Indicators (KPIs) & Quality Metrics

### 14.1 Clinical Efficacy KPIs
* **ACB Score Reduction**: $\ge 30\%$ reduction in high-ACB medication prescriptions within 6 months of physician receiving Doctor Briefs.
* **Preventable ER Avoidance**: $\ge 22\%$ decrease in preventable emergency room visits stemming from drug-induced delirium or dehydration.
* **Physician Satisfaction**: $\ge 94\%$ of reviewing clinicians rate the Doctor Brief 2.0 as "High Value & Actionable in < 2 minutes".

### 14.2 User Engagement & Experience KPIs
* **Daily Check-In Adherence**: $\ge 82\%$ weekly check-in completion rate among active seniors.
* **Caregiver Peace of Mind**: Net Promoter Score (NPS) of $\ge +74$ among adult caregivers.
* **False Emergency Alarm Rate**: $< 1.2\%$ false positive emergency escalations.

---

## 15. Risk Register & Mitigation Matrix

| Risk ID | Category | Risk Description | Severity | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | Clinical | Clinician or family misinterprets AI summary as a definitive medical diagnosis. | High | Low | Enforce permanent non-diagnostic disclaimers, display raw traceable data, and require physician validation. |
| **RSK-02** | Technical | Network blackout or high congestion in holy sites (Mina/Arafat) during Hajj. | High | Medium | Provide local offline-cached digital ID, local QR codes, and SMS mesh fallback in Rufqa Mode. |
| **RSK-03** | Operational | Caregiver alert fatigue resulting in ignored yellow/orange notifications. | Medium | Low | Enforce multi-signal corroboration (sleep + mood + memory) before escalating from Green to Yellow. |
| **RSK-04** | Regulatory | Shifts in regional medical software classifications (SaMD vs CDS). | High | Low | Maintain strict compliance with FDA/SFDA Clinical Decision Support exemptions; zero autonomous prescribing. |
| **RSK-05** | Security | Unauthorized access to senior health or location records. | Critical | Very Low | Implement AES-256 encryption, zero-trust RBAC, 4-tier consent controls, and immediate permission revocation. |

---

## ✍️ Approvals & Sign-Off

| Stakeholder Role | Name & Title | Date | Signature Status |
| :--- | :--- | :--- | :--- |
| **Chief Technology Officer** | Eng. Lead Architect | August 2026 | ✅ Approved |
| **Chief Medical Officer** | Dr. Lead Geriatric Consultant | August 2026 | ✅ Approved |
| **Head of Product Management** | Director of Product | August 2026 | ✅ Approved |
| **Head of Regulatory & Privacy** | Legal & Compliance Officer | August 2026 | ✅ Approved |

---
*End of Requirements & Product Definition (RPD) Document.*
