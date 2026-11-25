import type { Project } from "@/types";

const FLOOD_ML_SLUGS = new Set([
  "bangladesh-flood-dataset",
  "discharge-forecaster",
  "flood-risk-classifier",
  "flood-susceptibility",
]);

/**
 * Only flood / discharge / hydrology work gets the contour material.
 * Explicit slugs cover the seeded case studies; type and keyword matching
 * keep newly authored ML or flood projects consistent without a deploy.
 */
export function isFloodOrMlProject(
  project: Pick<Project, "slug" | "title" | "type">
): boolean {
  if (project.type === "ml-research") return true;
  if (FLOOD_ML_SLUGS.has(project.slug)) return true;
  return /flood|discharge|hydro/i.test(`${project.slug} ${project.title}`);
}
