import fs from "fs";
import path from "path";
import crypto from "crypto";

interface SeniorRecord {
  id: string;
  name: string;
  age?: number;
  language?: string;
  created_at: string;
}

interface CheckinRecord {
  id: string;
  senior_id: string;
  transcript: string;
  triage_level: string;
  triage_reason: string;
  mood_score: number | null;
  sleep_quality: number | null;
  fatigue_score: number | null;
  memory_concern: number;
  social_score: number | null;
  recommended_action: string;
  raw_response: string;
  created_at: string;
}

interface MedicationRecord {
  id: string;
  senior_id: string;
  name: string;
  dose?: string | null;
  acb_score?: number | null;
  added_at: string;
}

interface DatabaseStore {
  seniors: Record<string, SeniorRecord>;
  checkins: CheckinRecord[];
  medications: Record<string, MedicationRecord>;
}

const DB_FILE = path.join(process.cwd(), "wanis_data.json");

function loadDB(): DatabaseStore {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading database file, initializing fresh store:", err);
  }
  return {
    seniors: {
      senior_001: {
        id: "senior_001",
        name: "حجة فاطمة الهاشمي",
        age: 78,
        language: "ar",
        created_at: new Date().toISOString()
      }
    },
    checkins: [],
    medications: {
      senior_001_amitriptyline: {
        id: "senior_001_amitriptyline",
        senior_id: "senior_001",
        name: "Amitriptyline",
        dose: "25mg",
        acb_score: 3,
        added_at: new Date().toISOString()
      },
      senior_001_metformin: {
        id: "senior_001_metformin",
        senior_id: "senior_001",
        name: "Metformin",
        dose: "500mg",
        acb_score: 0,
        added_at: new Date().toISOString()
      }
    }
  };
}

let store: DatabaseStore = loadDB();

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database file:", err);
  }
}

// ===== SENIORS =====
export function getSenior(id: string) {
  return store.seniors[id] || null;
}

export function upsertSenior(senior: {
  id: string;
  name: string;
  age?: number;
  language?: string;
}) {
  const existing = store.seniors[senior.id];
  store.seniors[senior.id] = {
    id: senior.id,
    name: senior.name,
    age: senior.age ?? existing?.age,
    language: senior.language ?? existing?.language ?? "ar",
    created_at: existing?.created_at || new Date().toISOString()
  };
  saveDB();
}

// ===== CHECKINS =====
export function saveCheckin(checkin: {
  senior_id: string;
  transcript: string;
  triage_level: string;
  triage_reason: string;
  mood_score: number | null;
  sleep_quality: number | null;
  fatigue_score: number | null;
  memory_concern: boolean;
  social_score: number | null;
  recommended_action: string;
  raw_response: object;
}) {
  const id = crypto.randomUUID();
  const record: CheckinRecord = {
    id,
    senior_id: checkin.senior_id,
    transcript: checkin.transcript,
    triage_level: checkin.triage_level,
    triage_reason: checkin.triage_reason,
    mood_score: checkin.mood_score,
    sleep_quality: checkin.sleep_quality,
    fatigue_score: checkin.fatigue_score,
    memory_concern: checkin.memory_concern ? 1 : 0,
    social_score: checkin.social_score,
    recommended_action: checkin.recommended_action,
    raw_response: JSON.stringify(checkin.raw_response),
    created_at: new Date().toISOString()
  };
  store.checkins.unshift(record);
  saveDB();
  return id;
}

export function getRecentCheckins(senior_id: string, days: number = 14) {
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();
  return store.checkins.filter(
    (c) => c.senior_id === senior_id && c.created_at >= cutoff
  );
}

export function getLongitudinalSummary(senior_id: string, days: number = 14) {
  const checkins = getRecentCheckins(senior_id, days);
  if (checkins.length === 0) {
    return {
      total_checkins: 0,
      avg_mood: null,
      avg_sleep: null,
      avg_fatigue: null,
      avg_social: null,
      memory_concern_count: 0,
      max_triage_numeric: 1
    };
  }

  const validMoods = checkins.filter((c) => c.mood_score !== null).map((c) => c.mood_score as number);
  const validSleep = checkins.filter((c) => c.sleep_quality !== null).map((c) => c.sleep_quality as number);
  const validFatigue = checkins.filter((c) => c.fatigue_score !== null).map((c) => c.fatigue_score as number);
  const validSocial = checkins.filter((c) => c.social_score !== null).map((c) => c.social_score as number);

  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);

  const triageMap: Record<string, number> = { RED: 4, ORANGE: 3, YELLOW: 2, GREEN: 1 };
  const maxTriage = Math.max(...checkins.map((c) => triageMap[c.triage_level] || 1));

  return {
    total_checkins: checkins.length,
    avg_mood: avg(validMoods),
    avg_sleep: avg(validSleep),
    avg_fatigue: avg(validFatigue),
    avg_social: avg(validSocial),
    memory_concern_count: checkins.reduce((acc, c) => acc + c.memory_concern, 0),
    max_triage_numeric: maxTriage
  };
}

// ===== MEDICATIONS =====
export function getSeniorMedications(senior_id: string) {
  return Object.values(store.medications).filter((m) => m.senior_id === senior_id);
}

export function upsertMedication(senior_id: string, name: string, dose?: string) {
  const id = `${senior_id}_${name.toLowerCase().replace(/\s/g, "_")}`;
  const existing = store.medications[id];
  store.medications[id] = {
    id,
    senior_id,
    name,
    dose: dose || existing?.dose || null,
    acb_score: existing?.acb_score || null,
    added_at: existing?.added_at || new Date().toISOString()
  };
  saveDB();
}

export default {
  getSenior,
  upsertSenior,
  saveCheckin,
  getRecentCheckins,
  getLongitudinalSummary,
  getSeniorMedications,
  upsertMedication
};
