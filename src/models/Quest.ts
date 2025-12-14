// models/Profile.js
import mongoose from "mongoose";

const questSchema = new mongoose.Schema({
  sessionId: String,
  ip: String,
  userToken: String,
  submittedAt: Date,
  userAgent: String,
  experience: String,
  role: String,
  work_mode: String,
  company_size: String,
  salary_satisfaction: String,
  language: String,
  secondary_languages: [String],
  os: String,
  editor: String,
  terminal: String,
  keyboard: String,
  frameworks: [String],
  tools: [String],
  database: [String],
  ai_tools: [String],
  testing: [String],
  learning: String,
  challenge: String,
  ai_impact: String,
  tech_content: [String],
  wish: String,
  prediction: String
});

const Quest = mongoose.model("Quest", questSchema);
export default Quest;