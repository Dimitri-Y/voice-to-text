import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_TEXT } from "@/utils/constants";

const REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const s3 = new S3Client({
    region: REGION, credentials: {
        accessKeyId: process.env.AWS_ACCESSKEYID || "",
        secretAccessKey: process.env.AWS_SECRETACCESSKEY || "",
    }
});

export const uploadFileToS3Service = async (file: Blob): Promise<{ filename: string; url: string }> => {
    const originalName = (file as File).name.replace(/\s+/g, '_');
    const fileExtension = path.extname(originalName);
    const baseName = path.basename(originalName, fileExtension);
    const uniqueName = `${baseName}__${randomUUID()}${fileExtension}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.length > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds ${MAX_FILE_SIZE_TEXT}MB`);
    }
    const encodedKey = encodeURIComponent(uniqueName);
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: encodedKey,
        Body: buffer,
        ContentType: file.type,
    });

    await s3.send(command);

    return {
        filename: encodedKey,
        url: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${uniqueName}`,
    };
};
