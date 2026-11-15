/**
 * Permanent Anime Girl Character Canon — Shagun
 * 
 * This is the official character specification for the Moonlight Library LMS.
 * All future views, screens, illustrations, and visual assets MUST adhere to this canon.
 */

export interface CharacterCanonProfile {
  name: string;
  role: string;
  identity: string;
  appearance: {
    gender: string;
    hairColor: string;
    hairStyle: string;
    eyeColor: string;
    expression: string;
    outfit: {
      top: string;
      bottom: string;
      accessories: string;
    };
  };
  setting: {
    location: string;
    furniture: string;
    lighting: string;
    sky: string;
    props: string[];
  };
  artStyle: {
    genre: string;
    inspiration: string;
    colorPalette: string[];
  };
  permanentAssetPaths: {
    readingLandscape: string;
    readingPortrait: string;
    speakingLandscape: string;
    speakingPortrait: string;
    welcomeAudio: string;
  };
}

export const SHAGUN_CHARACTER_CANON: CharacterCanonProfile = {
  name: 'Shagun',
  role: 'Permanent Mascot, Host & Academic Mentor of Moonlit Library',
  identity: 'Intellectual, warm, and supportive anime scholar who guides the student through their MBA degree under the peaceful moonlit sky.',
  appearance: {
    gender: 'Female (Young Anime Scholar)',
    hairColor: 'Natural dark espresso / black with soft subtle midnight violet highlights',
    hairStyle: 'Long, soft, silky hair falling gently over shoulders with soft natural bangs framing a gentle smiling face',
    eyeColor: 'Warm, expressive dark amber / brown eyes reflecting gentle starlight',
    expression: 'Warm, gentle, encouraging, cheerful smile with an intellectual, serene demeanor',
    outfit: {
      top: 'Signature cozy soft lavender knitted oversized cardigan/sweater',
      bottom: 'Comfortable cream / ivory pleated midi skirt',
      accessories: 'Delicate celestial hair pin and warm woolen cuffs'
    }
  },
  setting: {
    location: 'Moonlit Sanctuary Library / Celestial Academic Archive',
    furniture: 'Deep emerald / indigo antique velvet reading armchair beside a gothic arched window',
    lighting: 'Soft warm candlelight, ethereal golden starlight, and gentle lavender luminescence',
    sky: 'Starry midnight sky, crescent moon, soft floating nebula clouds, and fairy lights',
    props: [
      'Magical glowing Book of Wisdom ("Wisdom of the Stars")',
      'Steaming cup of chamomile / spiced tea',
      'Sleeping celestial cat (Luna) on a grimoire nearby',
      'Ornate wooden bookshelves filled with leather-bound MBA grimoires'
    ]
  },
  artStyle: {
    genre: 'Magical Realism Anime Illustration',
    inspiration: 'Makoto Shinkai (Your Name, Weathering With You) atmospheric lighting + Studio Ghibli warmth',
    colorPalette: [
      '#1e1b4b (Midnight Navy)',
      '#754ed0 (Celestial Lavender)',
      '#fbbf24 (Starlight Gold)',
      '#fef3c7 (Warm Candle Cream)',
      '#0f172a (Deep Space)'
    ]
  },
  permanentAssetPaths: {
    readingLandscape: '/shagun/shagun_reading.jpg',
    readingPortrait: '/shagun/shagun_reading_portrait.jpg',
    speakingLandscape: '/shagun/shagun_speaking.jpg',
    speakingPortrait: '/shagun/shagun_speaking_portrait.jpg',
    welcomeAudio: '/shagun/shagun_welcome.mp3'
  }
};
