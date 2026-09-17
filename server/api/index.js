import { createApp } from "../src/app.js";
import { connectDB } from "../src/config/db.config.js";

const app = createApp();

let dbPromise = null;

export default async function handler(req, res) {
  if (!dbPromise) {
    dbPromise = connectDB().catch((err) => {
      console.error("MongoDB connection failed in Vercel function:", err.message);
      dbPromise = null;
    });
  }
  await dbPromise;
  return app(req, res);
}