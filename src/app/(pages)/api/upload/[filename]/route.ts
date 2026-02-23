import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/handleError";
import { getFileFromS3Service } from "@/services/AwsS3/getFileService";


export const GET = async (req: NextRequest, { params }: { params: Promise<{ filename: string }> }) => {
    try {
        const filename = (await params).filename;

        if (!filename) {
            return NextResponse.json({ error: "Filename is required" }, { status: 400 });
        }
        // const { fileContent, contentType } = await getFileService(filename);
        const encodedKey = encodeURIComponent(filename);
        console.log(encodedKey);
        const fileContent = await getFileFromS3Service(encodedKey);
        const contentType = "application/octet-stream";

        const body = new Uint8Array(fileContent);

        if (contentType.startsWith("audio/")) {
            return new NextResponse(body, {
                status: 200,
                headers: {
                    "Content-Type": contentType,
                    "Cache-Control": "no-cache",
                },
            });
        } else {
            return new NextResponse(body, {
                status: 200,
                headers: {
                    "Content-Type": contentType,
                    "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
                },
            });
        }
    } catch (error) {
        console.error("Error in GET /api/upload/:filename :", handleError(error));
        return NextResponse.json({ error: handleError(error) }, { status: 500 });
    }
};