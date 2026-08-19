<div align="center">

# 🧠 WANIS-AI (ونيس)
### **منظومة الذكاء السريري والرعاية المعرفية المتكاملة لكبار السن**
### **Enterprise Senior Cognitive Health & Continuous Care Intelligence Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-2.5-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Node.js & Express](https://img.shields.io/badge/Express-Backend-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Live Platform](https://img.shields.io/badge/Live_Platform-Cloud_Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://wanisai-senior-cognitive-intelligence-467968797278.europe-west2.run.app)
[![Compliance](https://img.shields.io/badge/PDPL_&_HIPAA-Aligned-10B981?style=for-the-badge&logo=shield&logoColor=white)](#-data-governance--consent-matrix)

<p align="center">
  <b>🌐 رابط المنصة المباشر | Live Production Platform:</b><br>
  <a href="https://wanisai-senior-cognitive-intelligence-467968797278.europe-west2.run.app" target="_blank"><b>https://wanisai-senior-cognitive-intelligence-467968797278.europe-west2.run.app</b></a>
</p>

<p align="center">
  <b>منصة سريرية متقدمة مبنية بذكاء اصطناعي مسؤول لرصد المؤشرات المعرفية المبكرة، إدارة العبء الكوليني للأدوية (ACB)، وتنسيق دوائر الرعاية الأسرية والطبية في العالم العربي.</b><br>
  <i>A clinically responsible, culturally attuned AI ecosystem providing early cognitive variance tracking, Anticholinergic Burden computation, automated Care Circle triage escalation, and Hajj/Umrah pilgrim safety.</i>
</p>

</div>

---

## 📑 جدول المحتويات | Table of Contents

- [1. الملخص التنفيذي | Executive Summary](#1-الملخص-التنفيذي--executive-summary)
- [2. البنية المعمارية للنظام | System Architecture](#2-البنية-المعمارية-للنظام--system-architecture)
- [3. المحاور والوحدات الوظيفية | Core Modules](#3-المحاور-والوحدات-الوظيفية--core-modules)
  - [3.1 فحص الاطمئنان الصوتي الذكي | Daily Voice Check-in](#31-فحص-الاطمئنان-الصوتي-الذكي--daily-voice-check-in)
  - [3.2 بروتوكول إشعارات دائرة الرعاية | Automated Care Circle Alerts](#32-بروتوكول-إشعارات-دائرة-الرعاية--automated-care-circle-alerts)
  - [3.3 ملخص العافية اليومي | Daily Wellness Summary](#33-ملخص-العافية-اليومي--daily-wellness-summary)
  - [3.4 محرك العبء المعرفي للأدوية | ACB Risk Engine](#34-محرك-العبء-المعرفي-للأدوية--acb-risk-engine)
  - [3.5 موجز الطبيب السريري 2.0 | Doctor Brief 2.0](#35-موجز-الطبيب-السريري-20--doctor-brief-20)
  - [3.6 رفيق الحج والعمرة (رفقة) | Rufqa Pilgrim Safety](#36-رفيق-الحج-والعمرة-رفقة--rufqa-pilgrim-safety)
  - [3.7 محرك دورة الرعاية الثمانية | 8-Stage Continuous Care Loop](#37-محرك-دورة-الرعاية-الثمانية--8-stage-continuous-care-loop)
- [4. مصفوفة التصنيف والفرز السريري | Clinical Triage Matrix](#4-مصفوفة-التصنيف-والفرز-السريري--clinical-triage-matrix)
- [5. حوكمة البيانات والخصوصية | Data Governance & Consent Matrix](#5-حوكمة-البيانات-والخصوصية--data-governance--consent-matrix)
- [6. التقنيات والمكتبات المعتمدة | Tech Stack & Tooling](#6-التقنيات-والمكتبات-المعتمدة--tech-stack--tooling)
- [7. هيكل المستودع البرمجي | Repository Structure](#7-هيكل-المستودع-البرمجي--repository-structure)
- [8. دليل التثبيت والتشغيل | Installation & Deployment](#8-دليل-التثبيت-والتشغيل--installation--deployment)
- [9. إخلاء المسؤولية الطبية | Clinical Disclaimer](#9-إخلاء-المسؤولية-الطبية--clinical-disclaimer)
- [10. الرعاية والشكر والتقدير | Acknowledgment](#10-الرعاية-والشكر-والتقدير--acknowledgment)

---

## 1. الملخص التنفيذي | Executive Summary

تُعد الرعاية الصحية المعرفية لكبار السن إحدى أكثر التحديات إلحاحاً في المجتمعات الحديثة، خاصة مع ندرة أدوات المتابعة الوقائية غير الجراحية وغياب التنسيق اللحظي بين كبير السن، الأسرة، والكوادر الطبية.

يقدم **WANIS-AI (ونيس)** نموذجاً ابتكارياً رائداً يجمع بين:
1. **الواجهة الطبيعية الفائقة البساطة**: التفاعل الصوتي الدافئ باللهجات المحلية دون الحاجة لأي معرفة تقنية مسبقة.
2. **الذكاء السريري القائم على الأدلة**: حساب مؤشر **Anticholinergic Cognitive Burden (ACB)** لتفادي التدهور المعرفي والتشوش الذهني الناتج عن تراكم الأدوية.
3. **التنبيه الاستباقي المؤتمت**: رصد تحولات الفرز السريري (من الاستقرار `GREEN` إلى التغير `YELLOW` أو الطوارئ `RED`) وإرسال إشعارات لحظية متعددة القنوات.
4. **حفظ الكرامة والخصوصية**: مصفوفة موافقات ثلاثية المستويات تفصل بين الحوارات الشخصية المشفرة والموجزات الموجهة للعائلة والتقارير الطبية.

---

## 2. البنية المعمارية للنظام | System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     WANIS-AI ARCHITECTURE                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
                                               │
                        ┌──────────────────────┴──────────────────────┐
                        ▼                                             ▼
             ┌─────────────────────┐                       ┌─────────────────────┐
             │   👵 SENIOR CLIENT  │                       │  👨‍👩‍👧 FAMILY & CLINIC │
             │  Voice Check-in UI  │                       │  Dashboard / Brief  │
             └──────────┬──────────┘                       └──────────▲──────────┘
                        │ (Audio / Transcript)                        │
                        ▼                                             │ (SSE / WebSockets)
             ┌────────────────────────────────────────────────────────┴──────────┐
             │                     EXPRESS.JS BACKEND GATEWAY                    │
             │           Authentication • Consent Enforcer • Rate Limiter        │
             └──────────────────────────────────┬────────────────────────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
     ┌───────────────────────┐      ┌───────────────────────┐      ┌───────────────────────┐
     │   GEMINI API ENGINE   │      │   CLINICAL ACB ENGINE │      │  CARE LOOP DISPATCHER │
     │  - Sentiment Analysis │      │  - Drug Burden Score  │      │  - Automated Chimes   │
     │  - Dialect Parsing    │      │  - Delirium Risk Calc │      │  - Browser Push API   │
     │  - Sleep & Mood Score │      │  - Interaction Matrix │      │  - Multi-Channel SMS  │
     └───────────┬───────────┘      └───────────┬───────────┘      └───────────┬───────────┘
                 │                              │                              │
                 └──────────────────────────────┼──────────────────────────────┘
                                                ▼
                               ┌─────────────────────────────────┐
                               │     TRIAGE & PROTOCOL ENGINE    │
                               │  🟢 GREEN  🟡 YELLOW  🔴 RED    │
                               └─────────────────────────────────┘
```

---

## 3. المحاور والوحدات الوظيفية | Core Modules

### 3.1 فحص الاطمئنان الصوتي الذكي | Daily Voice Check-in
* **معالجة الصوت الحواري**: استقبال مدخلات الصوت وتحليلها بمرونة لغوية تراعي خصوصية اللهجات العربية والخليجية.
* **الاستخلاص المعرفي المتعدد الأبعاد**:
  * **جودة ومدة النوم**: استخراج ساعات النوم وأنماط التقطع الليلي.
  * **مؤشر الإجهاد والمزاج**: تقييم نبرة الصوت والمفردات المعبرة عن النشاط أو الإرهاق.
  * **مستوى التواصل الاجتماعي**: رصد التفاعل الأسري والأنشطة اليومية.

---

### 3.2 بروتوكول إشعارات دائرة الرعاية | Automated Care Circle Alerts
* **رصد التحول اللحظي**: انطلاق استجابة فورية مؤتمتة عند تغير الحالة السريرية من خط الأساس (`GREEN ➔ YELLOW` أو `GREEN ➔ RED`).
* **إشعارات متعددة الوسائط**:
  * **نغمات صوتية مركبة**: توليد إشارات صوتية توافقية عبر **Web Audio API** (`playTriageAlertChime`).
  * **إشعارات المتصفح**: بث تنبيهات **Web Push Notifications** حتى أثناء تشغيل التطبيق في الخلفية.
  * **بطاقة التنبيه التفاعلية (`CareCircleTriageToast`)**:
    * مؤشر زمني حي يوضح عدد الثواني المنقضية منذ انطلاق التنبيه (`Timer Badge`).
    * شريط تقدم بصري يوضح مسار التدخل النشط.
    * خلفيات متدرجة ديناميكية ونبضات ضوئية مخصصة لحالات الطوارئ (`RED Alert Pulse Animation`).

---

### 3.3 ملخص العافية اليومي | Daily Wellness Summary
* **نافذة ترحيبية فور تسجيل الدخول**: تُعرض لأفراد العائلة ومقدمي الرعاية عند فتح بوابة الأسرة.
* **تجميع شامل وموحد**: دمج نتائج الفحص الصوتي الصباحي، نسبة الالتزام بالأدوية، ومؤشر ACB في شاشة موحدة سهلة القراءة.
* **توصيات إرشادية فورية**: نصائح مبنية على بيانات اليوم (مثل زيادة الترطيب، أو التواصل الهاتفي مع الوالدة).

---

### 3.4 محرك العبء المعرفي للأدوية | ACB Risk Engine
* **الوقاية من التدهور المعرفي (Anticholinergic Cognitive Burden)**:
  * حساب التراكم الكوليني للأدوية اليومية وفق المعايير السريرية المعتمدة عالمياً.
  * تنبيه الأطباء والعائلة عند تجاوز المؤشر للحد الحرج (Score ≥ 3).
* **مركز التذكير بالأدوية**:
  * واجهة بصرية مزودة بصور حقيقية للأقراص والجرعات لتفادي الالتباس.
  * تأكيد التناول الصوتي وتحديث حالة الالتزام اللحظي.

---

### 3.5 موجز الطبيب السريري 2.0 | Doctor Brief 2.0
* **تقرير 30/90 يوماً الجاهز للعيادة**: تلخيص المنحنيات المعرفية، استقرار النوم، والالتزام الدوائي قبل موعد الطبيب.
* **التصدير والطباعة الموثقة**: تصدير بصيغة PDF مع الختم الرقمي والتشفير السريري لتسهيل إدراج التقرير في الملف الطبي الإلكتروني (EMR).

---

### 3.6 رفيق الحج والعمرة (رفقة) | Rufqa Pilgrim Safety
* **وضع التائه الذكي (Lost Mode)**:
  * تفعيل بث الطوارئ بمجرد الضغط على زر الاستغاثة.
  * إرسال الإحداثيات المباشرة لمطوف الحملة وأفراد الأسرة.
* **بطاقة الطوارئ الرقمية سداسية اللغات**:
  * دعم كامل لـ: العربية، الإنجليزية، الفرنسية، الأردية، الإندونيسية، والتركية.
  * إمكانية قراءة البطاقة والتحدث الصوتي ببيانات الحاج دون الحاجة لاتصال بالإنترنت.
* **نقاط التجمع وبوابات الحرمين**: أدلة توجيهية مبسطة للعودة لمقر الإقامة بيسر وأمان.

---

### 3.7 محرك دورة الرعاية الثمانية | 8-Stage Continuous Care Loop
تخضع كل عملية فحص وتدخل لدورة حوكمة مغلقة ومسؤولة:
$$\text{OBSERVE} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{ASSESS} \longrightarrow \text{RECOMMEND} \longrightarrow \text{ACT} \longrightarrow \text{SHARE} \longrightarrow \text{FOLLOW-UP} \longrightarrow \text{LEARN}$$

---

## 4. مصفوفة التصنيف والفرز السريري | Clinical Triage Matrix

| مستوى الفرز | الحالة السريرية | المؤشرات المعيارية | الإجراء المؤتمت |
| :--- | :--- | :--- | :--- |
| 🟢 **GREEN** | **مستقر / متوافق مع خط الأساس** | نوم > 6 ساعات • نبرة طبيعية • الالتزام بالأدوية 100% | تحديث سجل العافية اليومي بهدوء |
| 🟡 **YELLOW** | **تغير ملحوظ يستوجب المتابعة** | نوم متقطع (< 5 ساعات) • إرهاق خفيف • دوخة بسيطة | إشعار دائرة الرعاية الأسرية فورياً عبر SMS والتطبيق |
| 🟠 **ORANGE** | **حذر سريري مرتفع** | مؤشر ACB ≥ 3 • نسيان متكرر • انخفاض ملحوظ في الشهية | إدراج الحالة في أولويات موجز الطبيب القادم |
| 🔴 **RED** | **طوارئ حرجة / استغاثة** | سقوط • ألم حاد • نبرة استغاثة • تفعيل وضع التائه | تصعيد فوري لجميع الأطراف، إطلاق التنبيه النبضي، وتشغيل خط الطوارئ |

---

## 5. حوكمة البيانات والخصوصية | Data Governance & Consent Matrix

تم تصميم نظام **ونيس** ليتوافق مع **نظام حماية البيانات الشخصية السعودي (PDPL)** والمعايير الصحية العالمية:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TIERED CONSENT ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  🔒 TIER 1: PRIVATE SENIOR DATA                                             │
│  - Raw voice audio recordings and private emotional reflections.            │
│  - Encrypted at rest, never shared without explicit on-device consent.      │
├─────────────────────────────────────────────────────────────────────────────┤
│  👨‍👩‍👧 TIER 2: FAMILY SUPPORT DIGEST                                          │
│  - Daily wellness aggregate, medication adherence %, and triage alerts.     │
│  - Shared only with verified Care Circle members.                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  🩺 TIER 3: CLINICAL DECISION SUPPORT & ESCALATION                          │
│  - Longitudinal ACB score, cognitive trend curves, emergency telemetry.     │
│  - Structured for geriatrician review and hospital intake.                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. التقنيات والمكتبات المعتمدة | Tech Stack & Tooling

| المجال | التقنية | الإصدار | الوظيفة الهندسية |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React + TypeScript | `19.0.0` / `5.6` | واجهة مستخدم سريعة، تفاعلية، وقوية النمط البرمجي |
| **Styling Engine** | Tailwind CSS 4 | `@tailwindcss/vite` | تصميم عصري متجاوب يدعم RTL والوضع الليلي |
| **AI SDK** | `@google/genai` | Modern SDK | التحليل الصوتي واستخراج المؤشرات السريرية عبر Gemini |
| **Backend & Routing**| Express.js | `4.21.2` | خادم API آمن لمعالجة الطلبات وحماية المفاتيح السرية |
| **Audio Engine** | Web Audio API | Native Browser | توليد النغمات الصوتية التوافقية متعددة الترددات |
| **Bundler & Build** | Vite + ESBuild | `6.2.0` | حزم التطبيق بأعلى كفاءة لبيئات الحاويات السحابية |
| **Icons & Visuals** | Lucide React | Latest | منظومة أيقونات متكاملة وموحدة |

---

## 7. هيكل المستودع البرمجي | Repository Structure

```text
WANIS-AI/
├── src/
│   ├── components/
│   │   ├── SeniorMode/              # واجهات رفيق كبير السن، الفحص الصوتي، وقائمة الأدوية
│   │   ├── FamilyMode/              # بوابة العائلة، ملخص العافية، ولوحة تنبيهات دائرة الرعاية
│   │   ├── ClinicianMode/           # لوحة الطبيب الاستشارية وموجز Doctor Brief 2.0
│   │   ├── RufqaMode/               # رفيق الحج والعمرة (وضع التائه ونقاط الحرم)
│   │   ├── OrchestratorMode/        # محرك دورة الرعاية الثمانية وسجل التدقيق المباشر
│   │   ├── InvestorMode/            # الجناح الاستراتيجي ومؤشرات الأداء والقيمة المضافة
│   │   ├── Notifications/           # بطاقات التنبيه اللحظية (CareCircleTriageToast, MedToast)
│   │   ├── EmergencyCard/           # بطاقة الطوارئ الرقمية متعددة اللغات
│   │   ├── Walkthrough/             # الجولة التعريفية التفاعلية ومركز المساعدة
│   │   └── Navbar.tsx               # شريط التنقل الرئيسي والتحكم باللغات والشخصيات
│   ├── services/
│   │   ├── api.ts                   # واجهة الاتصال بنماذج Gemini API وخادم Backend
│   │   ├── notificationService.ts   # خدمة النغمات الصوتية وإشعارات Push Notification
│   │   └── wellnessSummaryService.ts # محرك تجميع ملخص العافية اليومي للأسرة
│   ├── data/
│   │   ├── mockData.ts              # البيانات السريرية وسجلات الفحص التاريخية
│   │   ├── i18n.ts                  # القاموس اللغوي الثلاثي (العربية، الإنجليزية، الفرنسية)
│   │   ├── emergencyCardData.ts     # نصوص بطاقة الطوارئ باللغات الست
│   │   └── walkthroughData.ts       # محتوى الشروحات والأدلة الإرشادية
│   ├── types.ts                     # تعريفات النماذج والأنماط (TypeScript Interfaces & Types)
│   ├── index.css                    # استيراد وتخصيص Tailwind CSS والخطوط
│   ├── App.tsx                      # المكون الجذري وإدارة الحالات العامة للتطبيق
│   └── main.tsx                     # نقطة انطلاق تطبيق React
├── server.ts                        # خادم Express الآمن لمعالجة طلبات الذكاء الاصطناعي
├── metadata.json                    # إعدادات الصلاحيات والميزات في بيئة AI Studio
├── package.json                     # تعريف الاعتماديات وأوامر التشغيل
└── README.md                        # التوثيق الشامل والاحترافي للنظام
```

---

## 8. دليل التثبيت والتشغيل | Installation & Deployment

### المتطلبات الأساسية
* بيئة تشغيل **Node.js** (الإصدار `18.x` أو أعلى).
* مفتاح وصول **Google Gemini API Key** من [Google AI Studio](https://aistudio.google.com/).

### خطوات التشغيل المحلي (Development)

```bash
# 1. استنساخ المستودع
git clone https://github.com/4-u1/WANIS-AI.git
cd WANIS-AI

# 2. تثبيت الحزم البرمجية
npm install

# 3. إعداد متغيرات البيئة
cp .env.example .env
# قم بإدخال مفتاح Gemini الخاص بك داخل ملف .env:
# GEMINI_API_KEY=your_gemini_api_key_here

# 4. تشغيل خادم التطوير المتكامل (Backend + Frontend)
npm run dev
```

التطبيق سيعمل مباشرة عبر المنفذ: `http://localhost:3000`

### بناء نسخة الإنتاج (Production Build)

```bash
# بناء ملفات الواجهة المجمعة وتجميع خادم Express
npm run build

# تشغيل خادم الإنتاج
npm start
```

### رابط المنصة المباشر على السحابة (Live Cloud Deployment)

يمكن الوصول إلى النسخة السحابية المنشورة والمباشرة عبر الرابط التالي:
🌐 **[https://wanisai-senior-cognitive-intelligence-467968797278.europe-west2.run.app](https://wanisai-senior-cognitive-intelligence-467968797278.europe-west2.run.app)**

---

## 9. إخلاء المسؤولية الطبية | Clinical Disclaimer

> **تنبيه سريري هام**: يُعد نظام **WANIS-AI (ونيس)** أداة تقنية مساندة لدعم اتخاذ القرار والمتابعة الوقائية، ولا يُعتبر بديلاً عن الاستشارة الطبية المتخصصة، التشخيص السريري، أو خدمات الطوارئ والإسعاف المباشرة. يجب دائماً الرجوع للطبيب المختص عند اتخاذ القرارات العلاجية أو عند مواجهة أي طارئ صحي حاد.

---

## 10. الرعاية والشكر والتقدير | Acknowledgment

<div align="center">

تم تطوير وبناء هذا المشروع ضمن مسار  
**هندسة الأوامر والاستخدام المسؤول للذكاء الاصطناعي**  
تحت إشراف ورعاية  
**الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)**  
**أكاديمية سدايا — [@SDAIAAcademy](https://github.com/SDAIAAcademy)**  
*مبادرة صيف المستقبل 2026*

<br>

**صُنع ببالغ العناية والمسؤولية لخدمة كبار السن وضيوف الرحمن 🇸🇦**  
*Engineered with clinical precision for senior dignity, autonomy, and family peace of mind.*

</div>
