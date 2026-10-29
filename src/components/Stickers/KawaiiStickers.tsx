import React from 'react';

interface StickerProps {
  className?: string;
  size?: number;
}

export const MoonSticker: React.FC<StickerProps> = ({ className = '', size = 36 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block filter drop-shadow-md select-none ${className}`}
  >
    <path 
      d="M38 27C36.8 35.8 29.2 42 20 42C9.5 42 1 33.5 1 23C1 13.8 7.2 6.2 16 5C14.5 9 14.5 14 16.5 18.5C19 24.5 24.5 29 31.5 30.5C33.5 30.9 36 30 38 27Z" 
      fill="url(#moonGrad)" 
      stroke="#FEF08A" 
      strokeWidth="2"
    />
    <circle cx="16" cy="22" r="1.5" fill="#5C38AD" />
    <path d="M14 26C15 27.5 17 27.5 18 26" stroke="#5C38AD" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="25" r="2" fill="#F4ABC4" opacity="0.8" />
    <circle cx="20" cy="25" r="2" fill="#F4ABC4" opacity="0.8" />
    <path d="M38 12L39.5 16L43.5 17.5L39.5 19L38 23L36.5 19L32.5 17.5L36.5 16L38 12Z" fill="#FDE047" />
    <defs>
      <linearGradient id="moonGrad" x1="5" y1="5" x2="35" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFBEB" />
        <stop offset="0.6" stopColor="#FEF08A" />
        <stop offset="1" stopColor="#FBBF24" />
      </linearGradient>
    </defs>
  </svg>
);

export const CatPawSticker: React.FC<StickerProps> = ({ className = '', size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block filter drop-shadow-sm select-none ${className}`}
  >
    <circle cx="12" cy="14" r="4" fill="#F4ABC4" />
    <circle cx="20" cy="10" r="4.2" fill="#F4ABC4" />
    <circle cx="28" cy="14" r="4" fill="#F4ABC4" />
    <path 
      d="M13 22C11 25 12 31 16 33C20 35 24 33 27 31C30 27 28 22 25 21C22 20 18 20 15 21C14 21.3 13.5 21.6 13 22Z" 
      fill="#F9D6E4" 
      stroke="#F4ABC4" 
      strokeWidth="1.5"
    />
  </svg>
);

export const MagicBookSticker: React.FC<StickerProps> = ({ className = '', size = 36 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block filter drop-shadow-md select-none ${className}`}
  >
    <path d="M6 34C14 34 20 37 24 40C28 37 34 34 42 34V12C34 12 28 15 24 18C20 15 14 12 6 12V34Z" fill="#2E2056" stroke="#AA90EC" strokeWidth="2" />
    <path d="M24 18V40" stroke="#AA90EC" strokeWidth="2" />
    <path d="M9 18C14 18 19 20 22 22M9 24C14 24 19 26 22 28M26 22C29 20 34 18 39 18M26 28C29 26 34 24 39 24" stroke="#F4ABC4" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
    <circle cx="24" cy="12" r="3" fill="#FDE047" />
  </svg>
);

export const PotionBottleSticker: React.FC<StickerProps> = ({ className = '', size = 36 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 40 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block filter drop-shadow-md select-none ${className}`}
  >
    <path d="M15 6H25V12L31 22C35 29 33 38 27 42C21 46 13 45 9 39C5 33 6 24 11 18L15 12V6Z" fill="#1C1838" stroke="#B8A7EA" strokeWidth="2" />
    <rect x="14" y="3" width="12" height="4" rx="2" fill="#DCD6F7" />
    <path d="M10 28C14 26 26 25 30 30C32 34 30 39 26 41C21 44 14 43 11 38C9 35 9 31 10 28Z" fill="url(#potionGrad)" opacity="0.85" />
    <circle cx="18" cy="34" r="1.5" fill="#FFF" />
    <circle cx="23" cy="31" r="1" fill="#FFF" />
    <defs>
      <linearGradient id="potionGrad" x1="12" y1="26" x2="28" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#AA90EC" />
        <stop offset="1" stopColor="#F4ABC4" />
      </linearGradient>
    </defs>
  </svg>
);

export const ButterflySticker: React.FC<StickerProps> = ({ className = '', size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block filter drop-shadow-sm select-none ${className}`}
  >
    <path d="M19 12V28" stroke="#DCD6F7" strokeWidth="2" strokeLinecap="round" />
    <path d="M19 15C13 8 4 10 6 20C7 25 15 23 19 20" fill="#AA90EC" fillOpacity="0.7" stroke="#E1D9F8" strokeWidth="1.5" />
    <path d="M19 15C25 8 34 10 32 20C31 25 23 23 19 20" fill="#F4ABC4" fillOpacity="0.7" stroke="#F9D6E4" strokeWidth="1.5" />
    <circle cx="19" cy="11" r="1.5" fill="#FDE047" />
  </svg>
);

export const TeaCupSticker: React.FC<StickerProps> = ({ className = '', size = 34 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 44 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block filter drop-shadow-sm select-none ${className}`}
  >
    <path d="M8 15H30V26C30 30 26 33 21 33H17C12 33 8 30 8 26V15Z" fill="#241B44" stroke="#B8A7EA" strokeWidth="2" />
    <path d="M30 18H33C35 18 37 20 37 22C37 24 35 26 33 26H30" stroke="#B8A7EA" strokeWidth="2" strokeLinecap="round" />
    <path d="M5 34H33" stroke="#B8A7EA" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 11C15 8 18 8 18 5M23 11C23 8 26 8 26 5" stroke="#FFE8A3" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2" />
  </svg>
);
