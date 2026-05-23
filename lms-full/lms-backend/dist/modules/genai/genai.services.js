import { GoogleGenAI } from "@google/genai";
const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
export const GenerateAiResult = async (prompt) => {
    try {
        const text = await GenerateAiText(prompt);
        if (!text) {
            return [];
        }
        // CONVERT JSON STRING TO ARRAY
        const parsed = JSON.parse(text);
        return parsed;
    }
    catch (error) {
        console.log("AI Error", error);
        return [];
    }
};
export const GenerateAiText = async (prompt) => {
    try {
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return result.text?.trim() ?? "";
    }
    catch (error) {
        console.log("AI Text Error", error);
        return "";
    }
};
//# sourceMappingURL=genai.services.js.map