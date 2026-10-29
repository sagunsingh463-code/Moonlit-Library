# Moonlit Library — Your Little Universe of Learning 🌙✨

> *"Welcome to your Moonlit Library. Every little step you take brings you closer to your dreams."*

A cozy, magical, anime-inspired personal Learning Management System (LMS) designed for deep focus, joyful studying, MBA & academic mastery, and personal growth under the moonlight.

---

## 🌟 Signature Features

### 🌸 Shagun's Magical Welcome Experience
- **Cinematic Anime Stage:** High-definition original anime artwork featuring Shagun sitting in an antique velvet armchair by a giant arched moonlit window, surrounded by bookshelves, fairy lights, warm golden lamp, and her sleepy moon-cat curled up on antique tomes.
- **Natural Spoken Welcome:** Studio neural female voice (`/shagun/shagun_welcome.mp3`) accompanied by synthesized ambient harp music, speaking Shagun's personal greeting:
  > *"Hi, I'm Shagun. Welcome to my little reading world. This is my cozy corner for learning, dreaming, and discovering something new every day. I'm so happy you're here. Come on in!"*
- **15-Second Choreographed Experience:**
  - 0–3.4s: Shagun reads her glowing tome *Wisdom of the Stars*.
  - 3.4–5.0s: She looks up, makes eye contact, and smiles warmly.
  - 5.0–12.8s: Speaks her welcome dialogue with mouth movement and real-time highlighted captions.
  - 12.8–15.0s: Warmly gestures toward the library.
- **User Control:** Instant "Skip Intro" button, "Enter My Library" button, mute/sound toggle, and "Don't show this intro on next visit" preference.

---

### 📖 Moonlit Reader — Built-in In-App Document Viewer
Open and read any uploaded study document directly inside the platform without external redirects:

- **PDF Documents:** Rendered via **PDF.js** on high-DPI HTML5 canvas with zoom ($50\% - 250\%$), fit-to-width/page, and $90^\circ$ rotation.
- **PowerPoint Slide Decks (`.pptx` / `.ppt`):** Fully interactive 16:9 presentation slide viewer powered by **JSZip** with slide navigation, formatted bullet points, embedded graphics, slide thumbnail jump strip, and keyboard arrow controls ($\leftarrow / \rightarrow$).
- **Word Documents (`.docx`, `.doc`):** Rendered into clean typography via **Mammoth**.
- **Spreadsheets (`.xlsx`, `.xls`, `.csv`):** Multi-sheet tabbed spreadsheet viewer powered by **SheetJS (xlsx)** with interactive data tables.
- **Text & Notes (`.txt`, `.md`, `.json`, `.ts`):** Clean monospace text viewer with font scaling and word wrapping.
- **Images (`.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`):** Image viewer with zoom and rotation.
- **Videos (`.mp4`, `.webm`):** HTML5 video player.
- **Reading Progress & Moon Bookmarks:** Lunar phase completion indicator ($🌑 \rightarrow 🌓 \rightarrow 🌕$), bookmarks drawer with one-click page jumps, and persistent reading state.
- **Continue Reading Shelf:** Highlights recently studied documents with resume shortcuts.

---

### 📚 Comprehensive Academic & Study Modules
1. **My Files:** Folder organization, file uploads, Rename, Move to Folder, Favorite toggle, in-app reading, and bit-for-bit verified downloads.
2. **Notes Room:** Rich markdown editor with illustrated moon-shaped bookmarks and revision tags.
3. **Assignments Room:** Track deadlines, weighting, grading rubrics, and submission files.
4. **Quiz Room & Custom Quizzes:** Timed practice tests, automatic scoring, pass/fail thresholds, and instant answer reviews.
5. **Question Bank:** Categorized practice questions, difficulty ratings, and incorrect answer drill mode.
6. **Lecture Hall:** Organize recorded lectures, video embeds, and key discussion takeaways.
7. **Study Planner:** Weekly schedule planner with time slots, exam prep tags, and completion checkboxes.
8. **My Constellation:** Every completed study task and uploaded tome adds a glowing star to your personal constellation.
9. **Secret Study Garden:** Unlock cute stickers, decorations, and garden creatures through real learning achievements.
10. **Midnight Focus Mode:** Distraction-free starry study view with an integrated Pomodoro timer and ambient lo-fi soundscapes.

---

### 🔒 Secure Authentication & Data Privacy
- Real user registration and login with bcrypt password hashing and JSON Web Tokens (JWT).
- Private file isolation: uploaded files are stored in user-isolated directories and verified with JWT authentication (`403 Forbidden` for unauthorized cross-user access).
- Account settings with avatar selection, password updates, and account deletion options.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Document Engines:** `pdfjs-dist` (PDF), `jszip` (PowerPoint PPTX), `mammoth` (Word DOCX), `xlsx` (Excel & CSV)
- **Audio & Speech:** Web Audio API, Web Speech API, HTML5 Audio, Microsoft Neural TTS
- **Backend:** Node.js, Express 5, Multer (secure file uploads), JWT, bcryptjs

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/sagunsingh463-code/Moonlit-Library.git
cd Moonlit-Library

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Running the Application
In one terminal, start the backend server:
```bash
npm run server
```

In another terminal, start the Vite development server:
```bash
npm run dev
```

Open your browser to `http://localhost:5174/` to enter the Moonlit Library! 🌙

---

## 📜 License
MIT License. Created with love for learners everywhere.
