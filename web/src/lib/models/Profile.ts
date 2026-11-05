import mongoose, { Schema, Document } from "mongoose";
import type { IProfile } from "./interfaces";

export interface ProfileDocument extends IProfile, Document {}

const ProfileSchema = new Schema<ProfileDocument>(
  {
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    role: { type: String, required: true },
    tagline: { type: String, required: true },
    avatarUrl: { type: String },
    photoUrl: { type: String },
    location: { type: String, required: true },
    email: { type: String, required: true },
    linkedin: { type: String, required: true },
    github: { type: String, required: true },
    twitter: { type: String },
    telegram: { type: String },
    instagram: { type: String },
    aboutParagraphs: [{ type: String }],
    currently: {
      building: { type: String, default: "" },
      learning: { type: String, default: "" },
      funFact: { type: String, default: "" },
    },
    resumeUrl: { type: String },
    resumeUpdatedAt: { type: Date },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

export const Profile =
  mongoose.models.Profile ||
  mongoose.model<ProfileDocument>("Profile", ProfileSchema);
