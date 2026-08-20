import React, { useState } from 'react';
import { 
  Volume2, 
  Send, 
  Sparkles, 
  Mic, 
  Bot, 
  User, 
  HeartHandshake, 
  Coffee, 
  Sun, 
  BookOpen,
  BrainCircuit,
  MessageCircleQuestion
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { sendCompanionChat, fetchCognitiveExercise, speakText } from '../../services/api';

interface SeniorVoiceAssistantProps {
  language: SupportedLanguage;
  voiceEnabled: boolean;
}

export const SeniorVoiceAssistant: React.FC<SeniorVoiceAssistantProps> = ({
  language,
  voiceEnabled
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'senior' | 'wanis'; text: string; time: string }>>([
    {
      sender: 'wanis',
      text: language === 'ar'
        ? 'أهلاً بكِ يا والدتي الحبيبة فاطمة. أنا ونيس، رفيقكِ الدائم. كيف تشعرين الآن؟ هل ترغبين في تذكيرك بالماء أو الاستماع لقصة هادئة؟'
        : language === 'fr'
        ? 'Bonjour chère Hajjah Fatima. Je suis Wanis, votre compagnon de chaque instant. Comment vous sentez-vous ?'
        : 'Welcome, dear Hajjah Fatima. I am Wanis, your daily companion. How are you feeling right now? Would you like a water reminder or a peaceful reflection?',
      time: '08:30 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExercising, setIsExercising] = useState(false);

  const quickTopics = {
    ar: [
      'ذكرني بشرب الماء والدواء',
      'حدثني عن فضل الصبر والسكينة',
      'كيف أجعل نومي هادئاً الليلة؟'
    ],
    en: [
      'Remind me to drink water & take meds',
      'Share a peaceful morning reflection',
      'Tips for better sleep tonight'
    ],
    fr: [
      'Rappelle-moi de boire de l\'eau',
      'Une réflexion paisible pour aujourd\'hui',
      'Conseils pour bien dormir ce soir'
    ]
  }[language];

  const handleStartCognitiveExercise = async () => {
    setIsExercising(true);
    setIsLoading(true);
    try {
      const exercise = await fetchCognitiveExercise({
        topicType: 'nostalgia',
        language,
        seniorName: 'فاطمة'
      });

      const promptMsg = `${exercise.encouragement}\n\n${exercise.question}`;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = [
        ...messages,
        { sender: 'wanis' as const, text: promptMsg, time: timeStr }
      ];
      setMessages(updated);

      if (voiceEnabled) {
        speakText(promptMsg, language);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsExercising(false);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...messages, { sender: 'senior' as const, text, time: timeStr }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await sendCompanionChat({
        message: text,
        language,
        context: { seniorName: 'Fatima Al-Hashemi', age: 76 }
      });

      const updated = [
        ...newMessages,
        { sender: 'wanis' as const, text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ];
      setMessages(updated);

      if (voiceEnabled) {
        speakText(reply, language);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="senior-voice-companion-card" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base">
              {language === 'ar' ? 'ونيس — رفيقك اليومي' : 'Wanis Daily Companion'}
            </h3>
            <p className="text-teal-100 text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {language === 'ar' ? 'متصل وجاهز للحديث معكِ' : 'Active & ready to talk'}
            </p>
          </div>
        </div>

        {voiceEnabled && (
          <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-teal-100 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" />
            {language === 'ar' ? 'الصوت مفعّل' : 'Voice On'}
          </span>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/30">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.sender === 'senior' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${msg.sender === 'senior' ? 'bg-indigo-600' : 'bg-teal-600'}`}>
              {msg.sender === 'senior' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-3.5 shadow-xs ${msg.sender === 'senior' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'}`}>
              <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
              <div className="flex items-center justify-between mt-1 text-[10px] opacity-70">
                <span>{msg.time}</span>
                {msg.sender === 'wanis' && (
                  <button 
                    onClick={() => speakText(msg.text, language)}
                    className="hover:opacity-100 ml-2" 
                    title="Read aloud"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-semibold p-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>{language === 'ar' ? 'ونيس يفكر ويكتب لكِ...' : 'Wanis is responding...'}</span>
          </div>
        )}
      </div>

      {/* Quick Topic Chips & Cognitive Exercise Button */}
      <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={handleStartCognitiveExercise}
          disabled={isLoading || isExercising}
          className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold flex items-center gap-1.5 shrink-0 shadow-xs hover:opacity-95 transition-all disabled:opacity-50 react-btn-tap cursor-pointer active:scale-95"
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'جلسة تنشيط الذاكرة والحديث' : 'Memory Stimulation Session'}</span>
        </button>
        {quickTopics.map((topic, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(topic)}
            className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-teal-500 shrink-0 transition-colors react-btn-tap cursor-pointer active:scale-95"
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <input
          id="companion-chat-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={language === 'ar' ? 'اكتبي رسالتك لونيس...' : 'Type or speak to Wanis...'}
          className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100"
        />
        <button
          id="companion-send-btn"
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputText.trim()}
          className="p-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold disabled:opacity-40 transition-all react-btn-tap cursor-pointer active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
