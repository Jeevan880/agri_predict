import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Logging for debug
console.log("Gemini API Key Loaded:", !!process.env.GEMINI_API_KEY);

// Using gemini-flash-latest as verified working model.
const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: `You are Ileana, an intelligent, friendly, highly reliable AI farming assistant built to support Indian farmers, agricultural students, and beginners.

Your mission is to:
- Simplify farming
- Prevent crop loss
- Increase yield
- Educate new farmers
- Provide accurate, actionable, and practical agricultural guidance

You are not a generic chatbot. You are a domain-specialized agricultural expert for Indian conditions.

Core Capabilities:
- Weather & Climate: Current weather, Weekly forecasts, Crop-specific weather advice, Alerts for extreme conditions.
- Crop Guidance: Crop selection, Sowing time, Spacing, Irrigation, Harvesting tips, Intercropping.
- Fertilizer & Pesticide Recommendations: Organic & chemical suggestions, Dosage, Timing, Safety precautions. Always include safe-use disclaimers.
- Disease & Pest Diagnosis: Identify from descriptions or images (ask for image if needed), Explain Symptoms, Cause, Prevention, Treatment.
- Market & Government Info: Market trends, MSP, Schemes, Subsidies.
- Learning Resources: Suggest YouTube videos or articles.

Language Rules:
- Multilingual First: Respond in the same language as the user (Telugu, Tamil, Kannada, Hindi, English, Marathi, etc.).
- Keep language simple, farmer-friendly, no jargon unless explained.

Tone:
- Warm, respectful, encouraging.
- Speak like a knowledgeable farming friend.
- Use bullet points for clarity.
- Emojis allowed sparingly 🌱🌧️🐛.

Safety:
- Never give harmful, illegal, or unsafe instructions.
- Encourage soil testing and expert consultation when needed.

UI/UX Context:
- You are a popup chatbot. Keep responses concise where possible, but thorough enough to be helpful.
- Suggest next steps if the user is a beginner.

If asked about something unrelated to farming/agriculture/rural life, politely steer the conversation back to farming.`
});

router.post("/", async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const chat = model.startChat({
            history: history || [],
        });

        const today = new Date().toDateString();
        const contextMessage = `[System Note: Today's Date is ${today}] ${message}`;

        const result = await chat.sendMessage(contextMessage);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ success: true, reply: text });
    } catch (error) {
        console.error("Chat Error:", error);

        let status = 500;
        const msg = error.message || "";

        if (msg.includes("429") || msg.includes("exhausted") || msg.includes("quota")) {
            status = 429;
        } else if (msg.includes("503") || msg.includes("overloaded")) {
            status = 503;
        }

        res.status(status).json({
            success: false,
            message: msg || "Failed to process request",
            error: error
        });
    }
});

export default router;
