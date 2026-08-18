<div align="center">

# 🧠 WANIS-AI (ونيس)
### منصة الرعاية الصحية المعرفية والذكاء السريري لكبار السن
### Senior Cognitive Health & Care Intelligence Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📌 نظرة عامة | Overview

**WANIS-AI (ونيس)** هو نظام بيئي متكامل وذكي للرعاية الصحية المعرفية لكبار السن، مصمم بمسؤولية سريرية وذكاء ثقافي عميق يلائم البيئة العربية والخليجية. يجمع النظام بين الذكاء الاصطناعي التوليدي والتحليل الصوتي الحواري ونظم الرعاية المستمرة لتقديم تجربة وقائية وتفاعلية تحفظ استقلالية كبار السن وتمنح عائلاتهم الطمأنينة الكاملة.

**WANIS-AI** is a comprehensive, clinically responsible, and culturally attuned senior cognitive health ecosystem. By combining multimodal voice intake, deterministic clinical risk assessment, automated Care Circle notification protocols, and longitudinal geriatric tracking, Wanis bridges the gap between seniors, families, and healthcare providers.

---

## ✨ المميزات الرئيسية | Core Capabilities

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                             WANIS-AI ECOSYSTEM                              │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│  👵 SENIOR MODE   │  👨‍👩‍👧 FAMILY PORTAL  │  🩺 CLINICIAN 2.0 │  🕋 RUFQA HAJJ  │
│  Simple Voice UI  │  Wellness Summary │  Doctor Brief 2.0 │  Lost Mode      │
│  Med Adherence    │  Care Circle SMS  │  ACB Risk Engine  │  Emergency Card │
│  Warm Dialogues   │  Live Activity    │  Trend Analytics  │  Tawafa Hotline │
└───────────────────┴───────────────────┴───────────────────┴─────────────────┘
```

### 1. 🎙️ فحص الاطمئنان الصوتي اليومي | Daily Voice Check-in
* **حوار طبيعي ودود**: التحدث مع الوالدين باللهجة الحجازية والعربية الفصحى مع واجهة مبسطة للغاية خالية من التعقيد.
* **التحليل المعرفي الصوتي**: استخلاص مؤشرات جودة النوم، مستوى الإرهاق، الحالة المزاجية، والتواصل الاجتماعي تلقائياً.
* **محرك تصنيف أمان سريري (Triage)**:
  * 🟢 **GREEN**: استقرار تام وتوافق مع خط الأساس الطبيعي.
  * 🟡 **YELLOW**: تغير ملحوظ (قلة نوم، إرهاق) يستوجب متابعة العائلة.
  * 🟠 **ORANGE**: مؤشرات تستدعي مراجعة الطبيب المعالج.
  * 🔴 **RED**: طوارئ حرجة (سقوط، ألم حاد) تستدعي تدخلاً فورياً.

### 2. 🚨 تنبيهات دائرة الرعاية التلقائية | Automated Care Circle Alerts
* **رصد التحولات السريرية**: إشعار فوري عند تحول حالة الوالد/الوالدة من **`GREEN`** إلى **`YELLOW`** أو **`RED`**.
* **تنبيهات صوتية ودفع فوري**: نغمات صوتية مركبة عبر Web Audio API مع إشعارات متصفح Push API ورسائل SMS تلقائية.
* **مؤشر زمني مباشر**: بطاقة إشعار تفاعلية مزودة بعداد زمني يُظهر لحظة انطلاق التنبيه وعدد الثواني المنقضية ومسار الرعاية النشط.
* **سجل تدقيق الإشعارات**: لوحة مخصصة في بوابة العائلة لتوثيق جميع الإرساليات لأفراد العائلة والأطباء.

### 3. 📊 ملخص العافية والاطمئنان اليومي | Daily Wellness Summary
* **نافذة ترحيبية ذكية**: تظهر لأفراد العائلة فور تسجيل الدخول لتقديم موجز شامل عن صحة الوالد/الوالدة اليوم.
* **تجميع البيانات الحيوية**: دمج نتائج الفحص الصوتي، نسبة الالتزام بالأدوية، وتحديثات العبء المعرفي في تقرير واحد سريع القراءة.

### 4. 💊 ذكاء العبء المعرفي للأدوية | Anticholinergic Cognitive Burden (ACB)
* **حماية الذاكرة**: حساب تراكمي لمؤشر ACB للأدوية المتناولة لتفادي التدهور المعرفي أو التشوش الذهني الناتج عن التفاعلات الدوائية.
* **مركز التذكير بالأدوية**: تذكيرات صوتية وبصرية مع صور واضحة للأقراص والجرعات، وتأكيد التناول بنقرة واحدة.

### 5. 🩺 موجز الطبيب المتقدم 2.0 | Clinician & Doctor Brief 2.0
* **تقرير سريري جاهز للطبيب**: يلخص التاريخ الصحي المعرفي على مدار 30 و90 يوماً قبل موعد المريض.
* **تصدير وطباعة موثقة**: إمكانية تصدير التقرير بتنسيق PDF أو طباعته مع ختم التوثيق السريري والتشفير الرياضي للبيانات.

### 6. 🕋 رفقة — أمان الحاج والمعتمر | Rufqa Hajj & Umrah Companion
* **وضع التائه (Lost Mode)**: بث مباشر لإحداثيات الحاج إلى أسرته ومرشد الحملة (المطوف).
* **بطاقة الطوارئ الرقمية متعددة اللغات**: بطاقة ذكية تدعم 6 لغات (العربية، الإنجليزية، الفرنسية، الأردية، الإندونيسية، التركية) قابلة للترجمة الفورية دون اتصال.
* **نقاط التجمع في الحرم**: تحديد موقع الفندق وبوابات الحرم بنقرة واحدة.

### 7. 🔄 محرك دورة الرعاية الثمانية | Agentic 8-Stage Care Loop
* دورة رعاية مستمرة وشفافة تشمل: **الملاحظة ➔ الفهم ➔ التقييم ➔ التوصية ➔ التنفيذ ➔ المشاركة ➔ المتابعة ➔ التعلم**.
* سجل تدقيق كامل (Audit Log) مع تحديد صلاحيات الخصوصية ومستويات الموافقة (Tier 1, Tier 2, Tier 3).

---

## 🛠️ البنية التقنية | Architecture & Tech Stack

| الطبقة | التقنية المستخدمة | الوظيفة |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + TypeScript** | واجهة مستخدم سريعة ومتوافقة مع أعلى معايير الأمان |
| **Styling & Design** | **Tailwind CSS 4** | تصميم متجاوب فائق الأناقة مع دعم كامل للوضع الداكن و RTL |
| **AI Orchestration** | **Google Gemini (`@google/genai`)** | التحليل الصوتي واستخلاص المؤشرات السريرية ونماذج الرعاية |
| **Backend & API** | **Node.js + Express.js** | خادم متكامل آمن للتعامل مع المفاتيح وواجهات البرمجة |
| **Audio Processing** | **Web Audio API + Speech Synthesis** | توليد نغمات التنبيه التوافقية والتوجيه الصوتي بالعربية والإنجليزية |
| **Build & Bundler** | **Vite 6 + ESBuild** | حزم التطبيق بأعلى أداء وزمن تشغيل فائق السرعة |
| **Icons & Visuals** | **Lucide React + Motion** | أيقونات موحدة وحركات تفاعلية سلسة |

---

## 📁 هيكل المجلدات | Project Directory Structure

```text
WANIS-AI/
├── src/
│   ├── components/
│   │   ├── SeniorMode/              # واجهات رفيق كبار السن والفحص الصوتي
│   │   ├── FamilyMode/              # بوابة العائلة وملخص العافية وتنبيهات دائرة الرعاية
│   │   ├── ClinicianMode/           # لوحة الطبيب وتقرير Doctor Brief 2.0
│   │   ├── RufqaMode/               # رفيق الحج والعمرة ووضع التائه
│   │   ├── OrchestratorMode/        # محرك دورة الرعاية الثمانية وسجل التدقيق
│   │   ├── InvestorMode/            # الجناح التنفيذي ومؤشرات الأداء الاستراتيجية
│   │   ├── Notifications/           # إشعارات الأدوية وتنبيهات CareCircleTriageToast
│   │   ├── EmergencyCard/           # بطاقة الطوارئ الرقمية متعددة اللغات
│   │   ├── Walkthrough/             # الجولة الإرشادية ومركز الشروحات
│   │   └── Navbar.tsx               # شريط التنقل العلوي وتبديل اللغات والشخصيات
│   ├── services/
│   │   ├── api.ts                   # واجهات الاتصال بالذكاء الاصطناعي وخادم Express
│   │   ├── notificationService.ts   # محرك النغمات الصوتية وإشعارات Push Web API
│   │   └── wellnessSummaryService.ts # خدمة تجميع تقارير العافية اليومية
│   ├── data/
│   │   ├── mockData.ts              # البيانات السريرية وسجلات الفحص الأولية
│   │   ├── i18n.ts                  # القاموس اللغوي الثلاثي (العربية، الإنجليزية، الفرنسية)
│   │   ├── emergencyCardData.ts     # بيانات بطاقات الطوارئ وترجماتها
│   │   └── walkthroughData.ts       # محتوى الشروحات التفاعلية
│   ├── types.ts                     # تعريفات TypeScript ونماذج البيانات الشاملة
│   ├── index.css                    # تنسيقات Tailwind CSS وخطوط الواجهة
│   ├── App.tsx                      # المكون الرئيسي وتنسيق حالات النظام
│   └── main.tsx                     # نقطة دخول تطبيق React
├── server.ts                        # خادم Express ومسارات معالجة Gemini API
├── metadata.json                    # بيانات المشروع والصلاحيات المطلوبة
├── package.json                     # الحزم والمكتبات المعتمدة
└── README.md                        # التوثيق الشامل للنظام
```

---

## 🚀 البدء والتشغيل | Getting Started

### المتطلبات الأساسية | Prerequisites
* **Node.js** الإصدار 18 فما فوق.
* **مفتاح Google Gemini API** (احصل عليه من [Google AI Studio](https://aistudio.google.com/)).

### خطوات التثبيت والتشغيل | Installation Steps

```bash
# 1. استنساخ المستودع
git clone https://github.com/4-u1/WANIS-AI.git
cd WANIS-AI

# 2. تثبيت الحزم والمكتبات
npm install

# 3. إعداد متغيرات البيئة
cp .env.example .env
# افتح ملف .env وأضف المفتاح الخاص بك:
# GEMINI_API_KEY=your_actual_gemini_api_key_here

# 4. تشغيل خادم التطوير
npm run dev

# 5. بناء نسخة الإنتاج
npm run build
npm start
```

سيكون التطبيق متاحاً على الرابط: `http://localhost:3000`

---

## 🔒 الخصوصية ومصفوفة الموافقات | Privacy & Consent Matrix

يلتزم نظام **WANIS-AI** بأعلى معايير حماية البيانات والخصوصية الصحية من خلال ثلاث طبقات موافقة محكمة:
1. **Tier 1 (Private Senior Data)**: التسجيلات الصوتية والمحادثات الشخصية تظل مشفرة ولا تخرج عن جهاز المستخدم إلا بإذن صريح.
2. **Tier 2 (Family Support Digest)**: مشاركة الملخصات المعرفية العامة ونسب تناول الأدوية وتنبيهات تغير الحالة مع العائلة دون المساس بخصوصية الحوار.
3. **Tier 3 (Clinical Escalation)**: إتاحة تقارير مفصلة للطبيب المعالج وفريق الطوارئ عند حدوث أي تصعيد سريري أو تفعيل وضع التائه.

---

## ⚠️ إخلاء المسؤولية السريرية | Clinical Disclaimer

**WANIS-AI** هو نظام ذكاء اصطناعي لدعم اتخاذ القرار والمتابعة الوقائية، ولا يُعد بديلاً عن الفحص الطبي المتخصص أو التشخيص السريري المباشر. يُرجى دائماً استشارة الطبيب المعالج أو الاتصال بالطوارئ الطبية عند حدوث أي طارئ صحي حاد.

*WANIS-AI is an assistive clinical decision-support ecosystem and does not replace licensed medical professionals or emergency response teams. Always consult a qualified geriatrician or physician for medical advice.*

---

## 🏛️ الجهة الراعية والتقدير | Acknowledgment

<div align="center">

تم تطوير هذا المشروع ضمن برنامج  
**هندسة الأوامر والاستخدام المسؤول للذكاء الاصطناعي**  
بإشراف  
**الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)**  
**أكاديمية سدايا — [@SDAIAAcademy](https://github.com/SDAIAAcademy)**  
*صيف المستقبل 2026*

*Developed under the supervision of the Saudi Data and AI Authority (SDAIA) Academy — Summer of the Future 2026.*

</div>

---

<div align="center">

صُنع بـ 🤍 لخدمة كبار السن وضيوف الرحمن 🇸🇦  
**Engineered with precision for senior dignity and peace of mind.**

</div>
