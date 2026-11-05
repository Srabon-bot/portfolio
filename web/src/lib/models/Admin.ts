/*
 * Mongoose models — moved from /server so the Vercel-native admin can read
 * and write the SAME documents the original pipeline produced.
 * Schemas are byte-compatible with server/src/models/*.
 */

import mongoose, { Schema, Document } from "mongoose";
import type { IAdmin } from "./interfaces";

export interface AdminDocument extends IAdmin, Document {}

const AdminSchema = new Schema<AdminDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin =
  mongoose.models.Admin || mongoose.model<AdminDocument>("Admin", AdminSchema);
