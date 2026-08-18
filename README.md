<div align="center">

# 🧠 WANIS-AI

### منصة الرعاية الصحية المعرفية الذكية لكبار السن
### Senior Cognitive Health & Care Intelligence Platform

</div>

---

## 📌 نظرة عامة | Overview

**WANIS-AI** هو نظام بيئي متكامل وذكي للرعاية الصحية المعرفية لكبار السن، مصمم بمسؤولية سريرية وذكاء ثقافي. يجمع بين أحدث تقنيات الذكاء الاصطناعي التوليدي وأفضل ممارسات الرعاية الصحية لتقديم تجربة رعاية شاملة ومستمرة.

**WANIS-AI** is a clinically responsible, culturally intelligent senior cognitive wellbeing ecosystem featuring continuous care orchestration, advanced medication intelligence, and a dedicated Hajj/Umrah companion.

---

## ✨ المميزات الرئيسية | Key Features

### 🔄 Continuous Care Orchestration
رعاية مستمرة ومتكاملة تتابع الحالة الصحية المعرفية لكبار السن على مدار الساعة مع تنسيق ذكي بين مختلف جوانب الرعاية.

### 💊 Anticholinergic Cognitive Burden (ACB) Intelligence
نظام ذكي لتحليل العبء المعرفي الناتج عن الأدوية المضادة للكولين، يساعد الأطباء والمرضى على اتخاذ قرارات دوائية أكثر أماناً لصحة الدماغ.

### 📋 Doctor Brief 2.0
ملخص طبي ذكي ومحدّث يُقدّم للطبيب صورة شاملة عن حالة المريض قبل كل زيارة، موفراً الوقت ومحسّناً جودة الرعاية.

### 🕋 Rufqa — Hajj & Umrah Companion
رفيق ذكي مخصص لكبار السن أثناء أداء الحج والعمرة، يوفر إرشاداً صحياً وتتبع الموقع والدعم الطارئ مع مراعاة الخصوصية الثقافية.

### 🎙️ Voice Interaction
واجهة صوتية تفاعلية تتيح لكبار السن التواصل بشكل طبيعي دون الحاجة لمهارات تقنية.

---

## 🛠️ التقنيات المستخدمة | Tech Stack

| الطبقة | التقنية |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Node.js, Express.js |
| **AI Engine** | Google Gemini AI (`@google/genai`) |
| **Build Tool** | Vite 6 |
| **Animations** | Motion (Framer Motion) |
| **Icons** | Lucide React |

---

## 🚀 تشغيل المشروع | Getting Started

### المتطلبات | Prerequisites
* **Node.js** >= 18
* **مفتاح Gemini API** — احصل عليه من [Google AI Studio](https://aistudio.google.com/)

### التثبيت | Installation

```bash
# 1. استنساخ المشروع
git clone https://github.com/4-u1/WANIS-AI.git
cd WANIS-AI

# 2. تثبيت المكتبات
npm install

# 3. إعداد متغيرات البيئة
cp .env.example .env
# افتح .env وأضف مفتاح Gemini API الخاص بك
```

### متغيرات البيئة | Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### التشغيل | Run

```bash
# وضع التطوير
npm run dev

# بناء الإنتاج
npm run build
npm start
```

---

## 📁 هيكل المشروع | Project Structure

```text
WANIS-AI/
├── src/                  # الكود الرئيسي للواجهة
├── assets/
│   └── .aistudio/        # إعدادات Google AI Studio
├── server.ts             # خادم Express.js
├── index.html            # نقطة دخول HTML
├── metadata.json         # بيانات المشروع
├── vite.config.ts        # إعدادات Vite
├── tsconfig.json         # إعدادات TypeScript
├── .env.example          # نموذج متغيرات البيئة
└── package.json
```

---

## 🔒 الصلاحيات المطلوبة | Permissions Required

| الصلاحية | الغرض |
| :--- | :--- |
| 🎙️ **Microphone** | التفاعل الصوتي مع كبار السن |
| 📍 **Geolocation** | تتبع الموقع لرفيق الحج والعمرة |

---

## 🏛️ الجهة الداعمة | Acknowledgment

<div align="center">

تم تطوير هذا المشروع ضمن برنامج  
**هندسة الأوامر والاستخدام المسؤول للذكاء الاصطناعي**  
بإشراف  
**الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)**  
**أكاديمية سدايا — [@SDAIAAcademy](https://github.com/SDAIAAcademy)**  

*This project was developed as part of the Prompt Engineering & Responsible AI Use workshop by Saudi Data and AI Authority (SDAIA) Academy ([@SDAIAAcademy](https://github.com/SDAIAAcademy)) — Summer of the Future 2026*

</div>

---

## ⚠️ إخلاء المسؤولية الطبية | Medical Disclaimer

**WANIS-AI** هو أداة دعم قرار مساعدة ولا يُغني عن الاستشارة الطبية المتخصصة. جميع المعلومات المُقدّمة للأغراض التعليمية والتوجيهية فقط. يجب دائماً استشارة طبيب مختص قبل اتخاذ أي قرار طبي.

*WANIS-AI is a decision-support tool and does not replace professional medical advice. Always consult a qualified healthcare provider.*

---

## 📄 الرخصة | License

هذا المشروع مرخص تحت رخصة **MIT** — راجع ملف [LICENSE](LICENSE) للتفاصيل.

<br/>

<div align="center">

صُنع بـ 🤍 في المملكة العربية السعودية  
**Made with 🤍 in Saudi Arabia 🇸🇦**

</div>
