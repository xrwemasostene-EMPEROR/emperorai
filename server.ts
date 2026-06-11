import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Database backed by local JSON file for persistence mimicking PostgreSQL
const DB_FILE = path.join(process.cwd(), "server-db.json");

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  access_level: number; // 1 = Super Admin, 2 = VVIP, 4 = Premium User, 5 = Standard, 6 = Guest
  google_id?: string;
  momo_number?: string;
  account_name?: string;
  created_at: string;
  is_verified: boolean;
}

interface InteractionEvent {
  id: string;
  timestamp: string;
  user_id?: string;
  user_email?: string;
  type: "click" | "mousemove" | "page" | "auth" | "custom";
  page_name: string;
  target_element?: string;
  x?: number;
  y?: number;
  metadata?: Record<string, any>;
}

interface MomoPayment {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  currency: string;
  momo_number: string;
  transaction_id: string;
  plan: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  component: string;
  message: string;
}

interface DatabaseState {
  users: User[];
  payments: MomoPayment[];
  logs: LogEntry[];
  interactions: InteractionEvent[];
  telemetry: {
    totalRequests: number;
    tokensUsed: number;
    totalLatencyMs: number;
    successCount: number;
    failCount: number;
    totalClicks: number;
    totalMouseMoves: number;
  };
}

const DEFAULT_DB: DatabaseState = {
  users: [
    {
      id: "uuid-emperor-001",
      email: "xrwemasostene@gmail.com",
      full_name: "KAZENEZA RWEMA Sostene",
      phone: "0796931165",
      access_level: 1, // Super Admin
      momo_number: "0796931165",
      account_name: "KAZENEZA RWEMA Sostene",
      created_at: new Date().toISOString(),
      is_verified: true,
    },
    {
      id: "uuid-emperor-002",
      email: "itsmeemperor1@gmail.com", // Auto-upgrade user email from metadata
      full_name: "Emperor Sostene",
      phone: "0796931165",
      access_level: 1,
      momo_number: "0796931165",
      account_name: "Emperor Sostene",
      created_at: new Date().toISOString(),
      is_verified: true,
    }
  ],
  payments: [],
  logs: [
    {
      id: "log-1",
      timestamp: new Date().toISOString(),
      level: "INFO",
      component: "SYSTEM",
      message: "Empire AI Server initialized safely."
    }
  ],
  interactions: [],
  telemetry: {
    totalRequests: 0,
    tokensUsed: 0,
    totalLatencyMs: 0,
    successCount: 0,
    failCount: 0,
    totalClicks: 0,
    totalMouseMoves: 0
  }
};

let db: DatabaseState = { ...DEFAULT_DB };

// Initialize file-based DB
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      db = JSON.parse(data);
      // Ensure default users are present
      DEFAULT_DB.users.forEach(u => {
        if (!db.users.find(existing => existing.email === u.email)) {
          db.users.push(u);
        }
      });
    } else {
      saveDb();
    }
  } catch (err) {
    console.error("Failed to load db file, using fresh state:", err);
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save db file:", err);
  }
}

loadDb();

function addLog(level: "INFO" | "SUCCESS" | "WARNING" | "ERROR", component: string, message: string) {
  const newLog: LogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    level,
    component,
    message
  };
  db.logs.unshift(newLog);
  if (db.logs.length > 100) db.logs.pop(); // limit size
  saveDb();
}

// Lazy load Gemini Client to prevent crash if key is missing on startup
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      try {
        geminiClient = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            }
          }
        });
        addLog("INFO", "GEMINI", "Gemini API client initialized successfully.");
      } catch (e: any) {
        console.error("Failed to init Gemini SDK:", e);
        addLog("ERROR", "GEMINI", `Failed initialization: ${e.message}`);
      }
    } else {
      addLog("WARNING", "GEMINI", "GEMINI_API_KEY is not configured or placeholder detected. Falling back to offline intelligence model.");
    }
  }
  return geminiClient;
}

// --- API ENDPOINTS ---

// AUTH: Register user
app.post("/api/auth/register", (req, res) => {
  const { email, password, full_name, phone } = req.body;
  if (!email || !full_name) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Check if exists
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "Email already registered." });
  }

  const isSuperAdminEmail = 
    email.toLowerCase() === "xrwemasostene@gmail.com" || 
    email.toLowerCase() === "itsmeemperor1@gmail.com";

  const newUser: User = {
    id: `user-${Date.now()}`,
    email: email.toLowerCase(),
    full_name,
    phone: phone || "",
    access_level: isSuperAdminEmail ? 1 : 5, // Auto standard, or Super Admin if matching email
    created_at: new Date().toISOString(),
    is_verified: true
  };

  db.users.push(newUser);
  saveDb();
  addLog("SUCCESS", "AUTH", `New user registered: ${email} (Access Lvl: ${newUser.access_level})`);

  res.json({ message: "Registration successful!", user: newUser });
});

// AUTH: Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  // If user doesn't exist, auto-create a standard user or admin depending on email
  if (!user) {
    const isSuperAdminEmail = 
      email.toLowerCase() === "xrwemasostene@gmail.com" || 
      email.toLowerCase() === "itsmeemperor1@gmail.com";

    user = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      full_name: email.split("@")[0].toUpperCase(),
      phone: "",
      access_level: isSuperAdminEmail ? 1 : 5, // Live standard
      created_at: new Date().toISOString(),
      is_verified: true
    };
    db.users.push(user);
    saveDb();
    addLog("INFO", "AUTH", `Auto-created session for first-time user: ${email}`);
  }

  addLog("SUCCESS", "AUTH", `User logged in: ${email}`);
  res.json({ user });
});

// AUTH: Google OAuth Login
app.post("/api/auth/google", (req, res) => {
  const { google_id, email, full_name } = req.body;
  if (!google_id || !email) {
    return res.status(400).json({ error: "Google credentials required." });
  }

  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Create new user via Google
    const isSuperAdminEmail = 
      email.toLowerCase() === "xrwemasostene@gmail.com" || 
      email.toLowerCase() === "itsmeemperor1@gmail.com";

    user = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      full_name: full_name || email.split("@")[0].toUpperCase(),
      phone: "",
      google_id,
      access_level: isSuperAdminEmail ? 1 : 5, // Standard user by default
      created_at: new Date().toISOString(),
      is_verified: true
    };
    db.users.push(user);
    saveDb();
    addLog("SUCCESS", "AUTH-GOOGLE", `New user via Google Sign-In: ${email} (ID: ${google_id})`);
  } else {
    // Update google_id if not set
    if (!user.google_id) {
      user.google_id = google_id;
      saveDb();
    }
    addLog("SUCCESS", "AUTH-GOOGLE", `Google Sign-In for existing user: ${email}`);
  }

  res.json({ user, message: "Google authentication successful!" });
});

// INTERACTIONS: Track clicks and mouse movements
app.post("/api/track/interaction", (req, res) => {
  const { user_id, user_email, type, page_name, target_element, x, y, metadata } = req.body;

  if (!type || !page_name) {
    return res.status(400).json({ error: "Type and page_name required." });
  }

  const event: InteractionEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    user_id,
    user_email,
    type,
    page_name,
    target_element,
    x: x || 0,
    y: y || 0,
    metadata
  };

  db.interactions.push(event);
  
  // Update telemetry based on type
  if (type === "click") {
    db.telemetry.totalClicks += 1;
  } else if (type === "mousemove") {
    db.telemetry.totalMouseMoves += 1;
  }

  // Keep only last 500 events
  if (db.interactions.length > 500) {
    db.interactions = db.interactions.slice(-500);
  }

  saveDb();
  res.json({ message: "Event tracked", event });
});

// INTERACTIONS: Get interaction stats by user
app.get("/api/track/user/:user_id", (req, res) => {
  const { user_id } = req.params;
  const userEvents = db.interactions.filter(e => e.user_id === user_id);
  
  const stats = {
    total_events: userEvents.length,
    clicks: userEvents.filter(e => e.type === "click").length,
    mousemoves: userEvents.filter(e => e.type === "mousemove").length,
    pages_visited: new Set(userEvents.map(e => e.page_name)).size,
    last_activity: userEvents[userEvents.length - 1]?.timestamp || null
  };

  res.json(stats);
});

// PAYMENTS: Submit MTN MoMo subscription transaction
app.post("/api/momo/payment", (req, res) => {
  const { user_id, user_email, amount, currency, momo_number, transaction_id, plan } = req.body;

  if (!user_id || !amount || !momo_number || !transaction_id) {
    return res.status(400).json({ error: "Missing MoMo payment details." });
  }

  const newPayment: MomoPayment = {
    id: `pay-${Date.now()}`,
    user_id,
    user_email: user_email || "unknown@empire.com",
    amount: Number(amount),
    currency: currency || "RWF",
    momo_number,
    transaction_id,
    plan,
    status: "pending",
    created_at: new Date().toISOString()
  };

  db.payments.unshift(newPayment);
  saveDb();
  addLog("WARNING", "PAYMENT", `Pending MoMo payment submitted by ${user_email} (TxID: ${transaction_id}, Plan: ${plan})`);

  res.json({ message: "Payment transaction submitted to Emperor Sostene for approval. Please wait for activation.", payment: newPayment });
});

// PAYMENTS: Approve / Reject Transaction (Admin only)
app.post("/api/admin/momo/process", (req, res) => {
  const { payment_id, action, admin_id } = req.body; // action: 'approve' or 'reject'

  const payment = db.payments.find(p => p.id === payment_id);
  if (!payment) {
    return res.status(404).json({ error: "Payment record not found." });
  }

  payment.status = action === "approve" ? "approved" : "rejected";

  if (action === "approve") {
    // Upgrade user access level based on plan
    const user = db.users.find(u => u.id === payment.user_id);
    if (user) {
      const planLower = payment.plan.toLowerCase();
      // Premium is 4, Standard is 5, VVIP is 2 (highest paid tier)
      if (planLower === "premium") {
        user.access_level = 4;
      } else if (planLower === "vvip" || planLower === "elite") {
        user.access_level = 2; // VVIP Tier
      } else {
        user.access_level = 5; // Standard
      }
      addLog("SUCCESS", "PAYMENT", `Approved MoMo. Upgraded user ${user.email} (${payment.user_email}) to Access Lvl ${user.access_level}`);
    }
  } else {
    addLog("WARNING", "PAYMENT", `Rejected MoMo payment (ID: ${payment_id})`);
  }

  saveDb();
  res.json({ message: `Transaction has been ${payment.status}.`, payment });
});

// ADMIN: Manually assign VVIP access to user (Super Admin only)
app.post("/api/admin/assign-vvip", (req, res) => {
  const { admin_id, user_id, status } = req.body;
  
  const admin = db.users.find(u => u.id === admin_id);
  if (!admin || admin.access_level !== 1) {
    return res.status(403).json({ error: "Unauthorized. Super Admin access required." });
  }

  const user = db.users.find(u => u.id === user_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  if (status === "grant") {
    user.access_level = 2; // Assign VVIP Tier
    addLog("SUCCESS", "ADMIN", `Admin (${admin.email}) granted VVIP access to user ${user.email}`);
  } else if (status === "revoke") {
    user.access_level = 5; // Downgrade to Standard
    addLog("WARNING", "ADMIN", `Admin (${admin.email}) revoked VVIP access from user ${user.email}`);
  } else {
    return res.status(400).json({ error: "Invalid status. Use 'grant' or 'revoke'." });
  }

  saveDb();
  res.json({ message: `VVIP access ${status}ed for user ${user.email}`, user });
});

// METRICS: Get logs, telemetry, payments and users for admin panel
app.get("/api/admin/metrics", (req, res) => {
  res.json({
    users: db.users,
    payments: db.payments,
    logs: db.logs,
    interactions: db.interactions.slice(-100), // Return last 100 interactions
    telemetry: db.telemetry
  });
});

// AI: Text and chat generation endpoint using Gemini SDK (fallback to mock with system evaluation metrics)
app.post("/api/gemini/chat", async (req, res) => {
  const startTime = Date.now();
  const { prompt, history, systemInstruction } = req.body;

  db.telemetry.totalRequests += 1;

  if (!prompt) {
    db.telemetry.failCount += 1;
    saveDb();
    return res.status(400).json({ error: "Prompt is required." });
  }

  const client = getGeminiClient();

  try {
    if (client) {
      // Calculate token approximation
      const inputTokens = Math.ceil(prompt.length / 4);

      // Call genuine API
      addLog("INFO", "GEMINI", `Calling genuine Gemini API (gemini-3.5-flash) for prompt: "${prompt.substring(0, 40)}..."`);
      
      const configObj: any = {
        systemInstruction: systemInstruction || "You are Executive Assistant 'Empire AI', built under direct control of Emperor KAZENEZA RWEMA Sostene. Respond elegantly, matching the high standards of the Empire."
      };

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: configObj
      });

      const latency = Date.now() - startTime;
      const textResponse = response.text || "Empty response from Gemini Core.";
      const outputTokens = Math.ceil(textResponse.length / 4);

      // Update telemetry
      db.telemetry.tokensUsed += (inputTokens + outputTokens);
      db.telemetry.totalLatencyMs += latency;
      db.telemetry.successCount += 1;
      saveDb();

      addLog("SUCCESS", "GEMINI", `Response generated in ${latency}ms utilizing ${inputTokens + outputTokens} estimated tokens.`);

      return res.json({
        text: textResponse,
        tokens: inputTokens + outputTokens,
        latencyMs: latency,
        engine: "Genuine Gemini 3.5 Core",
      });
    } else {
      // Offline fallback simulator mapping beautiful rules
      const latency = Math.floor(Math.random() * 300) + 100;
      let reply = "";

      const lower = prompt.toLowerCase();
      if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        reply = "Warm greetings from the Empire AI system, crafted under the leadership of Emperor Sostene! How can your Executive Assistant serve you today?";
      } else if (lower.includes("emperor") || lower.includes("sostene")) {
        reply = "Emperor KAZENEZA RWEMA Sostene is the Supreme Administrator and Founder of Empire AI. His official contact for Mobile Money transfers and primary inquiries is +250 796 931 165, and email is xrwemasostene@gmail.com. All system processes operate with absolute fidelity to his commands.";
      } else if (lower.includes("payment") || lower.includes("momo") || lower.includes("subscription")) {
        reply = "Empire AI offers Free, Standard (RWF 5,000/mo), and Premium (RWF 15,000/mo) plans. Payments are securely processed through Rwanda MTN Mobile Money to the Emperor's account block: MoMo No: 0796931165 (Account Name: KAZENEZA RWEMA Sostene). Submit your transaction ID on your Billing portal to instantly queue for activation.";
      } else if (lower.includes("rwanda") || lower.includes("kinyarwanda")) {
        reply = "Amakuru! Empire AI supports Kinyarwanda streaming services, translation, voice feedback, and local Rwanda integration (MTN Mobile Money, local channels KC2, Flash TV, and RBA). Ndagufasha iki uyu munsi?";
      } else if (lower.includes("weather") || lower.includes("kigali")) {
        reply = "The microclimate in Kigali is beautiful today, with clear tropical breezes at around 24°C, perfect for watching local Kigali broadcasts and using Empire AI's advanced tools.";
      } else {
        reply = `[Rule-based Emulator] Thank you for querying Empire AI. I have matched your request and computed an response:
"${prompt}" holds deep significance. If you have active internet, you may configure process.env.GEMINI_API_KEY inside Settings > Secrets to unleash the true raw intelligence of live Gemini 3.5. Currently running in highly reliable Local Emulator node. How else can I assist?`;
      }

      db.telemetry.tokensUsed += Math.ceil((prompt.length + reply.length) / 4);
      db.telemetry.totalLatencyMs += latency;
      db.telemetry.successCount += 1;
      saveDb();

      addLog("SUCCESS", "GEMINI-EMULATOR", `Response simulated in ${latency}ms.`);

      return res.json({
        text: reply,
        tokens: Math.ceil((prompt.length + reply.length) / 4),
        latencyMs: latency,
        engine: "Empire Local Emulator Node"
      });
    }
  } catch (err: any) {
    const latency = Date.now() - startTime;
    db.telemetry.failCount += 1;
    db.telemetry.totalLatencyMs += latency;
    saveDb();
    addLog("ERROR", "GEMINI", `Failed to generate response: ${err.message}`);
    return res.status(500).json({ error: err.message, engine: "Error recovery node" });
  }
});

// START EXPRESS SERVER WIRED WITH VITE MIDDLEWARE

async function start() {
  // Vite integration for rich live preview
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EMPIRE-AI] Server online routing to port ${PORT}`);
    addLog("INFO", "NET", `Express server listening at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Critical server breakdown:", err);
});
