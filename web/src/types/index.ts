/*
 * Shared TypeScript types for the public frontend.
 *
 * These mirror the Mongoose models in /server so that the API response
 * shapes match what the UI expects. In Phase 2 these will be validated
 * with Zod when data comes from the real API.
 */

/** A grouped skill (frontend / backend / tools / ml-data) */
export interface Skill {
  _id: string;
  name: string;
  /** Category determines which group card the skill appears in */
  category: "frontend" | "backend" | "tools" | "ml-data";
  icon?: string;  /* icon name or URL — optional */
  order: number;
}

/** A project card (home page) or full case study */
export interface Project {
  _id: string;
  slug: string;
  title: string;
  /** One sentence: what it does and who it is for */
  tagline: string;
  problem?: string;
  outcome?: string;
  metric?: string;              /* optional key metric e.g. "40% faster loading" */
  description?: string;
  role?: string;
  features: string[];           /* 3-4 recommended */
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  coverImage?: string;          /* Cloudinary URL */
  screenshots: string[];        /* Cloudinary URLs */
  setupInstructions?: string;   /* markdown */
  improvements?: string;        /* markdown — "What I would improve" */
  /** Only full-stack and frontend projects can be featured */
  type: "full-stack" | "frontend" | "ml-research";
  featured: boolean;
  order: number;
  status: "draft" | "published";
  linkStatus?: {
    live: "ok" | "broken" | "unknown";
    checkedAt?: string;
  };
}

/** Singleton profile document */
export interface Profile {
  _id: string;
  name: string;
  displayName: string;          /* e.g. "Srabon" */
  role: string;                 /* e.g. "Full-Stack Developer" */
  tagline: string;              /* one-line value statement */
  avatarUrl?: string;
  photoUrl?: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  twitter?: string;
  instagram?: string;
  telegram?: string;
  aboutParagraphs: string[];
  currently: {
    building: string;
    learning: string;
    funFact: string;
  };
  resumeUrl?: string;
  resumeUpdatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

/** Grouped skill map used by the Skills section */
export interface SkillGroups {
  frontend: Skill[];
  backend: Skill[];
  tools: Skill[];
  mlData: Skill[];
}

/** Education card — editable in the admin console (new for Vercel-native) */
export interface Education {
  _id: string;
  institution: string;
  degree: string;
  /** Display string, e.g. "March 2023 — January 2027 (Expected)" */
  period: string;
  location?: string;
  description?: string;
  achievements: string[];
  published: boolean;
}

export interface Message {
  _id?: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  ipHash?: string;
  createdAt?: string;
}

