
"use client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface DEFAULT_STATE {
    file: File | null;
}
const DEFAULT_STATE: DEFAULT_STATE = {
    file: null,
}

const UploadFileForm = () => {
    const {
        control,
        handleSubmit,
        watch
    } = useForm({
        mode: "onSubmit",
        defaultValues: DEFAULT_STATE,
    });
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const selectedFile = watch("file");

    const handleFileChange = (file: File | undefined) => {
        if (file) {
            setAudioSrc(URL.createObjectURL(file));
        } else {
            setAudioSrc(null);
        }
    };
    const onSubmit = async () => {
        if (!selectedFile) return

        const formData = new FormData()
        formData.append('file', selectedFile)

        const uploadRecording = await fetch('/api/recording', {
            method: 'POST',
            body: formData,
        })
        if (uploadRecording.status === 201) {
            const responseData = await uploadRecording.json();
            toast.success(`File ${responseData.filepath} uploaded successfully`);
        } else if (uploadRecording.status === 500) {
            toast.error("Error uploading file");
        }
        // const uploadFile = await fetch('/api/upload', {
        //     method: 'POST',
        //     body: formData,
        // })
        // if (uploadFile.status === 201) {
        //     const responseData = await uploadFile.json();
        //     console.log(responseData.filename);
        //     toast.success(`File ${responseData.name} uploaded successfully`);
        // } else if (uploadFile.status === 500) {
        //     toast.error("Error uploading file");
        // }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Audio Transcription</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                    <Controller
                        name="file"
                        control={control}
                        render={({ field: { onChange } }) => (
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Supported format: mp3, wav or m4a (MAX. 25MB)</p>
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

                                    />
                                </label>
                            </div>
                        )}
                    />
                    {audioSrc && (
                        <div className="mt-4">
                            <audio controls src={audioSrc} className="w-full">
                                Your browser does not support the audio element. </audio>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 mt-4"
                    >
                        Upload and Transcribe
                    </button>
                </form>
            </div>
            {/* <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-center">Support Our Work</h2>
                <div className="flex justify-center mb-4">
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l-md">10$</button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700">20$</button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700">50$</button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md">100$</button>
                </div>
                <button
                    className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                    Support with 10$
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">Secure payment powered by Stripe</p>
            </div> */}
        </div>
    )
}
export default UploadFileForm;