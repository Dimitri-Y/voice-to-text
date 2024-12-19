import { NextResponse } from 'next/server';
import { getRecordingById } from '@/services/recordingService';
import { auth } from '@clerk/nextjs/server';
import { handleError } from '@/utils/handleError';

type Context = {
    params: { uuid: string }
};

export async function GET(req: Request, { params }: Context) {
    const { userId } = await auth();
    const { uuid } = params;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const recording = await getRecordingById(uuid, userId);
        if (!recording) {
            return NextResponse.json({ error: "Recording not found" }, { status: 404 });
        }
        return NextResponse.json(recording, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/recording/[uuid]:", handleError(error));
        return NextResponse.json({ error: handleError(error) }, { status: 500 });
    }
}
