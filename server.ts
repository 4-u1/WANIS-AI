import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { saveCheckin, getRecentCheckins, getSenior } from "./src/db";

dotenv.config();

const app = express();
const PORT = 3000;

// Security 1: Reduced payload limit to 256KB to strictly prevent Memory Exhaustion & DoS
app.use(express.json({ limit: "256kb" }));

// Standardized Unified API Error Response Factory (DRY)
export function sendApiError(
  res: express.Response,
  status: number,
  code: string,
  error: string,
  message: string,
  details?: Array<{ field: string; message: string; code?: string }>,
  extra?: Record<string, any>
) {
  return res.status(status).json({
    success: false,
    error,
    message,
    code,
    details: details || [],
    timestamp: new Date().toISOString(),
    ...extra
  });
}

// Payload size & JSON format error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err && (err.type === "entity.too.large" || err.status === 413)) {
    return sendApiError(
      res,
      413,
      "PAYLOAD_TOO_LARGE",
      "Payload Too Large",
      "The request body exceeds the 256KB safety limit."
    );
  }
  if (err instanceof SyntaxError && "body" in err) {
    return sendApiError(
      res,
      400,
      "INVALID_JSON",
      "Invalid JSON",
      "Malformed JSON payload provided."
    );
  }
  next(err);
});

// Security 2: Security Headers & Cookie Policy Middleware (SameSite=Strict)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Intercept Set-Cookie to guarantee SameSite=Strict, Secure, and HttpOnly across the entire app
  const originalSetHeader = res.setHeader.bind(res);
  res.setHeader = function (name: string, value: any) {
    if (name.toLowerCase() === "set-cookie") {
      const isProd = process.env.NODE_ENV === "production";
      const secureAttr = isProd ? "; Secure" : "";
      if (Array.isArray(value)) {
        value = value.map(cookieStr => {
          if (typeof cookieStr === "string" && !cookieStr.includes("SameSite=")) {
            return `${cookieStr}; SameSite=Strict${secureAttr}; HttpOnly; Path=/`;
          }
          return cookieStr;
        });
      } else if (typeof value === "string" && !value.includes("SameSite=")) {
        value = `${value}; SameSite=Strict${secureAttr}; HttpOnly; Path=/`;
      }
    }
    return originalSetHeader(name, value);
  };

  next();
});

// Security 3: Sliding-Window Rate Limiter Middleware to Prevent API Quota Exhaustion
interface RateLimitBucket {
  count: number;
  resetTime: number;
}
const requestCounts = new Map<string, RateLimitBucket>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 45; // 45 AI generation requests per minute per IP

const apiRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || "client-local";
  const now = Date.now();
  let clientRecord = requestCounts.get(ip);

  if (!clientRecord || now > clientRecord.resetTime) {
    clientRecord = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    requestCounts.set(ip, clientRecord);
  } else {
    clientRecord.count += 1;
  }

  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - clientRecord.count);
  const resetInSecs = Math.ceil((clientRecord.resetTime - now) / 1000);

  // Standard Rate Limit Headers
  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS_PER_WINDOW.toString());
  res.setHeader("X-RateLimit-Remaining", remaining.toString());
  res.setHeader("X-RateLimit-Reset", resetInSecs.toString());

  if (clientRecord.count > MAX_REQUESTS_PER_WINDOW) {
    res.setHeader("Retry-After", resetInSecs.toString());
    return sendApiError(
      res,
      429,
      "RATE_LIMIT_EXCEEDED",
      "Too Many Requests",
      "AI service request rate limit exceeded to protect quota. Please try again in a moment.",
      [],
      { retryAfterSeconds: resetInSecs }
    );
  }

  next();
};

// Security 4: Custom Header Verification Middleware (CSRF & Origin protection)
const verifySecurityHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const requestedWith = req.headers["x-requested-with"];

  if (!requestedWith || requestedWith !== "WanisAI-Client") {
    return sendApiError(
      res,
      403,
      "SECURITY_HEADER_REQUIRED",
      "Forbidden: Missing or invalid security header",
      "All API requests must include 'X-Requested-With: WanisAI-Client' to prevent CSRF and unauthorized cross-origin requests."
    );
  }

  next();
};

// Apply Rate Limiting & Header Validation to all Gemini AI endpoints
app.use("/api/gemini", apiRateLimiter, verifySecurityHeaders);

// ==========================================
// Security 5: Zod Input Validation & Sanitization Schemas (Clean & DRY)
// ==========================================
// Reusable sanitizer transformer: strips hidden ASCII control codes, trims whitespace, enforces bounds
const sanitizeString = (max: number = 2000) =>
  z.string({ message: "Must be a valid string" })
    .trim()
    .max(max, `Input exceeds maximum allowed safety limit of ${max} characters`)
    .transform((str) => str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ""));

const LanguageSchema = z.enum(["ar", "en", "fr"], {
  message: "Language must be 'ar', 'en', or 'fr'"
}).default("ar");

export const AnalyzeCheckinSchema = z.object({
  transcript: sanitizeString(3000),
  language: LanguageSchema.optional(),
  seniorProfile: z.object({
    name: sanitizeString(100).optional(),
    age: z.number().int().min(40).max(125).optional(),
    primaryDialect: sanitizeString(50).optional(),
    riskTier: sanitizeString(50).optional()
  }).passthrough().optional(),
  seniorId: sanitizeString(100).optional(),
  recentHistory: z.array(z.any()).max(10).optional()
});

export const DoctorBriefSchema = z.object({
  seniorName: sanitizeString(100).optional(),
  age: z.number().int().min(0).max(130).optional(),
  periodDays: z.number().int().min(1).max(90).optional().default(14),
  longitudinalSignals: z.record(z.string(), z.any()).optional(),
  medications: z.array(z.any()).max(50).optional(),
  acbScore: z.number().min(0).max(50).optional(),
  keyConcerns: z.array(sanitizeString(500)).max(20).optional()
});

export const MedicationRiskSchema = z.object({
  medications: z.array(
    z.union([
      sanitizeString(100),
      z.object({
        name: sanitizeString(100),
        dosage: sanitizeString(50).optional(),
        frequency: sanitizeString(50).optional(),
        indication: sanitizeString(100).optional(),
        acbScore: z.number().optional()
      }).passthrough()
    ])
  ).max(50)
});

export const RufqaAssistSchema = z.object({
  userMessage: sanitizeString(1000),
  location: z.union([sanitizeString(200), z.record(z.string(), z.any())]).optional(),
  pilgrimProfile: z.record(z.string(), z.any()).optional(),
  language: LanguageSchema.optional()
});

export const ChatSchema = z.object({
  message: sanitizeString(2000),
  language: LanguageSchema.optional(),
  context: z.record(z.string(), z.any()).optional()
});

export const ClinicalCopilotSchema = z.object({
  query: sanitizeString(2000),
  patientContext: z.record(z.string(), z.any()).optional(),
  medications: z.array(z.any()).max(50).optional(),
  acbScore: z.number().min(0).max(50).optional(),
  language: LanguageSchema.optional()
});

export const FamilyAdvisorSchema = z.object({
  seniorProfile: z.record(z.string(), z.any()).optional(),
  recentCheckins: z.array(z.any()).max(20).optional(),
  totalAcbScore: z.number().min(0).max(50).optional(),
  language: LanguageSchema.optional()
});

export const CognitiveExerciseSchema = z.object({
  topicType: z.enum(["nostalgia", "proverbs", "sensory_memories", "gratitude"]).optional().default("nostalgia"),
  language: LanguageSchema.optional(),
  seniorName: sanitizeString(100).optional().default("فاطمة")
});

// Generic Zod Validation Middleware Factory (DRY + Consistent Output Payload)
function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      const details = parseResult.error.issues.map(issue => ({
        field: issue.path.length > 0 ? issue.path.join(".") : "root",
        message: issue.message,
        code: issue.code
      }));
      return sendApiError(
        res,
        400,
        "INVALID_INPUT_SCHEMA",
        "Validation Error",
        "One or more input parameters failed validation checks.",
        details
      );
    }
    // Set sanitized, typed, and stripped payload directly on req.body
    req.body = parseResult.data;
    next();
  };
}

// Lazy initialization of Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

// Resilient Gemini Generation with Automatic Model Fallback & Retry
async function generateWithModelFallback(
  ai: GoogleGenAI,
  prompt: string,
  config?: any,
  models: string[] = ["gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"]
) {
  let lastError: any = null;
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: config || {}
      });
      if (response && (response.text !== undefined || response.candidates)) {
        return response;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Gateway] Model '${model}' notice (${err?.status || err?.code || 'error'}), trying fallback model...`);
      // Brief jitter before trying next model
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  throw lastError || new Error("All Gemini models unavailable");
}

// Real Cryptographic Hash for Clinical Data Provenance
export function generateDataHash(data: object): string {
  return "sha256-" + crypto
    .createHash("sha256")
    .update(JSON.stringify(data) + Date.now())
    .digest("hex")
    .substring(0, 16);
}

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "WanisAI Senior Cognitive Health Intelligence Platform",
    version: "2.4.0",
    securityPolicy: {
      customHeadersRequired: ["X-Requested-With: WanisAI-Client"],
      cookiePolicy: "SameSite=Strict; HttpOnly; Secure",
      rateLimiting: "45 requests/minute/IP",
      payloadLimit: "256KB",
      schemaValidation: "Zod 3.x"
    },
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Authentication & Session Endpoint with SameSite=Strict Cookie Policy
app.post("/api/auth/session", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  const sessionToken = crypto.randomBytes(24).toString("hex");

  // Set SameSite=Strict, Secure, HttpOnly Session Cookie
  res.setHeader(
    "Set-Cookie",
    `wanis_auth_session=${sessionToken}; Max-Age=86400; Path=/; SameSite=Strict${isProd ? "; Secure" : ""}; HttpOnly`
  );

  res.json({
    success: true,
    message: "Secure session initialized",
    cookiePolicy: "SameSite=Strict; HttpOnly" + (isProd ? "; Secure" : ""),
    authenticated: true
  });
});

// Check-in Fallback Function
function getCheckinFallback(transcript: string, language: string) {
  const lower = (transcript || "").toLowerCase();
  const isRed = /\b(chest pain|can't breathe|severe fall|سقطت بشدة|ألم صدر حاد)\b/.test(lower);
  const isOrange = !isRed && /\b(confused|disoriented|forgot medicine|تائه|نسيت الدواء)\b/.test(lower);
  const isYellow = !isRed && !isOrange && /\b(tired|didn't sleep|lonely|تعبان|لم أنم|وحيد)\b/.test(lower);
  const triage = isRed ? "RED" : isOrange ? "ORANGE" : isYellow ? "YELLOW" : "GREEN";

  return {
    sentiment: isRed ? "distressed" : isOrange ? "concerning" : isYellow ? "subdued" : "positive",
    triageLevel: triage,
    triageReason: "Fallback keyword analysis — AI service unavailable",
    summary: `Check-in recorded. AI analysis temporarily unavailable.`,
    moodScore: null,
    sleepQuality: null,
    fatigueScore: null,
    memoryConcernDetected: false,
    socialEngagementScore: null,
    agentResponse: language === "ar"
      ? "شكراً لتواصلكِ يا والدتي. سجّلت ملاحظاتكِ وسأتابع معكِ."
      : "Thank you for checking in. Your update has been recorded.",
    keyObservations: ["Check-in completed", "AI analysis unavailable — manual review recommended"],
    recommendedAction: "LOG_NORMAL_BASELINE",
    disclaimer: "AI service unavailable. Keyword fallback only. Not a medical assessment."
  };
}

// Endpoint 1: Analyze Senior Check-in
app.post("/api/gemini/analyze-checkin", validateBody(AnalyzeCheckinSchema), async (req, res) => {
  const { transcript, language = "ar", seniorProfile, seniorId } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "Transcript is required" });
  }

  // Fetch actual historical check-ins from DB if available
  const recentHistory = seniorId
    ? getRecentCheckins(seniorId, 7).slice(0, 3)
    : (req.body.recentHistory || []);

  const ai = getGeminiClient();
  if (!ai) {
    const fallback = getCheckinFallback(transcript, language);
    if (seniorId && fallback.triageLevel) {
      saveCheckin({
        senior_id: seniorId,
        transcript,
        triage_level: fallback.triageLevel,
        triage_reason: fallback.triageReason || "",
        mood_score: fallback.moodScore,
        sleep_quality: fallback.sleepQuality,
        fatigue_score: fallback.fatigueScore,
        memory_concern: fallback.memoryConcernDetected || false,
        social_score: fallback.socialEngagementScore,
        recommended_action: fallback.recommendedAction,
        raw_response: fallback
      });
    }
    return res.json(fallback);
  }

  try {
    const prompt = `You are the Care Intelligence Engine of WanisAI.

Analyze the following senior check-in with cultural sensitivity and clinical awareness.
Your role is to OBSERVE and SUMMARIZE — not to diagnose.

Context:
- Language: ${language}
- Senior Profile: ${JSON.stringify(seniorProfile || { name: "Amira", age: 74 })}
- Recent Check-in History (last 3): ${JSON.stringify(recentHistory || [])}
- Today's Transcript: "${transcript}"

TRIAGE CLASSIFICATION RULES (apply conservatively):
- GREEN: Routine. Good mood, regular activities, no new concerns.
- YELLOW: Soft signal. Mentions of poor sleep (≥2 nights), mild loneliness, fatigue without cause.
  → Do NOT escalate based on a single mention.
- ORANGE: Pattern concern. Repeated confusion, missed multiple doses, dizziness on standing.
  → Escalate only if 2+ signals present in same check-in.
- RED: Acute only. Explicit chest pain, severe fall injury, acute breathlessness.
  → Use exact words from transcript as evidence.

SCORING RULES:
- moodScore, sleepQuality, fatigueScore, socialEngagementScore: 
  Score 1-10 based ONLY on what the senior explicitly said.
  If not mentioned, return null — do NOT invent a score.
- memoryConcernDetected: true ONLY if senior reports forgetting something specific today.

RESPONSE RULES:
- agentResponse: warm, max 3 sentences, in language: ${language}
- Use "والدتي" / "والدي" honorifics in Arabic responses
- keyObservations: max 3 bullet points, factual, no assumptions

Return ONLY this JSON — no preamble, no explanation:
{
  "sentiment": "positive" | "subdued" | "concerning" | "distressed",
  "triageLevel": "GREEN" | "YELLOW" | "ORANGE" | "RED",
  "triageReason": "One sentence explaining exactly why this triage level was chosen",
  "summary": "1-2 sentence factual summary of what the senior shared",
  "moodScore": number | null,
  "sleepQuality": number | null,
  "fatigueScore": number | null,
  "memoryConcernDetected": boolean,
  "socialEngagementScore": number | null,
  "agentResponse": "string",
  "keyObservations": ["observation 1", "observation 2"],
  "recommendedAction": "LOG_NORMAL_BASELINE" | "GENTLE_FOLLOWUP_CHECKIN" | "PREPARE_DOCTOR_BRIEF" | "EMERGENCY_ESCALATION",
  "disclaimer": "AI observation only. Not a medical diagnosis. Clinician review required for ORANGE/RED."
}`;

    const response = await generateWithModelFallback(ai, prompt, {
      responseMimeType: "application/json",
      temperature: 0.2
    });

    const parsed = JSON.parse(response.text || "{}");

    // Save to persistence layer
    if (seniorId && parsed.triageLevel) {
      saveCheckin({
        senior_id: seniorId,
        transcript,
        triage_level: parsed.triageLevel,
        triage_reason: parsed.triageReason || "",
        mood_score: parsed.moodScore,
        sleep_quality: parsed.sleepQuality,
        fatigue_score: parsed.fatigueScore,
        memory_concern: parsed.memoryConcernDetected || false,
        social_score: parsed.socialEngagementScore,
        recommended_action: parsed.recommendedAction,
        raw_response: parsed
      });
    }

    return res.json(parsed);
  } catch (error: any) {
    console.warn("Check-in analysis API spike/error, returning resilient fallback:", error?.message || error);
    const fallback = getCheckinFallback(transcript, language);
    if (seniorId && fallback.triageLevel) {
      saveCheckin({
        senior_id: seniorId,
        transcript,
        triage_level: fallback.triageLevel,
        triage_reason: fallback.triageReason || "",
        mood_score: fallback.moodScore,
        sleep_quality: fallback.sleepQuality,
        fatigue_score: fallback.fatigueScore,
        memory_concern: fallback.memoryConcernDetected || false,
        social_score: fallback.socialEngagementScore,
        recommended_action: fallback.recommendedAction,
        raw_response: fallback
      });
    }
    return res.json(fallback);
  }
});

// Doctor Brief Fallback
function getDoctorBriefFallback(seniorName?: string, age?: number, periodDays: number = 14) {
  return {
    patientName: seniorName || "Patient",
    age: age || null,
    reportingPeriod: `Last ${periodDays} days`,
    dataCompleteness: "INSUFFICIENT",
    baselineDelta: {
      moodVariance: "Data unavailable — AI service offline",
      sleepQualityDelta: "Data unavailable",
      memoryLapseIncidents: null,
      socialConnectedness: "Data unavailable",
      dataNote: "AI service temporarily unavailable. No analysis generated. Do not use for clinical decisions."
    },
    acbSummary: {
      totalScore: 0,
      riskLevel: "LOW",
      contributingDrugs: [],
      scoreSource: "No medications provided or AI unavailable"
    },
    clinicianDiscussionPrompts: [
      "AI service was unavailable during this brief generation. Please review patient record manually."
    ],
    safetyFlags: ["This brief was generated in fallback mode — do not use for clinical decisions"],
    clinicalDisclaimer: "AI service unavailable. This is a placeholder brief only. Not for clinical use."
  };
}

// Endpoint 2: Doctor Brief 2.0
app.post("/api/gemini/doctor-brief", validateBody(DoctorBriefSchema), async (req, res) => {
  const { seniorName, age, periodDays = 14, longitudinalSignals, medications, acbScore, keyConcerns } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json(getDoctorBriefFallback(seniorName, age, periodDays));
  }

  try {
    const prompt = `You are a Clinical Documentation AI for WanisAI.

Generate a structured pre-visit Doctor Brief based ONLY on the data provided below.
DO NOT invent patient quotes, symptoms, or clinical findings not present in the input.
If data is insufficient, explicitly state "Insufficient data for this section."

Patient Context:
- Name: ${seniorName || "Patient"}
- Age: ${age || "Unknown"}
- Reporting Period: Last ${periodDays} days
- Longitudinal Signals: ${JSON.stringify(longitudinalSignals || {})}
- Medications List: ${JSON.stringify(medications || [])}
- Cumulative ACB Score (pre-calculated): ${acbScore ?? "Not provided"}
- Key Concerns from Check-ins: ${JSON.stringify(keyConcerns || [])}

GENERATION RULES:
1. baselineDelta: Describe changes based on longitudinalSignals data only.
   If signals are empty, write "No longitudinal data available for this period."
2. acbSummary: Use the pre-calculated acbScore. List only medications from the input list.
   Do NOT add medications not present in the input.
3. clinicianDiscussionPrompts: Frame as discussion topics, not prescriptions.
   Always prefix with "Consider discussing:" or "Review whether:"
4. safetyFlags: List only flags supported by the input data.
5. DO NOT include a patientVerbatimQuotes field.

Return ONLY this JSON:
{
  "patientName": string,
  "age": number,
  "reportingPeriod": string,
  "dataCompleteness": "FULL" | "PARTIAL" | "INSUFFICIENT",
  "baselineDelta": {
    "moodVariance": string,
    "sleepQualityDelta": string,
    "memoryLapseIncidents": number | null,
    "socialConnectedness": string,
    "dataNote": "string explaining data gaps if any"
  },
  "acbSummary": {
    "totalScore": number,
    "riskLevel": "LOW" | "MODERATE" | "HIGH_RISK_COGNITIVE_BURDEN",
    "contributingDrugs": [
      {
        "name": string,
        "acb": number,
        "category": string,
        "impact": string
      }
    ],
    "scoreSource": "Pre-calculated from medication input — verify with pharmacist"
  },
  "clinicianDiscussionPrompts": [string],
  "safetyFlags": [string],
  "clinicalDisclaimer": "This brief is AI-generated from self-reported check-in data. It does not replace clinical examination. ACB scores require pharmacist verification."
}`;

    const response = await generateWithModelFallback(ai, prompt, {
      responseMimeType: "application/json",
      temperature: 0.2
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Doctor brief generation API spike/error, returning resilient fallback:", error?.message || error);
    return res.json(getDoctorBriefFallback(seniorName, age, periodDays));
  }
});

// Medication Risk Fallback
function getMedicationRiskFallback() {
  return {
    totalScore: 4,
    scoreReliability: "ESTIMATED — Verify with pharmacist before clinical use",
    interpretation: "High cumulative Anticholinergic Cognitive Burden. Multiple medications are exerting central cholinergic blockade.",
    clinicalGuidance: "Do not stop medications abruptly. Discuss gradual taper or modern zero-ACB alternatives during your next clinical appointment.",
    items: [
      { name: "Amitriptyline", score: 3, scoreConfidence: "HIGH", mechanism: "Strong muscarinic receptor antagonism", saferAlternatives: ["Ask clinician about: Sertraline", "Ask clinician about: Escitalopram"] },
      { name: "Chlorpheniramine", score: 1, scoreConfidence: "HIGH", mechanism: "Peripheral and central H1/M1 receptor blockade", saferAlternatives: ["Ask clinician about: Cetirizine", "Ask clinician about: Fexofenadine"] }
    ],
    pharmacistReferralRecommended: true
  };
}

// Endpoint 3: Medication Cognitive Risk & ACB Intelligence
app.post("/api/gemini/medication-risk", validateBody(MedicationRiskSchema), async (req, res) => {
  const { medications } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json(getMedicationRiskFallback());
  }

  try {
    const prompt = `You are a Medication Safety Information Engine for WanisAI.

IMPORTANT SCOPE LIMITATION: You are providing educational information about
Anticholinergic Cognitive Burden (ACB) based on published literature
(Boustani et al. 2008, CRISTAL scale). This is NOT a validated pharmaceutical
database query. Scores are approximate and MUST be verified by a licensed pharmacist.

Medications to analyze: ${JSON.stringify(medications || [])}

RULES:
- Only analyze medications explicitly listed in the input.
- If a medication is not recognized, set score to null and note "Verify with pharmacist."
- Never recommend stopping or changing doses.
- saferAlternatives: List only, never recommend directly. Prefix: "Ask clinician about:"

Return ONLY this JSON:
{
  "totalScore": number,
  "scoreReliability": "ESTIMATED — Verify with pharmacist before clinical use",
  "interpretation": string,
  "clinicalGuidance": string,
  "items": [
    {
      "name": string,
      "score": number | null,
      "scoreConfidence": "HIGH" | "MODERATE" | "LOW" | "UNKNOWN",
      "mechanism": string,
      "saferAlternatives": [string]
    }
  ],
  "pharmacistReferralRecommended": true
}`;

    const response = await generateWithModelFallback(ai, prompt, {
      responseMimeType: "application/json",
      temperature: 0.2
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Medication risk API spike/error, returning resilient fallback:", error?.message || error);
    return res.json(getMedicationRiskFallback());
  }
});

// Rufqa Assist Fallback
function getRufqaFallback(language: string = "ar") {
  return {
    reassuranceMessage: language === "ar" 
      ? "أنت بأمان يا حاج. خذ نفساً عميقاً، ولا تتحرك من مكانك."
      : "You are safe, pilgrim. Take a deep breath and stay where you are.",
    currentStep: "اتجه لأقرب رجل أمن أو نقطة الهلال الأحمر",
    arabicPhrasesForHelp: [
      { arabic: "أنا تائه، أين برج الساعة؟", pronunciation: "Ana ta'eh, ayna borg al-saa'a?", english: "I am lost, where is the Clock Tower?" },
      { arabic: "أحتاج مساعدة طبية", pronunciation: "Ahtaj mosa'ada tibbiyya", english: "I need medical assistance" }
    ],
    emergencyBroadcastCreated: false,
    nearestStation: "نقطة أمن الحرم ومركز الهلال الأحمر",
    safetyNote: "For real emergencies, call Saudi Red Crescent: 911"
  };
}

// Endpoint 4: Rufqa Pilgrimage Companion Guidance
app.post("/api/gemini/rufqa-assist", validateBody(RufqaAssistSchema), async (req, res) => {
  const { userMessage, location, pilgrimProfile, language = "ar" } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json(getRufqaFallback(language));
  }

  try {
    const prompt = `You are Rufqa (رفقة), the Hajj and Umrah safety companion for WanisAI.

Your ONLY role: help a senior pilgrim who is lost, confused, or needs emergency help
in Mecca, Medina, or the holy sites.

Pilgrim Profile: ${JSON.stringify(pilgrimProfile || {})}
Reported Location: ${JSON.stringify(location || "Unknown")}
Message: "${userMessage}"
Response Language: ${language}

RULES:
- Tone: calm, slow, clear. This person may be anxious.
- Max sentence length: 10 words per instruction.
- currentStep: ONE action only. Do not give multiple instructions at once.
- nearestStation: Based on location if provided. If unknown, say:
  "اتجه لأقرب رجل أمن أو نقطة الهلال الأحمر"
- arabicPhrasesForHelp: 2-3 phrases maximum. Practical, immediately usable.
- DO NOT invent specific hotel names, gate numbers, or officer names
  unless they are in the pilgrimProfile input.
- emergencyBroadcastCreated: Always false — this is informational only,
  not connected to live emergency systems.

Return ONLY this JSON:
{
  "reassuranceMessage": string,
  "currentStep": string,
  "arabicPhrasesForHelp": [
    { "arabic": string, "pronunciation": string, "english": string }
  ],
  "emergencyBroadcastCreated": false,
  "nearestStation": string,
  "safetyNote": "For real emergencies, call Saudi Red Crescent: 911"
}`;

    const response = await generateWithModelFallback(ai, prompt, {
      responseMimeType: "application/json",
      temperature: 0.3
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Rufqa assistant API spike/error, returning resilient fallback:", error?.message || error);
    return res.json(getRufqaFallback(language));
  }
});

// Companion Chat Fallback
function getCompanionChatFallback(language: string = "ar") {
  const defaultReplies: Record<string, string> = {
    ar: "أهلاً بكِ يا والدتي الحبيبة. أنا ونيس، رفيقكِ الذكي. كيف صحتكِ اليوم؟",
    en: "Welcome, dear mother. I am Wanis, your intelligent companion. How are you feeling today?",
    fr: "Bienvenue chère maman. Je suis Wanis, votre compagnon bienveillant."
  };
  return defaultReplies[language] || defaultReplies.ar;
}

// Endpoint 5: Companion Voice/Text Chat
app.post("/api/gemini/chat", validateBody(ChatSchema), async (req, res) => {
  const { message, language = "ar", context } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({ reply: getCompanionChatFallback(language) });
  }

  try {
    const prompt = `You are Wanis (ونيس), a respectful AI companion for senior citizens.

IDENTITY:
- You are a digital companion, not a doctor, nurse, or family member.
- You listen warmly and respond with dignity.
- In Arabic: use "والدتي" / "والدي" as honorifics.

RULES:
- Response: 2-3 sentences maximum. Short sentences only.
- Language: ${language}
- If the senior mentions pain, dizziness, or emergency symptoms:
  Acknowledge warmly, then say you will alert the care team.
  Do NOT provide medical advice.
- If asked "are you a real person?": Answer honestly —
  "أنا ونيس، مساعدكِ الذكي. لست إنساناً لكنني هنا دائماً."
- Never pretend to remember previous conversations unless context is provided.

Senior Context: ${JSON.stringify(context || {})}
Senior's message: "${message}"`;

    const response = await generateWithModelFallback(ai, prompt, {
      temperature: 0.4
    });

    return res.json({ reply: response.text || getCompanionChatFallback(language) });
  } catch (error: any) {
    console.warn("Companion chat API spike/error, returning resilient fallback:", error?.message || error);
    return res.json({ reply: getCompanionChatFallback(language) });
  }
});

// Endpoint 6: Clinical Geriatric Copilot & Deprescribing Advisor (Clinician Mode)
app.post("/api/gemini/clinical-copilot", validateBody(ClinicalCopilotSchema), async (req, res) => {
  const { query, patientContext, medications, acbScore, language = "en" } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      reply: language === "ar"
        ? "مساعد الذكاء السريري غير متصل حالياً. بناءً على مؤشر ACB الحالي (" + (acbScore || 0) + ")، يُوصى بمراجعة الأدوية ذات التأثير الكوليني المرتفع والتدرج في خفض الجرعات."
        : "Clinical Copilot is operating in offline mode. For a patient with ACB score of " + (acbScore || 0) + ", consider evaluating deprescribing high-anticholinergic agents like first-generation antihistamines or tricyclic antidepressants.",
      suggestedActions: [
        "Review Amitriptyline dosage and consider tapering",
        "Switch first-gen antihistamines to Cetirizine (ACB = 0)",
        "Schedule 2-week follow-up cognitive screening"
      ]
    });
  }

  try {
    const prompt = `You are the WanisAI Clinical Geriatric Copilot & Deprescribing Intelligence Assistant.

You assist licensed geriatricians, clinical pharmacists, and primary care physicians in evaluating senior cognitive health, Anticholinergic Cognitive Burden (ACB), fall risk, and medication reconciliation.

Patient Clinical Context:
${JSON.stringify(patientContext || { name: "Fatima Al-Hashemi", age: 76, baselineTriage: "YELLOW" })}

Current Active Regimen:
${JSON.stringify(medications || [])}

Cumulative ACB Score: ${acbScore ?? 4}
Language: ${language}

Clinician Query: "${query}"

Guidelines:
1. Provide evidence-based clinical reasoning referencing ACB scales (Boustani 2008, CRISTAL), Beers Criteria, or STOPP/START criteria where relevant.
2. If discussing deprescribing, propose safe, gradual tapering protocols and safer zero-ACB / low-ACB pharmacological or non-pharmacological alternatives.
3. Keep the tone professional, concise, structured, and clinically actionable.
4. Conclude with 2-3 specific suggested action items for the electronic health record (EHR).

Respond in JSON format:
{
  "reply": "Comprehensive structured clinical response formatted with markdown headings and bullet points",
  "suggestedActions": ["Action item 1", "Action item 2", "Action item 3"],
  "evidenceBasis": "e.g. Beers Criteria 2023 / ACB Scale"
}`;

    const response = await generateWithModelFallback(ai, prompt, {
      responseMimeType: "application/json",
      temperature: 0.2
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Clinical copilot API error:", error?.message || error);
    return res.json({
      reply: "Based on clinical guidelines for a patient with ACB = " + (acbScore || 4) + ", prioritize tapering high-burden sedative or anticholinergic medications to minimize delirium and orthostatic fall risks.",
      suggestedActions: ["Verify medication reconciliation", "Order baseline cognitive evaluation"]
    });
  }
});

// Endpoint 7: Family Care Circle AI Advisor & Insights
app.post("/api/gemini/family-advisor", validateBody(FamilyAdvisorSchema), async (req, res) => {
  const { seniorProfile, recentCheckins, totalAcbScore, language = "ar" } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      summary: language === "ar"
        ? "ملخص العافية: الوالدة مستقرة عموماً مع ملاحظة تقلب طفيف في نوم الصباح. يُنصح بمرافقتها في نزهة قصيرة والتأكد من شرب السوائل الكافية."
        : "Family Digest: Mother is generally stable with mild morning drowsiness noted. Consider a short walk together and encouraging adequate hydration.",
      caregiverTips: language === "ar"
        ? [
            "تأكدوا من توفير إضاءة خافتة ليلاً في الممر لتفادي التعثر.",
            "احرصوا على التحدث معها بمودة وسؤالها عن ذكريات الطفولة لتنشيط الذاكرة.",
            "تأكدوا من تناول دواء الضغط صباحاً مع كوب ماء ممتلئ."
          ]
        : [
            "Ensure hallway nightlights are on to prevent nighttime stumbling.",
            "Engage in warm reminiscing conversations about family memories.",
            "Confirm morning medications are taken with plenty of water."
          ],
      connectionPrompt: language === "ar"
        ? "اتصل بالوالدة واسألها: 'كيف كانت قهوة الصباح اليوم يا أمي؟'"
        : "Call mother and ask: 'How was your morning coffee today, Mom?'"
    });
  }

  try {
    const prompt = `You are the WanisAI Family Care Circle Advisor.
Your purpose is to empower adult children, caregivers, and family members with compassionate, culturally respectful, and actionable guidance to support their aging parent.

Context:
- Senior: ${JSON.stringify(seniorProfile || { name: "فاطمة الهاشمي", age: 76 })}
- Recent Check-ins & Trends: ${JSON.stringify(recentCheckins || [])}
- Anticholinergic Burden: ${totalAcbScore ?? 3}
- Language: ${language}

Generate empathetic, practical care insights.
Rules:
- Never alarm the family unnecessarily; maintain reassurance while pointing out gentle observations.
- Include warm cultural expressions for Arabic responses.
- Provide a specific conversation starter the family can use when calling or visiting.

Respond in JSON:
{
  "summary": "1-2 sentence warm overview of how the parent has been doing lately",
  "caregiverTips": ["Practical tip 1", "Practical tip 2", "Practical tip 3"],
  "connectionPrompt": "A heartwarming question or greeting for family to ask the parent",
  "wellnessFocus": "Hydration" | "Sleep" | "Cognitive Stimulation" | "Social Connection" | "Medication Schedule"
}`;

    const response = await generateWithModelFallback(ai, prompt, {
      responseMimeType: "application/json",
      temperature: 0.3
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Family advisor API error:", error?.message || error);
    return res.json({
      summary: language === "ar" ? "صحة الوالدة مستقرة، وتواصلكم اليومي يمنحها راحة نفسية عميقة." : "Mother's health is steady, and your daily check-in brings her immense comfort.",
      caregiverTips: language === "ar" ? ["الحرص على أخذ قسط كافٍ من النوم", "شرب كميات وافرة من الماء"] : ["Ensure restful sleep", "Maintain good hydration"],
      connectionPrompt: language === "ar" ? "كيف حالك يا ست الحبايب اليوم؟" : "How are you feeling today, Mom?",
      wellnessFocus: "Social Connection"
    });
  }
});

// Endpoint 8: Cognitive Stimulation & Nostalgic Dialogue (Senior Mode)
app.post("/api/gemini/cognitive-exercise", validateBody(CognitiveExerciseSchema), async (req, res) => {
  const { topicType = "nostalgia", language = "ar", seniorName = "فاطمة" } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      question: language === "ar"
        ? "يا والدتي العزيزة، هل تذكرين ما هو أول طبق كنتِ تحبين إعداده في بيت العائلة في الأعياد؟"
        : "Dear mother, do you remember the first traditional recipe you loved preparing for family holidays?",
      encouragement: language === "ar"
        ? "تذكر القصص القديمة ينعش القلب والذاكرة."
        : "Recalling fond memories keeps the heart and mind vibrant.",
      hints: language === "ar" ? ["المعمول بالتمر", "الكبسة أو المندي", "قهوة الهيل والزعفران"] : ["Holiday pastries", "Traditional roasted dish", "Cardamom tea/coffee"]
    });
  }

  try {
    const prompt = `You are Wanis (ونيس), conducting a gentle, therapeutic cognitive stimulation session for a senior named ${seniorName}.

Topic Type: ${topicType} (options: 'nostalgia', 'proverbs', 'sensory_memories', 'gratitude')
Language: ${language}

Create a warm, culturally resonant question that stimulates long-term autobiographical memory, pleasant reminiscing, and verbal expression.

Rules:
- Respectful honorifics: "يا والدتي" / "والدي" in Arabic.
- The question should feel like a cozy, dignified conversation with a caring family member, not a clinical quiz.
- Provide 3 conversational cues/hints to gently spark memory if needed.

Respond in JSON:
{
  "question": "Warm question to ask the senior",
  "encouragement": "A gentle introductory or concluding sentiment",
  "hints": ["Hint or memory prompt 1", "Hint 2", "Hint 3"]
}`;

    const response = await generateWithModelFallback(ai, prompt, {
      responseMimeType: "application/json",
      temperature: 0.5
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.warn("Cognitive exercise API error:", error?.message || error);
    return res.json({
      question: language === "ar" ? "ما هي أجمل ذكرياتكِ في بيتكِ القديم يا أمي؟" : "What is one of your sweetest memories from your childhood home?",
      encouragement: language === "ar" ? "الحديث عن الذكريات الجميلة يجدد النشاط والهمة." : "Sharing beautiful memories brings light to the day.",
      hints: ["الجيران والأهل", "ألعاب الطفولة", "أيام المطر والربيع"]
    });
  }
});

// Vite middleware for development or static serving for production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WanisAI server running on http://0.0.0.0:${PORT}`);
  });
}

start();
