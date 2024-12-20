import { UPLOAD_DIR } from "@/utils/constants";
import fs from "fs/promises";
import path from "path";

export const getFileService = async (filename: string): Promise<{ fileContent: Buffer<ArrayBufferLike>, contentType: string }> => {

    const filePath = path.join(UPLOAD_DIR, filename);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    try { await fs.access(filePath); } catch (error) {
        throw new Error("File not found");
    }
    const fileContent = await fs.readFile(filePath);
    const contentType = getContentType(filePath);
    return { fileContent, contentType };
}

const getContentType = (filePath: string): string => {
    const extension = path.extname(filePath).toLowerCase();
    switch (extension) {
        case ".mp3":
            return "audio/mpeg";
        case ".wav":
            return "audio/wav";
        case ".m4a":
            return "audio/x-m4a";
        case ".ogg":
            return "audio/ogg";
        case ".png":
            return "image/png";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".gif":
            return "image/gif";
        case ".txt":
            return "text/plain";
        case ".pdf":
            return "application/pdf";
        default:
            return "application/octet-stream";
    }
};