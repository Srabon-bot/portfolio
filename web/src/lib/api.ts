/*
 * lib/api.ts — the data layer for ALL public pages.
 *
 * Vercel-native (Part 9): reads go straight to MongoDB Atlas through the
 * serverless-safe connection, wrapped in ISR-style caching tagged
 * `portfolio-content`. Every admin write calls revalidateTag() on that
 * tag, so published changes appear immediately.
 *
 * Fallbacks preserved: if Atlas is unreachable or a collection is empty
 * (cold cluster during a build), we degrade to seed data — the site
 * never crashes because the database sneezed.
 */

import { unstable_cache } from "next/cache";
import {
  seedProfile,
  seedSkills,
  seedProjects,
  seedMlProjects,
} from "./seed-data";
import type { Profile, Skill, Project } from "@/types";
import { connectDB } from "./db";
import { Profile as ProfileModel } from "./models/Profile";
import { Skill as SkillModel } from "./models/Skill";
import { Project as ProjectModel } from "./models/Project";
import { CONTENT_TAG } from "./content";

/* lean() docs contain ObjectId/Date instances — normalize to plain JSON
 * so types match the web expectations (string ids, ISO date strings). */
function plain<T>(doc: unknown): T | null {
  return doc ? (JSON.parse(JSON.stringify(doc)) as T) : null;
}

/* ── Profile ─────────────────────────────────────────────────────────── */

const dbProfile = unstable_cache(
  async (): Promise<Profile | null> => {
    if (!(await connectDB())) return null;
    const doc = await ProfileModel.findOne().limit(1).lean();
    return plain<Profile>(doc);
  },
  ["api-profile"],
  { revalidate: 60, tags: [CONTENT_TAG] }
);

export async function getProfile(): Promise<Profile> {
  try {
    const fromDb = await dbProfile();
    if (fromDb) return fromDb;
  } catch {
    /* Atlas down — fall through to seed */
  }
  return seedProfile;
}

/* ── Skills ──────────────────────────────────────────────────────────── */

const dbSkills = unstable_cache(
  async (): Promise<Skill[]> => {
    if (!(await connectDB())) return [];
    const docs = await SkillModel.find().sort({ order: 1, name: 1 }).lean();
    return (JSON.parse(JSON.stringify(docs)) as unknown[]) as Skill[];
  },
  ["api-skills"],
  { revalidate: 60, tags: [CONTENT_TAG] }
);

export async function getSkills(): Promise<Skill[]> {
  try {
    const fromDb = await dbSkills();
    if (fromDb.length > 0) return fromDb;
  } catch {
    /* fallback */
  }
  return seedSkills;
}

/* ── Projects ────────────────────────────────────────────────────────── */

const dbProjects = unstable_cache(
  async (): Promise<Project[]> => {
    if (!(await connectDB())) return [];
    const docs = await ProjectModel.find({ status: "published" })
      .sort({ order: 1 })
      .lean();
    const published = (
      JSON.parse(JSON.stringify(docs)) as Project[]
    ).filter((p) => !p.title.startsWith("PLACEHOLDER"));
    return published;
  },
  ["api-projects"],
  { revalidate: 60, tags: [CONTENT_TAG] }
);

function splitProjects(published: Project[]): {
  featured: Project[];
  mlProjects: Project[];
  all: Project[];
} {
  return {
    featured: published.filter(
      (p) => p.featured && (p.type === "full-stack" || p.type === "frontend")
    ),
    mlProjects: published.filter((p) => p.type === "ml-research"),
    all: published,
  };
}

const seedProjectsFallback = (): {
  featured: Project[];
  mlProjects: Project[];
  all: Project[];
} => {
  /* Identical behaviour to the pre-Part-9 data layer */
  const publishedSeed = seedProjects.filter(
    (p) => p.status === "published" && !p.title.startsWith("PLACEHOLDER")
  );
  return {
    featured: publishedSeed.filter(
      (p) => p.featured && (p.type === "full-stack" || p.type === "frontend")
    ),
    mlProjects: seedMlProjects.filter((p) => p.status === "published"),
    all: [...publishedSeed, ...seedMlProjects.filter((p) => p.status === "published")],
  };
};

export async function getProjects(): Promise<{
  featured: Project[];
  mlProjects: Project[];
  all: Project[];
}> {
  let published: Project[] | null = null;
  try {
    published = await dbProjects();
  } catch {
    published = null;
  }
  if (!published || published.length === 0) return seedProjectsFallback();
  return splitProjects(published);
}

/* ── Single project by slug ──────────────────────────────────────────── */

const dbProjectBySlug = unstable_cache(
  async (slug: string): Promise<Project | null> => {
    if (!(await connectDB())) return null;
    const doc = await ProjectModel.findOne({ slug, status: "published" }).lean();
    return plain<Project>(doc);
  },
  ["api-project-by-slug"],
  { revalidate: 60, tags: [CONTENT_TAG] }
);

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const fromDb = await dbProjectBySlug(slug);
    if (fromDb && !fromDb.title.startsWith("PLACEHOLDER")) return fromDb;
  } catch {
    /* fallback */
  }
  return [...seedProjects, ...seedMlProjects].find((p) => p.slug === slug) || null;
}
