export interface IRecording {
    id: string;
    content: string;
    filePath: string;
    language: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    uuid: string;
}

export interface IRecordingGroup {
    updatedAt: string;
    recordings: IRecording[];
}

export const groupRecordingsByDate = (recordings: IRecording[]): IRecordingGroup[] => {
    const groupedRecordings: IRecordingGroup[] = [];

    recordings.forEach((recording) => {
        const date = typeof recording.updatedAt === 'string'
            ? recording.updatedAt.split('T')[0]
            : recording.updatedAt.toISOString().split('T')[0];

        const existingGroup = groupedRecordings.find(group => group.updatedAt === date);

        if (existingGroup) {
            existingGroup.recordings.push(recording);
        } else {
            groupedRecordings.push({
                updatedAt: date,
                recordings: [recording],
            });
        }
    });

    return groupedRecordings;
};
