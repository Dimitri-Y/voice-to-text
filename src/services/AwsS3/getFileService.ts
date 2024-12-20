import { S3Client, GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const s3 = new S3Client({
    region: REGION, credentials: {
        accessKeyId: process.env.AWS_ACCESSKEYID || "",
        secretAccessKey: process.env.AWS_SECRETACCESSKEY || "",
    }
});

export const getFileFromS3Service = async (filename: string): Promise<Buffer> => {
    if (!filename) {
        throw new Error("Filename is required");
    }

    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
    });

    const response: GetObjectCommandOutput = await s3.send(command);

    if (!response.Body || !(response.Body instanceof Readable)) {
        throw new Error("Invalid file response or file not found");
    }

    const chunks: Buffer[] = [];
    for await (const chunk of response.Body) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
};
