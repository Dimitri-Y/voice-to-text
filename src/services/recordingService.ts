import prisma from "../../prisma/client";

interface RecordingData {
    clerkId: string;
    content: string;
    filePath: string;
    language: string;
}

export const createRecording = async (recordingData: RecordingData) => {
    const user = await prisma.user.findUnique({
        where: { clerkId: recordingData.clerkId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return await prisma.recording.create({
        data: {
            userId: user.id,
            content: recordingData.content,
            filePath: recordingData.filePath,
            language: recordingData.language
        },
    });
};

export const getRecordingsByUserClerkId = async (clerkId: string) => {
    const user = await prisma.user.findUnique({
        where: { clerkId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return await prisma.recording.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
    });
};

export const getRecordingById = async (id: number) => {
    return await prisma.recording.findUnique({
        where: { id },
    });
};

export const deleteRecordingById = async (id: number) => {
    return await prisma.recording.delete({
        where: { id },
    });
};

