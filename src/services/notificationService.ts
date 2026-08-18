import { Medication, SupportedLanguage } from '../types';

/**
 * Audio Synthesizer for Medication Chimes (Web Audio API)
 * Guarantees crisp sound playback with no external asset dependencies.
 */
class NotificationAudio {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  playReminderChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Gentle dual-tone ascending chime (C5 -> E5 -> G5)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        gain.gain.setValueAtTime(0, now + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.14 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.6);
      });
    } catch (err) {
      console.warn('Audio chime playback failed:', err);
    }
  }

  playSuccessChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Positive harmonic confirmation chord
      const freqs = [587.33, 880.00];
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch (err) {
      console.warn('Success chime playback failed:', err);
    }
  }

  playTriageAlertChime(triage: 'YELLOW' | 'ORANGE' | 'RED') {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      if (triage === 'RED') {
        // Urgent alternating alert tones
        const freqs = [880, 587.33, 880, 587.33];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.18);

          gain.gain.setValueAtTime(0, now + idx * 0.18);
          gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.18 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.18);
          osc.stop(now + idx * 0.18 + 0.35);
        });
      } else {
        // Yellow/Orange attentive notification chime
        const freqs = [440, 554.37, 659.25];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);

          gain.gain.setValueAtTime(0, now + idx * 0.12);
          gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.5);
        });
      }
    } catch (err) {
      console.warn('Triage alert audio error:', err);
    }
  }
}

export const notificationAudio = new NotificationAudio();

/**
 * Text-to-Speech Medication Voice Prompts
 */
export function speakMedicationReminder(medication: Medication, language: SupportedLanguage) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    let text = '';
    let langCode = 'ar-SA';

    if (language === 'ar') {
      text = `تذكير بموعد الدواء يا والدتي فاطمة. حان وقت تناول ${medication.name}، الجرعة ${medication.dosage}.`;
      langCode = 'ar-SA';
    } else if (language === 'fr') {
      text = `Rappel de médicament pour Hajjah Fatima. Il est temps de prendre ${medication.name}, dosage ${medication.dosage}.`;
      langCode = 'fr-FR';
    } else {
      text = `Medication reminder for Hajjah Fatima. It is time to take ${medication.name}, dosage ${medication.dosage}.`;
      langCode = 'en-US';
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.9; // Slower, clear pace for older adults
    utterance.pitch = 1.05; // Friendly tone

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(langCode.substring(0, 2)));
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis failed:', err);
  }
}

/**
 * Text-to-Speech Medication Adherence History Pronunciation
 */
export function speakMedicationHistoryRecord(medName: string, dosage: string, takenAt: string, language: SupportedLanguage) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();

    let text = '';
    let langCode = 'ar-SA';

    if (language === 'ar') {
      text = `تم تأكيد أخذ دواء ${medName}، الجرعة ${dosage}، في تمام الساعة ${takenAt}.`;
      langCode = 'ar-SA';
    } else if (language === 'fr') {
      text = `Dose de ${medName}, ${dosage}, confirmée prise aujourd'hui à ${takenAt}.`;
      langCode = 'fr-FR';
    } else {
      text = `Dose of ${medName}, ${dosage}, confirmed taken today at ${takenAt}.`;
      langCode = 'en-US';
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.92;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(langCode.substring(0, 2)));
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis failed:', err);
  }
}

/**
 * Browser Push Notification API Integration
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export function sendBrowserPushNotification(
  medication: Medication,
  language: SupportedLanguage,
  onClick?: () => void
): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const title = language === 'ar'
      ? `⏰ تذكير بموعد دواء: ${medication.name}`
      : language === 'fr'
      ? `⏰ Rappel Médicament: ${medication.name}`
      : `⏰ Medication Reminder: ${medication.name}`;

    const body = language === 'ar'
      ? `يا والدتي فاطمة، حان موعد تناول ${medication.name} (${medication.dosage}) - ${medication.frequency}. اضغطي لتأكيد أخذ الجرعة.`
      : language === 'fr'
      ? `Il est l'heure de prendre ${medication.name} (${medication.dosage}) - ${medication.frequency}. Cliquez pour valider.`
      : `Time to take ${medication.name} (${medication.dosage}) - ${medication.frequency}. Click to mark as taken.`;

    const notification = new Notification(title, {
      body,
      icon: '/icon.png',
      badge: '/icon.png',
      tag: `med-reminder-${medication.id}`,
      requireInteraction: true,
      data: { medId: medication.id }
    });

    notification.onclick = () => {
      window.focus();
      if (onClick) onClick();
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn('Browser push notification error:', err);
    return false;
  }
}

export function sendCareCircleTriagePushNotification(
  seniorName: string,
  newTriage: 'YELLOW' | 'ORANGE' | 'RED',
  reason: string,
  language: SupportedLanguage,
  onClick?: () => void
): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const isRed = newTriage === 'RED';
    const title = language === 'ar'
      ? (isRed ? `🚨 تنبيه عاجل من دائرة الرعاية: الوالدة ${seniorName}` : `⚠️ إشعار متابعة من دائرة الرعاية: الوالدة ${seniorName}`)
      : language === 'fr'
      ? (isRed ? `🚨 Alerte Urgente Cercle de Soins: ${seniorName}` : `⚠️ Notification Cercle de Soins: ${seniorName}`)
      : (isRed ? `🚨 Care Circle Urgent Alert: ${seniorName}` : `⚠️ Care Circle Alert: ${seniorName}`);

    const body = language === 'ar'
      ? `تحول مستوى الاطمئنان إلى (${newTriage === 'RED' ? 'طوارئ' : 'متابعة'}). السبب: ${reason}. تم إشعار مريم وفريق الرعاية.`
      : language === 'fr'
      ? `Le niveau de triage est passé à (${newTriage}). Motif: ${reason}. Le cercle de soins a été prévenu.`
      : `Triage level shifted to ${newTriage}. Reason: ${reason}. Care Circle members have been notified.`;

    const notification = new Notification(title, {
      body,
      icon: '/icon.png',
      badge: '/icon.png',
      tag: `triage-shift-${Date.now()}`,
      requireInteraction: isRed,
      data: { triage: newTriage }
    });

    notification.onclick = () => {
      window.focus();
      if (onClick) onClick();
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn('Browser push notification error:', err);
    return false;
  }
}

