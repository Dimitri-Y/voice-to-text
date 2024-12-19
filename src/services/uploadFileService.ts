import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { MAX_FILE_SIZE } from "@/utils/constants";

const UPLOAD_DIR = path.join(process.cwd(), process.env.ROOT_PATH ? process.env.ROOT_PATH : "public/uploads");

export const uploadFileService = async (file: Blob): Promise<{ filename: string }> => {
    let originalName = (file as File).name;
    originalName = originalName.replace(/\s+/g, '_');
    const fileExtension = path.extname(originalName);
    const baseName = path.basename(originalName, fileExtension);
    const uniqueName = `${baseName}__${randomUUID()}${fileExtension}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.length > MAX_FILE_SIZE) {
        throw new Error("File size exceeds 25MB");
    }

    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }

    const filePath = path.resolve(UPLOAD_DIR, uniqueName);
    await fs.writeFile(filePath, buffer);

    return { filename: uniqueName };
};
