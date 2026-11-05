/*
 * db.ts — serverless-safe Mongoose connection for Vercel.
 *
 * On Vercel every function invocation is a fresh process, and invocations
 * run concurrently. We cache the connection on globalThis so warm lambdas
 * reuse one pooled connection instead of opening one per request (which
 * exhausts the Atlas free-tier connection limit). Same pattern survives
 * dev-server hot reloads in one PID.
 *
 * Callers: every Route Handler that needs data — NEVER import this in
 * Edge/middleware code (Edge cannot run Mongoose).
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

/* Minimal cache shape — avoids leaking the mongoose namespace into globals */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var __portfolioMongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis.__portfolioMongooseCache ?? {
  conn: null,
  promise: null,
};
if (process.env.NODE_ENV !== "production") {
  globalThis.__portfolioMongooseCache = cache;
}

/**
 * Resolves with a pooled connection, or null when MongoDB is not
 * configured/unreachable — call sites fall back to seed data.
 */
export async function connectDB(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    throw new Error(
      "[db] MONGODB_URI is not set — add it to web/.env (local) or Vercel env vars."
    );
  }
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    mongoose.set("strictQuery", true);
    cache.promise = mongoose.connect(MONGODB_URI, {
      /* Free-tier-friendly pool sizing */
      maxPoolSize: 10,
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    });
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (err) {
    /* Reset so the next invocation can retry a fresh connection */
    cache.promise = null;
    console.error("[db] MongoDB connection failed:", err);
    return null;
  }
}
