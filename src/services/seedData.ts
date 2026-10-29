import { 
  FileItem, 
  NoteItem, 
  AssignmentItem, 
  LectureItem, 
  QuestionItem, 
  ConstellationStar, 
  StudyPlanTask, 
  GardenItem, 
  UserStudyStats, 
  AppSettings,
  QuizDefinition
} from '../types';

export const initialSettings: AppSettings = {
  reduceMotion: false,
  soundEnabled: true,
  ambientSound: 'none',
  volume: 0.4,
  openingSkipped: false,
  studentName: 'Seraphina',
  targetDegree: 'MBA Candidate (Class of 2027)'
};

export const initialNotes: NoteItem[] = [
  {
    id: 'note-1',
    title: '🌙 Corporate Finance: DCF Modeling & WACC Formulae',
    content: `# Discounted Cash Flow (DCF) & Capital Cost

## Key Valuation Philosophy
The intrinsic value of an enterprise is the present value of its future unlevered free cash flows discounted at the firm's Weighted Average Cost of Capital (WACC).

### Unlevered Free Cash Flow (UFCF):
\`\`\`text
UFCF = EBIT * (1 - Tax Rate) + D&A - CapEx - Change in Net Working Capital
\`\`\`

### Weighted Average Cost of Capital (WACC):
\`\`\`text
WACC = (E / V) * Re + (D / V) * Rd * (1 - Tc)
\`\`\`
Where:
- **E**: Market value of equity
- **D**: Market value of debt
- **V**: E + D (Total firm enterprise value)
- **Re**: Cost of equity (via CAPM: Rf + Beta * ERP)
- **Rd**: Pre-tax cost of debt
- **Tc**: Corporate marginal tax rate

### Terminal Value Methods:
1. **Gordon Growth Model**: TV = FCF_{n+1} / (WACC - g), where long-term perpetual growth rate g <= GDP growth (usually 2-3%).
2. **Exit Multiple**: TV = Multiple * EBITDA_{n}.

> *Note to self: Always run sensitivity analysis tables on WACC (+/- 0.5%) vs Terminal Growth Rate (+/- 0.25%).*`,
    subject: 'Corporate Finance',
    tags: ['Valuation', 'DCF', 'WACC', 'Exam Prep'],
    createdAt: '2026-10-24T21:15:00.000Z',
    updatedAt: '2026-10-28T22:30:00.000Z',
    isBookmarked: true,
    bookmarkColor: '#FFE8A3',
    bookmarkNote: 'Core DCF equations for mid-term finance exam',
    needsRevision: true,
    wordCount: 185
  },
  {
    id: 'note-2',
    title: '✨ Marketing Strategy: Blue Ocean & Porter\'s 5 Forces',
    content: `# Competitive Strategy & Market Creation

## Porter's Five Forces Framework
1. **Threat of New Entrants**: Economies of scale, switching costs, brand loyalty, capital requirements.
2. **Bargaining Power of Buyers**: Buyer concentration, substitute availability, price sensitivity.
3. **Bargaining Power of Suppliers**: Supplier differentiation, supplier concentration, presence of substitutes.
4. **Threat of Substitutes**: Relative price performance of alternatives.
5. **Industry Rivalry**: Competitor diversity, exit barriers, industry growth velocity.

## Blue Ocean Strategy (Chan Kim & Mauborgne)
- **Red Oceans**: All industries in existence today; known market space where industry boundaries are defined and accepted. Competition turns water bloody.
- **Blue Oceans**: Untapped market space, demand creation, and the opportunity for highly profitable growth.
- **The ERRC Grid**:
  - **Eliminate**: Which factors that the industry takes for granted should be eliminated?
  - **Reduce**: Which factors should be reduced well below industry standard?
  - **Raise**: Which factors should be raised well above industry standard?
  - **Create**: Which factors should be created that the industry has never offered?`,
    subject: 'Marketing Strategy',
    tags: ['Strategy', 'Blue Ocean', 'Porter', 'Frameworks'],
    createdAt: '2026-10-25T19:00:00.000Z',
    updatedAt: '2026-10-27T18:45:00.000Z',
    isBookmarked: true,
    bookmarkColor: '#F4ABC4',
    bookmarkNote: 'ERRC Grid examples to include in the case pitch deck',
    needsRevision: false,
    wordCount: 172
  },
  {
    id: 'note-3',
    title: '📖 Operations Management: Little\'s Law & Bottleneck Theory',
    content: `# Process Analysis & Little's Law

## The Golden Law of Queuing & Inventory
\`\`\`text
Work in Process (WIP) = Throughput (R) * Flow Time (T)
\`\`\`
- If throughput is held constant, reducing flow time directly reduces average inventory holding costs.

## Theory of Constraints (Goldratt)
1. **Identify** the system's bottleneck (the process stage with lowest effective capacity).
2. **Exploit** the bottleneck (ensure it never starves or wastes time on defective parts).
3. **Subordinate** everything else to the above decision.
4. **Elevate** the bottleneck (invest capital/labor to expand bottleneck throughput).
5. If in the previous steps a constraint has been broken, return to Step 1.`,
    subject: 'Operations & Supply Chain',
    tags: ['Operations', 'Bottleneck', 'Theory of Constraints'],
    createdAt: '2026-10-26T16:20:00.000Z',
    updatedAt: '2026-10-26T16:20:00.000Z',
    isBookmarked: false,
    needsRevision: true,
    wordCount: 128
  }
];

export const initialAssignments: AssignmentItem[] = [
  {
    id: 'asg-1',
    title: 'Case Analysis: Apple\'s Capital Allocation Strategy',
    subject: 'Corporate Finance',
    description: 'Evaluate Apple’s share buybacks, dividend yield, and cash repatriation post-2017 TCJA. Compute optimal debt-to-equity ratio and capital structure recommendations.',
    dueDate: '2026-11-04T23:59:00.000Z',
    priority: 'high',
    status: 'in-progress',
    weightage: '25% of Term Grade'
  },
  {
    id: 'asg-2',
    title: 'Brand Repositioning Memo: Tesla vs Luxury EVs',
    subject: 'Marketing Strategy',
    description: 'Synthesize perceptual mapping and recommend pricing/segmentation strategy for an emerging luxury EV line competing against Mercedes EQ and Porsche Taycan.',
    dueDate: '2026-11-08T18:00:00.000Z',
    priority: 'medium',
    status: 'pending',
    weightage: '20% of Term Grade'
  },
  {
    id: 'asg-3',
    title: 'Zara Fast Fashion Supply Chain Process Flow Analysis',
    subject: 'Operations & Supply Chain',
    description: 'Calculate cycle time, capacity utilization of La Coruña distribution hub, and economic order quantities under lead time variance.',
    dueDate: '2026-10-28T23:59:00.000Z',
    priority: 'high',
    status: 'submitted',
    weightage: '20% of Term Grade',
    grade: 'A+ (97/100)',
    submissionNotes: 'Submitted ahead of schedule with full Monte Carlo simulation model.',
    submittedFileName: 'Zara_Supply_Chain_MonteCarlo_Analysis.pdf',
    submittedAt: '2026-10-28T19:30:00.000Z'
  }
];

export const initialLectures: LectureItem[] = [
  {
    id: 'lec-1',
    title: 'Lecture 07: Mergers, Acquisitions & LBO Mechanics',
    subject: 'Corporate Finance',
    professor: 'Prof. Julian Vance',
    date: '2026-10-27',
    durationMinutes: 75,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // or placeholder embed
    attachedFileName: 'Lecture07_LBO_Debt_Schedules.pdf',
    keyTakeaways: [
      'Senior bank debt vs Mezzanine debt vs Sponsor equity breakdown in modern buyouts',
      'Sources and Uses table must always equate balance sheet transfers cleanly',
      'Target IRR for private equity sponsors remains 20-25% threshold'
    ],
    notesMarkdown: `### Key Lecture Discussion Points:
1. **Deleveraging effect**: Debt paydown creates equity value expansion even with zero EBITDA growth or multiple expansion.
2. **Working capital covenants**: Always model cash sweep percentage covenants carefully.`,
    isWatched: true,
    rating: 5
  },
  {
    id: 'lec-2',
    title: 'Lecture 09: Behavioral Economics in Consumer Pricing',
    subject: 'Marketing Strategy',
    professor: 'Dr. Evelyn Rousseau',
    date: '2026-10-29',
    durationMinutes: 60,
    videoUrl: '',
    attachedFileName: 'Lec09_Decoy_Effect_Prospect_Theory.pdf',
    keyTakeaways: [
      'Kahneman & Tversky\'s Prospect Theory: Loss aversion is ~2.25x stronger than equivalent gain appreciation',
      'Asymmetric dominance (The Decoy Effect) shifts buyer choices towards target high-margin bundles'
    ],
    notesMarkdown: `Exam highlight: Be prepared to construct a 3-tier SaaS pricing matrix demonstrating decoy theory.`,
    isWatched: false,
    rating: 4
  }
];

export const initialQuestions: QuestionItem[] = [
  {
    id: 'q-1',
    subject: 'Corporate Finance',
    topic: 'WACC & Capital Structure',
    question: 'When corporate income taxes are introduced into the Modigliani-Miller framework without bankruptcy costs, how does increasing leverage affect a firm\'s Weighted Average Cost of Capital (WACC)?',
    options: [
      'WACC increases monotonically due to higher default risk premium',
      'WACC remains strictly constant regardless of leverage',
      'WACC decreases continuously because debt interest payments are tax-deductible',
      'WACC forms a U-shaped curve that bottoms out at 50% debt'
    ],
    correctOptionIndex: 2,
    explanation: 'With corporate taxes and no financial distress costs (MM Proposition II with taxes), the interest tax shield lowers the effective after-tax cost of debt [Rd * (1 - Tc)]. Hence, WACC decreases continuously as leverage increases towards 100%.',
    difficulty: 'Medium',
    isBookmarked: true,
    timesPracticed: 3,
    timesCorrect: 3,
    lastPracticed: '2026-10-28T20:15:00.000Z'
  },
  {
    id: 'q-2',
    subject: 'Marketing Strategy',
    topic: 'Segmentation & Positioning',
    question: 'In Kim & Mauborgne’s Blue Ocean Strategy, what does the Four Actions Framework (ERRC) primarily aim to achieve simultaneously?',
    options: [
      'High market share and aggressive price cutting',
      'Differentiation and low cost (Value Innovation)',
      'Vertical integration and supplier dominance',
      'Rapid patent filings and regulatory barriers'
    ],
    correctOptionIndex: 1,
    explanation: 'Blue Ocean Strategy breaks the traditional trade-off between differentiation and low cost by pursuing "Value Innovation"—raising value for buyers while reducing cost structures.',
    difficulty: 'Easy',
    isBookmarked: false,
    timesPracticed: 2,
    timesCorrect: 2,
    lastPracticed: '2026-10-27T17:00:00.000Z'
  },
  {
    id: 'q-3',
    subject: 'Operations & Supply Chain',
    topic: 'Little\'s Law',
    question: 'A customer support queue has an average of 45 tickets in process at any time, and the team resolves 15 tickets per hour. According to Little\'s Law, what is the average flow time of a ticket?',
    options: [
      '1.5 hours',
      '3.0 hours',
      '0.33 hours (20 minutes)',
      '6.0 hours'
    ],
    correctOptionIndex: 1,
    explanation: 'By Little\'s Law: Inventory (WIP) = Throughput (R) * Flow Time (T). Thus: 45 = 15 * T => T = 45 / 15 = 3 hours.',
    difficulty: 'Easy',
    isBookmarked: true,
    timesPracticed: 4,
    timesCorrect: 4,
    lastPracticed: '2026-10-29T10:10:00.000Z'
  },
  {
    id: 'q-4',
    subject: 'Corporate Finance',
    topic: 'CAPM & Beta',
    question: 'Company Alpha has an unlevered asset beta of 0.8. If the company shifts to a capital structure with Debt-to-Equity (D/E) ratio of 0.5 and corporate tax rate is 20%, what is its levered equity beta (assuming debt beta is zero)?',
    options: [
      '0.80',
      '1.12',
      '1.20',
      '1.45'
    ],
    correctOptionIndex: 1,
    explanation: 'Hamada equation: Beta_L = Beta_U * [1 + (1 - T) * (D / E)] = 0.8 * [1 + (1 - 0.20) * 0.5] = 0.8 * [1 + 0.40] = 0.8 * 1.4 = 1.12.',
    difficulty: 'Hard',
    isBookmarked: true,
    timesPracticed: 2,
    timesCorrect: 1,
    lastPracticed: '2026-10-28T21:40:00.000Z'
  },
  {
    id: 'q-5',
    subject: 'Organizational Behavior',
    topic: 'Motivation & Leadership',
    question: 'According to Herzberg’s Two-Factor Motivator-Hygiene Theory, which of the following is considered a primary intrinsic motivator rather than a hygiene factor?',
    options: [
      'Job security and severance provisions',
      'Competitive base salary and fringe benefits',
      'Sense of personal achievement and recognition',
      'Company policy and quality of supervision'
    ],
    correctOptionIndex: 2,
    explanation: 'Herzberg categorizes salary, security, and supervision as hygiene factors (preventing dissatisfaction). True motivators driving job satisfaction and high performance include achievement, recognition, meaningful work, and advancement.',
    difficulty: 'Medium',
    isBookmarked: false,
    timesPracticed: 1,
    timesCorrect: 1,
    lastPracticed: '2026-10-26T14:30:00.000Z'
  }
];

export const initialConstellations: ConstellationStar[] = [
  {
    id: 'star-1',
    title: 'Mastered Little\'s Law (Operations)',
    category: 'quiz',
    x: 22,
    y: 35,
    size: 6,
    glowColor: '#FFE8A3',
    unlockedAt: '2026-10-24T18:00:00.000Z',
    magnitude: 1,
    notes: 'Scored 100% on Queuing Theory quiz'
  },
  {
    id: 'star-2',
    title: 'Completed Zara Supply Chain Case',
    category: 'assignment',
    x: 38,
    y: 22,
    size: 7,
    glowColor: '#B8A7EA',
    unlockedAt: '2026-10-26T20:15:00.000Z',
    magnitude: 2,
    notes: 'Grade A+ earned under the moonlight'
  },
  {
    id: 'star-3',
    title: 'DCF & WACC Formula Synthesis',
    category: 'note',
    x: 55,
    y: 40,
    size: 6,
    glowColor: '#F4ABC4',
    unlockedAt: '2026-10-27T22:30:00.000Z',
    magnitude: 1,
    notes: 'Compiled comprehensive study cheat-sheet'
  },
  {
    id: 'star-4',
    title: '90-min Midnight Deep Focus Session',
    category: 'focus',
    x: 70,
    y: 28,
    size: 8,
    glowColor: '#FEF9C3',
    unlockedAt: '2026-10-28T23:00:00.000Z',
    magnitude: 3,
    notes: 'Serene midnight Pomodoro flow'
  },
  {
    id: 'star-5',
    title: 'Finance WACC Beta Hamada Mastery',
    category: 'quiz',
    x: 82,
    y: 48,
    size: 6,
    glowColor: '#A5C9FF',
    unlockedAt: '2026-10-29T21:00:00.000Z',
    magnitude: 2,
    notes: 'Solved complex levered beta challenge'
  }
];

export const initialPlannerTasks: StudyPlanTask[] = [
  {
    id: 'task-1',
    title: 'Review Corporate Valuation Chapter 8',
    subject: 'Corporate Finance',
    day: 'Monday',
    timeSlot: '08:00 PM - 09:30 PM',
    durationMinutes: 90,
    completed: true,
    isExamPrep: true
  },
  {
    id: 'task-2',
    title: 'Prepare Tesla Luxury EV Positioning Memo',
    subject: 'Marketing Strategy',
    day: 'Tuesday',
    timeSlot: '09:00 PM - 10:30 PM',
    durationMinutes: 90,
    completed: true
  },
  {
    id: 'task-3',
    title: 'Practice Question Bank: Hamada Beta & CAPM',
    subject: 'Corporate Finance',
    day: 'Wednesday',
    timeSlot: '08:30 PM - 09:30 PM',
    durationMinutes: 60,
    completed: true,
    isExamPrep: true
  },
  {
    id: 'task-4',
    title: 'Watch Lecture 09: Behavioral Pricing Insights',
    subject: 'Marketing Strategy',
    day: 'Thursday',
    timeSlot: '09:00 PM - 10:00 PM',
    durationMinutes: 60,
    completed: false
  },
  {
    id: 'task-5',
    title: 'Operations Bottleneck Simulation Practice',
    subject: 'Operations & Supply Chain',
    day: 'Friday',
    timeSlot: '08:00 PM - 09:30 PM',
    durationMinutes: 90,
    completed: false
  },
  {
    id: 'task-6',
    title: 'Weekend MBA Mid-Term Mock Exam & Review',
    subject: 'Corporate Finance',
    day: 'Saturday',
    timeSlot: '02:00 PM - 05:00 PM',
    durationMinutes: 180,
    completed: false,
    isExamPrep: true
  }
];

export const initialGardenItems: GardenItem[] = [
  {
    id: 'garden-1',
    name: 'Moonlit Bonsai',
    type: 'plant',
    description: 'A miniature ancient juniper tree that glows silver when you finish a daily study goal.',
    icon: 'bonsai',
    rarity: 'rare',
    unlocked: true,
    unlockedAt: '2026-10-24T18:00:00.000Z',
    unlockCondition: 'Complete your first study session',
    position: { x: 20, y: 55 }
  },
  {
    id: 'garden-2',
    name: 'Amethyst Crystal Cluster',
    type: 'crystal',
    description: 'A radiant purple geode that resonates with calm focus during midnight study hours.',
    icon: 'crystal',
    rarity: 'rare',
    unlocked: true,
    unlockedAt: '2026-10-26T20:15:00.000Z',
    unlockCondition: 'Submit an assignment with high priority',
    position: { x: 45, y: 65 }
  },
  {
    id: 'garden-3',
    name: 'Sleeping Moon Cat Plaque',
    type: 'cat-charm',
    description: 'An enchanted porcelain figurine of Luna curled peacefully on a stack of books.',
    icon: 'cat-charm',
    rarity: 'celestial',
    unlocked: true,
    unlockedAt: '2026-10-28T23:00:00.000Z',
    unlockCondition: 'Complete 30 minutes in Midnight Focus Mode',
    position: { x: 75, y: 50 }
  },
  {
    id: 'garden-4',
    name: 'Luminescent Lavender Blossom',
    type: 'plant',
    description: 'Petals that release a dreamy fragrance when you score 100% on any practice quiz.',
    icon: 'flower',
    rarity: 'rare',
    unlocked: true,
    unlockedAt: '2026-10-29T21:00:00.000Z',
    unlockCondition: 'Score 100% in a quiz session',
    position: { x: 30, y: 35 }
  },
  {
    id: 'garden-5',
    name: 'Golden Starlight Lantern',
    type: 'decor',
    description: 'A hand-forged lantern containing a captured star that never goes out.',
    icon: 'lantern',
    rarity: 'legendary',
    unlocked: false,
    unlockCondition: 'Collect 10 stars in your personal constellation',
    position: { x: 60, y: 30 }
  },
  {
    id: 'garden-6',
    name: 'Enchanted Butterfly Brooch',
    type: 'sticker',
    description: 'A shimmering butterfly that flutters across your notes during revisions.',
    icon: 'butterfly',
    rarity: 'rare',
    unlocked: false,
    unlockCondition: 'Bookmark 5 important revision notes or questions',
    position: { x: 80, y: 25 }
  }
];

export const initialStats: UserStudyStats = {
  totalStudyMinutes: 540,
  tasksCompleted: 14,
  quizzesTaken: 6,
  quizAverageScore: 92,
  starsCollected: 5,
  currentStreakDays: 6,
  weeklyLogs: [
    { date: '2026-10-24', dayName: 'Fri', minutes: 75, tasksCount: 2, phase: 'waxing-crescent' },
    { date: '2026-10-25', dayName: 'Sat', minutes: 90, tasksCount: 3, phase: 'first-quarter' },
    { date: '2026-10-26', dayName: 'Sun', minutes: 120, tasksCount: 3, phase: 'waxing-gibbous' },
    { date: '2026-10-27', dayName: 'Mon', minutes: 80, tasksCount: 2, phase: 'waxing-gibbous' },
    { date: '2026-10-28', dayName: 'Tue', minutes: 110, tasksCount: 3, phase: 'full-moon' },
    { date: '2026-10-29', dayName: 'Wed', minutes: 65, tasksCount: 1, phase: 'waning-gibbous' }
  ]
};

export const initialCustomQuizzes: QuizDefinition[] = [
  {
    id: 'quiz-def-1',
    title: 'Corporate Finance Valuation Mastery Test',
    subject: 'Corporate Finance',
    description: 'Comprehensive timed evaluation covering MM Proposition II, WACC interest tax shield, and Hamada levered beta mechanics.',
    timeLimitMinutes: 10,
    passingScorePercent: 75,
    questionIds: ['q-1', 'q-4'],
    createdAt: '2026-10-28T21:00:00.000Z',
    totalAttempts: 3,
    highestScore: 100,
    isCustom: true
  },
  {
    id: 'quiz-def-2',
    title: 'Strategy & Operations Sprint Exam',
    subject: 'Marketing Strategy',
    description: 'Timed assessment evaluating Blue Ocean Value Innovation (ERRC) and Little\'s Law queuing bottlenecks.',
    timeLimitMinutes: 12,
    passingScorePercent: 70,
    questionIds: ['q-2', 'q-3', 'q-5'],
    createdAt: '2026-10-27T18:00:00.000Z',
    totalAttempts: 2,
    highestScore: 100,
    isCustom: true
  }
];

