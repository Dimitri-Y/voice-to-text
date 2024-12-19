import { NextResponse } from 'next/server';
import { createRecording, getRecordingsByUserClerkId } from '@/services/recordingService';
import { auth } from '@clerk/nextjs/server';
import { handleError } from '@/utils/handleError';
import path from "path";
import { transcribeAudio } from '@/lib/openai.mjs';
import { uploadFileService } from '@/services/uploadFileService';
import { groupRecordingsByDate, IRecording } from '@/types/RecordingData';

const UPLOAD_DIR = path.join(process.cwd(), process.env.ROOT_PATH ? process.env.ROOT_PATH : "public/uploads");
const ALLOWED_AUDIO_TYPES = ["audio/mp3", "audio/mpeg", "audio/mp4", "audio/wav", "audio/x-m4a", "audio/m4a"];

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const recordings = await getRecordingsByUserClerkId(userId);
        const groupRecordings = groupRecordingsByDate(recordings as IRecording[]);
        return NextResponse.json(groupRecordings, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/recordings:", handleError(error));
        return NextResponse.json({ error: handleError(error) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        const file = (body.file as Blob) || null;
        if (!file) {
            return NextResponse.json({ error: "File is required" }, { status: 400 });
        }
        if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
            return NextResponse.json({
                error: "Unsupported file type. Only audio files are allowed."
            }, { status: 400 });

        }
        try {
            const { filename } = await uploadFileService(file);
            try {
                const filePath = path.resolve(UPLOAD_DIR, filename);
                const response = await transcribeAudio(filePath);
                const language = response?.language;
                const content = response?.text;
                const newRecording = await createRecording({ clerkId: userId, content, filePath: filename, language });
                return NextResponse.json(newRecording, { status: 201 });
            } catch (error) {
                return NextResponse.json({ error: handleError(error), message: "error OpenAI" }, { status: 500 });
            }
        } catch (error) {
            return NextResponse.json({ error: `File upload failed ${error}` }, { status: 500 });
        }
    } catch (error) {
        console.error("Error in POST /api/recordings:", handleError(error));
        return NextResponse.json({ error: handleError(error) }, { status: 500 });
    }
}
