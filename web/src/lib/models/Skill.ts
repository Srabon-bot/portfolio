import mongoose, { Schema, Document } from "mongoose";
import type { ISkill } from "./interfaces";

export interface SkillDocument extends ISkill, Document {}

const SkillSchema = new Schema<SkillDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, enum: ["frontend", "backend", "tools", "ml-data"] },
    icon: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Skill =
  mongoose.models.Skill || mongoose.model<SkillDocument>("Skill", SkillSchema);
