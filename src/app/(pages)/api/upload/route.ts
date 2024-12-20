import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/handleError";
import { auth } from "@clerk/nextjs/server";
import { ALLOWED_AUDIO_TYPES } from "@/utils/constants";
import { uploadFileToS3Service } from "@/services/AwsS3/uploadFileService";



export const POST = async (req: NextRequest) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        const file = (body.file as Blob) || null;

        if (!file || !ALLOWED_AUDIO_TYPES.includes(file.type)) {
            return NextResponse.json({
                success: false,
                error: "Unsupported file type. Only audio files are allowed.",
            }, { status: 400 });
        }

        const uploadFile = await uploadFileToS3Service(file);
        return NextResponse.json({
            success: true,
            filename: uploadFile.filename,
            url: uploadFile.url,
        }, { status: 201 });

    } catch (error) {
        console.error("Error in POST /api/upload :", handleError(error));
        return NextResponse.json({ error: handleError(error) }, { status: 500 });
    }
};
