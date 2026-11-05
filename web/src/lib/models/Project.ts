import mongoose, { Schema, Document } from "mongoose";
import type { IProject } from "./interfaces";

export interface ProjectDocument extends IProject, Document {}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    problem: { type: String, required: true },
    description: { type: String, required: true },
    role: { type: String, required: true },
    features: [{ type: String }],
    stack: [{ type: String }],
    liveUrl: { type: String },
    repoUrl: { type: String },
    coverImage: { type: String },
    screenshots: [{ type: String }],
    setupInstructions: { type: String },
    improvements: { type: String },
    type: {
      type: String,
      required: true,
      enum: ["full-stack", "frontend", "ml-research"],
      default: "full-stack",
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      required: true,
      enum: ["draft", "published"],
      default: "draft",
    },
    source: {
      type: {
        type: String,
        enum: ["manual", "github"],
        default: "manual",
      },
      owner: { type: String },
      repo: { type: String },
      lastSyncedAt: { type: Date },
    },
    linkStatus: {
      live: {
        type: String,
        enum: ["ok", "broken", "unknown"],
        default: "unknown",
      },
      repo: {
        type: String,
        enum: ["ok", "broken", "unknown"],
        default: "unknown",
      },
      checkedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.Project ||
  mongoose.model<ProjectDocument>("Project", ProjectSchema);
