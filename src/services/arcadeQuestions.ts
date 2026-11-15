import { QuestionItem, FlashcardItem, ConceptPairItem } from '../types';

export const comprehensiveMbaQuestions: QuestionItem[] = [
  // ==========================================
  // PRODUCT MANAGEMENT (Term 2)
  // ==========================================
  {
    id: 'pm-1',
    subject: 'Product Management',
    topic: 'Product Discovery & Prioritization',
    question: 'In the RICE prioritization framework for product features, what does the "C" represent and how is it scored?',
    options: [
      'Cost, measured in estimated engineering sprint hours',
      'Confidence, measured as a percentage (e.g., 100% high, 80% medium, 50% low)',
      'Complexity, scored on a Fibonacci scale from 1 to 13',
      'Customer Value, scored on a 5-point Likert scale'
    ],
    correctOptionIndex: 1,
    explanation: 'In RICE (Reach × Impact × Confidence / Effort), Confidence is expressed as a percentage to discount projects where estimates are speculative or lack quantitative data.',
    difficulty: 'Medium',
    isBookmarked: true
  },
  {
    id: 'pm-2',
    subject: 'Product Management',
    topic: 'Metrics & North Star',
    question: 'A B2B SaaS product has high top-of-funnel customer acquisition but a monthly Net Revenue Retention (NRR) of 82%. What is the most critical issue the PM should address?',
    options: [
      'Increase Google Ads spend to capture more lead volume',
      'Address severe revenue churn and lack of account expansion in post-onboarding cohorts',
      'Redesign the top-level marketing landing page branding',
      'Transition from monthly billing to 3-year upfront contracts immediately'
    ],
    correctOptionIndex: 1,
    explanation: 'An NRR under 100% indicates that the business is losing revenue from existing customers (churn/downgrades exceed expansion). For healthy SaaS, top quartile NRR is typically > 115%.',
    difficulty: 'Hard',
    isBookmarked: false
  },
  {
    id: 'pm-3',
    subject: 'Product Management',
    topic: 'Minimum Viable Product',
    question: 'Which MVP type tests demand by presenting a front-end offering before building any backend automation, fulfilling requests manually behind the scenes?',
    options: [
      'Piecemeal MVP',
      'Wizard of Oz MVP',
      'Concierge MVP',
      'Smoke Test / Fake Door MVP'
    ],
    correctOptionIndex: 1,
    explanation: 'In a Wizard of Oz MVP, users experience a seemingly automated frontend, but humans perform all processing manually in the background without user awareness.',
    difficulty: 'Easy',
    isBookmarked: false
  },
  {
    id: 'pm-4',
    subject: 'Product Management',
    topic: 'Product-Market Fit & Retention',
    question: 'When analyzing cohort retention curves, what visual characteristic signals that a product has achieved true Product-Market Fit?',
    options: [
      'A strictly vertical drop that resets each month',
      'A retention curve that flattens out parallel to the x-axis over time',
      'A curve that drops to zero after 90 days',
      'A constantly linear downward slope with no inflection point'
    ],
    correctOptionIndex: 1,
    explanation: 'A flattening cohort retention curve signifies an asymptotic core of loyal users who continue using the product indefinitely, which is the hallmark of true PMF.',
    difficulty: 'Medium',
    isBookmarked: true
  },
  {
    id: 'pm-5',
    subject: 'Product Management',
    topic: 'A/B Testing & Statistical Significance',
    question: 'You run an A/B test on checkout conversion. Variant B shows a 4% lift with p = 0.08. If your predetermined alpha significance threshold was 0.05, what is the correct statistical decision?',
    options: [
      'Roll out Variant B immediately because 4% is economically significant',
      'Fail to reject the null hypothesis; do not declare Variant B a definitive winner',
      'Increase p-value threshold to 0.10 retroactively to approve the release',
      'Multiply the sample size mathematically to reach p < 0.05'
    ],
    correctOptionIndex: 1,
    explanation: 'Because p (0.08) > alpha (0.05), the observed lift could plausibly be due to random variation. The rigorous decision is to fail to reject the null hypothesis.',
    difficulty: 'Hard',
    isBookmarked: false
  },

  // ==========================================
  // MICROECONOMICS (Term 2)
  // ==========================================
  {
    id: 'econ-1',
    subject: 'Microeconomics',
    topic: 'Elasticity of Demand',
    question: 'If the Price Elasticity of Demand for a premium enterprise software tool is -0.45, what happens to Total Revenue if the firm raises prices by 10%?',
    options: [
      'Total Revenue decreases because quantity demanded drops substantially',
      'Total Revenue increases because percentage drop in quantity is less than percentage rise in price',
      'Total Revenue remains completely unchanged',
      'Total Revenue goes to zero due to customer substitution'
    ],
    correctOptionIndex: 1,
    explanation: 'When |Ed| < 1 (inelastic demand), a percentage increase in price exceeds the percentage decrease in quantity demanded, leading to an increase in total revenue.',
    difficulty: 'Easy',
    isBookmarked: false
  },
  {
    id: 'econ-2',
    subject: 'Microeconomics',
    topic: 'Game Theory & Nash Equilibrium',
    question: 'In a classic Prisoner’s Dilemma game played as a one-shot simultaneous interaction, what is the dominant strategy outcome?',
    options: [
      'Both players cooperate, reaching Pareto optimal outcome',
      'Both players defect, resulting in a Nash Equilibrium that is Pareto suboptimal',
      'One player defects while the other cooperates in alternating turns',
      'Neither player has an optimal strategy without communication'
    ],
    correctOptionIndex: 1,
    explanation: 'Defection is a dominant strategy for both players regardless of the other’s choice, leading to the defect-defect Nash equilibrium even though mutual cooperation yields higher payoffs.',
    difficulty: 'Medium',
    isBookmarked: true
  },
  {
    id: 'econ-3',
    subject: 'Microeconomics',
    topic: 'Price Discrimination',
    question: 'A software company charges students $10/month, professionals $40/month, and enterprises $150/month based on verifiable identity. Which degree of price discrimination is this?',
    options: [
      'First-degree (Perfect price discrimination)',
      'Second-degree (Quantity discounting / versioning)',
      'Third-degree (Market segmentation based on observable characteristics)',
      'Intertemporal price skimming'
    ],
    correctOptionIndex: 2,
    explanation: 'Third-degree price discrimination charges different prices to distinct groups based on observable group characteristics and differing price elasticities.',
    difficulty: 'Medium',
    isBookmarked: false
  },
  {
    id: 'econ-4',
    subject: 'Microeconomics',
    topic: 'Market Structures',
    question: 'In a Cournot duopoly, firms compete by simultaneously choosing:',
    options: [
      'Prices, driving price down to marginal cost',
      'Quantities, taking the competitor\'s output quantity as given',
      'Advertising expenditure exclusively',
      'Product differentiation attributes'
    ],
    correctOptionIndex: 1,
    explanation: 'The Cournot competition model assumes firms produce homogeneous goods and simultaneously decide on the quantities they will produce.',
    difficulty: 'Hard',
    isBookmarked: false
  },

  // ==========================================
  // INTRODUCTION TO UI/UX (Term 2)
  // ==========================================
  {
    id: 'ux-1',
    subject: 'Introduction to UI/UX',
    topic: 'Hick\'s Law',
    question: 'According to Hick-Hyman Law in interaction design, the time required to make a decision is a logarithmic function of:',
    options: [
      'The physical distance to the target button',
      'The number and complexity of available choices presented',
      'The color contrast ratio between text and background',
      'The viewport resolution of the mobile screen'
    ],
    correctOptionIndex: 1,
    explanation: 'Hick’s Law states that decision time increases logarithmically with the number of options (T = b · log2(n + 1)). Reducing choices accelerates decision-making.',
    difficulty: 'Easy',
    isBookmarked: false
  },
  {
    id: 'ux-2',
    subject: 'Introduction to UI/UX',
    topic: 'Fitts\'s Law',
    question: 'According to Fitts\'s Law, which regions of a desktop screen have infinite target width because the cursor automatically stops at the edge?',
    options: [
      'The geographic center of the screen',
      'The 4 corners and outermost boundary edges of the screen',
      'The modal dialog overlays',
      'Floating action buttons in the bottom right quadrant'
    ],
    correctOptionIndex: 1,
    explanation: 'In desktop interfaces, screen edges and corners "pin" the cursor, effectively giving them infinite depth and making them the fastest targets to acquire.',
    difficulty: 'Medium',
    isBookmarked: true
  },
  {
    id: 'ux-3',
    subject: 'Introduction to UI/UX',
    topic: 'Usability Heuristics',
    question: 'Jakob Nielsen\'s heuristic "Match between system and the real world" recommends that systems should:',
    options: [
      'Use 3D skeuomorphic textures on all modern digital buttons',
      'Speak the users\' language with familiar words, phrases, and real-world conventions',
      'Display all database table schema column names directly to the user',
      'Enforce biometric login whenever transactions occur'
    ],
    correctOptionIndex: 1,
    explanation: 'This heuristic emphasizes communicating in concepts and language familiar to the user rather than internal technical system jargon.',
    difficulty: 'Easy',
    isBookmarked: false
  },
  {
    id: 'ux-4',
    subject: 'Introduction to UI/UX',
    topic: 'Design Systems & Accessibility',
    question: 'Under WCAG 2.1 AA standards, what is the minimum required contrast ratio for normal body text against its background?',
    options: [
      '2.5:1',
      '3.0:1',
      '4.5:1',
      '7.0:1'
    ],
    correctOptionIndex: 2,
    explanation: 'WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18pt or 14pt bold). Level AAA requires 7:1.',
    difficulty: 'Medium',
    isBookmarked: false
  },

  // ==========================================
  // LEADERSHIP ACCELERATOR (Term 2)
  // ==========================================
  {
    id: 'lead-1',
    subject: 'Leadership Accelerator',
    topic: 'Situational Leadership',
    question: 'In the Hersey-Blanchard Situational Leadership model, which leadership style is recommended for team members who possess high competence and high commitment (Readiness Level R4)?',
    options: [
      'Directing / Telling (S1)',
      'Coaching / Selling (S2)',
      'Supporting / Participating (S3)',
      'Delegating (S4)'
    ],
    correctOptionIndex: 3,
    explanation: 'For R4 subordinates (high ability, high willingness), leaders employ Delegating (S4)—granting autonomy with low task behavior and low relationship support.',
    difficulty: 'Easy',
    isBookmarked: false
  },
  {
    id: 'lead-2',
    subject: 'Leadership Accelerator',
    topic: 'Psychological Safety',
    question: 'In Amy Edmondson\'s Harvard research and Google\'s Project Aristotle, what was found to be the single most critical differentiator of high-performing teams?',
    options: [
      'Average individual IQ of the engineering members',
      'Psychological safety—the shared belief that the team is safe for interpersonal risk-taking',
      'Colocated physical office presence and shared meal hours',
      'Strict hierarchical reporting with zero ambiguity'
    ],
    correctOptionIndex: 1,
    explanation: 'Project Aristotle found psychological safety was the bedrock of successful teams; members felt safe to admit mistakes, ask questions, and propose unconventional ideas.',
    difficulty: 'Medium',
    isBookmarked: true
  },
  {
    id: 'lead-3',
    subject: 'Leadership Accelerator',
    topic: 'Transformational vs Transactional',
    question: 'Which of the "Four Is" of Transformational Leadership involves challenging assumptions, reframing problems, and encouraging followers to innovate?',
    options: [
      'Idealized Influence',
      'Inspirational Motivation',
      'Intellectual Stimulation',
      'Individualized Consideration'
    ],
    correctOptionIndex: 2,
    explanation: 'Intellectual Stimulation encourages followers to be creative, question dogmas, and approach old situations in new ways without fear of criticism.',
    difficulty: 'Hard',
    isBookmarked: false
  },

  // ==========================================
  // MARKET RESEARCH METHODS (Term 2)
  // ==========================================
  {
    id: 'mrm-1',
    subject: 'Market Research Methods',
    topic: 'Conjoint Analysis',
    question: 'What is the primary objective of Choice-Based Conjoint (CBC) analysis in consumer research?',
    options: [
      'To cluster consumers by demographic age brackets',
      'To quantify the relative part-worth utilities that respondents place on different product attributes and trade-offs',
      'To measure search engine keyword search volumes',
      'To forecast macroeconomic GDP shifts'
    ],
    correctOptionIndex: 1,
    explanation: 'Conjoint analysis uncovers how consumers value different attributes (price, brand, features) by presenting holistic trade-off choices and calculating part-worth utilities.',
    difficulty: 'Medium',
    isBookmarked: true
  },
  {
    id: 'mrm-2',
    subject: 'Market Research Methods',
    topic: 'Net Promoter Score (NPS)',
    question: 'How is the Net Promoter Score (NPS) calculated from a 0-10 willingness-to-recommend survey question?',
    options: [
      'Average rating of all respondents divided by 10',
      'Percentage of Promoters (9-10) minus Percentage of Detractors (0-6)',
      'Percentage of Promoters (8-10) minus Percentage of Passives (5-7)',
      'Total count of Promoters divided by total respondents'
    ],
    correctOptionIndex: 1,
    explanation: 'NPS = % Promoters (scores 9-10) minus % Detractors (scores 0-6). Passives (7-8) count toward total respondents but are not directly subtracted.',
    difficulty: 'Easy',
    isBookmarked: false
  },
  {
    id: 'mrm-3',
    subject: 'Market Research Methods',
    topic: 'Sampling Bias',
    question: 'When a web survey on an investment blog receives responses only from self-selected, highly passionate crypto traders, which systematic sampling bias has occurred?',
    options: [
      'Survivorship bias',
      'Non-response & Voluntary response bias',
      'Recall bias',
      'Observer-expectancy effect'
    ],
    correctOptionIndex: 1,
    explanation: 'Voluntary response bias occurs when sample members self-select into the study, overrepresenting individuals with strong opinions or emotional stakes.',
    difficulty: 'Easy',
    isBookmarked: false
  },

  // ==========================================
  // CV & INTERVIEW WORKSHOP (Term 2)
  // ==========================================
  {
    id: 'car-1',
    subject: 'CV Interview Workshop',
    topic: 'STAR Method',
    question: 'When answering behavioral interview questions, what does the STAR behavioral answering structure represent?',
    options: [
      'Strategy, Tactics, Action, Revenue',
      'Situation, Task, Action, Result',
      'Summary, Theory, Application, Review',
      'Scope, Timeline, Accountability, ROI'
    ],
    correctOptionIndex: 1,
    explanation: 'STAR stands for Situation (context), Task (objective/challenge), Action (specific steps taken by the candidate), and Result (quantifiable impact achieved).',
    difficulty: 'Easy',
    isBookmarked: false
  },
  {
    id: 'car-2',
    subject: 'CV Interview Workshop',
    topic: 'Resume Impact Bullets',
    question: 'Which of the following resume bullets best adheres to the Google XYZ resume formula ("Accomplished [X], as measured by [Y], by doing [Z]")?',
    options: [
      'Responsible for managing corporate social media accounts and customer engagement.',
      'Reduced enterprise customer onboarding churn by 22% ($1.4M ARR saved) by redesigning the automated email sequence and self-serve checklist.',
      'Assisted the engineering lead in testing various backend database queries.',
      'Demonstrated exceptional leadership and teamwork across cross-functional sprints.'
    ],
    correctOptionIndex: 1,
    explanation: 'The bullet clearly states Accomplishment (reduced onboarding churn), Measurement (by 22%, $1.4M ARR saved), and Action (redesigning email sequence & self-serve checklist).',
    difficulty: 'Easy',
    isBookmarked: false
  },

  // ==========================================
  // ENTREPRENEURIAL MINDSET (Term 2)
  // ==========================================
  {
    id: 'ent-1',
    subject: 'Entrepreneurial Mindset',
    topic: 'Effectuation vs Causation',
    question: 'According to Saras Sarasvathy\'s theory of Effectuation, expert entrepreneurs start with:',
    options: [
      'A comprehensive 5-year financial forecast and market share projection',
      'Who they are, what they know, and whom they know (Bird-in-Hand principle)',
      'Securing bank loans with fixed asset collateral',
      'Conducting quantitative focus groups of 5,000 respondents'
    ],
    correctOptionIndex: 1,
    explanation: 'The Bird-in-Hand principle of Effectuation posits that entrepreneurs start with their current identity, knowledge base, and social networks rather than pre-set goals.',
    difficulty: 'Medium',
    isBookmarked: true
  },
  {
    id: 'ent-2',
    subject: 'Entrepreneurial Mindset',
    topic: 'Affordable Loss',
    question: 'Under the Affordable Loss principle of entrepreneurship, how do founders evaluate risk when making investment decisions?',
    options: [
      'They calculate maximum expected upside returns using Net Present Value models',
      'They commit only what they are willing and able to lose if the experiment fails entirely',
      'They hedge risk through credit default swaps and corporate bonds',
      'They wait until all market uncertainty is mathematically eliminated'
    ],
    correctOptionIndex: 1,
    explanation: 'Affordable Loss focuses on downside control—investing only resources the founder can comfortably lose—rather than betting on speculative upside projections.',
    difficulty: 'Easy',
    isBookmarked: false
  },

  // ==========================================
  // DESIGN THINKING (Term 1)
  // ==========================================
  {
    id: 'dt-1',
    subject: 'Design Thinking',
    topic: 'Stanford d.school Five Stages',
    question: 'In the Stanford d.school Design Thinking process, which stage immediately precedes "Ideate"?',
    options: [
      'Empathize',
      'Define (Point of View problem statement)',
      'Prototype',
      'Test'
    ],
    correctOptionIndex: 1,
    explanation: 'The 5 stages are: Empathize -> Define -> Ideate -> Prototype -> Test. The Define stage synthesizes user observations into a clear, actionable problem statement.',
    difficulty: 'Easy',
    isBookmarked: false
  },
  {
    id: 'dt-2',
    subject: 'Design Thinking',
    topic: 'Divergent vs Convergent Thinking',
    question: 'In the British Design Council\'s "Double Diamond" model, the first diamond involves:',
    options: [
      'Building high-fidelity production code',
      'Divergent exploration of the problem space, followed by convergent definition of the core challenge',
      'Pricing strategy followed by distribution logistics',
      'Immediate patent filing followed by liquidation'
    ],
    correctOptionIndex: 1,
    explanation: 'The Double Diamond consists of: 1) Discover (divergent) & Define (convergent) for the problem, followed by 2) Develop (divergent) & Deliver (convergent) for the solution.',
    difficulty: 'Medium',
    isBookmarked: true
  },

  // ==========================================
  // VIBE CODING & PROMPT ENGINEERING (Term 1)
  // ==========================================
  {
    id: 'vc-1',
    subject: 'Vibe Coding',
    topic: 'AI-Assisted Fast Prototyping',
    question: 'What is the core philosophy behind "Vibe Coding" in rapid software development?',
    options: [
      'Writing low-level assembly language with manual memory management',
      'Directing AI models with natural language intuition, iterative prompts, and immediate visual validation to build functional apps rapidly',
      'Eliminating all automated unit tests permanently from production',
      'Refusing to run code locally until a full architectural RFC is approved'
    ],
    correctOptionIndex: 1,
    explanation: 'Vibe Coding describes the modern workflow of communicating intent to AI coding assistants in plain language, reviewing changes visually, and iterating quickly.',
    difficulty: 'Easy',
    isBookmarked: false
  },
  {
    id: 'pe-1',
    subject: 'Prompt Engineering',
    topic: 'Few-Shot & Chain-of-Thought',
    question: 'Which prompting technique explicitly instructs the LLM to write out step-by-step reasoning steps before generating the final answer to improve multi-step logic?',
    options: [
      'Zero-Shot Direct Prompting',
      'Chain-of-Thought (CoT) Prompting',
      'Role Reversal Prompting',
      'Temperature Amplification'
    ],
    correctOptionIndex: 1,
    explanation: 'Chain-of-Thought (CoT) prompting prompts the model to generate intermediate reasoning steps ("think step by step"), significantly boosting accuracy in complex logic and math.',
    difficulty: 'Easy',
    isBookmarked: false
  },
  {
    id: 'pe-2',
    subject: 'Prompt Engineering',
    topic: 'Retrieval-Augmented Generation (RAG)',
    question: 'In a RAG architecture, what is the role of the Vector Database?',
    options: [
      'To compile TypeScript files into JavaScript bundles',
      'To store and perform similarity search on text chunk embeddings to retrieve relevant contextual passages',
      'To manage relational SQL foreign key constraints',
      'To encrypt SSL certificates for web servers'
    ],
    correctOptionIndex: 1,
    explanation: 'Vector databases index high-dimensional vector embeddings, allowing fast cosine similarity searches to find relevant document chunks matching user queries.',
    difficulty: 'Medium',
    isBookmarked: true
  },

  // ==========================================
  // ACCOUNTING PRIMER (Term 1)
  // ==========================================
  {
    id: 'acc-1',
    subject: 'Accounting Primer',
    topic: 'The Accounting Equation & Double-Entry',
    question: 'If a company purchases $50,000 of factory equipment by paying $10,000 in cash and taking out a $40,000 bank loan, what is the net effect on total assets?',
    options: [
      'Total assets remain unchanged',
      'Total assets increase by $40,000',
      'Total assets increase by $50,000',
      'Total assets decrease by $10,000'
    ],
    correctOptionIndex: 1,
    explanation: 'Equipment (+50,000) and Cash (-10,000) results in a net increase in assets of +$40,000, exactly matched by an increase in Liabilities (+40,000 loan).',
    difficulty: 'Easy',
    isBookmarked: false
  },
  {
    id: 'acc-2',
    subject: 'Accounting Primer',
    topic: 'Accrual vs Cash Accounting',
    question: 'Under accrual accounting, when is revenue recognized when a company delivers goods in March, sends an invoice in April, and receives payment in May?',
    options: [
      'In March, when the performance obligation is satisfied and goods are transferred',
      'In April, when the billing invoice is officially dispatched',
      'In May, when cash actually arrives in the corporate bank account',
      'Evenly distributed over the full fiscal calendar year'
    ],
    correctOptionIndex: 0,
    explanation: 'Under ASC 606 / IFRS 15, revenue is recognized when the performance obligation is satisfied (goods delivered in March), regardless of invoice or payment timing.',
    difficulty: 'Medium',
    isBookmarked: false
  },

  // ==========================================
  // MARKETING ANALYSIS (Term 1)
  // ==========================================
  {
    id: 'mkt-1',
    subject: 'Marketing Analysis',
    topic: 'Customer Lifetime Value (CLV)',
    question: 'If average gross margin per customer is $400/year, retention rate is 80%, and discount rate is 10%, what is the Customer Lifetime Value (CLV = Margin × r / (1 + i - r))?',
    options: [
      '$800',
      '$1,066.67',
      '$1,600.00',
      '$2,400.00'
    ],
    correctOptionIndex: 1,
    explanation: 'CLV = $400 × 0.80 / (1 + 0.10 - 0.80) = 320 / 0.30 = $1,066.67.',
    difficulty: 'Hard',
    isBookmarked: true
  },
  {
    id: 'mkt-2',
    subject: 'Marketing Analysis',
    topic: 'CAC Payback Period',
    question: 'If Customer Acquisition Cost (CAC) is $600 and the customer generates $50 in gross margin per month, what is the CAC payback period?',
    options: [
      '6 months',
      '12 months',
      '18 months',
      '24 months'
    ],
    correctOptionIndex: 1,
    explanation: 'Payback Period = CAC / Monthly Gross Margin = $600 / $50 = 12 months.',
    difficulty: 'Easy',
    isBookmarked: false
  },

  // ==========================================
  // ORGANIZATIONAL BEHAVIOR (Term 1)
  // ==========================================
  {
    id: 'ob-1',
    subject: 'Organizational Behavior',
    topic: 'Herzberg\'s Two-Factor Theory',
    question: 'According to Frederick Herzberg\'s motivation-hygiene theory, which of the following is categorized as a "Hygiene" factor rather than a true "Motivator"?',
    options: [
      'Challenging work and personal growth opportunities',
      'Base salary, company policies, and working conditions',
      'Sense of responsibility and autonomy',
      'Recognition for outstanding achievement'
    ],
    correctOptionIndex: 1,
    explanation: 'Hygiene factors (salary, policies, supervision, work conditions) prevent dissatisfaction when present, but their presence alone does not generate intrinsic motivation.',
    difficulty: 'Medium',
    isBookmarked: false
  },

  // ==========================================
  // MANAGERIAL COMMUNICATION (Term 1)
  // ==========================================
  {
    id: 'mc-1',
    subject: 'Managerial Communication',
    topic: 'The Minto Pyramid Principle',
    question: 'What is the governing structure of Barbara Minto\'s Pyramid Principle for executive presentations?',
    options: [
      'Begin with extensive background history, provide data, and state the conclusion at the very end',
      'Lead with the top-level conclusion or recommendation first (SCQA), followed by MECE supporting arguments',
      'Avoid recommendations and present raw data tables only',
      'Present emotional anecdotes without numerical metrics'
    ],
    correctOptionIndex: 1,
    explanation: 'The Minto Pyramid Principle dictates stating the core insight/recommendation upfront, supported hierarchically by Mutually Exclusive, Collectively Exhaustive (MECE) points.',
    difficulty: 'Easy',
    isBookmarked: false
  },

  // ==========================================
  // STATISTICS (Term 1)
  // ==========================================
  {
    id: 'stat-1',
    subject: 'Statistics',
    topic: 'Hypothesis Testing & Errors',
    question: 'In clinical trials or business A/B testing, a Type I error occurs when:',
    options: [
      'The researcher fails to reject a false null hypothesis (False Negative)',
      'The researcher rejects a true null hypothesis (False Positive)',
      'The sample variance equals zero',
      'The p-value exceeds 0.99'
    ],
    correctOptionIndex: 1,
    explanation: 'A Type I error (alpha) occurs when you reject a null hypothesis that is actually true—finding an effect or difference when none exists in reality (False Positive).',
    difficulty: 'Easy',
    isBookmarked: false
  },
  {
    id: 'stat-2',
    subject: 'Statistics',
    topic: 'Central Limit Theorem',
    question: 'The Central Limit Theorem asserts that as sample size n grows large (typically n >= 30), the distribution of sample means:',
    options: [
      'Becomes heavily skewed toward the sample maximum',
      'Approaches a normal distribution regardless of the underlying population distribution shape',
      'Becomes uniformly flat between zero and one',
      'Collapses to a single deterministic point'
    ],
    correctOptionIndex: 1,
    explanation: 'The CLT guarantees that the sampling distribution of the mean will be approximately normal for large sample sizes, enabling parametric inferences.',
    difficulty: 'Medium',
    isBookmarked: true
  },

  // ==========================================
  // FINANCE (Term 1)
  // ==========================================
  {
    id: 'fin-1',
    subject: 'Finance',
    topic: 'Capital Asset Pricing Model (CAPM)',
    question: 'If the risk-free rate is 4%, the expected market return is 10%, and a tech stock has a Beta of 1.5, what is the expected cost of equity under CAPM?',
    options: [
      '10.0%',
      '13.0%',
      '15.0%',
      '19.0%'
    ],
    correctOptionIndex: 1,
    explanation: 'Cost of Equity = Rf + Beta × (Rm - Rf) = 4% + 1.5 × (10% - 4%) = 4% + 9% = 13.0%.',
    difficulty: 'Easy',
    isBookmarked: true
  },
  {
    id: 'fin-2',
    subject: 'Finance',
    topic: 'Internal Rate of Return (IRR) vs NPV',
    question: 'When evaluating mutually exclusive capital investment projects of different scales, which metric should be prioritized to maximize total shareholder wealth?',
    options: [
      'Internal Rate of Return (IRR)',
      'Net Present Value (NPV)',
      'Payback Period',
      'Accounting Rate of Return (ARR)'
    ],
    correctOptionIndex: 1,
    explanation: 'NPV directly measures the absolute dollar addition to shareholder value. IRR can produce ranking errors when projects have different scales or reinvestment timing.',
    difficulty: 'Medium',
    isBookmarked: false
  }
];

// Helper to get 50 questions for any subject or mixed challenge
export function generateSubjectChallengeQuestions(subjectName: string, count: number = 50): QuestionItem[] {
  // Filter questions matching subject
  let subjectQuestions = comprehensiveMbaQuestions.filter(
    q => q.subject.toLowerCase() === subjectName.toLowerCase()
  );

  // If specific subject has fewer than requested count, pull from related MBA pool
  let pool = [...subjectQuestions];
  if (pool.length < count) {
    const otherQuestions = comprehensiveMbaQuestions.filter(
      q => q.subject.toLowerCase() !== subjectName.toLowerCase()
    );
    // Shuffle other questions
    const shuffledOthers = [...otherQuestions].sort(() => Math.random() - 0.5);
    pool = [...pool, ...shuffledOthers];
  }

  // If pool is still smaller than count (e.g. 50), generate scenario variants based on MBA concepts
  const result: QuestionItem[] = [];
  const usedIds = new Set<string>();

  // Shuffle initial pool
  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
  for (const q of shuffledPool) {
    if (result.length >= count) break;
    result.push({
      ...q,
      id: `${q.id}-session-${result.length + 1}`
    });
    usedIds.add(q.id);
  }

  // If we still need more to fulfill exact 50 questions requirement:
  let iteration = 1;
  while (result.length < count) {
    for (const q of comprehensiveMbaQuestions) {
      if (result.length >= count) break;
      result.push({
        ...q,
        id: `${q.id}-var-${iteration}-${result.length + 1}`,
        question: `[Case Application ${iteration}] In an MBA scenario for ${subjectName}: ${q.question}`
      });
    }
    iteration++;
  }

  return result.slice(0, count);
}

// Memory Match Game Pairs
export const initialMemoryGamePairs: ConceptPairItem[] = [
  {
    id: 'mem-1',
    subject: 'Product Management',
    concept: 'North Star Metric',
    definition: 'The single key metric that best captures the core value product delivers to customers.',
    example: 'Spotify: Time spent listening'
  },
  {
    id: 'mem-2',
    subject: 'Microeconomics',
    concept: 'Opportunity Cost',
    definition: 'The value of the next best alternative forgone when making a decision.',
    example: 'Choosing MBA salary over working full-time'
  },
  {
    id: 'mem-3',
    subject: 'Introduction to UI/UX',
    concept: 'Hick\'s Law',
    definition: 'Time taken to make a decision increases logarithmically with the number of options.',
    example: 'Streamlining checkout options'
  },
  {
    id: 'mem-4',
    subject: 'Finance',
    concept: 'WACC',
    definition: 'Weighted Average Cost of Capital representing blended cost of debt and equity.',
    example: 'Discount rate used in DCF valuation'
  },
  {
    id: 'mem-5',
    subject: 'Leadership Accelerator',
    concept: 'Psychological Safety',
    definition: 'Shared belief that a team is safe for interpersonal risk-taking and admitting errors.',
    example: 'Google Project Aristotle finding'
  },
  {
    id: 'mem-6',
    subject: 'Design Thinking',
    concept: 'Double Diamond',
    definition: 'Process of divergent discovery, convergent definition, divergent solution, convergent delivery.',
    example: 'British Design Council model'
  },
  {
    id: 'mem-7',
    subject: 'Marketing Analysis',
    concept: 'CLV to CAC Ratio',
    definition: 'Benchmark metric for customer profitability; ideal ratio is 3:1 or higher.',
    example: '$1,500 LTV vs $500 CAC'
  },
  {
    id: 'mem-8',
    subject: 'Prompt Engineering',
    concept: 'Chain of Thought',
    definition: 'Prompting method guiding LLMs to write intermediate reasoning steps.',
    example: 'Let\'s think step by step'
  }
];

// Flashcards for Flashcard Challenge
export const initialFlashcards: FlashcardItem[] = [
  {
    id: 'fc-1',
    subject: 'Product Management',
    frontPrompt: 'What is RICE prioritization and how is the score computed?',
    backAnswer: 'RICE = (Reach × Impact × Confidence) / Effort.\nReach = Users impacted per time period.\nImpact = 3 (massive) to 0.25 (minimal).\nConfidence = 100%, 80%, or 50%.\nEffort = Person-months or sprints.',
    category: 'Frameworks',
    masteryLevel: 'learning'
  },
  {
    id: 'fc-2',
    subject: 'Microeconomics',
    frontPrompt: 'What defines a Nash Equilibrium in Game Theory?',
    backAnswer: 'A state where no player has an incentive to unilaterally deviate from their chosen strategy, given the strategies chosen by all other players.',
    category: 'Game Theory',
    masteryLevel: 'mastered'
  },
  {
    id: 'fc-3',
    subject: 'Finance',
    frontPrompt: 'What is the formula for the Gordon Growth Model (Terminal Value)?',
    backAnswer: 'Terminal Value = FCF(n+1) / (WACC - g), where g is the perpetual growth rate and WACC is the discount rate.',
    category: 'Valuation',
    masteryLevel: 'novice'
  },
  {
    id: 'fc-4',
    subject: 'Introduction to UI/UX',
    frontPrompt: 'What does Fitts\'s Law state regarding target acquisition time?',
    backAnswer: 'Time = a + b · log2(2D / W), where D is distance to target and W is target width. Larger targets closer to user are clicked faster.',
    category: 'Interaction Design',
    masteryLevel: 'learning'
  },
  {
    id: 'fc-5',
    subject: 'Statistics',
    frontPrompt: 'Differentiate between Type I and Type II errors.',
    backAnswer: 'Type I Error (α): False Positive — Rejecting true null hypothesis.\nType II Error (β): False Negative — Failing to reject false null hypothesis.\nPower = 1 - β.',
    category: 'Inference',
    masteryLevel: 'mastered'
  }
];

// True or False Game items
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
    subject: 'Finance',
    statement: 'Under Modigliani-Miller Theorem with corporate taxes, firm value increases as debt ratio rises.',
    isTrue: true,
    explanation: 'True. The interest tax shield reduces taxes paid to the government, creating additional firm value.'
  },
  {
    id: 'tf-2',
    subject: 'Product Management',
    statement: 'A Wizard of Oz MVP uses automated algorithms right from day one with zero manual intervention.',
    isTrue: false,
    explanation: 'False. A Wizard of Oz MVP mimics automation on the frontend while humans manually perform work in the background.'
  },
  {
    id: 'tf-3',
    subject: 'Microeconomics',
    statement: 'If cross-price elasticity between Good A and Good B is positive, the two goods are substitutes.',
    isTrue: true,
    explanation: 'True. When the price of Good B rises, demand for Good A increases, indicating they substitute for each other.'
  },
  {
    id: 'tf-4',
    subject: 'Introduction to UI/UX',
    statement: 'WCAG 2.1 AA requires a contrast ratio of at least 7.0:1 for normal body text.',
    isTrue: false,
    explanation: 'False. WCAG AA requires 4.5:1 for normal body text. 7.0:1 is the stricter Level AAA requirement.'
  },
  {
    id: 'tf-5',
    subject: 'Entrepreneurial Mindset',
    statement: 'The effectuation principle of Affordable Loss focuses on limiting downside risk rather than forecasting upside returns.',
    isTrue: true,
    explanation: 'True. Expert founders evaluate whether the potential loss is acceptable rather than gambling on speculative forecasts.'
  }
];
