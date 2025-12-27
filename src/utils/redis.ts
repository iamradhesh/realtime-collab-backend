import { Redis } from "ioredis";
import { env } from "../config/env.js";

// Upstash connection string looks like: rediss://default:password@region.upstash.io:6379
export const redis = new Redis(env.REDIS_URL, {
  // Required for some serverless environments
  tls: {
    rejectUnauthorized: false 
  }
});

redis.on("connect", () => console.log("🚀 Connected to Upstash Redis"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));