import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { handleError } from "@/utils/handleError";

const UPLOAD_DIR = path.join(process.cwd(),
    process.env.ROOT_PATH ? process.env.ROOT_PATH : "public/uploads");


export const GET = async (req: NextRequest, { params }: { params: Promise<{ filename: string }> }) => {
    try {
        const filename = (await params).filename;

        if (!filename) {
            return NextResponse.json({ error: "Filename is required" }, { status: 400 });
        }

        const filePath = path.join(UPLOAD_DIR, filename);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        try { await fs.access(filePath); } catch (error) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }
        const fileContent = await fs.readFile(filePath);
        const contentType = getContentType(filePath);

        if (contentType.startsWith("audio/")) {
            return new NextResponse(fileContent, {
                status: 200,
                headers: {
                    "Content-Type": contentType,
                    "Cache-Control": "no-cache",
                },
            });
        } else {
            return new NextResponse(fileContent, {
                status: 200,
                headers: {
                    "Content-Type": contentType,
                    "Content-Disposition": `attachment; filename="${filename}"`,
                },
            });
        }
    } catch (error) {
        console.error("Error in GET /api/upload/:filename :", handleError(error));
        return NextResponse.json({ error: handleError(error) }, { status: 500 });
    }
};

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
