import { IRecording } from "../RecordingData";

export interface IUser {
    id: number;
    email: string;
    name: string;
    clerkId: string;
    recordings: IRecording[]
    isPremium: boolean;
}