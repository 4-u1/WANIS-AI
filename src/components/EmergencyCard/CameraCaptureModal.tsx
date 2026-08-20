import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  RefreshCw, 
  Zap, 
  ZapOff, 
  Check, 
  X, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  Image as ImageIcon,
  Timer,
  Scan,
  ShieldCheck
} from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl: string;
  seniorName: string;
  language: SupportedLanguage;
  onSavePhoto: (newPhotoUrl: string) => void;
}

// Curated high quality senior portraits for instant test & realistic simulation
const SAMPLE_PRESETS = [
  {
    id: 'saudi-senior-1',
    label: 'Umm Abdullah (Default)',
    labelAr: 'أم عبد الله (افتراضي)',
    url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'saudi-senior-2',
    label: 'Senior Portrait 2',
    labelAr: 'صورة شخصية ٢ (رسمية)',
    url: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'saudi-senior-3',
    label: 'Senior Portrait 3',
    labelAr: 'صورة شخصية ٣ (طبيعية)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'saudi-senior-4',
    label: 'Senior Portrait 4',
    labelAr: 'صورة شخصية ٤',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400'
  }
];

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  seniorName,
  language,
  onSavePhoto
}) => {
  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [flashTriggered, setFlashTriggered] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCameraSupported, setIsCameraSupported] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isRtl = language === 'ar';

  // Play shutter sound effect using Web Audio API
  const playShutterSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      // Shutter click tone burst
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio fallback silent
    }
  };

  // Start real webcam stream if available
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 640 },
            height: { ideal: 640 }
          },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setStreamActive(true);
        setIsCameraSupported(true);
      } else {
        setIsCameraSupported(false);
      }
    } catch (err) {
      console.warn('Real camera not accessible, using interactive bio-camera simulation:', err);
      setStreamActive(false);
      setIsCameraSupported(false);
      setCameraError(language === 'ar' ? 'الكاميرا الحقيقية غير متاحة أو مقيدة في نافذة المعاينة. يمكنك استخدام المحاكي التفاعلي أو رفع صورة من جهازك.' : 'Hardware webcam unavailable. You can use our interactive bio-viewfinder simulation or upload a photo.');
    }
  };

  // Stop camera on unmount or close
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStreamActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setSelectedPreset(null);
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // Handle capture shutter
  const handleTriggerCapture = () => {
    if (countdown !== null) return;

    // Trigger visual flash
    if (isFlashOn) {
      setFlashTriggered(true);
      setTimeout(() => setFlashTriggered(false), 200);
    }

    playShutterSound();

    if (streamActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 480;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror if front camera
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
        return;
      }
    }

    // Interactive simulated camera capture
    // Pick a high-res realistic snapshot if hardware video stream is unavailable
    const fallbackPortrait = selectedPreset || currentPhotoUrl || SAMPLE_PRESETS[0].url;
    setCapturedImage(fallbackPortrait);
  };

  const handleStartTimerCapture = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          handleTriggerCapture();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCapturedImage(reader.result);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPhoto = () => {
    if (capturedImage) {
      onSavePhoto(capturedImage);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setSelectedPreset(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div 
        id="camera-capture-dialog"
        className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col text-white animate-scaleUp max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Camera Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 border-b border-teal-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>{language === 'ar' ? 'التقاط صورة البطاقة الصحية' : 'Medical ID Photo Capture'}</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  BIO-SCAN
                </span>
              </h2>
              <p className="text-[11px] text-teal-200/70 font-medium">
                {seniorName} • {language === 'ar' ? 'التحقق البيومتري للمسعفين' : 'Responder Facial ID Verification'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Screen Area */}
        <div className="relative bg-black flex flex-col items-center justify-center min-h-[300px] sm:min-h-[340px] overflow-hidden">
          
          {/* Flash screen overlay animation */}
          {flashTriggered && (
            <div className="absolute inset-0 bg-white z-40 animate-fadeOut pointer-events-none" />
          )}

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <span className="text-7xl font-black text-white animate-ping">{countdown}</span>
            </div>
          )}

          {!capturedImage ? (
            /* Live Camera / Simulation Viewfinder */
            <div className="relative w-full h-full flex items-center justify-center bg-slate-950 p-4">
              
              {streamActive ? (
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full max-h-[320px] object-cover rounded-2xl border border-teal-500/30 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
              ) : (
                /* High-fidelity Simulation Screen */
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-2xl overflow-hidden border-2 border-teal-500/50 shadow-inner bg-slate-900 flex items-center justify-center">
                  <img 
                    src={selectedPreset || currentPhotoUrl || SAMPLE_PRESETS[0].url} 
                    alt="Simulated Viewfinder Senior"
                    className="w-full h-full object-cover opacity-90 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
                  
                  {/* Live Simulation Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-teal-950/80 border border-teal-500/40 backdrop-blur-md flex items-center gap-1.5 text-[10px] text-teal-300 font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>BIO-ID 4K SIMULATOR</span>
                  </div>
                </div>
              )}

              {/* Facial Alignment Overlay Reticle */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                
                {/* Oval face guide */}
                <div className="w-48 sm:w-56 h-60 sm:h-64 rounded-[50%] border-2 border-dashed border-teal-400/70 shadow-[0_0_15px_rgba(20,184,166,0.3)] flex items-center justify-center relative">
                  {/* Crosshairs & Center target */}
                  <div className="w-4 h-4 border-t-2 border-l-2 border-teal-300 absolute -top-2 -left-2" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-teal-300 absolute -top-2 -right-2" />
                  <div className="w-4 h-4 border-b-2 border-l-2 border-teal-300 absolute -bottom-2 -left-2" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-teal-300 absolute -bottom-2 -right-2" />
                  
                  <span className="text-[10px] bg-slate-950/80 text-teal-300 px-2 py-0.5 rounded-full font-bold border border-teal-500/40 absolute bottom-3">
                    {language === 'ar' ? 'ضع الوجه داخل الإطار' : 'Align Face Within Frame'}
                  </span>
                </div>

              </div>

              {/* Top Viewfinder HUD info */}
              <div className="absolute top-2 left-3 right-3 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsFlashOn(!isFlashOn)}
                    className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                      isFlashOn ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-black/40 text-white/80 hover:bg-black/60'
                    }`}
                    title="Toggle Flash"
                  >
                    {isFlashOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleStartTimerCapture}
                    disabled={countdown !== null}
                    className="p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/80 transition-colors"
                    title="3s Timer Capture"
                  >
                    <Timer className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-teal-300 bg-black/50 px-2 py-1 rounded-md backdrop-blur border border-teal-500/30">
                    ISO 100 • 1/120s
                  </span>
                  <button
                    type="button"
                    onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
                    className="p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/80 transition-colors"
                    title="Switch Camera (Front/Back)"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Review Captured Photo Screen */
            <div className="relative w-full p-4 flex flex-col items-center justify-center bg-slate-950">
              <div className="relative w-48 sm:w-56 aspect-square rounded-3xl overflow-hidden border-4 border-emerald-500/80 shadow-2xl">
                <img 
                  src={capturedImage} 
                  alt="Captured Profile" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 p-1 rounded-full bg-emerald-500 text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-3 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تمت مطابقة الصورة بنجاح' : 'Bio-ID Photo Ready to Apply'}</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  {language === 'ar' ? 'ستظهر هذه الصورة على بطاقة الطوارئ ورابط المسعفين الفوري.' : 'This photo will be displayed on the Digital ID card and QR web profile.'}
                </p>
              </div>
            </div>
          )}

          {/* Hidden Canvas for Frame Grab */}
          <canvas ref={canvasRef} className="hidden" />
          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload}
          />
        </div>

        {/* Preset Portraits Quick Picker (When Not Captured) */}
        {!capturedImage && (
          <div className="px-4 py-3 bg-slate-950 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
              <span>{language === 'ar' ? 'نماذج صور جاهزة للاختبار أو رفع ملف:' : 'Quick Presets or Upload Device Photo:'}</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 react-btn-tap cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'رفع من الجهاز' : 'Upload File'}</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_PRESETS.map((preset) => {
                const isSelected = (selectedPreset || currentPhotoUrl) === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset.url);
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 react-btn-tap cursor-pointer ${
                      isSelected 
                        ? 'border-teal-400 scale-105 shadow-md shadow-teal-500/20' 
                        : 'border-slate-700 hover:border-slate-500 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.label} 
                      className="w-full h-12 sm:h-14 object-cover rounded-lg"
                    />
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-teal-500 text-white flex items-center justify-center text-[8px] font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Shutter & Action Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          
          {!capturedImage ? (
            /* Live Camera Controls */
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all react-btn-tap cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-teal-400" />
                <span className="hidden sm:inline">{language === 'ar' ? 'استعراض' : 'Gallery'}</span>
              </button>

              {/* Main Shutter Button */}
              <button
                type="button"
                id="btn-shutter-capture"
                onClick={handleTriggerCapture}
                className="w-16 h-16 rounded-full border-4 border-white/80 p-1 bg-teal-500 hover:bg-teal-400 active:scale-90 transition-all shadow-lg shadow-teal-500/30 flex items-center justify-center cursor-pointer group"
                title={language === 'ar' ? 'التقاط الصورة' : 'Capture Photo'}
              >
                <div className="w-12 h-12 rounded-full bg-white group-hover:scale-95 transition-transform flex items-center justify-center">
                  <Camera className="w-6 h-6 text-teal-700" />
                </div>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-colors react-btn-tap cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </>
          ) : (
            /* Captured Actions */
            <>
              <button
                type="button"
                id="btn-retake-photo"
                onClick={handleRetake}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all react-btn-tap cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-slate-400" />
                <span>{language === 'ar' ? 'إعادة الالتقاط' : 'Retake Photo'}</span>
              </button>

              <button
                type="button"
                id="btn-save-captured-photo"
                onClick={handleApplyPhoto}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-all react-btn-tap cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'ar' ? 'اعتماد وحفظ الصورة' : 'Apply Photo to ID'}</span>
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
