import { NextResponse } from 'next/server';
import { createRecording, getRecordingsByUserClerkId } from '@/services/recordingService';
import { auth } from '@clerk/nextjs/server';
import { handleError } from '@/utils/handleError';
import { groupRecordingsByDate, IRecording } from '@/types/RecordingData';
import { ALLOWED_AUDIO_TYPES } from '@/utils/constants';
import { uploadFileToS3Service } from '@/services/AwsS3/uploadFileService';
import { transcribeAudioWithS3 } from '@/lib/openaiFromS3.mjs';


export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const recordings = await getRecordingsByUserClerkId(userId);
        const groupRecordings = groupRecordingsByDate(recordings as unknown as IRecording[]);
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
            const { filename } = await uploadFileToS3Service(file);
            try {
                const response = await transcribeAudioWithS3(filename);
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
