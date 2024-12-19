
"use client";
import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { RotatingLinesSpinnerForBtn } from "@/ui/loaderSpinners";
import { useRouter } from "next/navigation";

interface DEFAULT_STATE {
    file: File | null;
}
const DEFAULT_STATE: DEFAULT_STATE = {
    file: null,
}
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["audio/mp3", "audio/mpeg", "audio/mp4", "audio/wav", "audio/x-m4a", "audio/m4a"]

const UploadFileForm = () => {
    const {
        control,
        handleSubmit,
        watch
    } = useForm({
        mode: "onSubmit",
        defaultValues: DEFAULT_STATE,
    });
    const { request, isLoading, error } = useApi();
    const router = useRouter();

    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const selectedFile = watch("file");

    const handleFileChange = (file: File | undefined) => {
        if (file) {
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                toast.error("Unsupported file type. Please select an mp3, wav, or m4a file.");
                toast.error(file.type);
                setAudioSrc(null);
            }
            if (file.size > MAX_FILE_SIZE) {
                toast.error("File size exceeds 25MB. Please select a smaller file.");
                setAudioSrc(null);
            }
            setAudioSrc(URL.createObjectURL(file));
        } else {
            setAudioSrc(null);
        }
    };
    const onSubmit = async () => {
        if (!selectedFile) {
            toast.error(`Please select a file`);
            return;
        }
        if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
            toast.error("Unsupported file type. Please select an mp3, wav, or m4a file.");
            return;
        }
        if (selectedFile.size > MAX_FILE_SIZE) {
            toast.error("File size exceeds 25MB. Please select a smaller file.");
            return;
        }
        const formData = new FormData()
        formData.append('file', selectedFile)

        const uploadRecording = await request('/api/recording', {
            method: 'POST',
            body: formData,
        }, true);
        if (uploadRecording.status === 201) {
            const responseData = await uploadRecording.json();
            toast.success(`File ${responseData.filepath} uploaded successfully`);
            router.replace(`dashboard/${responseData.uuid}`);
        }
        if (error) {
            toast.error("Error uploading file")
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold mb-4 text-center">Audio Transcription</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                <Controller
                    name="file"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition duration-300 ease-in-out">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-base text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Supported format: mp3, wav or m4a (MAX. 25MB)</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Language: English, Ukranian</p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    accept=".mp3,.wav,.m4a"
                                    onChange={(e) => {
                                        onChange(e.target.files?.[0]);
                                        handleFileChange(e.target.files?.[0]);
                                    }}
                                    className="hidden"
                                    disabled={isLoading}
                                />
                            </label>
                        </div>
                    )}
                />
                {audioSrc && (
                    <div className="mt-4 p-4">
                        <audio controls src={audioSrc} className="w-full">
                            Your browser does not support the audio element. </audio>
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md text-base font-medium hover:bg-blue-700 mt-4 transition duration-300 ease-in-out flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            Upload and Transcribe
                            <RotatingLinesSpinnerForBtn color="#fff" />
                        </>
                    ) : (
                        "Upload and Transcribe"
                    )}
                </button>
            </form>
        </>
    )
}
export default UploadFileForm;