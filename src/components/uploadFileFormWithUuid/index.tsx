
"use client";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { IRecording } from "@/types/RecordingData";
import Link from "next/link";
import { RotatingLinesSpinnerForChat } from "@/ui/loaderSpinners";

interface DEFAULT_STATE {
    file: File | null;
}
const DEFAULT_STATE: DEFAULT_STATE = {
    file: null,
}
interface UploadFileProps {
    recording: IRecording;
}
const UploadFileFormWithUuid: React.FC<UploadFileProps> = ({ recording }) => {
    const { request, isLoading, error } = useApi();

    const [audioSrc, setAudioSrc] = useState<string | null>(null);

    useEffect(() => {
        const fetchFile = async () => {
            const file = await request(`/api/upload/${recording.filePath}`, {
                method: 'GET',
            }, true);
            const blob = await file.blob();
            const url = URL.createObjectURL(blob);
            setAudioSrc(url);
        };
        fetchFile();
    }, [])

    return (
        <>
            <h1 className="text-2xl font-bold mb-4 text-center">Audio Transcription</h1>
            <div className="mb-4">
                <Link href={`/dashboard`} passHref>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition duration-300 ease-in-out">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-10 h-10  mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" d="M14 8H4m8 3.5v5M9.5 14h5M4 6v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z" />
                                </svg>

                                <p className="mb-2 text-base text-gray-500 dark:text-gray-400">
                                    <span className="text-lg font-semibold">To dashboard</span> to transcribe audio</p>
                            </div>
                        </label>
                    </div>
                </Link>
                {isLoading ? <RotatingLinesSpinnerForChat color={"rgb(17,24,39)"} /> : error ?
                    <div className="mt-4">
                        <audio controls src={undefined} className="w-full">
                            Error uploaded audio </audio>
                        <div className="flex items-center justify-center text-red-500">
                            Error uploaded audio
                        </div>
                    </div> : audioSrc && (
                        <div className="mt-4 p-4">
                            <audio controls src={audioSrc} className="w-full">
                                Your browser does not support the audio element. </audio>
                        </div>
                    )}
            </div>
        </>
    )
}
export default UploadFileFormWithUuid;