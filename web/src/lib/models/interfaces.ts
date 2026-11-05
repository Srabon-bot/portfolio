/*
 * Document interfaces shared between the Mongoose models and the admin
 * route handlers. Mirrors server/src/types so existing MongoDB documents
 * type-check unchanged (Education + Achievement are new for Vercel-native).
 */

export interface IAdmin {
  email: string;
  passwordHash: string;
}

export interface IProfile {
  name: string;
  displayName: string;
  role: string;
  tagline: string;
  avatarUrl?: string;
  photoUrl?: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  twitter?: string;
  telegram?: string;
  instagram?: string;
  aboutParagraphs: string[];
  currently: {
    building: string;
    learning: string;
    funFact: string;
  };
  resumeUrl?: string;
  resumeUpdatedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
}

export type SkillCategory = "frontend" | "backend" | "tools" | "ml-data";

export interface ISkill {
  name: string;
  category: SkillCategory;
  icon?: string;
  order: number;
}

export type ProjectType = "full-stack" | "frontend" | "ml-research";
export type ProjectStatus = "draft" | "published";

export interface IProject {
  slug: string;
  title: string;
  tagline: string;
  problem: string;
  description: string;
  role: string;
  features: string[];
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  coverImage?: string;
  screenshots: string[];
  setupInstructions?: string;
  improvements?: string;
  type: ProjectType;
  featured: boolean;
  order: number;
  status: ProjectStatus;
  source: {
    type: "manual" | "github";
    owner?: string;
    repo?: string;
    lastSyncedAt?: Date;
  };
  linkStatus?: {
    live: "ok" | "broken" | "unknown";
    repo: "ok" | "broken" | "unknown";
    checkedAt?: Date;
  };
}

export interface IMessage {
  name: string;
  email: string;
  message: string;
  read: boolean;
  ipHash?: string;
  createdAt?: Date;
}

/* ── NEW for the Vercel-native admin — Education section editing ─────── */

export interface IEducation {
  institution: string;
  degree: string;
  /** Display strings, e.g. "2021" / "2025" / "2025 — Present" */
  period: string;
  location?: string;
  description?: string;
  achievements: string[];
  order: number;
  published: boolean;
}
