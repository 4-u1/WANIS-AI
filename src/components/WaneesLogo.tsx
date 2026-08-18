import React from 'react';

export type LogoVariant = 'icon' | 'horizontal' | 'full' | 'compact' | 'watermark';

interface WaneesLogoProps {
  variant?: LogoVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  isDark?: boolean;
  showTagline?: boolean;
  showEcosystemSubtitle?: boolean;
  arabicTagline?: boolean;
}

export const WaneesLogo: React.FC<WaneesLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  isDark = false,
  showTagline = true,
  showEcosystemSubtitle = true,
  arabicTagline = false
}) => {
  // Icon dimensions based on size prop
  const iconDimensions = {
    xs: { width: 24, height: 24 },
    sm: { width: 34, height: 34 },
    md: { width: 44, height: 44 },
    lg: { width: 60, height: 60 },
    xl: { width: 88, height: 88 },
    '2xl': { width: 120, height: 120 },
    custom: { width: 44, height: 44 }
  }[size];

  // SVG Emblem of Wanees (Stylized W, Senior Silhouette, Golden Arch, Stars & Halo)
  const renderEmblem = (width = iconDimensions.width, height = iconDimensions.height) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 drop-shadow-xs"
      aria-label="Wanees Logo Emblem"
    >
      <defs>
        {/* Navy to Deep Teal Gradient (Left Loop & Base) */}
        <linearGradient id="waneesLeftGrad" x1="20" y1="60" x2="110" y2="175" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E3A5F" />
          <stop offset="45%" stopColor="#102A4D" />
          <stop offset="100%" stopColor="#0B486B" />
        </linearGradient>

        {/* Teal to Luminous Emerald Gradient (Right Caregiver / Senior Leaf Profile) */}
        <linearGradient id="waneesRightGrad" x1="90" y1="170" x2="180" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0E5A77" />
          <stop offset="40%" stopColor="#148F96" />
          <stop offset="85%" stopColor="#2EAF92" />
          <stop offset="100%" stopColor="#48C9A6" />
        </linearGradient>

        {/* Central Core Figure Gradient */}
        <linearGradient id="waneesCenterGrad" x1="100" y1="75" x2="100" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22A396" />
          <stop offset="100%" stopColor="#136B7E" />
        </linearGradient>

        {/* Golden Champagne Celestial Arch Gradient */}
        <linearGradient id="waneesGoldArch" x1="50" y1="80" x2="155" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D4AF7A" />
          <stop offset="50%" stopColor="#E5C799" />
          <stop offset="100%" stopColor="#C9A265" />
        </linearGradient>

        {/* Subtle Ambient Glow */}
        <radialGradient id="waneesGlow" cx="100" cy="100" r="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2EAF92" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2EAF92" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background Soft Glow */}
      <circle cx="100" cy="95" r="75" fill="url(#waneesGlow)" />

      {/* 1. Golden Celestial Arch (Protective Canopy) */}
      <path
        d="M 52 88 A 62 62 0 0 1 156 56"
        stroke="url(#waneesGoldArch)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeOpacity="0.9"
        fill="none"
      />

      {/* 2. Golden Celestial Stars (Sparkles of Hope & Wisdom) */}
      {/* Primary Big Sparkle */}
      <path
        d="M 154 36 C 154 39.5 156 42 159 42 C 156 42 154 44.5 154 48 C 154 44.5 152 42 149 42 C 152 42 154 39.5 154 36 Z"
        fill="#D4AF7A"
      />
      {/* Secondary Star */}
      <path
        d="M 144 26 C 144 28 145.5 29.5 147.5 29.5 C 145.5 29.5 144 31 144 33 C 144 31 142.5 29.5 140.5 29.5 C 142.5 29.5 144 28 144 26 Z"
        fill="#E5C799"
      />
      {/* Small Star */}
      <path
        d="M 132 40 C 132 41.5 133 42.5 134.5 42.5 C 133 42.5 132 43.5 132 45 C 132 43.5 131 42.5 129.5 42.5 C 131 42.5 132 41.5 132 40 Z"
        fill="#C9A265"
      />

      {/* 3. Central Figure Head (Serenity Dot) */}
      <circle cx="100" cy="84" r="14" fill="url(#waneesCenterGrad)" />

      {/* 4. Left Embracing Arm & Loop (Deep Navy / Indigo) */}
      <path
        d="M 64 76 
           C 54 84, 46 99, 46 114 
           C 46 128, 55 137, 69 137 
           C 82 137, 95 125, 108 146 
           C 114 156, 117 165, 115 174 
           C 112 179, 105 180, 99 177 
           C 87 172, 72 153, 62 138 
           C 49 119, 40 98, 48 78 
           C 54 62, 69 66, 75 75 
           Z"
        fill="url(#waneesLeftGrad)"
      />

      {/* 5. Right Caregiver Arm & Senior Gentle Profile Silhouette (Emerald / Teal) */}
      <path
        d="M 108 146 
           C 122 124, 137 106, 146 84 
           C 152 70, 153 58, 148 54 
           C 142 50, 134 56, 132 63 
           C 134 68, 140 73, 140 79 
           C 140 82, 136 85, 134 88 
           C 133 89.5, 135 92, 136 93.5 
           C 136.5 94.5, 134 97, 132 99 
           C 130 101, 126 104, 126 107 
           C 126 112, 131 115, 128 122 
           C 124 133, 115 147, 105 158 
           C 102 161, 99 164, 99 166 
           C 102 165, 105 157, 108 146 
           Z"
        fill="url(#waneesRightGrad)"
      />

      {/* Smoothed Inner Organic Dynamic Ribbon Layer */}
      <path
        d="M 52 82 
           C 42 100, 48 126, 68 132 
           C 84 137, 98 124, 114 153 
           C 126 132, 142 108, 151 76 
           C 153 68, 149 57, 146 54 
           C 136 68, 135 84, 129 97 
           C 125 106, 121 116, 114 125 
           C 106 112, 94 105, 83 103 
           C 71 101, 59 74, 52 82 
           Z"
        fill="url(#waneesRightGrad)"
        fillOpacity="0.88"
      />
    </svg>
  );

  // 1. Icon Only Variant
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  // 2. Badge Variant (Emblem with Glass/Neumorphic backing)
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center justify-center p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-sm border border-slate-200/80 dark:border-slate-800 ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  // 3. Horizontal Variant (Ideal for Navbar & Section Headers)
  if (variant === 'horizontal' || variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {renderEmblem()}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-xl sm:text-2xl text-[#102A4D] dark:text-white font-sans uppercase">
              WANEES
            </span>
            <span className="text-sm font-bold text-teal-700 dark:text-teal-400 font-arabic">
              ونـيـس
            </span>
          </div>
          {showEcosystemSubtitle && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-2.5 h-[1px] bg-teal-600 dark:bg-teal-400 opacity-60"></span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-teal-800 dark:text-teal-300 uppercase">
                AI Care & Safety Ecosystem
              </span>
              <span className="w-2.5 h-[1px] bg-teal-600 dark:bg-teal-400 opacity-60"></span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. Full Master Logo Variant (With Tagline & Ecosystem Statement)
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* Emblem */}
      <div className="relative mb-2">
        {renderEmblem(
          size === '2xl' ? 140 : size === 'xl' ? 104 : size === 'lg' ? 84 : 64,
          size === '2xl' ? 140 : size === 'xl' ? 104 : size === 'lg' ? 84 : 64
        )}
      </div>

      {/* Brand Name */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[0.18em] text-[#102A4D] dark:text-white uppercase leading-none mt-1">
        WANEES
      </h1>
      
      {/* Arabic Calligraphy Subtitle */}
      <span className="text-xs sm:text-sm font-bold text-teal-700 dark:text-teal-400 font-arabic tracking-wide mt-1">
        مـنـظـومـة ونـيـس الـذكـيـة لـرعـايـة وكـبـار الـسـن
      </span>

      {/* Decorative Ecosystem Rule */}
      {showEcosystemSubtitle && (
        <div className="flex items-center justify-center gap-2.5 my-2 w-full max-w-xs">
          <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-teal-600 dark:via-teal-400 to-teal-600"></div>
          <span className="text-[10px] sm:text-xs font-bold tracking-widest text-teal-800 dark:text-teal-300 uppercase whitespace-nowrap">
            AI CARE & SAFETY ECOSYSTEM
          </span>
          <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-teal-600 dark:via-teal-400 to-teal-600"></div>
        </div>
      )}

      {/* Quad Motto Tagline */}
      {showTagline && (
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 tracking-wide mt-0.5">
          {arabicTagline 
            ? 'فهم استباقي · تواصل إنساني · حماية فورية · استقرار دائم'
            : 'Understand. Connect. Act. Protect.'
          }
        </p>
      )}
    </div>
  );
};
