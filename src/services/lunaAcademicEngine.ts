// Moonlit Library — Luna AI Academic Knowledge & Reasoning Engine
// Provides authentic, structured MBA explanations in simple English and Hinglish
// Used as smart academic intelligence and instant fallback when API quota is pending

export function getAcademicResponse(prompt: string, subject?: string): string | null {
  const clean = prompt.toLowerCase().trim();

  // 1. GREETINGS
  if (clean === 'hello' || clean === 'hi' || clean === 'hello luna' || clean === 'hi luna' || clean === 'namaste' || clean === 'hey') {
    return `Namaste Sagun! 🌙✨ Main **Luna** hoon, aapki Moonlit Library AI Study Assistant.

Main aapki study mein kaise madad kar sakti hoon? Aap mujhse Term 2 ke kisi bhi subject ke baare mein sawaal poochh sakte hain:
* 📈 **Microeconomics** (Demand & Supply, Elasticity, Game Theory)
* 💡 **Product Management** (PRDs, Prioritization, MVP, User Stories)
* 🎨 **Introduction to UI/UX** (Nielsen Heuristics, Wireframing, UX Research)
* 👑 **Leadership Accelerator** (Situational Leadership, Psychological Safety)
* 📊 **Market Research Methods** (Qualitative vs Quantitative, Survey Design)

Aap Hinglish ya English mein koi bhi concept poochhiye, main step-by-step simple examples ke saath samjhaungi! ☕📖`;
  }

  // 2. DEMAND AND SUPPLY IN HINGLISH / ENGLISH
  if ((clean.includes('demand') && clean.includes('supply')) || clean.includes('demand and supply') || clean.includes('supply and demand')) {
    return `### 📈 **Demand & Supply Explained (in Simple Hinglish)**

Economics ka sabse fundamental concept hai **Demand (Maang) aur Supply (Aapoorti)**. Yeh dono forces milkar market mein kisi bhi product ki **Price** aur **Quantity** decide karti hain.

---

#### 1. Law of Demand (Maang ka Niyam) 📉
* **Core Rule:** Jab kisi cheez ki **Price badhti hai**, toh log use **kam khareedte hain** (Demand girti hai). Aur jab **Price girti hai**, toh log use **zyada khareedte hain** (Inverse/Negative Relationship).
* **Formula:** P ↑ ⟹ Qd ↓ (Price badhne par demand girti hai — Ceteris Paribus).
* **Example:** Agar iPhone ₹1,20,000 se girkar ₹60,000 ho jaye, toh demand bohot tezi se badh jayegi!

---

#### 2. Law of Supply (Aapoorti ka Niyam) 📈
* **Core Rule:** Sellers aur producers chahte hain ki unhe zyada munafa (profit) mile. Isliye jab kisi product ki **Price badhti hai**, toh sellers use **zyada bechna chahte hain** (Direct/Positive Relationship).
* **Formula:** P ↑ ⟹ Qs ↑ (Price badhne par supply badhti hai).
* **Example:** Agar market mein crude oil ya wheat ka daam badh jaye, toh producers production aur supply badha dete hain taaki zyada profit ho.

---

#### 3. Market Equilibrium (Bazaar ka Santulan) ⚖️
Jab **Quantity Demanded ($Q_d$) = Quantity Supplied ($Q_s$)** ho jati hai, use **Equilibrium Point** kehte hain.
* **Equilibrium Price ($P^*$):** Woh price jahan khareedne wale aur bechne wale dono raazi hain.
* **Equilibrium Quantity ($Q^*$):** Total units jo market mein trade hoti hain.

* **Agar Price Equilibrium se upar ho:** **Surplus (Excess Supply)** ho jayega $\implies$ Sellers ko daam ghatane padenge.
* **Agar Price Equilibrium se neeche ho:** **Shortage (Excess Demand)** ho jayega $\implies$ Customers zyada daam dene ko taiyyar honge aur daam badh jayenge.

---

#### 4. Shift vs Movement along the Curve 🔄
* **Movement along the curve:** Sirf tab hoti hai jab **product ka apna price** badalta hai.
* **Shift of the curve:** Tab hoti hai jab baaki factors badalte hain (jaise: Consumer income badh jana, competitor ke daam, ya government policy badal jana).

---

💡 *Key MBA Takeaway:* Product managers aur business leaders ke liye, Pricing Strategy hamesha price elasticity of demand aur competitive supply constraints par depend karti hai!`;
  }

  // 3. UI/UX & NIELSEN'S HEURISTICS
  if (clean.includes('heuristic') || clean.includes('ui/ux') || clean.includes('ui ux') || clean.includes('nielsen')) {
    return `### 🎨 **Nielsen’s 10 Usability Heuristics for UI/UX Design**

Jakob Nielsen ke 10 Usability Heuristics digital product design ke sabse respected golden rules hain:

1. **Visibility of System Status:** User ko hamesha pata hona chahiye ki app mein kya chal raha hai (e.g. Loading spinners, upload progress bars).
2. **Match Between System and Real World:** Familiar words aur metaphors use karein (e.g. Shopping cart icon, trash can icon).
3. **User Control and Freedom:** Galti se tap hone par user ko aasaani se "Undo", "Cancel", ya "Back" karne ki azaadi mile.
4. **Consistency and Standards:** Poore platform mein buttons, fonts, aur colors consistent hone chahiye (standard conventions follow karein).
5. **Error Prevention:** User se galti hone se pehle hi rokein (e.g. Delete karne se pehle confirmation dialog, form field validation).
6. **Recognition Rather than Recall:** User ko cheezein yaad rakhne par majboor na karein; options aur actions screen par clearly visible hon.
7. **Flexibility and Efficiency of Use:** Beginners ke liye simple ho, par power users ke liye keyboard shortcuts aur quick gestures hon.
8. **Aesthetic and Minimalist Design:** Screen par unnecessary clutter na ho. Sirf relevant information dikhayein.
9. **Help Users Recognize, Diagnose, and Recover from Errors:** Error messages clear plain language mein hon, technical jargon na ho, aur solution batayein.
10. **Help and Documentation:** Searchable, concise help guides aur onboarding tooltips provide karein.`;
  }

  // 4. PRODUCT MANAGEMENT & PRD
  if (clean.includes('prd') || clean.includes('product management') || clean.includes('product manager') || clean.includes('rice') || clean.includes('jtbd')) {
    return `### 💡 **MBA Product Management & PRD Framework**

Ek Product Manager (PM) ka kaam engineer, designer, aur business goals ke beech bridge banna hota hai.

---

#### 1. Structure of a High-Impact PRD (Product Requirement Document)
1. **Problem Statement & Background:** Kis user pain-point ko solve kar rahe hain aur why now?
2. **Target Audience & User Personas:** Primary aur secondary users kaun hain?
3. **Jobs-To-Be-Done (JTBD):** *"When [situation], I want to [motivation], so I can [expected outcome]."*
4. **Goals & Non-Goals:** Clear boundaries define karein ki is release mein kya banega aur kya NAHI banega.
5. **Key Metrics / Success Criteria:** North Star Metric (e.g. Day-30 Retention, Task Completion Rate).
6. **User Flows & Functional Requirements:** P0 (Must have), P1 (Should have), P2 (Nice to have).
7. **Technical Dependencies & Risks:** API integrations, latency, legal/compliance.

---

#### 2. RICE Prioritization Framework
Feature prioritize karne ke liye RICE formula:
$$\\text{RICE Score} = \\frac{\\text{Reach} \\times \\text{Impact} \\times \\text{Confidence}}{\\text{Effort}}$$
* **Reach:** Kitne users impact honge per quarter?
* **Impact:** 3 (Massive), 2 (High), 1 (Medium), 0.5 (Low).
* **Confidence:** 100% (High data), 80% (Medium), 50% (Low).
* **Effort:** Kitne person-months engineer time lagega?`;
  }

  // 5. LEADERSHIP ACCELERATOR
  if (clean.includes('leadership') || clean.includes('situational leadership')) {
    return `### 👑 **Situational Leadership Framework (Hersey-Blanchard)**

Leader ko ek hi style sab par enforce nahi karni chahiye; employee ke **Competence (Kaam karne ki ability)** aur **Commitment (Motivation)** ke hisab se style adapt karni padti hai:

1. **Directing (S1 - High Direction, Low Support):**
   * *Target:* Low competence, high enthusiasm (New joiner).
   * *Action:* Step-by-step instructions dein aur closely supervise karein.
2. **Coaching (S2 - High Direction, High Support):**
   * *Target:* Some competence, low commitment (Disillusioned learner).
   * *Action:* Guidance dein par feedback aur emotional support bhi provide karein.
3. **Supporting (S3 - Low Direction, High Support):**
   * *Target:* High competence, variable confidence.
   * *Action:* Decision-making unhe karne dein, bas encourage aur remove roadblocks karein.
4. **Delegating (S4 - Low Direction, Low Support):**
   * *Target:* High competence, high commitment (Senior performer).
   * *Action:* Autonomous ownership hand over karein aur high-level updates monitor karein.`;
  }

  // 6. PRACTICE QUESTIONS
  if (clean.includes('practice') || clean.includes('quiz') || clean.includes('question')) {
    return `### 📝 **MBA Scenario-Based Practice Challenge**

Aapke liye ek practical business case question:

**Scenario:**
*A SaaS platform notes that when its monthly subscription price was raised from \$20 to \$24 (a 20% increase), monthly active paying subscribers dropped from 10,000 to 9,000 (a 10% decrease).*

**Question:**
1. Is the demand for this software product **Price Elastic** or **Price Inelastic**?
2. Did total revenue increase, decrease, or remain unchanged?

---

**Step-by-Step Answer:**
1. **Price Elasticity of Demand ($E_d$):**
   $$E_d = \\left| \\frac{\\% \\Delta Q}{\\% \\Delta P} \\right| = \\frac{10\\%}{20\\%} = 0.5$$
   Since $E_d < 1$, demand is **Price Inelastic**. Users consider the software essential.
2. **Total Revenue Impact:**
   * Initial Revenue: $10,000 \\times \\$20 = \\$200,000$
   * New Revenue: $9,000 \\times \\$24 = \\$216,000$
   * **Result:** Total Revenue increased by **\$16,000** (+8%)! For inelastic goods, raising prices increases total revenue.`;
  }

  // Default fallback for any query
  return null;
}
