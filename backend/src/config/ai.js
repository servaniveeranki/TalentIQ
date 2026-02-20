import OpenAI from "openai";

const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const MODEL = "llama-3.3-70b-versatile";
export const MAX_TOKENS = 2000;

export default ai;
