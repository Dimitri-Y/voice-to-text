import OpenAI from "openai";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import fs from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { franc } from "franc";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,
});

const REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const s3 = new S3Client({
    region: REGION, credentials: {
        accessKeyId: process.env.AWS_ACCESSKEYID || "",
        secretAccessKey: process.env.AWS_SECRETACCESSKEY || "",
    }
});

/**
 * @param {string} fileUrl 
 * @returns {Promise<Readable>}
 */
const getFileFromS3 = async (filename) => {
    const decodedKey = filename;
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: decodedKey,
    });

    const response = await s3.send(command);

    if (!response.Body) {
        throw new Error("Failed to download file from S3");
    }

    if (response.Body instanceof Readable) {
        return response.Body;
    }

    const stream = Readable.from(response.Body);
    return stream;
};

/**
 * @param {string} filename
 * @returns {Promise<{text: string, language: string}>}
 */

const saveStreamToFile = async (stream, filename) => {
    const tempPath = join(tmpdir(), filename);
    const writeStream = fs.createWriteStream(tempPath);
    await new Promise((resolve, reject) => {
        stream.pipe(writeStream)
            .on("finish", resolve)
            .on("error", reject);
    });
    return tempPath;
};

export const transcribeAudioWithS3 = async (filename) => {
    try {
        const fileStream = await getFileFromS3(filename);

        const filePath = await saveStreamToFile(fileStream, filename);

        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
        });

        fs.unlinkSync(filePath);

        const text = response?.text;
        if (!text) {
            throw new Error("Empty transcription result");
        }

        const language = detectLanguage(text);
        return { text, language };
    } catch (error) {
        console.error("Error in transcribeAudio:", error);
        throw new Error("Failed to transcribe audio");
    }
};


/**
 * @param {string} text
 * @returns {string}
 */
const detectLanguage = (text) => {
    const languageMap = { eng: "English", ukr: "Ukrainian" };
    const languageCode = franc(text);
    return languageMap[languageCode] || "Unknown Language";
};
