import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) { console.log("No Key"); return; }
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();
        if (data.models) {
            fs.writeFileSync("models_list.txt", data.models.map(m => m.name).join('\n'));
            console.log("Wrote to models_list.txt");
        } else {
            console.log(JSON.stringify(data));
        }
    } catch (error) { console.error(error); }
}
listModels();
