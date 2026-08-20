import { RufqaStepActivityData } from '../types';

export interface StepGoalPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  goalSteps: number;
  descriptionAr: string;
  descriptionEn: string;
  intensity: 'GENTLE' | 'MODERATE' | 'VIGOROUS';
}

export const STEP_GOAL_PRESETS: StepGoalPreset[] = [
  {
    id: 'goal-gentle-senior',
    nameAr: 'إيقاع كبار السن المريح (4,000 خطوة)',
    nameEn: 'Gentle Senior Pacing (4,000 steps)',
    goalSteps: 4000,
    descriptionAr: 'مخصص للمسن ومريض الضغط/السكري مع استراحات متكررة واستخدام العربة عند الحاجة.',
    descriptionEn: 'Tailored for seniors with hypertension/fatigue with frequent hydration pauses.',
    intensity: 'GENTLE'
  },
  {
    id: 'goal-standard-umrah',
    nameAr: 'مناسك العمرة الكاملة (7,500 خطوة)',
    nameEn: 'Standard Umrah Ritual (7,500 steps)',
    goalSteps: 7500,
    descriptionAr: 'يغطي 7 أشواط طواف و 7 أشواط سعي مع المسار التواصلي من الفندق إلى الحرم.',
    descriptionEn: 'Covers complete 7-circuit Tawaf, 7-lap Sa\'i plus hotel courtyard transit.',
    intensity: 'MODERATE'
  },
  {
    id: 'goal-hajj-active-day',
    nameAr: 'يوم الحج النشط والمشاعر (10,000 خطوة)',
    nameEn: 'Hajj Active Sacred Day (10,000 steps)',
    goalSteps: 10000,
    descriptionAr: 'يشمل مسار مخيم منى ورمي الجمرات والمشي بين المشاعر المقدسة بتنظيم صحي.',
    descriptionEn: 'Encompasses Mina camp transit, Jamarat bridge walkway, and sacred sites movement.',
    intensity: 'VIGOROUS'
  }
];

export const INITIAL_RUFQA_STEP_DATA: RufqaStepActivityData = {
  dailyStepGoal: 7500,
  currentSteps: 4820,
  distanceKm: 3.24,
  activeMinutes: 62,
  caloriesBurnedKcal: 184,
  currentCadenceSpm: 68, // gentle elder pace (60-75 spm)
  gaitStability: 'NORMAL',
  hydrationAlertIntervalSteps: 1500,
  stepsSinceLastHydration: 620,
  ritualBreakdown: {
    tawaf: {
      circuitsDone: 5,
      totalCircuits: 7,
      steps: 1980,
      targetSteps: 2800,
      status: 'IN_PROGRESS',
      lastCircuitCompletedTime: '12 mins ago'
    },
    sai: {
      circuitsDone: 0,
      totalCircuits: 7,
      steps: 0,
      targetSteps: 3500,
      status: 'PENDING'
    },
    jamaratWalk: {
      steps: 1420,
      targetSteps: 2000,
      distanceMeters: 950,
      status: 'IN_PROGRESS'
    },
    dailyTransit: {
      steps: 1420,
      distanceMeters: 960,
      status: 'IN_PROGRESS'
    }
  },
  hourlyDistribution: [
    { hour: '04:00', labelAr: 'فجر', labelEn: 'Fajr', steps: 650, ritualStage: 'HOTEL_REST', ritualStageAr: 'التهيئة والوضوء' },
    { hour: '06:00', labelAr: 'شروق', labelEn: 'Sunrise', steps: 1980, ritualStage: 'TAWAF', ritualStageAr: 'طواف الصباح (5 أشواط)' },
    { hour: '09:00', labelAr: 'ضحى', labelEn: 'Forenoon', steps: 420, ritualStage: 'HOTEL_REST', ritualStageAr: 'استراحة الفندق وزمزم' },
    { hour: '12:00', labelAr: 'ظهر', labelEn: 'Dhuhr', steps: 350, ritualStage: 'MINA_REST', ritualStageAr: 'صلاة الظهر وممر الحرم' },
    { hour: '15:00', labelAr: 'عصر', labelEn: 'Asr', steps: 1420, ritualStage: 'JAMARAT', ritualStageAr: 'مسار المشي الهادئ' },
    { hour: '18:00', labelAr: 'مغرب', labelEn: 'Maghrib', steps: 0, ritualStage: 'PENDING', ritualStageAr: 'مجدول: السعي' },
    { hour: '20:00', labelAr: 'عشاء', labelEn: 'Isha', steps: 0, ritualStage: 'PENDING', ritualStageAr: 'مجدول: طواف الوداع' }
  ],
  sensorStream: {
    sensorModel: 'WanisAI 6-Axis Motion Engine (IMU-Sensor-v3)',
    samplingRateHz: 50,
    accelX: 0.08,
    accelY: 0.94,
    accelZ: 0.12,
    strideLengthCm: 56, // senior stride length
    confidenceScore: 98.6,
    pedometerStatus: 'STREAMING',
    lastSyncTimestamp: 'Just now (Bluetooth LE / Local IMU)'
  }
};
