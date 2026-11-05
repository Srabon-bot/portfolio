import mongoose, { Schema, Document } from "mongoose";
import type { IEducation } from "./interfaces";

export interface EducationDocument extends IEducation, Document {}

const EducationSchema = new Schema<EducationDocument>(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
    achievements: [{ type: String }],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Education =
  mongoose.models.Education ||
  mongoose.model<EducationDocument>("Education", EducationSchema);
