import OpenAI from "openai";
import fs from "fs";
import { franc } from "franc";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,
    project: process.env.OPENAI_PROJECT
});
/**
 * @param {string} filePath 
 * @returns {Promise<{text: string, language: string}>} 
 */
export const transcribeAudio = async (filePath) => {
    try {
        const fileStream = fs.createReadStream(filePath);

        const response = await openai.audio.transcriptions.create({
            file: fileStream,
            model: "whisper-1",
        });
        const text = response?.text;
        if (!text) {
            throw new Error("Empty transcription result");
        }

        const languageCode = franc(text);
        const language = mapLanguageCodeToName(languageCode);

        return { text, language };
    } catch (error) {
        console.error("Error in transcribeAudio:", error.response?.data || error.message);
        throw new Error("Failed to transcribe audio");
    }
};

/**
 * @param {string} code 
 * @returns {string} 
 */
const mapLanguageCodeToName = (code) => {
    const languageMap = {
        eng: "English",
        ukr: "Ukrainian"
    };

    return languageMap[code] || "Unknown Language";
};