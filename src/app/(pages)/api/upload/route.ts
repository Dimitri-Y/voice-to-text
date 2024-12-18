import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/handleError";
import { auth } from "@clerk/nextjs/server";
import { uploadFileService } from "@/services/uploadFileService";


const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/x-m4a"];

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        const file = (body.file as Blob) || null;
        let originalName = (file as File).name;
        originalName = originalName.replace(/\s+/g, '_');
        if (file && ALLOWED_AUDIO_TYPES.includes(file.type)) {
            const uploadFile = await uploadFileService(file);
            const fileName = uploadFile.filename;
            return NextResponse.json({
                success: true,
                filename: fileName,
                name: originalName,
            }, { status: 201 });
        } else {
            return NextResponse.json({
                success: false,
                error: "Unsupported file type. Only audio files are allowed."
            }, { status: 400 });
        }
    } catch (error) {
        console.error("Error in POST /api/upload :", handleError(error));
        return NextResponse.json({ error: handleError(error) }, { status: 500 });
    }
};
