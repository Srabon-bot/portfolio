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
  architectureSummary?: string;
  architectureFlow?: string;
  architectureNotes?: string;
  authNotes?: string;
  deploymentNotes?: string;
  hardProblemTitle?: string;
  hardProblemContext?: string;
  hardProblemFix?: string;
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
  createdAt: Date;
}
