import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);
let output = `Testing Key: ${key}\n`;

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        output += `gemini-1.5-flash SUCCESS: ${result.response.text()}\n`;
    } catch (error) {
        output += `gemini-1.5-flash FAILED: ${error.message}\n`;
    }
}

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();
        if (data.models) {
            output += "Available Models:\n" + data.models.map(m => m.name).join('\n');
        } else {
            output += "List Models Error: " + JSON.stringify(data);
        }
    } catch (e) {
        output += "Fetch Error: " + e.message;
    }
    fs.writeFileSync("verify_output.txt", output);
}

run().then(listModels);
