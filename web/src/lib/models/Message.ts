import mongoose, { Schema, Document } from "mongoose";
import type { IMessage } from "./interfaces";

export interface MessageDocument extends IMessage, Document {}

const MessageSchema = new Schema<MessageDocument>(
  {
    name: { type: String, required: true, trim: true, maxLength: 120 },
    email: { type: String, required: true, trim: true, maxLength: 180 },
    message: { type: String, required: true, trim: true, maxLength: 3000 },
    read: { type: Boolean, default: false },
    ipHash: { type: String },
  },
  { timestamps: true }
);

export const Message =
  mongoose.models.Message ||
  mongoose.model<MessageDocument>("Message", MessageSchema);
