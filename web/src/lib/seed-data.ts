/*
 * Phase 1 seed data — static mock content used while the API is not yet built.
 *
 * In Phase 2 these will be replaced by real API calls to the Express backend.
 * Every value here comes directly from PRD §17 or is clearly marked PLACEHOLDER.
 *
 * RULE: Never invent details, project claims, or contact info.
 * Use only what is in the PRD; mark unknown fields PLACEHOLDER.
 */

import type { Profile, Skill, Project, Education } from "@/types";

/* ─── Profile ──────────────────────────────────────────────────────── */
export const seedProfile: Profile = {
  _id: "seed-profile",
  name: "Shahriar Hossain Srabon",
  displayName: "Srabon",
  role: "Full-Stack Developer (MERN)",
  tagline:
    "I build full-stack web apps with the MERN stack, with a focus on tools that solve real problems for people in Bangladesh.",
  /* avatarUrl is served from /public — will be replaced by Cloudinary URL in Phase 3 */
  avatarUrl: "/avatar.jpg",
  photoUrl: "/avatar.jpg",
  location: "Dhaka, Bangladesh",
  email: "srabon361@gmail.com",
  linkedin: "https://www.linkedin.com/in/shahriar-hossain-b0589a402/",
  github: "https://github.com/Srabon-bot",
  instagram: "https://www.instagram.com/its_srabon_here_/",
  aboutParagraphs: [
    "I am a final-semester Computer Science student at the University of Information Technology and Sciences (UITS) in Dhaka. I build full-stack web applications with React, Next.js, Node.js, Express, and MongoDB — the kind of apps that solve real, everyday problems.",
    "My standout project is Haal Khata, a voice-first digital ledger for Bangladesh's neighborhood shopkeepers that speaks Bangla, English, and Korean. It won the grand prize at the KAIST training program. That project taught me how good engineering and local cultural context can produce something people genuinely need.",
    "I believe the best technology is grounded in the lives of the people who use it. I am especially interested in building tools with a direct Bangladeshi impact — and I also research deep learning models for flood forecasting in Bangladesh, though that is a secondary pursuit.",
  ],
  currently: {
    building: "This portfolio and its MERN admin CMS",
    learning: "Next.js App Router and modern full-stack patterns",
    funFact: "Developer by day, Madridista by heart. ⚽",
  },
  /* resumeUrl points to the public PDF, can be overridden by Cloudinary via admin */
  resumeUrl: "/Shahriar_Hossain_Srabon_Resume.pdf",
  resumeUpdatedAt: "2026-10",
  seoTitle: "Srabon — Full-Stack Developer (MERN)",
  seoDescription:
    "Full-stack developer (MERN · Next.js · TypeScript) building web apps that solve real problems for people in Bangladesh. Available for internships and junior roles.",
};

/* ─── Skills ───────────────────────────────────────────────────────── */
/* PRD §17.2 — MERN technologies lead each category */
export const seedSkills: Skill[] = [
  /* Frontend */
  { _id: "sk-react",      name: "React",       category: "frontend", order: 1 },
  { _id: "sk-nextjs",     name: "Next.js",      category: "frontend", order: 2 },
  { _id: "sk-ts",         name: "TypeScript",   category: "frontend", order: 3 },
  { _id: "sk-js",         name: "JavaScript",   category: "frontend", order: 4 },
  { _id: "sk-tailwind",   name: "Tailwind CSS", category: "frontend", order: 5 },
  { _id: "sk-html",       name: "HTML5",        category: "frontend", order: 6 },
  { _id: "sk-css",        name: "CSS3",         category: "frontend", order: 7 },

  /* Backend — MERN first */
  { _id: "sk-node",       name: "Node.js",      category: "backend",  order: 1 },
  { _id: "sk-express",    name: "Express",      category: "backend",  order: 2 },
  { _id: "sk-mongodb",    name: "MongoDB",      category: "backend",  order: 3 },
  { _id: "sk-rest",       name: "REST APIs",    category: "backend",  order: 4 },
  { _id: "sk-jwt",        name: "JWT auth",     category: "backend",  order: 5 },

  /* Tools */
  { _id: "sk-git",        name: "Git",          category: "tools",    order: 1 },
  { _id: "sk-github",     name: "GitHub",       category: "tools",    order: 2 },
  { _id: "sk-vscode",     name: "VS Code",      category: "tools",    order: 3 },
  { _id: "sk-vercel",     name: "Vercel",       category: "tools",    order: 4 },
  { _id: "sk-render",     name: "Render",       category: "tools",    order: 5 },
  { _id: "sk-linux",      name: "Linux",        category: "tools",    order: 6 },
  { _id: "sk-firebase",   name: "Firebase",     category: "tools",    order: 7 },

  /* ml-data — secondary row, shown smaller */
  { _id: "sk-python",     name: "Python",       category: "ml-data",  order: 1 },
  { _id: "sk-tf",         name: "TensorFlow",   category: "ml-data",  order: 2 },
  { _id: "sk-pytorch",    name: "PyTorch",      category: "ml-data",  order: 3 },
  { _id: "sk-sklearn",    name: "scikit-learn", category: "ml-data",  order: 4 },
  { _id: "sk-pandas",     name: "Pandas",       category: "ml-data",  order: 5 },
  { _id: "sk-numpy",      name: "NumPy",        category: "ml-data",  order: 6 },
  { _id: "sk-jupyter",    name: "Jupyter",      category: "ml-data",  order: 7 },
  { _id: "sk-sql",        name: "SQL",          category: "ml-data",  order: 8 },
  { _id: "sk-c",          name: "C",            category: "ml-data",  order: 9 },
  { _id: "sk-cpp",        name: "C++",          category: "ml-data",  order: 10 },
];

/* ─── Projects ─────────────────────────────────────────────────────── */
/* PRD §17.3 — Haal Khata is the standout project, listed first */
export const seedProjects: Project[] = [
  {
    _id: "proj-haalkhata",
    slug: "haal-khata",
    title: "Haal Khata (হাল খাতা)",
    tagline:
      "A voice-first digital ledger for Bangladesh's neighborhood shopkeepers — speaks Bangla, English, and Korean.",
    problem:
      "Over 4.5 million neighborhood mudi dokans in Bangladesh conduct 73%+ of sales on credit (baki), manually tracked in paper notebooks that are prone to loss, alteration, and disputes. Existing digital ledger apps require tedious typing that busy shopkeepers cannot do during fast-paced counter transactions.",
    description:
      "Haal Khata is a voice-first, offline-capable digital ledger built with React 19, Dexie (IndexedDB), and Neon Postgres. It allows shopkeepers to speak natural transactions in Bangla, English, or Korean, extracting structured ledger entries with a 100% on-device rule-based engine requiring zero external AI API quotas or network connectivity. Grand prize winner at the KAIST international training program.",
    role: "Lead Full-Stack Developer",
    features: [
      "Voice-first transaction entry in Bangla, English, and Korean turning natural speech into structured ledger entries",
      "100% local on-device rule-based extraction engine with zero external AI API dependency, working fully offline",
      "Per-customer credit (baki) tracking, repayments ledger, and today / 7-day financial summaries",
      "Multi-device account sync powered by Neon Postgres and Vercel Edge Functions with soft-delete reconciliation",
      "Rooted in the 430-year-old Bengali Pohela Boishakh red-book debt reconciliation ritual ('Why Haal Khata?')",
    ],
    stack: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Dexie (IndexedDB)", "Neon Postgres", "Vercel Edge Functions", "Gemini API"],
    liveUrl: "https://haal-khata.vercel.app",
    repoUrl: "https://github.com/Srabon-bot/kaist-haalkhata",
    coverImage: "/projects/haalkhata/landing.png",
    screenshots: [
      "/projects/haalkhata/landing.png",
      "/projects/haalkhata/today-ledger.png",
      "/projects/haalkhata/voice-entry.png",
      "/projects/haalkhata/customers.png",
      "/projects/haalkhata/summary.png",
      "/projects/haalkhata/history.png",
      "/projects/haalkhata/haal-khata-ritual.png",
    ],
    setupInstructions:
      "1. Clone the repository: `git clone https://github.com/Srabon-bot/kaist-haalkhata.git`\n2. Install dependencies: `npm install`\n3. Configure `.env` with `DATABASE_URL` (Neon Postgres) and `SESSION_SECRET`\n4. Initialize database schema: `psql $DATABASE_URL -f db/schema.sql`\n5. Start development server: `npm run dev` (voice entry works fully offline with zero API needed)",
    improvements:
      "Add dialect-adaptive acoustic model for regional Chittagonian and Sylheti accents, and integrate native Bluetooth thermal receipt printer support.",
    type: "full-stack",
    featured: true,
    order: 1,
    status: "published",
  },
  {
    _id: "proj-bazardor",
    slug: "bazardor",
    title: "BazarDor (বাজার দর)",
    tagline:
      "A modern, responsive commodity and grocery price tracking web application for Bangladesh.",
    problem:
      "Commodity and grocery prices in Bangladesh fluctuate frequently across various wholesale and retail markets. Everyday consumers lack transparent, centralized access to daily market rates and trends, making household budgeting difficult and leaving them susceptible to arbitrary retail markups.",
    description:
      "BazarDor (বাজার দর) empowers consumers across Bangladesh with transparent daily commodity pricing, dynamic native Bangla calendar date, category-wise price trackers, and market-by-market comparison tables across wholesale and retail hubs.",
    role: "Lead Full-Stack Developer",
    features: [
      "Real-time commodity price marquee ticker & dynamic Bangla calendar date formatted natively for Bangladesh Standard Time",
      "Daily price risers and fallers breakdown ('আজ দাম বেড়েছে ▲' / 'দাম কমেছে ▼') highlighting top market movements",
      "Category-wise product catalog (Rice, Oil, Vegetables, Meat, Fish) with multi-criteria price sorting (Low to High, High to Low)",
      "Protected product deep-dive with minimum, maximum, and average rates plus market-wise price comparison table",
      "Secure multi-provider authentication via Better Auth supporting email/password, Google, and GitHub OAuth",
    ],
    stack: ["Next.js", "React 19", "TypeScript", "MongoDB", "Better Auth", "Tailwind CSS", "DaisyUI"],
    liveUrl: "https://assignment-7-kw2m.vercel.app",
    repoUrl: "https://github.com/Srabon-bot/BazarDor",
    coverImage: "/projects/bazardor/home.png",
    screenshots: [
      "/projects/bazardor/home.png",
      "/projects/bazardor/category.png",
      "/projects/bazardor/product-details.png",
      "/projects/bazardor/signin.png",
    ],
    setupInstructions:
      "1. Clone the repository: `git clone https://github.com/Srabon-bot/BazarDor.git`\n2. Install dependencies: `npm install`\n3. Configure `.env.local` with `MONGODB_URI`, `BETTER_AUTH_SECRET`, and OAuth keys\n4. Start development server: `npm run dev`",
    improvements:
      "Implement crowdsourced verified community price reports, automated SMS alerts for essential staples when prices spike beyond threshold, and predictive trend charts using historical seasonal market data.",
    type: "full-stack",
    featured: true,
    order: 2,
    status: "published",
  },
  {
    _id: "proj-fitlog",
    slug: "fitlog",
    title: "FitLog 🏋️",
    tagline:
      "A dark, no-nonsense workout library and daily session planner with real-time session metrics.",
    problem:
      "Fitness enthusiasts and lifters often struggle with cluttered workout apps filled with intrusive ads, complex signups, and bloated menus. They need a fast, responsive interface to explore exercises across muscle groups, curate a focused daily workout, and track combined duration and calories in real time.",
    description:
      "FitLog is an exercise library and daily session planning application built with Next.js 16, React 19, and Tailwind CSS. It empowers users to explore muscle-specific movements, review step-by-step form cues, construct capped daily workout routines, and track live duration and calorie metrics with local persistence.",
    role: "Frontend / Full-Stack Engineer",
    features: [
      "Curated exercise library covering all major muscle groups with difficulty ratings, equipment tags, and step-by-step instructions",
      "Interactive 'Today's Plan' session builder capped at 5 lifts with instant progress check-offs and state management",
      "Live session analytics calculating total planned exercises, combined minutes, and estimated calories burned in real time",
      "Dedicated 'Saved' list allowing lifters to bookmark upcoming lifts to swap into future training sessions",
      "Instant muscle group search, numeric sorting by duration and calories, and zero-loss local storage persistence",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "DaisyUI", "Lucide React"],
    liveUrl: "https://assignment-6-fit-log-weld.vercel.app",
    repoUrl: "https://github.com/Srabon-bot/FitLog",
    coverImage: "/projects/fitlog/home.png",
    screenshots: [
      "/projects/fitlog/home.png",
      "/projects/fitlog/library.png",
      "/projects/fitlog/workout-details.png",
      "/projects/fitlog/my-plan.png",
      "/projects/fitlog/saved.png",
    ],
    setupInstructions:
      "1. Clone the repository: `git clone https://github.com/Srabon-bot/FitLog.git`\n2. Install dependencies: `npm install`\n3. Start the Next.js development server: `npm run dev`\n4. Open http://localhost:3000 in your browser",
    improvements:
      "Integrate RESTful workout history logging to MongoDB Atlas, add custom exercise creator forms with video demos, and build automated superset pairing suggestions.",
    type: "frontend",
    featured: true,
    order: 3,
    status: "published",
  },
  {
    _id: "proj-yutnori",
    slug: "yutnori-3d",
    title: "Yutnori (윷놀이) 3D",
    tagline:
      "A 3D, browser-based version of the traditional Korean board game with physics, AI, and multi-language support.",
    problem:
      "Traditional cultural board games like Yutnori (윷놀이) are rarely available digitally with tactile 3D physics, authentic Korean rule completeness, or accessible multi-language support (English, 한국어, and বাংলা) for international players.",
    description:
      "A browser-based 3D implementation of the traditional Korean board game Yutnori built with React, React Three Fiber, Three.js, Zustand, and Vitest. Features a pure, isolated TypeScript rules engine, 3-difficulty heuristic AI opponent, pass-and-play local multiplayer, animated yut stick throws, synthesized Web Audio sound effects, and multilingual support.",
    role: "3D Graphics & Frontend Engineer",
    features: [
      "Complete traditional rules engine: Do/Gae/Geol/Yut/Mo, Back-do, bonus throws, capturing, stacking, and center shortcuts",
      "3D board and animated yut sticks toss with physics flip animation and hover-to-preview landing path indicators",
      "Intelligent heuristic AI opponent with 3 difficulty modes (Easy, Medium, Hard) plus local pass-and-play on one device",
      "Full trilingual localization across all screens and tutorials in English, Korean (한국어), and Bangla (বাংলা)",
      "Zero-backend architecture with synthesized Web Audio sound effects, custom character creator, and 100% test coverage via Vitest",
    ],
    stack: ["React", "TypeScript", "React Three Fiber", "Three.js", "Zustand", "Vite", "Vitest"],
    liveUrl: "https://yutnori-ten.vercel.app",
    repoUrl: "https://github.com/Srabon-bot/yutnori-game",
    coverImage: "/projects/yutnori/home.png",
    screenshots: [
      "/projects/yutnori/home.png",
      "/projects/yutnori/how-to-play.png",
      "/projects/yutnori/gameplay.png",
      "/projects/yutnori/yut-throw.png",
    ],
    setupInstructions:
      "1. Clone repository: `git clone https://github.com/Srabon-bot/yutnori-game.git`\n2. Install dependencies: `npm install`\n3. Run development server: `npm run dev`\n4. Run rules engine test suite: `npm test`",
    improvements:
      "Add WebRTC peer-to-peer online multiplayer, customizable 3D board textures and wooden token materials, and ranked online leaderboards.",
    type: "frontend",
    featured: true,
    order: 4,
    status: "published",
  },
];

/* ─── ML/Research projects (shown in the "Research and ML" strip) ─── */
export const seedMlProjects: Project[] = [
  {
    _id: "proj-flood-dataset",
    slug: "bangladesh-flood-dataset",
    title: "Bangladesh Flood Dataset",
    tagline: "Curated dataset for Bangladesh flood risk research and model training.",
    features: [],
    stack: ["Python", "Pandas"],
    repoUrl: "https://github.com/Srabon-bot/Bangladesh-flood-data-set",
    coverImage: undefined,
    screenshots: [],
    type: "ml-research",
    featured: false,
    order: 1,
    status: "published",
  },
  {
    _id: "proj-discharge",
    slug: "discharge-forecaster",
    title: "Discharge Forecaster",
    tagline: "Deep learning model for river discharge forecasting in Bangladesh.",
    features: [],
    stack: ["Python", "TensorFlow"],
    repoUrl: "https://github.com/Srabon-bot/Discharge-forecaster-model-for-Bangladesh",
    coverImage: undefined,
    screenshots: [],
    type: "ml-research",
    featured: false,
    order: 2,
    status: "published",
  },
  {
    _id: "proj-flood-classifier",
    slug: "flood-risk-classifier",
    title: "Flood Risk Classifier",
    tagline: "Machine learning classifier for Bangladesh flood risk zones.",
    features: [],
    stack: ["Python", "scikit-learn"],
    repoUrl: "https://github.com/Srabon-bot/Bangladesh-flood-risk-classifier-model",
    coverImage: undefined,
    screenshots: [],
    type: "ml-research",
    featured: false,
    order: 3,
    status: "published",
  },
  {
    _id: "proj-susceptibility",
    slug: "flood-susceptibility",
    title: "Flood Susceptibility Mapping",
    tagline: "Spatial ML model for Bangladesh flood susceptibility analysis.",
    features: [],
    stack: ["Python", "PyTorch"],
    repoUrl: "https://github.com/Srabon-bot/Bangladesh-flood-susceptibility",
    coverImage: undefined,
    screenshots: [],
    type: "ml-research",
    featured: false,
    order: 4,
    status: "published",
  },
];

/* ─── Education (editable in the admin console; NEW for Vercel-native) ─
 * Real verified facts only — matches the pre-existing static card.
 * Achievements are NOT seeded (never invent unverified details);
 * the admin console is the authoring surface for those.               */
export const seedEducation: Education[] = [
  {
    _id: "seed-education-uits",
    institution: "University of Information Technology & Sciences (UITS)",
    degree: "Bachelor of Science in Computer Science & Engineering",
    period: "March 2023 — January 2027 (Expected)",
    location: "Dhaka, Bangladesh",
    description:
      "Currently completing my final semester, building a foundation in software engineering, full-stack development, and machine learning.",
    achievements: [],
    published: true,
  },
];
