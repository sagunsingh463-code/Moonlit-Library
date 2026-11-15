import { QuestionItem, FlashcardItem, ConceptPairItem } from '../types';

// =========================================================================
// HANDCRAFTED REAL-LIFE MBA SCENARIO-BASED CASE QUESTIONS (TERM 2 FOCUS)
// =========================================================================
export const comprehensiveMbaQuestions: QuestionItem[] = [
  // -----------------------------------------------------------------------
  // 1. PRODUCT MANAGEMENT (Term 2)
  // -----------------------------------------------------------------------
  {
    id: 'pm-sc-1',
    subject: 'Product Management',
    topic: 'Product Discovery & Prioritization',
    question: 'A B2B SaaS platform has 4 competing feature requests. Feature A has Reach: 10,000 users, Impact: 3 (massive), Confidence: 80%, Effort: 2 person-months. Feature B has Reach: 50,000 users, Impact: 1 (minimal), Confidence: 50%, Effort: 1 person-month. Using the RICE prioritization framework, which feature should the PM prioritize first and why?',
    options: [
      'Feature A (RICE score: 12,000) over Feature B (RICE score: 25,000) because high impact always trumps reach in B2B',
      'Feature B (RICE score: 25,000) over Feature A (RICE score: 12,000) because its low effort and broad reach yield a superior efficiency ratio',
      'Neither; RICE cannot be calculated when confidence is below 90%',
      'Feature A, because Effort must always be squared in the RICE denominator'
    ],
    correctOptionIndex: 1,
    explanation: 'RICE score = (Reach × Impact × Confidence) / Effort. For Feature A: (10,000 × 3 × 0.80) / 2 = 12,000. For Feature B: (50,000 × 1 × 0.50) / 1 = 25,000. Feature B scores higher due to its rapid time-to-value and low implementation effort.',
    difficulty: 'Hard',
    isBookmarked: true,
    isApproved: true
  },
  {
    id: 'pm-sc-2',
    subject: 'Product Management',
    topic: 'Cohort Retention & Product-Market Fit',
    question: 'A consumer fitness subscription app observes that its Day 1 retention is 70%, Day 7 is 35%, Day 30 is 14%, and Day 90 is 13.8%, remaining steady through Day 180. The VP of Marketing claims the app lacks Product-Market Fit because 86% of signups leave by Day 30. How should the Head of Product evaluate this retention curve?',
    options: [
      'Agree with the VP of Marketing; true PMF requires a minimum 50% Day 90 retention rate across all consumer verticals',
      'Disagree with the VP; the flattening retention curve at ~14% indicates an authentic, retained core audience, proving PMF has been achieved for that segment',
      'Immediately shut down all paid acquisition because the Day 1 to Day 30 drop-off is mathematically fatal',
      'Pivot the app to enterprise B2B sales where cohort curves are purely vertical'
    ],
    correctOptionIndex: 1,
    explanation: 'In cohort retention analysis, an asymptote (a curve that flattens parallel to the horizontal axis) demonstrates that a stable core of users derives sustained value indefinitely. In consumer mobile apps, a steady 14% long-term plateau often indicates solid PMF.',
    difficulty: 'Hard',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'pm-sc-3',
    subject: 'Product Management',
    topic: 'SaaS Unit Economics & Churn',
    question: 'An enterprise collaboration tool generates $120,000 in monthly recurring revenue (MRR). In November, it loses $6,000 in MRR from account cancellations, suffers $3,000 in downgrades, but gains $15,000 in expansion revenue from existing accounts upgrading their tiers. What is the Net Revenue Retention (NRR) for November?',
    options: [
      '92.5% (Severe contraction)',
      '97.5% (Minor contraction)',
      '105.0% (Net expansion)',
      '112.5% (High velocity expansion)'
    ],
    correctOptionIndex: 2,
    explanation: 'Net Revenue Retention = (Starting MRR - Churn - Contraction + Expansion) / Starting MRR = ($120,000 - $6,000 - $3,000 + $15,000) / $120,000 = $126,000 / $120,000 = 105.0%. Since NRR > 100%, existing customer revenue grew even without acquiring new logos.',
    difficulty: 'Hard',
    isBookmarked: true,
    isApproved: true
  },
  {
    id: 'pm-sc-4',
    subject: 'Product Management',
    topic: 'MVP Testing & Validation',
    question: 'A founder wants to launch an on-demand luxury watch rental service. Before investing $400,000 in inventory and developing an automated matching engine, she builds a sleek Webflow landing page, manually purchases requested watches on her personal credit card when orders come in, and hand-delivers them to clients. Which MVP approach is this?',
    options: [
      'Piecemeal MVP',
      'Concierge MVP',
      'Wizard of Oz MVP',
      'Smoke Test / Fake Door MVP'
    ],
    correctOptionIndex: 1,
    explanation: 'In a Concierge MVP, the service is provided manually and transparently to the customer (they know a human is directly serving them), allowing deep qualitative customer discovery and immediate feedback.',
    difficulty: 'Medium',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'pm-sc-5',
    subject: 'Product Management',
    topic: 'Product-Led Growth (PLG) & Time-to-Value',
    question: 'In a Product-Led Growth (PLG) business model, which tactic is most effective at minimizing Time-to-Value (TTV) for newly registered self-serve users?',
    options: [
      'Requiring a mandatory 30-minute Zoom demo with an Account Executive before unlocking the dashboard',
      'Enforcing credit card capture upfront with a 12-field corporate billing form',
      'Offering interactive in-app empty state templates and reverse trials that let users experience the core "Aha!" moment in under 2 minutes',
      'Sending an automated 20-page PDF manual via email immediately following sign-up'
    ],
    correctOptionIndex: 2,
    explanation: 'PLG focuses on letting the product sell itself by reducing friction. Minimizing Time-to-Value (TTV) through pre-populated templates and immediate hands-on value drives self-serve activation and viral loops.',
    difficulty: 'Medium',
    isBookmarked: false,
    isApproved: true
  },

  // -----------------------------------------------------------------------
  // 2. MICROECONOMICS (Term 2)
  // -----------------------------------------------------------------------
  {
    id: 'econ-sc-1',
    subject: 'Microeconomics',
    topic: 'Price Elasticity & Revenue Strategy',
    question: 'A cloud hosting company estimates that the price elasticity of demand for its basic developer compute instances is -1.65, while the elasticity for its proprietary high-security financial enterprise database is -0.35. If the executive committee wants to increase total company revenue, what pricing strategy should the pricing manager recommend?',
    options: [
      'Raise prices on both products by 10% to capitalize on general market inflation',
      'Lower prices on basic developer instances (elastic demand) and increase prices on enterprise databases (inelastic demand)',
      'Increase prices on basic developer instances and lower prices on enterprise databases',
      'Lower prices on both products to maximize total physical server utilization'
    ],
    correctOptionIndex: 1,
    explanation: 'When demand is price elastic (|Ed| > 1), lowering prices increases total revenue because the percentage increase in quantity demanded exceeds the percentage price drop. When demand is price inelastic (|Ed| < 1), raising prices increases total revenue because quantity drops by less than the price hike.',
    difficulty: 'Hard',
    isBookmarked: true,
    isApproved: true
  },
  {
    id: 'econ-sc-2',
    subject: 'Microeconomics',
    topic: 'Game Theory & Duopoly Price Wars',
    question: 'Two major ride-hailing networks (Platform Alpha and Platform Beta) are in a Cournot duopoly with market demand P = 100 - Q (where Q = q1 + q2) and identical marginal costs MC = 10. If both firms simultaneously choose profit-maximizing output quantities, what is the Cournot equilibrium output for each firm?',
    options: [
      'q1 = 45, q2 = 45 (Competitive outcome)',
      'q1 = 30, q2 = 30 (Cournot equilibrium)',
      'q1 = 22.5, q2 = 22.5 (Monopoly cartel outcome)',
      'q1 = 10, q2 = 10 (Zero profit floor)'
    ],
    correctOptionIndex: 1,
    explanation: 'Each firm maximizes Profit = (100 - q1 - q2 - 10)q1 = (90 - q1 - q2)q1. Setting marginal revenue = marginal cost: 90 - 2q1 - q2 = 0 => q1 = (90 - q2) / 2. By symmetry q1 = q2: q = (90 - q) / 2 => 3q = 90 => q = 30. Total output Q = 60, and Market Price P = 100 - 60 = 40.',
    difficulty: 'Hard',
    isBookmarked: true,
    isApproved: true
  },
  {
    id: 'econ-sc-3',
    subject: 'Microeconomics',
    topic: 'Price Discrimination & Market Segmentation',
    question: 'A major software corporation licenses its CAD engineering suite in two ways: it charges university students $20/month upon uploading an active .edu student ID, while charging commercial engineering firms $250/month per seat. What degree of price discrimination is this, and what condition prevents arbitrage?',
    options: [
      'First-degree price discrimination; prevented by state consumer protection laws',
      'Second-degree price discrimination; prevented by software download bandwidth caps',
      'Third-degree price discrimination; prevented by non-transferable personalized student licensing keys and watermarked commercial export restrictions',
      'Intertemporal skimming; prevented by seasonal semester exam schedules'
    ],
    correctOptionIndex: 2,
    explanation: 'Third-degree price discrimination segments customers based on identifiable characteristics with different price elasticities. It requires verifiable segmentation (.edu email/student ID) and restrictions that prevent students from reselling licenses to commercial firms (arbitrage prevention).',
    difficulty: 'Medium',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'econ-sc-4',
    subject: 'Microeconomics',
    topic: 'Sunk Costs & Shutdown Decisions',
    question: 'A microchip fabrication plant cost $800 million to construct (sunk and non-recoverable). In 2026, severe market oversupply causes chip prices to fall to $18 per unit. The plant\'s Average Variable Cost (AVC) is $15 per unit, and its Average Total Cost (ATC) is $24 per unit. In the short run, what is the economically rational production decision?',
    options: [
      'Shut down immediately because the firm is losing $6 per unit relative to Average Total Cost',
      'Continue operating in the short run because Price ($18) exceeds Average Variable Cost ($15), contributing $3 per unit toward fixed overhead',
      'Liquidate the plant at scrap value regardless of contract terms',
      'Raise the selling price to $25 unilaterally to guarantee accounting profitability'
    ],
    correctOptionIndex: 1,
    explanation: 'In the short run, fixed costs are sunk. As long as Price > Average Variable Cost (P > AVC), producing generates a positive contribution margin ($18 - $15 = $3) that offsets part of the fixed costs. Shutting down would cause the firm to lose 100% of its fixed costs.',
    difficulty: 'Hard',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'econ-sc-5',
    subject: 'Microeconomics',
    topic: 'Externalities & Pigouvian Intervention',
    question: 'A chemical manufacturer emits untreated wastewater into a public river, generating a negative production externality of $40 per barrel produced. At the unregulated market equilibrium, how do the market output and price compare to the socially optimal outcome?',
    options: [
      'Market output is lower and price is higher than the social optimum',
      'Market output is higher and price is lower than the social optimum, creating deadweight loss',
      'Market output and price are already Pareto optimal because private firms minimize internal costs',
      'Market output equals the social optimum, but producer surplus is artificially suppressed'
    ],
    correctOptionIndex: 1,
    explanation: 'When a negative externality exists, Marginal Social Cost (MSC) > Marginal Private Cost (MPC). The unregulated market ignores external pollution costs, leading to overproduction (Q_market > Q_social) at an artificially low price (P_market < P_social), causing deadweight welfare loss.',
    difficulty: 'Medium',
    isBookmarked: false,
    isApproved: true
  },

  // -----------------------------------------------------------------------
  // 3. INTRODUCTION TO UI/UX (Term 2)
  // -----------------------------------------------------------------------
  {
    id: 'ux-sc-1',
    subject: 'Introduction to UI/UX',
    topic: 'Fitts\'s Law & Ergonomics',
    question: 'A mobile banking team notices a 32% drop in transaction completions on smartphones with 6.7-inch displays. The "Transfer Funds" primary call-to-action (CTA) button is currently positioned in the top-left navigation corner. Applying Fitts\'s Law and thumb zone ergonomics, what redesign should the UX architect implement?',
    options: [
      'Reduce the button size by 50% to make more room for informational disclaimer text',
      'Relocate the primary CTA to a sticky bottom bar spanning the full width of the natural thumb zone',
      'Change the button color from deep green to bright neon magenta while leaving it in the top-left corner',
      'Force the user to rotate their phone into landscape mode prior to initiating a transfer'
    ],
    correctOptionIndex: 1,
    explanation: 'Fitts\'s Law states that target acquisition time depends on target distance (D) and width (W): T = a + b · log2(2D/W). Placing the CTA in the bottom sticky thumb zone drastically shortens distance (D) and increases width (W), making tapping effortless on large mobile screens.',
    difficulty: 'Medium',
    isBookmarked: true,
    isApproved: true
  },
  {
    id: 'ux-sc-2',
    subject: 'Introduction to UI/UX',
    topic: 'Hick\'s Law & Decision Latency',
    question: 'An enterprise SaaS pricing page displays 9 different subscription plans side-by-side with 45 granular checkmarks. User research indicates that visitors spend 8 minutes scanning before bouncing without initiating a free trial. Applying Hick\'s Law, what is the best UX intervention?',
    options: [
      'Add 4 additional plans to cater to ultra-niche customer segments',
      'Streamline the page to 3 clearly differentiated tiers (e.g., Starter, Pro, Enterprise) with a recommended badge and an expandable feature comparison modal',
      'Replace all text descriptions with 60-second unskippable video tutorials',
      'Remove all pricing details completely and require a 15-question qualification survey'
    ],
    correctOptionIndex: 1,
    explanation: 'Hick\'s Law posits that decision time increases logarithmically with the number and complexity of choices: T = b · log2(n + 1). Reducing 9 choices down to 3 core tiers eliminates choice overload ("paralysis by analysis") and drastically improves conversion.',
    difficulty: 'Easy',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'ux-sc-3',
    subject: 'Introduction to UI/UX',
    topic: 'Accessibility & WCAG 2.1 AA Compliance',
    question: 'A UX designer selects light gray body text (#94A3B8) on a white background (#FFFFFF) for a medical health portal. The computed contrast ratio is 2.45:1. An accessibility audit flags this as a compliance failure. What is the minimum contrast ratio required by WCAG 2.1 Level AA for normal body text, and what is the remediation?',
    options: [
      '3.0:1; darken text until contrast exceeds 3.0:1',
      '4.5:1; darken text to a deeper shade (e.g., #334155) yielding at least a 4.5:1 contrast ratio',
      '7.0:1; only pure black (#000000) is legally allowed under AA standards',
      '1.5:1; the current color is already fully compliant'
    ],
    correctOptionIndex: 1,
    explanation: 'WCAG 2.1 Level AA mandates a minimum contrast ratio of 4.5:1 for normal body text (under 18pt or under 14pt bold). For large text, the requirement is 3.0:1. The stricter 7.0:1 ratio is required only for Level AAA.',
    difficulty: 'Medium',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'ux-sc-4',
    subject: 'Introduction to UI/UX',
    topic: 'Jakob\'s Law & Mental Models',
    question: 'An online travel booking agency redesigns its website and replaces the standard top search bar and calendar date-picker with an interactive floating 3D globe. Booking conversions immediately drop by 44%. Which fundamental UX principle explains this failure?',
    options: [
      'Miller\'s Law (The magical number 7 ± 2)',
      'Jakob\'s Law (Users spend most of their time on other sites, so they expect your site to work like other familiar sites)',
      'Tesler\'s Law of Conservation of Complexity',
      'Parkinson\'s Law of Time Expansion'
    ],
    correctOptionIndex: 1,
    explanation: 'Jakob\'s Law states that users expect your interface to conform to established mental models derived from other platforms they use daily. Violating mental models forces users to learn an unfamiliar interface, spiking cognitive load and abandonment.',
    difficulty: 'Easy',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'ux-sc-5',
    subject: 'Introduction to UI/UX',
    topic: 'System Usability Scale (SUS) Benchmarking',
    question: 'After completing 20 usability testing sessions on a newly launched enterprise ERP portal, the calculated System Usability Scale (SUS) score is 58.5. How should the UX research lead report this finding to the executive stakeholders?',
    options: [
      'The score represents an "A+" grade because it is well above 50 out of 100',
      'The score falls in the "Below Average / Marginal" category (industry benchmark average is 68); critical usability flaws require systematic overhaul',
      'SUS scores only measure visual aesthetic beauty, so engineering should ignore it',
      'The score indicates 58.5% user retention after 30 days'
    ],
    correctOptionIndex: 1,
    explanation: 'A SUS score of 68 represents the 50th percentile (average usability). A score of 58.5 corresponds to approximately the 25th percentile (Grade D/marginal), indicating significant usability friction that inhibits task completion.',
    difficulty: 'Hard',
    isBookmarked: true,
    isApproved: true
  },

  // -----------------------------------------------------------------------
  // 4. LEADERSHIP ACCELERATOR (Term 2)
  // -----------------------------------------------------------------------
  {
    id: 'lead-sc-1',
    subject: 'Leadership Accelerator',
    topic: 'Psychological Safety & Google Project Aristotle',
    question: 'A newly appointed Engineering Director notices that during post-mortem meetings after production outages, junior engineers remain completely silent while senior staff debate. When an outage occurs due to a missed edge case, it is revealed that a junior developer had noticed the bug two days prior but felt uncomfortable speaking up. Based on Amy Edmondson’s research on Psychological Safety, what should the Director do?',
    options: [
      'Reprimand the junior engineer publicly to set an example for accountability',
      'Model vulnerability by sharing their own past mistakes, institute blameless post-mortems, and explicitly invite quieter team members into discussions',
      'Appoint a dedicated oversight committee to approve all pull requests without team discussion',
      'Replace all retrospective meetings with anonymous written grievance forms'
    ],
    correctOptionIndex: 1,
    explanation: 'Psychological safety is the shared belief that a team is safe for interpersonal risk-taking without fear of humiliation or retribution. Leaders foster it by framing work as learning problems, acknowledging their own fallibility, and modeling genuine curiosity.',
    difficulty: 'Medium',
    isBookmarked: true,
    isApproved: true
  },
  {
    id: 'lead-sc-2',
    subject: 'Leadership Accelerator',
    topic: 'Situational Leadership (Hersey-Blanchard)',
    question: 'In the Hersey-Blanchard Situational Leadership model, a high-performing senior developer with deep domain expertise has recently been promoted to manage a distributed team. She is eager and committed, but completely unfamiliar with budgeting and performance appraisals (Development Level D2: Some competence, low/insecure competence in management). What leadership style should her VP employ?',
    options: [
      'Delegating (S4: Low directive, low supportive behavior) to grant her total freedom',
      'Coaching / Selling (S2: High directive, high supportive behavior) to teach management skills while building confidence',
      'Telling / Directing (S1: High directive, low supportive behavior) with formal written reprimands',
      'Abandoning oversight entirely because she was a stellar senior engineer'
    ],
    correctOptionIndex: 1,
    explanation: 'Under Situational Leadership, when a subordinate is at D2 (enthusiastic but facing a steep learning curve in a new role), the leader must provide high direction (clear guidance on unfamiliar tasks) coupled with high support (encouragement and active listening).',
    difficulty: 'Hard',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'lead-sc-3',
    subject: 'Leadership Accelerator',
    topic: 'Conflict Resolution & Thomas-Kilmann Model',
    question: 'During a critical product launch, the Head of Sales wants to release an unpolished feature early to win a $5M enterprise RFP, while the Head of Engineering insists on delaying the release by 4 weeks to eliminate architectural security vulnerabilities. Both leaders are dug into their positions. Applying the Thomas-Kilmann Conflict Mode Instrument (TKM), which approach is optimal here?',
    options: [
      'Accommodating: Engineering surrenders immediately to satisfy Sales',
      'Avoiding: Delaying the meeting indefinitely hoping the client forgets',
      'Collaborating: Working together to discover an integrative solution (e.g., scoping a private beta with contractual feature flags and security safeguards)',
      'Compromising: Releasing half the feature with half the security patches'
    ],
    correctOptionIndex: 2,
    explanation: 'Collaboration (high assertiveness, high cooperativeness) seeks an integrative "win-win" solution where both vital interests—revenue acquisition and core cybersecurity integrity—are addressed without compromising either stakeholder\'s core mandate.',
    difficulty: 'Medium',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'lead-sc-4',
    subject: 'Leadership Accelerator',
    topic: 'Radical Candor (Kim Scott Framework)',
    question: 'A manager observes that a project lead regularly interrupts teammates during client reviews. Fearful of hurting the lead\'s feelings and creating awkward tension, the manager says nothing during 1-on-1s and praises their enthusiasm instead. According to Kim Scott’s Radical Candor framework, which quadrant is the manager operating in?',
    options: [
      'Obnoxious Aggression (Challenge directly without caring personally)',
      'Ruinous Empathy (Care personally but fail to challenge directly)',
      'Manipulative Insincerity (Neither care personally nor challenge directly)',
      'Radical Candor (Care personally AND challenge directly)'
    ],
    correctOptionIndex: 1,
    explanation: 'Ruinous Empathy occurs when a leader genuinely cares about someone\'s feelings but withholds necessary constructive criticism to avoid immediate discomfort, ultimately sabotaging the employee\'s growth and the team\'s performance.',
    difficulty: 'Easy',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'lead-sc-5',
    subject: 'Leadership Accelerator',
    topic: 'Kotter\'s 8-Step Change Model',
    question: 'A traditional retail bank plans to transition 80% of its branch operations to mobile AI banking over the next 24 months. According to John Kotter’s 8-Step Leading Change model, what is the mandatory first step before forming a guiding coalition or articulating a strategic vision?',
    options: [
      'Immediately terminate 20% of branch tellers to cut operating expenses',
      'Create a sense of urgency by examining market realities, competitive threats, and the cost of inaction',
      'Declare victory after the first prototype mobile app launch',
      'Outsource all engineering to an overseas consulting vendor'
    ],
    correctOptionIndex: 1,
    explanation: 'Kotter\'s Step 1 is "Establish a Sense of Urgency." Without widespread organizational recognition that the status quo is more perilous than embracing the unknown, people resist change and reforms fail before gaining momentum.',
    difficulty: 'Medium',
    isBookmarked: false,
    isApproved: true
  },

  // -----------------------------------------------------------------------
  // 5. MARKET RESEARCH METHODS (Term 2)
  // -----------------------------------------------------------------------
  {
    id: 'mrm-sc-1',
    subject: 'Market Research Methods',
    topic: 'Choice-Based Conjoint Analysis (CBC)',
    question: 'A consumer electronics brand plans to launch a smart wearable. To decide between 3 battery lives (24h, 48h, 7 days), 2 screen types (AMOLED vs E-Ink), and 3 price points ($149, $199, $249), the research team uses Choice-Based Conjoint (CBC). What unique advantage does CBC offer over simply asking customers "How important is battery life on a 1-5 scale?"',
    options: [
      'It eliminates the need to interview human consumers through AI neural net simulations',
      'It forces realistic trade-offs, calculating part-worth utilities and willingness-to-pay without the "everything is important" rating inflation bias',
      'It guarantees that customers will purchase the product in physical stores',
      'It replaces demographic segmentation entirely with census records'
    ],
    correctOptionIndex: 1,
    explanation: 'Direct rating scales suffer from "feature inflation"—consumers claim they want maximum battery, premium screen, and lowest price simultaneously. Conjoint analysis simulates realistic purchase trade-offs to uncover true part-worth utility values.',
    difficulty: 'Hard',
    isBookmarked: true,
    isApproved: true
  },
  {
    id: 'mrm-sc-2',
    subject: 'Market Research Methods',
    topic: 'Net Promoter Score (NPS) Mechanics',
    question: 'An enterprise cloud vendor surveys 500 decision-makers with the question: "How likely are you to recommend us to a colleague (0-10)?". The results show 250 Promoters (scores 9-10), 150 Passives (scores 7-8), and 100 Detractors (scores 0-6). What is the vendor\'s Net Promoter Score (NPS)?',
    options: [
      '+30',
      '+50',
      '+15',
      '+70'
    ],
    correctOptionIndex: 0,
    explanation: 'NPS = % Promoters - % Detractors. Total sample = 500. % Promoters = 250 / 500 = 50%. % Detractors = 100 / 500 = 20%. % Passives = 150 / 500 = 30% (counted in total, not in subtraction). NPS = 50% - 20% = +30.',
    difficulty: 'Easy',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'mrm-sc-3',
    subject: 'Market Research Methods',
    topic: 'Sampling Bias & External Validity',
    question: 'A fintech startup measures consumer interest in a high-yield algorithmic cryptocurrency savings account by placing a pop-up survey exclusively on a high-frequency trading subreddit forum. 92% of respondents indicate strong intent to deposit $10,000+. Why should the venture investment committee treat this finding with extreme skepticism?',
    options: [
      'The sample size was mathematically insufficient for statistical hypothesis tests',
      'The survey suffered from severe Voluntary Response and Selection Bias, sampling a non-representative, ultra-high-risk affinity group rather than the broader market',
      'Reddit prohibits commercial financial surveys under FTC regulations',
      'Algorithmic trading is illegal in developing economies'
    ],
    correctOptionIndex: 1,
    explanation: 'Selection bias occurs when the sampling frame systematically differs from the target population. Sampling a crypto trading forum selects for high risk tolerance and enthusiasm, destroying external validity for general retail consumers.',
    difficulty: 'Medium',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'mrm-sc-4',
    subject: 'Market Research Methods',
    topic: 'Kano Model Classification',
    question: 'In the Kano Customer Satisfaction Model, when a hotel room has clean sheets and running hot water, guests do not express special delight; however, if sheets are stained or hot water is absent, guests are furious and leave negative reviews. How is this feature classified in the Kano Model?',
    options: [
      'Attractive / Delighter (Exceeds expectations)',
      'Performance / One-Dimensional (Linear satisfaction with execution)',
      'Must-Be / Basic / Threshold (Expected baseline; absence causes extreme dissatisfaction)',
      'Indifferent (Zero effect on customer emotion)'
    ],
    correctOptionIndex: 2,
    explanation: 'Must-Be (Threshold) attributes are taken for granted when present, yielding neutral satisfaction at best. However, their absence triggers immediate, severe customer dissatisfaction.',
    difficulty: 'Easy',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'mrm-sc-5',
    subject: 'Market Research Methods',
    topic: 'Van Westendorp Price Sensitivity Meter',
    question: 'In a Van Westendorp Price Sensitivity survey for a B2B SaaS tool, the intersection of the "Too Cheap" curve and the "Too Expensive" curve represents which key economic threshold?',
    options: [
      'The Monopoly Profit Maximization Point',
      'The Point of Marginal Cheapness (PMC)',
      'The Point of Marginal Expensiveness (PME)',
      'The Indifference Price Point (IPP)'
    ],
    correctOptionIndex: 1,
    explanation: 'The Point of Marginal Cheapness (PMC) is the price point where the proportion of customers viewing the product as "Too Cheap" (doubting its quality) equals those who view it as "Not Cheap". Pricing below this threshold damages perceived product quality.',
    difficulty: 'Hard',
    isBookmarked: false,
    isApproved: true
  },

  // -----------------------------------------------------------------------
  // 6. CV & INTERVIEW WORKSHOP (Term 2)
  // -----------------------------------------------------------------------
  {
    id: 'cv-sc-1',
    subject: 'CV Interview Workshop',
    topic: 'STAR Behavioral Framework & Impact',
    question: 'In an MBA management consulting interview, the interviewer asks: "Tell me about a time you led a team through an unexpected project crisis." Which candidate response demonstrates the most effective STAR (Situation, Task, Action, Result) methodology?',
    options: [
      '"My team was working on a hard project and our client was upset. I worked 80 hours a week, called the client constantly, and eventually everything turned out fine."',
      '"At Acme Logistics, a supplier bankruptcy threatened a 3-week delay on a $12M contract (Situation/Task). I led a 48-hour sprint to audit alternate vendors, negotiated priority SLA terms with a local supplier (Action), and delivered the project on time with an additional $180K cost savings (Result)."',
      '"I consider crisis management one of my greatest philosophical passions; I always remain calm under pressure and inspire people."',
      '"My previous manager was disorganized and blamed us for his errors, so I escalated the issue to the board of directors."'
    ],
    correctOptionIndex: 1,
    explanation: 'An outstanding STAR answer defines the quantitative context (Situation/Task), specific personal contributions (Action), and measurable business impact with numerical metrics (Result).',
    difficulty: 'Medium',
    isBookmarked: true,
    isApproved: true
  },
  {
    id: 'cv-sc-2',
    subject: 'CV Interview Workshop',
    topic: 'Google X-Y-Z Resume Formula',
    question: 'According to former Google SVP Laszlo Bock, high-impact resume accomplishments should strictly follow the X-Y-Z formula: "Accomplished [X], as measured by [Y], by doing [Z]". Which bullet point exemplifies this standard?',
    options: [
      'Responsible for managing corporate social media marketing campaigns and customer outreach',
      'Accelerated mobile checkout conversion by 26% [X], generating $2.1M in incremental ARR [Y], by implementing Apple Pay 1-click checkout and redesigning form field validation [Z]',
      'Attended weekly cross-functional product standups and collaborated enthusiastically with engineers',
      'Expertise in Python, SQL, Tableau, Agile methodologies, and leadership strategy'
    ],
    correctOptionIndex: 1,
    explanation: 'The X-Y-Z formula clearly articulates the specific Accomplishment [X], provides quantitative verification [Y], and explains the precise Strategic Action taken [Z].',
    difficulty: 'Easy',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'cv-sc-3',
    subject: 'CV Interview Workshop',
    topic: 'Weakness Question & Authentic Self-Awareness',
    question: 'When asked: "What is your greatest professional weakness?" during an executive leadership interview, which approach is favored by seasoned executive recruiters?',
    options: [
      'Use a disguised virtue: "I am such a perfectionist that I work too hard and care too much about quality"',
      'Disclose a fatal flaw: "I have severe anger issues and frequently lose patience when junior staff ask questions"',
      'Identify a genuine developmental opportunity, articulate your self-awareness, and detail the proactive frameworks and systems you currently use to manage it',
      'Refuse to answer: "I have no professional weaknesses because I learn from all experiences"'
    ],
    correctOptionIndex: 2,
    explanation: 'Executive interviewers despise pseudo-weaknesses ("I\'m a perfectionist"). The winning approach is authentic self-awareness: naming a real area of past friction and showing the concrete mitigation habits you have adopted to manage it.',
    difficulty: 'Medium',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'cv-sc-4',
    subject: 'CV Interview Workshop',
    topic: 'Market Sizing & Structured Problem Solving',
    question: 'In a McKinsey-style case interview, the candidate is asked: "Estimate the annual market size (in USD) for dry cleaning services in New York City." What is the essential first step the candidate should take?',
    options: [
      'Immediately guess $500 Million and ask if that sounds reasonable',
      'Clarify the scope (residential vs commercial), outline a structured bottom-up segmentation tree (Population -> Households -> Dry-clean user % -> Annual frequency -> Average ticket price), and state assumptions clearly',
      'Search Google on their smartphone during the interview',
      'Decline to answer because exact census data is unavailable without an analyst team'
    ],
    correctOptionIndex: 1,
    explanation: 'Case interviewers do not care about the exact numerical answer; they evaluate structured problem-solving, logical segmentation trees, MECE structuring, and transparent, defensible assumptions.',
    difficulty: 'Hard',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'cv-sc-5',
    subject: 'CV Interview Workshop',
    topic: 'Offer Negotiation & Total Compensation',
    question: 'A candidate receives an offer for a Senior PM role: $140,000 base salary + $20,000 annual bonus + $60,000 in equity RSUs vesting over 4 years. The candidate has a competing offer with $160,000 base salary. How should the candidate negotiate with their preferred company?',
    options: [
      'Threaten to reject the offer publicly on LinkedIn unless base salary is doubled immediately',
      'Express genuine enthusiasm for the role and team culture, anchor around total compensation, share the competing cash base respectfully, and propose a specific counter-offer ($155,000 base or an accelerated sign-on bonus)',
      'Accept the offer immediately without asking any questions to avoid seeming greedy',
      'Insist on speaking directly with the Chairman of the Board of Directors'
    ],
    correctOptionIndex: 1,
    explanation: 'Negotiation requires positive collaboration ("I would love to join your mission"), objective external anchors (competing market offer), and constructive flexibility across compensation components (base, sign-on bonus, equity).',
    difficulty: 'Medium',
    isBookmarked: false,
    isApproved: true
  },

  // -----------------------------------------------------------------------
  // 7. ENTREPRENEURIAL MINDSET (Term 2)
  // -----------------------------------------------------------------------
  {
    id: 'ent-sc-1',
    subject: 'Entrepreneurial Mindset',
    topic: 'Effectuation & The Bird-in-Hand Principle',
    question: 'According to Professor Saras Sarasvathy\'s seminal study on expert serial entrepreneurs, how does "Effectuation" fundamentally differ from corporate "Causation"?',
    options: [
      'Causation starts with a given goal and selects among means; Effectuation starts with a given set of means (Who I am, What I know, Whom I know) and allows goals to emerge',
      'Causation is used only by venture capitalists; Effectuation is used only by bankrupt founders',
      'Effectuation relies exclusively on 10-year discounted cash flow predictive modeling',
      'There is no difference; both require $5M in upfront seed funding before product development'
    ],
    correctOptionIndex: 0,
    explanation: 'Causal thinking begins with a predetermined target and calculates required resources. Effectual thinking begins with existing means (identity, skills, social network) and collaborates with committed stakeholders to discover new possibilities.',
    difficulty: 'Medium',
    isBookmarked: true,
    isApproved: true
  },
  {
    id: 'ent-sc-2',
    subject: 'Entrepreneurial Mindset',
    topic: 'Affordable Loss vs Expected Return',
    question: 'A founder with $50,000 in total personal savings wants to validate an AI legal contract review tool. A consulting firm quotes $45,000 to build an MVP with an estimated 40% chance of making $500,000. Under the Effectual principle of "Affordable Loss", why should the founder reject this proposal?',
    options: [
      'Because expected return (0.40 × $500,000 = $200,000) exceeds cost, so the deal is economically impossible',
      'Because risking $45,000 (90% of total personal wealth) exceeds what the founder can afford to lose if the experiment fails, risking catastrophic personal ruin',
      'Because AI software cannot legally review contracts under federal guidelines',
      'Because venture capitalists refuse to invest in legal software'
    ],
    correctOptionIndex: 1,
    explanation: 'The Affordable Loss principle prioritizes downside risk containment over speculative upside projections. Expert entrepreneurs never gamble existential personal solvency on a single unproven hypothesis.',
    difficulty: 'Hard',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'ent-sc-3',
    subject: 'Entrepreneurial Mindset',
    topic: 'The Mom Test Customer Discovery',
    question: 'In Rob Fitzpatrick\'s "The Mom Test" framework for early-stage customer discovery, which of the following interview questions is considered flawed because it invites polite, misleading validation?',
    options: [
      '"How do you currently handle invoicing for your freelance clients?"',
      '"When was the last time you bought project management software, and what did you spend?"',
      '"Would you pay $50 a month for an app that automatically organizes your receipts with AI?"',
      '"What is the hardest part about filing your quarterly tax returns?"'
    ],
    correctOptionIndex: 2,
    explanation: 'Asking hypothetical future questions ("Would you buy...?") always invites polite, positive lies. The Mom Test mandates asking about specific past actions and concrete behaviors, not speculative future promises.',
    difficulty: 'Medium',
    isBookmarked: true,
    isApproved: true
  },
  {
    id: 'ent-sc-4',
    subject: 'Entrepreneurial Mindset',
    topic: 'Runway Calculation & Burn Rate Management',
    question: 'A seed-stage SaaS startup has $480,000 in the bank. Its monthly gross expenses are $45,000 and it generates $15,000 in monthly revenue. The founders plan to hire 2 engineers adding $10,000/month in net burn. What will their revised runway be in months?',
    options: [
      '8.0 months',
      '12.0 months',
      '16.0 months',
      '24.0 months'
    ],
    correctOptionIndex: 1,
    explanation: 'Current Net Burn = Gross Expenses ($45k) - Revenue ($15k) = $30,000/month. Revised Net Burn with new hires = $30k + $10k = $40,000/month. Revised Runway = Cash Reserve ($480k) / Net Burn ($40k) = 12.0 months.',
    difficulty: 'Medium',
    isBookmarked: false,
    isApproved: true
  },
  {
    id: 'ent-sc-5',
    subject: 'Entrepreneurial Mindset',
    topic: 'Pivot Strategies & Eric Ries Lean Startup',
    question: 'A mobile app originally built as a multi-player location-based game notices that users ignore the game mechanics but obsessively use its internal photo-sharing filter feature. The founders decide to strip away the entire gaming layer and relaunch solely as a visual photo community. What type of pivot is this under Eric Ries’s Lean Startup methodology?',
    options: [
      'Customer Segment Pivot',
      'Zoom-In Pivot',
      'Platform Pivot',
      'Channel Pivot'
    ],
    correctOptionIndex: 1,
    explanation: 'A Zoom-In Pivot reframes a single compelling feature of an existing product as the entire product itself, eliminating extraneous complexity that customers ignore (this was the exact pivot that created Instagram from Burbn).',
    difficulty: 'Easy',
    isBookmarked: false,
    isApproved: true
  }
];

// =========================================================================
// PROCEDURAL MBA CASE SCENARIO GENERATOR
// Guarantees 50 authentic, distinct, scenario-based questions for any Term 2 subject
// =========================================================================

interface ScenarioTemplate {
  topic: string;
  scenarioGen: (company: string, metric1: number, metric2: number) => {
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  };
}

const term2ScenarioTemplates: Record<string, ScenarioTemplate[]> = {
  'Microeconomics': [
    {
      topic: 'Cross-Price Elasticity & Substitute Goods',
      scenarioGen: (c, m1, m2) => ({
        question: `${c} raises the price of its subscription tier from $${m1} to $${m1 + 5}. A rival platform observes its demand jump by ${m2}%. If the cross-price elasticity of demand is computed as +${(m2 / 10).toFixed(2)}, how should the executive committee classify the relationship between the two offerings?`,
        options: [
          'They are strong substitute goods; customers migrate rapidly when one raises price',
          'They are complementary goods; higher price on one suppresses demand for the other',
          'They are independent Veblen goods with perfectly inelastic demand',
          'They are Giffen goods that violate the law of supply'
        ],
        correctOptionIndex: 0,
        explanation: 'A positive cross-price elasticity of demand (Exy > 0) indicates that Goods X and Y are substitutes. When the price of X rises, consumers substitute toward Good Y.',
        difficulty: 'Medium'
      })
    },
    {
      topic: 'Deadweight Loss & Excise Taxation',
      scenarioGen: (c, m1, m2) => ({
        question: `The municipal regulator imposes a $${m1} excise tax per unit on ${c}'s logistics fleet. In competitive equilibrium, supply is perfectly elastic while demand is downward sloping with slope -2. Who bears the economic incidence of the tax?`,
        options: [
          'The entire tax burden is shifted forward onto consumers because supply is perfectly elastic',
          'The firm absorbs 100% of the tax out of operating margin',
          'The municipal regulator bears the cost through tax rebates',
          'The tax burden is split exactly 50/50 regardless of elasticity'
        ],
        correctOptionIndex: 0,
        explanation: 'When supply is perfectly elastic, suppliers will not accept a lower net price than the market baseline; therefore, the entire tax burden is shifted 100% to buyers.',
        difficulty: 'Hard'
      })
    },
    {
      topic: 'Nash Equilibrium & Strategic Pricing',
      scenarioGen: (c, m1, m2) => ({
        question: `${c} and its chief market competitor face a simultaneous pricing dilemma. If both maintain high prices, each earns $${m1}M profit. If one cuts price while the other maintains high price, the price-cutter earns $${m1 + 8}M while the other earns $${m1 - 5}M. If both cut prices, both earn $${m1 - 2}M. What is the Nash Equilibrium outcome?`,
        options: [
          'Both firms cut prices, reaching a Nash Equilibrium that is Pareto suboptimal',
          'Both firms maintain high prices without antitrust collusion',
          'One firm exits the market while the other becomes a monopoly',
          'No pure strategy Nash Equilibrium exists'
        ],
        correctOptionIndex: 0,
        explanation: 'Cutting price is a dominant strategy for both firms regardless of the rival\'s choice, leading to the classic defect-defect (cut-cut) Nash Equilibrium.',
        difficulty: 'Hard'
      })
    },
    {
      topic: 'Economies of Scale vs Scope',
      scenarioGen: (c, m1, m2) => ({
        question: `${c} manufactures electric batteries. By doubling plant production volume from ${m1}k to ${m1 * 2}k units per quarter, its Long-Run Average Total Cost (LRATC) drops from $${m2} to $${Math.round(m2 * 0.75)}. Which economic phenomenon explains this cost reduction?`,
        options: [
          'Internal economies of scale through fixed-cost spreading and learning curve efficiencies',
          'Diseconomies of scope due to bureaucratic overhead',
          'Diminishing marginal returns in variable labor input',
          'Giffen good price dynamics'
        ],
        correctOptionIndex: 0,
        explanation: 'When long-run average cost falls as output scale expands, the firm experiences economies of scale driven by equipment specialization, bulk purchasing, and fixed overhead dilution.',
        difficulty: 'Easy'
      })
    },
    {
      topic: 'Bundling & Extraction of Consumer Surplus',
      scenarioGen: (c, m1, m2) => ({
        question: `${c} offers two software modules: Analytics and Reporting. Segment A values Analytics at $${m1} and Reporting at $${m2}. Segment B values Analytics at $${m2} and Reporting at $${m1}. By bundling both modules together for $${m1 + m2}, what economic objective is achieved?`,
        options: [
          'Extracting consumer surplus by exploiting negatively correlated customer valuations',
          'Violating federal antitrust tying provisions without consumer benefit',
          'Inducing deadweight loss by depressing total consumer surplus to zero',
          'Transforming variable costs into fixed liabilities'
        ],
        correctOptionIndex: 0,
        explanation: 'Pure bundling is most profitable when customer valuations for distinct components are negatively correlated, allowing the seller to capture consumer surplus without leaving money on the table.',
        difficulty: 'Hard'
      })
    }
  ],
  'Introduction to UI/UX': [
    {
      topic: 'Cognitive Load Theory in Checkout UX',
      scenarioGen: (c, m1, m2) => ({
        question: `${c}\'s e-commerce app redesign reduced the number of form fields during signup from ${m1} down to 3. Usability testing revealed an immediate ${m2}% lift in completion velocity. According to Sweller\'s Cognitive Load Theory, which type of cognitive load was minimized?`,
        options: [
          'Extraneous cognitive load (friction caused by unnecessary interface presentation and irrelevant inputs)',
          'Intrinsic cognitive load (the inherent difficulty of the payment concept itself)',
          'Germane cognitive load (the mental effort devoted to forming schemas)',
          'Sensory memory saturation'
        ],
        correctOptionIndex: 0,
        explanation: 'Extraneous cognitive load is generated by poor interface design and redundant demands. Eliminating unnecessary fields removes extraneous friction so users can focus on their primary task.',
        difficulty: 'Medium'
      })
    },
    {
      topic: 'A/B Testing & False Positive Risks',
      scenarioGen: (c, m1, m2) => ({
        question: `${c}\'s growth team tests a green vs blue button on ${m1},000 landing page visitors. After only 4 hours, Variant B shows a ${m2}% conversion lift with p = 0.041. The junior designer wants to stop the test immediately and ship Variant B. What UX research error is being committed?`,
        options: [
          'Peeking problem / premature stopping bias before reaching planned statistical sample size and power',
          'Jakob\'s Law violation',
          'Simpson\'s Paradox in reverse',
          'Failure to apply Hick\'s logarithmic scale'
        ],
        correctOptionIndex: 0,
        explanation: 'Stopping an A/B test early upon first reaching p < 0.05 ("peeking") dramatically inflates False Positive rates (Type I error). Tests must run to their predetermined sample size and account for cyclical weekly patterns.',
        difficulty: 'Hard'
      })
    },
    {
      topic: 'Information Architecture & Card Sorting',
      scenarioGen: (c, m1, m2) => ({
        question: `${c} is reorganizing its enterprise knowledge base of ${m1} help documents. The UX team invites 30 target users to organize topic cards into categories and generate their own category labels. Which research method is being conducted?`,
        options: [
          'Open Card Sorting (to discover user-defined mental models and nomenclature)',
          'Closed Card Sorting (placing cards into pre-established buckets)',
          'Tree Testing (reverse card sorting for navigation findability)',
          'Cognitive Walkthrough of high-fidelity wireframes'
        ],
        correctOptionIndex: 0,
        explanation: 'In Open Card Sorting, participants sort items into groups that make sense to them and create their own category names, uncovering intuitive mental models for Information Architecture.',
        difficulty: 'Easy'
      })
    },
    {
      topic: 'Micro-Interactions & System Feedback',
      scenarioGen: (c, m1, m2) => ({
        question: `When a user clicks "Submit Payment" on ${c}\'s mobile app, the UI freezes for ${m1} seconds with no spinner, audio cue, or disabled button state. 28% of users tap the button multiple times, causing duplicate bank charges. Which Nielsen Heuristic is violated?`,
        options: [
          'Visibility of System Status (The system should always keep users informed about what is going on through appropriate feedback within reasonable time)',
          'Aesthetic and minimalist design',
          'Flexibility and efficiency of use',
          'Recognition rather than recall'
        ],
        correctOptionIndex: 0,
        explanation: 'Nielsen\'s Heuristic #1 dictates that systems must provide immediate visual feedback (loading spinners, disabled buttons) to confirm receipt of user input and prevent duplicate actions.',
        difficulty: 'Easy'
      })
    }
  ],
  'Leadership Accelerator': [
    {
      topic: 'Cross-Functional Matrix Alignment',
      scenarioGen: (c, m1, m2) => ({
        question: `At ${c}, a Product Manager leads a team of ${m1} senior engineers who report administratively to an Engineering VP. The PM has accountability for delivery deadlines but zero formal line-management authority. Which leadership competency is critical to driving execution in this matrix?`,
        options: [
          'Influence without authority through coalition building, shared outcomes, and interpersonal trust',
          'Issuing formal disciplinary notices to engineers via human resources',
          'Bypassing the engineering team and writing the backend codebase independently',
          'Threatening to cancel developer bonuses'
        ],
        correctOptionIndex: 0,
        explanation: 'Matrix organizations require leaders to achieve alignment through lateral influence, persuasion, empathetic listening, and shared mission rather than command-and-control hierarchy.',
        difficulty: 'Medium'
      })
    },
    {
      topic: 'Emotional Intelligence & Executive Presence',
      scenarioGen: (c, m1, m2) => ({
        question: `During a heated board meeting where ${c} missed its quarterly revenue forecast by ${m1}%, a board member aggressively questions the CEO\'s operational competence. According to Daniel Goleman\'s Emotional Intelligence framework, what represents the highest level of Self-Regulation?`,
        options: [
          'Acknowledging the emotional triggers calmly, validating the board\'s concern without defensiveness, and reframing the discussion around concrete turnaround levers',
          'Storming out of the boardroom to signal intense displeasure',
          'Immediately blaming the VP of Sales and firing them in front of the board',
          'Denying that the quarterly metrics are real'
        ],
        correctOptionIndex: 0,
        explanation: 'Self-regulation enables executives to manage disruptive emotional impulses and react with poised composure, non-defensive empathy, and strategic clarity under intense pressure.',
        difficulty: 'Medium'
      })
    },
    {
      topic: 'Delegation Frameworks & Growth',
      scenarioGen: (c, m1, m2) => ({
        question: `A founder at ${c} works ${m1} hours per week reviewing every marketing email, pull request, and supplier invoice. Her direct reports feel micromanaged and attrition has reached ${m2}%. To transition from individual contributor to scalable executive, what delegation shift is required?`,
        options: [
          'Shift from task delegation (telling people exact steps) to outcome delegation (aligning on clear objectives, guardrails, and decision ownership)',
          'Hire an executive assistant to approve everything on the founder\'s behalf without team communication',
          'Install keystroke surveillance software on all employee computers',
          'Cancel all 1-on-1 meetings to save time'
        ],
        correctOptionIndex: 0,
        explanation: 'Scalable leadership requires outcome delegation: defining success criteria, boundaries, and accountability, then empowering subordinates with autonomy over execution.',
        difficulty: 'Easy'
      })
    }
  ],
  'Market Research Methods': [
    {
      topic: 'MaxDiff (Best-Worst Scaling) Analysis',
      scenarioGen: (c, m1, m2) => ({
        question: `${c} wants to rank ${m1} candidate features for a new enterprise portal. Rather than using a standard 1-5 Likert scale where respondents rate everything as "important", the researcher presents sets of 4 features at a time and asks: "Which is Most Important and which is Least Important?". What methodology is this?`,
        options: [
          'MaxDiff (Maximum Difference / Best-Worst Scaling)',
          'Cluster Analysis using Euclidean distance',
          'Bivariate Pearson Correlation',
          'Exploratory Factor Analysis'
        ],
        correctOptionIndex: 0,
        explanation: 'MaxDiff forces respondents to make clear trade-offs by identifying best/worst choices across rotating subsets, generating interval-level utility scores free of scale rating bias.',
        difficulty: 'Medium'
      })
    },
    {
      topic: 'A/B Testing Cohort Contamination',
      scenarioGen: (c, m1, m2) => ({
        question: `${c} runs an A/B test on pricing where Control sees $${m1}/mo and Treatment sees $${m2}/mo. Because users clear browser cookies or log in across mobile and desktop, ${m1}% of users see both prices during the trial. What research hazard has occurred?`,
        options: [
          'Sample contamination / treatment spillover, biasing conversion metrics and triggering customer backlash',
          'Survivorship bias across desktop cohorts',
          'Regression to the mean in price elasticity',
          'Guttman scaling divergence'
        ],
        correctOptionIndex: 0,
        explanation: 'Cross-device contamination destroys experimental isolation. Users who encounter divergent pricing lose trust, and statistical comparison between control and variant is corrupted.',
        difficulty: 'Hard'
      })
    },
    {
      topic: 'Ethnographic Field Studies vs Surveys',
      scenarioGen: (c, m1, m2) => ({
        question: `${c} designs hospital surgical equipment. Despite surveys showing ${m1}% surgeon satisfaction, equipment malfunctions remain high in clinical operating rooms. The research team embeds researchers inside live operating theaters for 3 weeks to observe workflows. What research approach is this?`,
        options: [
          'Ethnographic contextual inquiry (observational field research uncovering tacit behaviors that users cannot articulate in surveys)',
          'Secondary market desk research',
          'Quantitative Monte Carlo simulation',
          'Controlled laboratory blind testing'
        ],
        correctOptionIndex: 0,
        explanation: 'Ethnography and contextual inquiry reveal real-world environmental pressures, habituated workarounds, and tacit behaviors that participants fail to report on self-administered surveys.',
        difficulty: 'Easy'
      })
    }
  ],
  'Product Management': [
    {
      topic: 'North Star Metric Selection',
      scenarioGen: (c, m1, m2) => ({
        question: `${c} is an interactive peer-to-peer MBA learning platform. The marketing team advocates for "Monthly Registered Accounts", while the product team advocates for "Weekly Active Learners Completing >= 2 Study Sessions". Which metric serves as the true North Star Metric and why?`,
        options: [
          '"Weekly Active Learners Completing >= 2 Sessions", because it measures actual customer value delivery and product engagement rather than top-of-funnel vanity registration volume',
          '"Monthly Registered Accounts", because raw user count is all venture capital investors care about',
          'Neither; total cumulative website pageviews should always be the North Star Metric',
          'The number of support tickets filed per week'
        ],
        correctOptionIndex: 0,
        explanation: 'A North Star Metric must capture core value delivery to the customer and correlate with long-term retention. Registered accounts is a vanity metric that does not indicate active utility.',
        difficulty: 'Medium'
      })
    },
    {
      topic: 'Feature Cannibalization in Platforms',
      scenarioGen: (c, m1, m2) => ({
        question: `${c} sells a flagship enterprise software tool for $${m1 * 10}/year. It launches a lightweight self-serve edition at $${m1}/year. Over two quarters, self-serve generates $${m2}M, but enterprise pipeline conversions drop by 25% as customers downgrade. How should the PM address this cannibalization?`,
        options: [
          'Re-segment features clearly by gating mission-critical enterprise capabilities (SSO, SOC2 compliance, custom APIs, dedicated SLA) to the enterprise tier',
          'Shut down the self-serve edition completely and ban all credit card signups',
          'Double the price of both editions simultaneously',
          'Ignore the enterprise pipeline and focus solely on freemium'
        ],
        correctOptionIndex: 0,
        explanation: 'Cannibalization is managed through disciplined feature gating. Enterprise buyers willingly pay higher premiums for enterprise governance, security (SSO/SAML), and custom integrations.',
        difficulty: 'Hard'
      })
    },
    {
      topic: 'Technical Debt vs Velocity Trade-offs',
      scenarioGen: (c, m1, m2) => ({
        question: `${c}\'s engineering team reports that 40% of sprint capacity is spent fixing legacy database bugs and production downtime has increased by ${m1}%. The VP of Sales demands that 100% of engineering time be spent on new sales demos. As the lead PM, what balanced capacity allocation framework should you propose?`,
        options: [
          'A balanced allocation rule (e.g. 70% core feature roadmap, 20% technical debt / architectural refactoring, 10% experimental discovery)',
          '0% for bugs and 100% for sales features until the company reaches IPO',
          '100% engineering freeze on all customer features for the next 18 months',
          'Outsource all bug fixes to temporary freelancers without onboarding'
        ],
        correctOptionIndex: 0,
        explanation: 'Sustainable product velocity requires deliberate capacity allocation (such as the 70/20/10 rule). Ignoring technical debt creates compounding interest that eventually halts new feature velocity.',
        difficulty: 'Medium'
      })
    }
  ],
  'CV Interview Workshop': [
    {
      topic: 'Executive Case Interview Structuring',
      scenarioGen: (c, m1, m2) => ({
        question: `During an MBA leadership interview for ${c}, the interviewer asks: "${c}\'s operating margin has declined from ${m1}% to ${m2}%. How would you diagnose and solve this problem?". What is the best opening framework to communicate?`,
        options: [
          'Deconstruct Margin into Revenue (Price × Volume) and Costs (Fixed + Variable), state clear initial hypotheses, and systematically ask targeted diagnostic questions before recommending solutions',
          'State immediately that the company should fire 20% of its staff without reviewing financial statements',
          'Tell an unrelated personal anecdote about college club fundraising',
          'Ask the interviewer to give you the answer because you don\'t have a calculator'
        ],
        correctOptionIndex: 0,
        explanation: 'Top-tier consulting and executive interviews evaluate MECE structured problem solving: decomposing profitability into Revenue vs Costs, establishing structured hypotheses, and testing assumptions.',
        difficulty: 'Hard'
      })
    },
    {
      topic: 'Explaining Employment Gaps Strategically',
      scenarioGen: (c, m1, m2) => ({
        question: `An MBA candidate took a ${m1}-month career break between roles to complete intensive certifications, care for an elderly relative, and launch an angel investing syndicate. When an executive recruiter asks about the gap, how should the candidate position it on their resume and in conversation?`,
        options: [
          'Frame the period proactively on the CV as a purposeful sabbatical, highlighting new skills, leadership responsibilities, and emotional resilience gained',
          'Falsify employment dates at the previous employer to erase the gap from existence',
          'Apologize profusely and express shame about being unemployed',
          'Claim that the gap is protected under government top-secret clearance'
        ],
        correctOptionIndex: 0,
        explanation: 'Authentic transparency paired with proactive framing turns a career gap into a strength. Demonstrating intentional personal growth, skill acquisition, or personal responsibility conveys mature leadership.',
        difficulty: 'Easy'
      })
    }
  ],
  'Entrepreneurial Mindset': [
    {
      topic: 'Lemonade Principle (Leveraging Surprises)',
      scenarioGen: (c, m1, m2) => ({
        question: `${c}, a cloud food-delivery startup, faces a sudden municipal ban prohibiting gas-powered delivery scooters within city limits. Rather than shutting down or lobbying against the law, the founder immediately strikes an exclusive partnership with an electric bicycle fleet, marketing ${c} as the city\'s first 100% Zero-Emission courier. Which Effectuation principle is demonstrated?`,
        options: [
          'The Lemonade Principle (embracing unexpected contingencies and turning obstacles into novel opportunities)',
          'The Pilot-in-the-Plane causal control illusion',
          'Expected Utility Maximization under risk neutrality',
          'Porter\'s Five Forces Supplier Hegemony'
        ],
        correctOptionIndex: 0,
        explanation: 'The Lemonade Principle in Effectuation teaches that expert entrepreneurs do not fear unexpected surprises or barriers; they leverage contingencies as raw materials for innovation.',
        difficulty: 'Medium'
      })
    },
    {
      topic: 'Founder Equity Vesting & Cliffs',
      scenarioGen: (c, m1, m2) => ({
        question: `Two co-founders start ${c} and split equity 50/50. Six months after incorporation, Founder A abruptly leaves to take a corporate consulting job. If the startup instituted a standard industry 4-year vesting schedule with a 1-year cliff, what percentage of company equity does Founder A keep?`,
        options: [
          '0% (Because Founder A departed prior to the 1-year cliff, zero shares have vested)',
          '50% (Because shares were granted at incorporation)',
          '12.5% (Pro-rated for 6 months)',
          '25.0% (Half of their initial allocation)'
        ],
        correctOptionIndex: 0,
        explanation: 'A 1-year cliff specifies that if a founder leaves before completing 12 full months of service, zero equity vests. This protects the surviving founder and incoming investors from dead equity on the cap table.',
        difficulty: 'Medium'
      })
    }
  ]
};

// =========================================================================
// 50-QUESTION GENERATOR FOR MOONLIGHT ARCADE
// Guarantees exactly 50 unique scenario-based questions with deep MBA explanations
// =========================================================================
export function generateSubjectChallengeQuestions(subjectName: string, count: number = 50): QuestionItem[] {
  const result: QuestionItem[] = [];
  const usedSignatures = new Set<string>();

  // 1. Pull handcrafted scenario questions matching the exact subject
  const handcraftedForSubject = comprehensiveMbaQuestions.filter(
    q => q.subject.toLowerCase() === subjectName.toLowerCase()
  );

  handcraftedForSubject.forEach(q => {
    if (result.length < count) {
      result.push({
        ...q,
        id: `${q.id}-${result.length + 1}`
      });
      usedSignatures.add(q.question.slice(0, 30));
    }
  });

  // 2. If it's a specific subject, generate procedural variations using subject's scenario templates
  const subjectTemplates = term2ScenarioTemplates[subjectName] || [];
  const companies = [
    'AuraPay Technologies', 'Vanguard Health Cloud', 'Apex Retail Analytics',
    'Nexus Autonomous Freight', 'Starlight D2C Brands', 'Zenith FinTech Systems',
    'Solstice Microelectronics', 'Titanium Security Corp', 'Hyperion Logistics'
  ];

  let compIdx = 0;
  let cycle = 1;

  while (result.length < count && subjectTemplates.length > 0) {
    for (const t of subjectTemplates) {
      if (result.length >= count) break;
      const comp = companies[compIdx % companies.length];
      const m1 = 10 + (compIdx * 7 + cycle * 3) % 40;
      const m2 = 15 + (compIdx * 11 + cycle * 5) % 35;
      const generated = t.scenarioGen(comp, m1, m2);

      const sig = generated.question.slice(0, 35);
      if (!usedSignatures.has(sig)) {
        result.push({
          id: `${subjectName.toLowerCase().slice(0, 4)}-gen-${result.length + 1}`,
          subject: subjectName,
          topic: t.topic,
          question: generated.question,
          options: generated.options,
          correctOptionIndex: generated.correctOptionIndex,
          explanation: generated.explanation,
          difficulty: generated.difficulty,
          isBookmarked: false,
          isApproved: true
        });
        usedSignatures.add(sig);
      }
      compIdx++;
    }
    cycle++;
    if (cycle > 15) break; // safeguard
  }

  // 3. If mixed MBA challenge or still under count, draw from all other Term 2 subjects
  if (result.length < count) {
    const allTerm2Subjects = Object.keys(term2ScenarioTemplates);
    let sIdx = 0;
    while (result.length < count) {
      const sName = allTerm2Subjects[sIdx % allTerm2Subjects.length];
      const sTemplates = term2ScenarioTemplates[sName];
      const t = sTemplates[Math.floor(Math.random() * sTemplates.length)];
      const comp = companies[Math.floor(Math.random() * companies.length)];
      const m1 = 12 + Math.floor(Math.random() * 30);
      const m2 = 18 + Math.floor(Math.random() * 25);
      const generated = t.scenarioGen(comp, m1, m2);

      result.push({
        id: `term2-scenario-${result.length + 1}`,
        subject: sName,
        topic: t.topic,
        question: generated.question,
        options: generated.options,
        correctOptionIndex: generated.correctOptionIndex,
        explanation: generated.explanation,
        difficulty: generated.difficulty,
        isBookmarked: false,
        isApproved: true
      });
      sIdx++;
      if (result.length >= count) break;
    }
  }

  return result.slice(0, count);
}

// =========================================================================
// MEMORY GAME PAIRS, FLASHCARDS, TRUE/FALSE
// =========================================================================
export const initialMemoryGamePairs: ConceptPairItem[] = [
  {
    id: 'mem-1',
    subject: 'Product Management',
    concept: 'North Star Metric',
    definition: 'The key metric that best captures core value delivered to customers (e.g. Spotify: Time spent listening).',
    example: 'Spotify: Time spent listening'
  },
  {
    id: 'mem-2',
    subject: 'Microeconomics',
    concept: 'Opportunity Cost',
    definition: 'The value of the next best alternative foregone when making an economic choice.',
    example: 'Foregone corporate salary while pursuing full-time MBA'
  },
  {
    id: 'mem-3',
    subject: 'Introduction to UI/UX',
    concept: 'Hick\'s Law',
    definition: 'Decision latency increases logarithmically with the number and complexity of choices.',
    example: 'Simplifying checkout options from 9 down to 3'
  },
  {
    id: 'mem-4',
    subject: 'Leadership Accelerator',
    concept: 'Psychological Safety',
    definition: 'The shared belief that a team is safe for interpersonal risk-taking and admitting mistakes.',
    example: 'Google Project Aristotle finding'
  },
  {
    id: 'mem-5',
    subject: 'Market Research Methods',
    concept: 'Conjoint Analysis',
    definition: 'Statistical technique used to evaluate part-worth utilities that consumers place on distinct features.',
    example: 'Simulating price vs battery trade-offs'
  },
  {
    id: 'mem-6',
    subject: 'Entrepreneurial Mindset',
    concept: 'Affordable Loss',
    definition: 'Evaluating risk by limiting downside loss rather than betting on speculative upside forecasts.',
    example: 'Sarasvathy\'s Effectuation principle'
  }
];

export const initialFlashcards: FlashcardItem[] = [
  {
    id: 'fc-1',
    subject: 'Product Management',
    frontPrompt: 'What does RICE stand for in feature prioritization?',
    backAnswer: 'Reach × Impact × Confidence / Effort.\nUsed to calculate objective ROI scores for competing product initiatives.',
    category: 'Prioritization',
    masteryLevel: 'learning'
  },
  {
    id: 'fc-2',
    subject: 'Microeconomics',
    frontPrompt: 'What is the condition for short-run shutdown in competitive markets?',
    backAnswer: 'Shut down if Price < Average Variable Cost (P < AVC).\nIf P > AVC, the firm operates in the short run to offset fixed costs.',
    category: 'Production Economics',
    masteryLevel: 'mastered'
  },
  {
    id: 'fc-3',
    subject: 'Introduction to UI/UX',
    frontPrompt: 'What is Fitts\'s Law formula and its design implication?',
    backAnswer: 'T = a + b · log2(2D / W).\nTargets should be large (W) and close to the user\'s thumb/cursor (D) to minimize acquisition time.',
    category: 'Ergonomics',
    masteryLevel: 'learning'
  },
  {
    id: 'fc-4',
    subject: 'Leadership Accelerator',
    frontPrompt: 'What are the 4 quadrants of Kim Scott\'s Radical Candor?',
    backAnswer: '1. Radical Candor (Care Personally + Challenge Directly)\n2. Ruinous Empathy (Care without Challenging)\n3. Obnoxious Aggression (Challenge without Caring)\n4. Manipulative Insincerity (Neither)',
    category: 'Leadership Frameworks',
    masteryLevel: 'novice'
  },
  {
    id: 'fc-5',
    subject: 'Entrepreneurial Mindset',
    frontPrompt: 'What is the core rule of Rob Fitzpatrick\'s "The Mom Test"?',
    backAnswer: 'Never ask if they think your idea is good. Ask about their past concrete actions, real spending, and current workarounds.',
    category: 'Customer Discovery',
    masteryLevel: 'mastered'
  }
];

export interface TrueFalseQuestion {
  id: string;
  subject: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export const initialTrueFalseQuestions: TrueFalseQuestion[] = [
  {
    id: 'tf-1',
    subject: 'Microeconomics',
    statement: 'If the price elasticity of demand is -0.4, increasing the product price will increase total revenue.',
    isTrue: true,
    explanation: 'True. When demand is inelastic (|Ed| < 1), the percentage price increase exceeds the percentage drop in units sold.'
  },
  {
    id: 'tf-2',
    subject: 'Product Management',
    statement: 'In a Wizard of Oz MVP, users know that humans are manually fulfilling the tasks behind the scenes.',
    isTrue: false,
    explanation: 'False. A Wizard of Oz MVP presents a simulated automated front-end while humans manually execute tasks without the user knowing.'
  },
  {
    id: 'tf-3',
    subject: 'Introduction to UI/UX',
    statement: 'WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal body text against its background.',
    isTrue: true,
    explanation: 'True. 4.5:1 is the required ratio for normal body text under AA (3:1 for large text).'
  },
  {
    id: 'tf-4',
    subject: 'Leadership Accelerator',
    statement: 'Under Hersey-Blanchard Situational Leadership, delegating (S4) is the recommended style for inexperienced, insecure subordinates.',
    isTrue: false,
    explanation: 'False. Inexperienced subordinates (D1/D2) require Directing (S1) or Coaching (S2). Delegating (S4) is reserved for highly competent, self-motivated staff (D4).'
  },
  {
    id: 'tf-5',
    subject: 'Entrepreneurial Mindset',
    statement: 'The effectuation principle of Affordable Loss prioritizes downside capital preservation over upside return forecasts.',
    isTrue: true,
    explanation: 'True. Effectual founders evaluate risk by determining whether they can comfortably absorb the potential loss if the venture fails.'
  }
];
