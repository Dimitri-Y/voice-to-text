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
    
    const isFreeRecording = await canCreateRecording(user.id)
    
    if(isFreeRecording){
        throw new Error("Free period has ended")
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

export const getRecordingById = async (uuid: string, clerkId: string) => {
    const user = await prisma.user.findUnique({
        where: { clerkId },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return await prisma.recording.findUnique({
        where: {
            userId: user.id,
            id: uuid
        },
    });
};

export const deleteRecordingById = async (id: string) => {
    return await prisma.recording.delete({
        where: { id },
    });
};


export async function canCreateRecording(userId: string) {
  const count = await prisma.recording.count({ where: { userId } });

  if (count < 3) return true;

  const hasOneTime = Boolean(
    await prisma.payment.findFirst({
      where: { userId, status: 'COMPLETED' },
    })
  );
  const hasActiveSub = Boolean(
    await prisma.subscription.findFirst({
      where: {
        userId,
        plan: 'MONTHLY',
        status: 'ACTIVE',
        currentPeriodEnd: { gt: new Date() },
      },
    })
  );

  return hasOneTime || hasActiveSub;
}