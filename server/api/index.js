import { createApp } from "../src/app.js";

let app = null;

export default async function handler(req, res) {
  // 1. Ensure CORS headers are attached to every single response, including preflights & errors
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-request-id, Accept, Origin, X-Requested-With"
  );

  // 2. Immediately respond to preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 3. Delegate to Express app
  try {
    if (!app) {
      app = createApp();
    }
    return app(req, res);
  } catch (err) {
    console.error("Vercel Serverless Invocation Error:", err);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVERLESS_INITIALIZATION_ERROR",
        message: err?.message || "Serverless Function Initialization Failed"
      }
    });
  }
}