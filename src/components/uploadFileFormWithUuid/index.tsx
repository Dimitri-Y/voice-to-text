
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
                                <svg className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-base text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">To dashboard</span> to transcribe drag and drop</p>
                                {/* <p className="text-sm text-gray-500 dark:text-gray-400">Supported format: mp3, wav or m4a (MAX. 25MB)</p> */}
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
                        <div className="mt-4">
                            <audio controls src={audioSrc} className="w-full">
                                Your browser does not support the audio element. </audio>
                        </div>
                    )}
            </div>
        </>
    )
}
export default UploadFileFormWithUuid;